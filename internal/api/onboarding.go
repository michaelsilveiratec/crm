package api

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/user/crm_eclesia/internal/db"
	"github.com/user/crm_eclesia/internal/service"
	"golang.org/x/crypto/bcrypt"
)

type RegisterRequest struct {
	ChurchName string `json:"church_name" binding:"required"`
	ChurchSlug string `json:"church_slug" binding:"required"`
	AdminName  string `json:"admin_name" binding:"required"`
	Username   string `json:"username" binding:"required"`
	Password   string `json:"password" binding:"required,min=6"`
	Email      string `json:"email" binding:"required,email"`
}

func RegisterHandler(c *gin.Context) {
	var req RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos: " + err.Error()})
		return
	}

	// Normalizar slug
	slug := strings.ToLower(strings.ReplaceAll(req.ChurchSlug, " ", "-"))

	// 1. Iniciar transação
	tx, err := db.DB.Begin()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro interno ao iniciar cadastro"})
		return
	}
	defer tx.Rollback()

	// 2. Criar a Igreja
	var churchID int
	err = tx.QueryRow(`INSERT INTO churches (name, slug, email, plan, status) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
		req.ChurchName, slug, req.Email, "basic", "active").Scan(&churchID)
	if err != nil {
		if strings.Contains(err.Error(), "unique_slug") || strings.Contains(err.Error(), "unique") {
			c.JSON(http.StatusConflict, gin.H{"error": "Este identificador de igreja (slug) já está em uso"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao criar igreja"})
		}
		return
	}

	// 3. Criar Assinatura Trial (7 dias)
	_, err = tx.Exec(`INSERT INTO subscriptions (church_id, plan, status, trial_ends_at) VALUES ($1, $2, $3, NOW() + INTERVAL '7 days')`,
		churchID, "basic", "trialing")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao criar assinatura"})
		return
	}

	// 4. Criar o Pastor Administrador
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	_, err = tx.Exec(`INSERT INTO users (church_id, name, username, password_hash, role) VALUES ($1, $2, $3, $4, $5)`,
		churchID, req.AdminName, req.Username, string(hashedPassword), "pastor")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao criar usuário administrador"})
		return
	}

	// 5. Criar Mensagens Pastorais Padrão
	defaultMessages := []struct {
		cat, tit, msg string
	}{
		{"BOAS_VINDAS", "Bem-vindo!", "Olá {nome}, que alegria ter você conosco na {igreja}!"},
		{"ANIVERSARIANTE", "Parabéns!", "Feliz aniversário, {nome}! Que Deus te abençoe ricamente hoje."},
	}

	for _, dm := range defaultMessages {
		_, err = tx.Exec(`INSERT INTO pastoral_messages (church_id, categoria, titulo, mensagem, status) VALUES ($1, $2, $3, $4, $5)`,
			churchID, dm.cat, dm.tit, dm.msg, "ATIVA")
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao criar mensagens padrão"})
			return
		}
	}

	// 6. Commitar
	if err := tx.Commit(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao finalizar cadastro"})
		return
	}

	// Registrar Auditoria
	service.LogActivity(churchID, 0, "Nova igreja registrada: "+req.ChurchName, c.ClientIP())

	c.JSON(http.StatusCreated, gin.H{
		"message":     "Igreja cadastrada com sucesso! Você já pode fazer login.",
		"church_slug": slug,
	})
}
