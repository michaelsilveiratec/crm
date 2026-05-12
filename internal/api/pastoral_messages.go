package api

import (
	"fmt"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/user/crm_eclesia/internal/db"
)

func CreatePastoralMessageHandler(c *gin.Context) {
	churchID, _ := c.Get("church_id")
	userID, _ := c.Get("user_id")

	var req struct {
		Categoria string `json:"categoria" binding:"required"`
		Titulo    string `json:"titulo" binding:"required,max=100"`
		Mensagem  string `json:"mensagem" binding:"required,max=2000"`
		Status    string `json:"status" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Campos inválidos ou vazios."})
		return
	}

	msg := &db.PastoralMessage{
		ChurchID:  churchID.(int),
		Categoria: req.Categoria,
		Titulo:    req.Titulo,
		Mensagem:  req.Mensagem,
		Status:    req.Status,
		CriadoPor: userID.(int),
	}

	if err := db.CreatePastoralMessage(msg); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao salvar a mensagem."})
		return
	}

	c.JSON(http.StatusCreated, msg)
}

func GetPastoralMessagesHandler(c *gin.Context) {
	churchID, _ := c.Get("church_id")
	messages, err := db.GetAllPastoralMessages(churchID.(int))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao buscar as mensagens."})
		return
	}
	if messages == nil {
		messages = []db.PastoralMessage{}
	}
	c.JSON(http.StatusOK, messages)
}

func UpdatePastoralMessageHandler(c *gin.Context) {
	churchID, _ := c.Get("church_id")
	idParam := c.Param("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
		return
	}

	var req struct {
		Categoria string `json:"categoria" binding:"required"`
		Titulo    string `json:"titulo" binding:"required,max=100"`
		Mensagem  string `json:"mensagem" binding:"required,max=2000"`
		Status    string `json:"status" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Campos inválidos ou vazios."})
		return
	}

	msg := &db.PastoralMessage{
		ID:        id,
		ChurchID:  churchID.(int),
		Categoria: req.Categoria,
		Titulo:    req.Titulo,
		Mensagem:  req.Mensagem,
		Status:    req.Status,
	}

	if err := db.UpdatePastoralMessage(msg); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao atualizar a mensagem."})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Mensagem atualizada com sucesso"})
}

func DeletePastoralMessageHandler(c *gin.Context) {
	churchID, _ := c.Get("church_id")
	idParam := c.Param("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
		return
	}

	if err := db.DeletePastoralMessage(id, churchID.(int)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao excluir a mensagem."})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Mensagem pastoral excluída com sucesso."})
}
func GetMessageHistoryHandler(c *gin.Context) {
	churchID, _ := c.Get("church_id")
	history, err := db.GetMessageHistory(churchID.(int))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao buscar histórico."})
		return
	}
	if history == nil {
		history = []db.MessageSend{}
	}
	c.JSON(http.StatusOK, history)
}

func SendBulkPastoralMessageHandler(c *gin.Context) {
	churchID, _ := c.Get("church_id")
	userID, _ := c.Get("user_id")

	var req struct {
		MessageID    int    `json:"message_id" binding:"required"`
		Target       string `json:"target" binding:"required"` // 'single' ou 'list'
		TargetID     int    `json:"target_id"`                // member_id se 'single'
		ListType     string `json:"list_type"`                // 'visitors', 'birthdays', etc.
		MensagemFinal string `json:"mensagem_final"`           // texto final já com variáveis substituídas
		Telefone     string `json:"telefone"`                 // telefone do destinatário
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos."})
		return
	}

	// 1. Buscar a mensagem base
	messages, _ := db.GetAllPastoralMessages(churchID.(int))
	var baseMsg *db.PastoralMessage
	for _, m := range messages {
		if m.ID == req.MessageID {
			baseMsg = &m
			break
		}
	}

	if baseMsg == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Mensagem não encontrada."})
		return
	}

	// 2. Envio individual — registrar no histórico
	if req.Target == "single" {
		if req.TargetID == 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Informe o membro destinatário."})
			return
		}

		// Buscar dados do membro para pegar telefone, se não veio no payload
		telefone := req.Telefone
		if telefone == "" {
			members, _ := db.GetAllMembers(churchID.(int))
			for _, mem := range members {
				if mem.ID == req.TargetID {
					telefone = mem.WhatsApp
					break
				}
			}
		}

		// Montar mensagem final se não veio pronta
		mensagemFinal := req.MensagemFinal
		if mensagemFinal == "" {
			mensagemFinal = baseMsg.Mensagem
		}

		// Limpar telefone
		telefone = strings.ReplaceAll(telefone, " ", "")
		telefone = strings.ReplaceAll(telefone, "-", "")
		telefone = strings.ReplaceAll(telefone, "(", "")
		telefone = strings.ReplaceAll(telefone, ")", "")

		send := &db.MessageSend{
			Telefone:      telefone,
			MensagemFinal: mensagemFinal,
			Status:        "Enviado via WhatsApp Web",
		}

		if err := db.SaveMessageSend(send, churchID.(int), req.MessageID, req.TargetID, userID.(int)); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Erro ao registrar histórico: %v", err)})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"message": "Envio registrado no histórico com sucesso.",
			"status":  "success",
		})
		return
	}

	// 3. Disparo em massa — placeholder para implementação futura
	c.JSON(http.StatusOK, gin.H{
		"message": "Disparo em massa iniciado para a lista: " + req.ListType,
		"status":  "pending",
	})
}
