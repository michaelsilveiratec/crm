package api

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/user/crm_eclesia/internal/db"
	"github.com/user/crm_eclesia/internal/service"
)

func SendWorkerMessageHandler(c *gin.Context) {
	churchID, senderID, ok := GetChurchAndUser(c)
	if !ok {
		return
	}

	var msg db.WorkerMessage
	if err := c.ShouldBindJSON(&msg); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos"})
		return
	}

	msg.ChurchID = churchID
	msg.SenderID = senderID

	if err := db.CreateWorkerMessage(&msg); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao salvar recado."})
		return
	}

	// Notificar o Pastor via WhatsApp
	var pastorPhone string
	err := db.DB.QueryRow("SELECT phone FROM users WHERE church_id = $1 AND role = 'pastor' LIMIT 1", msg.ChurchID).Scan(&pastorPhone)

	if err == nil && pastorPhone != "" {
		waText := fmt.Sprintf("🚨 *NOVO RECADO DO OBREIRO*\n\n*Tipo:* %s\n*Assunto:* %s\n*Mensagem:* %s\n\n_Enviado pelo sistema CRM Bom Samaritano_",
			msg.MsgType, msg.Subject, msg.Message)
		service.SendWhatsApp(pastorPhone, waText)
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Recado enviado e notificado via WhatsApp!"})
}

func GetWorkerMessagesHandler(c *gin.Context) {
	churchID, ok := GetChurchID(c)
	if !ok {
		return
	}

	// Por enquanto, listamos todas as mensagens da igreja de forma segura
	messages, err := db.GetAllWorkerMessages(churchID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao buscar recados."})
		return
	}

	c.JSON(http.StatusOK, messages)
}
