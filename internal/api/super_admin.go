package api

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/user/crm_eclesia/internal/db"
)

// SuperAdminGetChurches returns all churches registered in the SaaS
func SuperAdminGetChurches(c *gin.Context) {
	query := "SELECT id, name, slug, email, phone, plan, status, created_at FROM churches ORDER BY created_at DESC"
	rows, err := db.DB.Query(query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao buscar igrejas"})
		return
	}
	defer rows.Close()

	type Church struct {
		ID        int    `json:"id"`
		Name      string `json:"name"`
		Slug      string `json:"slug"`
		Email     string `json:"email"`
		Phone     string `json:"phone"`
		Plan      string `json:"plan"`
		Status    string `json:"status"`
		CreatedAt string `json:"created_at"`
	}

	var list []Church
	for rows.Next() {
		var ch Church
		if err := rows.Scan(&ch.ID, &ch.Name, &ch.Slug, &ch.Email, &ch.Phone, &ch.Plan, &ch.Status, &ch.CreatedAt); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao ler registro"})
			return
		}
		list = append(list, ch)
	}
	c.JSON(http.StatusOK, list)
}

// SuperAdminUpdateChurchStatus allows blocking or activating a church
func SuperAdminUpdateChurchStatus(c *gin.Context) {
	idStr := c.Param("id")
	id, _ := strconv.Atoi(idStr)

	var payload struct {
		Status string `json:"status"` // 'active', 'blocked'
	}
	if err := c.BindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Payload inválido"})
		return
	}

	_, err := db.DB.Exec("UPDATE churches SET status = $1 WHERE id = $2", payload.Status, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao atualizar status da igreja"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Status da igreja atualizado"})
}

// SuperAdminGetStats returns global platform metrics
func SuperAdminGetStats(c *gin.Context) {
	var totalChurches int
	var totalUsers int
	var totalMembers int

	db.DB.QueryRow("SELECT COUNT(*) FROM churches").Scan(&totalChurches)
	db.DB.QueryRow("SELECT COUNT(*) FROM users").Scan(&totalUsers)
	db.DB.QueryRow("SELECT COUNT(*) FROM members").Scan(&totalMembers)

	c.JSON(http.StatusOK, gin.H{
		"total_churches": totalChurches,
		"total_users":    totalUsers,
		"total_members":  totalMembers,
	})
}
