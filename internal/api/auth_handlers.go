package api

import (
	"net/http"

	"github.com/user/crm_eclesia/internal/auth"
	"github.com/user/crm_eclesia/internal/db"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

type LoginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

func LoginHandler(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos"})
		return
	}

	user, err := db.GetUserByUsername(req.Username)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Usuário ou senha incorretos"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Usuário ou senha incorretos"})
		return
	}

	token, err := auth.GenerateToken(user.ID, user.Role)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao gerar token"})
		return
	}

	// Set cookie
	c.SetCookie("jwt", token, 3600*24, "/", "", false, true) // Secure=false para dev local sem HTTPS

	c.JSON(http.StatusOK, gin.H{
		"message": "Login realizado com sucesso",
		"user":    user,
	})
}

func LogoutHandler(c *gin.Context) {
	c.SetCookie("jwt", "", -1, "/", "", false, true)
	c.JSON(http.StatusOK, gin.H{"message": "Logout realizado"})
}

func MeHandler(c *gin.Context) {
	role, _ := c.Get("role")
	userID, _ := c.Get("user_id")

	c.JSON(http.StatusOK, gin.H{
		"user_id": userID,
		"role":    role,
	})
}
