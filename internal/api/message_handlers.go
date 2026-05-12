package api

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/user/crm_eclesia/internal/db"
)

// SendWhatsAppMessageHandler builds a wa.me URL for a given member.
func SendWhatsAppMessageHandler(c *gin.Context) {
	churchID, _ := c.Get("church_id")

	var payload struct {
		MemberID int    `json:"member_id"`
		Template string `json:"template"`
	}
	if err := c.BindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Payload inválido"})
		return
	}

	// Retrieve member's WhatsApp number with tenant isolation
	var whatsapp string
	err := db.DB.QueryRow("SELECT whatsapp FROM members WHERE id = $1 AND church_id = $2", payload.MemberID, churchID).Scan(&whatsapp)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Membro não encontrado nesta igreja"})
		return
	}

	// Strip non-digit characters
	cleaned := ""
	for _, r := range whatsapp {
		if r >= '0' && r <= '9' {
			cleaned += string(r)
		}
	}

	// Build URL with pre-filled text (URL-encoded)
	url := "https://wa.me/" + cleaned
	if payload.Template != "" {
		encoded := strings.ReplaceAll(payload.Template, " ", "%20")
		url += "?text=" + encoded
	}

	c.JSON(http.StatusOK, gin.H{"url": url})
}
