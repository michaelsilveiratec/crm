package api

import (
	"net/http"

	"github.com/user/crm_eclesia/internal/db"
	"github.com/gin-gonic/gin"
)

type CreateMemberRequest struct {
	Name          string `json:"name" binding:"required"`
	Address       string `json:"address"`
	Phone         string `json:"phone"`
	WhatsApp      string `json:"whatsapp" binding:"required"`
	BirthDate     string `json:"birth_date"`
	AttendantName string `json:"attendant_name"`
	MaritalStatus string `json:"marital_status"`
	Observations  string `json:"observations"`
}

func CreateMemberHandler(c *gin.Context) {
	var req CreateMemberRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados obrigatórios ausentes ou inválidos"})
		return
	}

	// Recupera o ID do usuário que está logado (setado pelo middleware AuthRequired)
	userIDVal, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao identificar usuário logado"})
		return
	}
	userID := userIDVal.(int)

	member := &db.Member{
		Name:          req.Name,
		Address:       req.Address,
		Phone:         req.Phone,
		WhatsApp:      req.WhatsApp,
		BirthDate:     req.BirthDate,
		AttendantName: req.AttendantName,
		MaritalStatus: req.MaritalStatus,
		Observations:  req.Observations,
		CreatedBy:     userID,
	}

	if err := db.CreateMember(member); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao salvar cadastro no banco"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Cadastro realizado com sucesso",
	})
}

func GetMembersHandler(c *gin.Context) {
	members, err := db.GetAllMembers()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao buscar membros"})
		return
	}
	
	// If the DB returns nil for empty slice, ensure we return an empty array instead of null
	if members == nil {
		members = []db.Member{}
	}

	c.JSON(http.StatusOK, members)
}
