package api

import (
	"fmt"
	"net/http"
	"github.com/user/crm_eclesia/internal/db"
	"github.com/user/crm_eclesia/internal/service"
	"github.com/gin-gonic/gin"
)

func SendWorkerMessageHandler(c *gin.Context) {
	churchID, _ := c.Get("church_id")
	senderID, _ := c.Get("user_id")

	var msg db.WorkerMessage
	if err := c.ShouldBindJSON(&msg); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos"})
		return
	}

	msg.ChurchID = churchID.(int)
	msg.SenderID = senderID.(int)

	if err := db.CreateWorkerMessage(&msg); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao salvar recado: " + err.Error()})
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
	churchID, _ := c.Get("church_id")
	
	// Por enquanto, listamos todas as mensagens da igreja de forma segura
	messages, err := db.GetAllWorkerMessages(churchID.(int))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao buscar recados: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, messages)
}
