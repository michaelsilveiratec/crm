package api

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/user/crm_eclesia/internal/db"
	"github.com/user/crm_eclesia/internal/service"
)

func SendRealWhatsAppHandler(c *gin.Context) {
	churchID, ok := GetChurchID(c)
	if !ok {
		return
	}

	var req struct {
		MemberID int    `json:"member_id"`
		Phone    string `json:"phone" binding:"required"`
		Message  string `json:"message" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos"})
		return
	}

	ws := service.NewWhatsAppService()
	err := ws.SendMessage(churchID, req.MemberID, req.Phone, req.Message)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao processar envio"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Solicitação de envio processada"})
}

func GetWhatsAppLogsHandler(c *gin.Context) {
	churchID, ok := GetChurchID(c)
	if !ok {
		return
	}

	rows, err := db.DB.Query(`SELECT phone, message, status, error_msg, sent_at FROM whatsapp_logs WHERE church_id = $1 ORDER BY sent_at DESC LIMIT 50`, churchID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao buscar logs"})
		return
	}
	defer rows.Close()

	type Log struct {
		Phone    string `json:"phone"`
		Message  string `json:"message"`
		Status   string `json:"status"`
		ErrorMsg string `json:"error_msg"`
		SentAt   string `json:"sent_at"`
	}

	var logs []Log
	for rows.Next() {
		var l Log
		rows.Scan(&l.Phone, &l.Message, &l.Status, &l.ErrorMsg, &l.SentAt)
		logs = append(logs, l)
	}

	c.JSON(http.StatusOK, EnsureSlice(logs))
}
