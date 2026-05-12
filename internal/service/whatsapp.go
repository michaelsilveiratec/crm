package service

import (
	"os"

	"github.com/user/crm_eclesia/internal/db"
)

type WhatsAppService struct {
	BaseURL string
	ApiKey  string
}

func NewWhatsAppService() *WhatsAppService {
	return &WhatsAppService{
		BaseURL: os.Getenv("WHATSAPP_API_URL"),
		ApiKey:  os.Getenv("WHATSAPP_API_KEY"),
	}
}

func (s *WhatsAppService) SendMessage(churchID int, memberID int, phone string, message string) error {
	status := "sent"
	errorMsg := ""

	// Se não houver configuração, apenas logamos como "simulado"
	if s.BaseURL == "" {
		errorMsg = "API não configurada (Modo Simulação)"
		status = "simulated"
	}

	// Registrar no log do banco de dados
	var mID interface{}
	mID = memberID
	if memberID == 0 {
		mID = nil
	}

	_, err := db.DB.Exec(`INSERT INTO whatsapp_logs (church_id, member_id, phone, message, status, error_msg) VALUES ($1, $2, $3, $4, $5, $6)`,
		churchID, mID, phone, message, status, errorMsg)
	
	return err
}

// SendWhatsApp é uma função auxiliar global para disparar mensagens rapidamente
func SendWhatsApp(phone string, message string) error {
	svc := NewWhatsAppService()
	// Usamos churchID 0 e memberID 0 para logs de sistema/equipe
	return svc.SendMessage(0, 0, phone, message)
}
