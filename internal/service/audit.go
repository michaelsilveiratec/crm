package service

import (
	"log"
	"github.com/user/crm_eclesia/internal/db"
)

func LogActivity(churchID int, userID int, action string, ip string) {
	_, err := db.DB.Exec(`INSERT INTO audit_logs (church_id, user_id, action, ip_address) VALUES ($1, $2, $3, $4)`,
		churchID, userID, action, ip)
	if err != nil {
		log.Printf("Erro ao gravar log de auditoria: %v", err)
	}
}
