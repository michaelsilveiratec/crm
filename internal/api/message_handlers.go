package api

import (
"encoding/json",
    "net/http"
    "time"

    "github.com/gin-gonic/gin"
    "github.com/user/crm_eclesia/internal/db"
)

// GetBirthdaysHandler returns members whose birthday is today.
func GetBirthdaysHandler(c *gin.Context) {
    // Simple query matching month and day of birth_date (format YYYY-MM-DD or empty).
    today := time.Now().Format("01-02") // MM-DD
    query := `SELECT id, name, whatsapp, birth_date FROM members WHERE strftime('%m-%d', birth_date) = ?`
    rows, err := db.DB.Query(query, today)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao buscar aniversariantes"})
        return
    }
    defer rows.Close()

    type Birthday struct {
        ID        int    `json:"id"`
        Name      string `json:"name"`
        WhatsApp  string `json:"whatsapp"`
        BirthDate string `json:"birth_date"`
    }
    var list []Birthday
    for rows.Next() {
        var b Birthday
        if err := rows.Scan(&b.ID, &b.Name, &b.WhatsApp, &b.BirthDate); err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao ler registro"})
            return
        }
        list = append(list, b)
    }
    c.JSON(http.StatusOK, list)
}

// SendWhatsAppMessageHandler builds a wa.me URL for a given member.
func SendWhatsAppMessageHandler(c *gin.Context) {
    var payload struct {
        MemberID int    `json:"member_id"`
        Template string `json:"template"`
    }
    if err := c.BindJSON(&payload); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Payload inválido"})
        return
    }
    // Retrieve member's WhatsApp number.
    var whatsapp string
    err := db.DB.QueryRow("SELECT whatsapp FROM members WHERE id = ?", payload.MemberID).Scan(&whatsapp)
    if err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Membro não encontrado"})
        return
    }
    // Strip non‑digit characters.
    cleaned := ""
    for _, r := range whatsapp {
        if r >= '0' && r <= '9' {
            cleaned += string(r)
        }
    }
    // Build URL with pre‑filled text (URL‑encoded).
    url := "https://wa.me/" + cleaned
    if payload.Template != "" {
        // Simple URL‑encode spaces as %20 for demonstration.
        encoded := ""
        for _, r := range payload.Template {
            if r == ' ' {
                encoded += "%20"
            } else {
                encoded += string(r)
            }
        }
        url += "?text=" + encoded
    }
    c.JSON(http.StatusOK, gin.H{"url": url})
}
