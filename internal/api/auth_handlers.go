package api

import (
	"net/http"
	"strconv"

	"github.com/user/crm_eclesia/internal/auth"
	"github.com/user/crm_eclesia/internal/db"
	"github.com/user/crm_eclesia/internal/service"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

type LoginRequest struct {
	ChurchSlug string `json:"church_slug" binding:"required"`
	Username   string `json:"username" binding:"required"`
	Password   string `json:"password" binding:"required"`
}

func LoginHandler(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos"})
		return
	}

	// 1. Encontrar a igreja pelo slug
	var churchID int
	err := db.DB.QueryRow("SELECT id FROM churches WHERE slug = $1 AND status = 'active'", req.ChurchSlug).Scan(&churchID)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Igreja não encontrada ou inativa"})
		return
	}

	// 2. Buscar o usuário dentro desta igreja específica
	user := &db.User{}
	query := "SELECT id, church_id, name, username, password_hash, role, provisional_access FROM users WHERE username = $1 AND church_id = $2"
	err = db.DB.QueryRow(query, req.Username, churchID).Scan(&user.ID, &user.ChurchID, &user.Name, &user.Username, &user.PasswordHash, &user.Role, &user.ProvisionalAccess)
	
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Usuário ou senha incorretos"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Usuário ou senha incorretos"})
		return
	}

	token, err := auth.GenerateToken(user.ID, user.ChurchID, user.Role)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao gerar token"})
		return
	}

	// Set cookie
	c.SetCookie("jwt", token, 3600*24, "/", "", false, true) 

	// Registrar Auditoria
	service.LogActivity(user.ChurchID, user.ID, "Login realizado", c.ClientIP())

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
	churchID, _ := c.Get("church_id")

	var userName string
	var churchName string
	var provisionalAccess bool

	// Buscar dados do usuário
	if idInt, ok := userID.(int); ok {
		if user, err := db.GetUserByID(idInt); err == nil {
			userName = user.Name
			provisionalAccess = user.ProvisionalAccess
		}
	}

	// Buscar nome da igreja
	if cidInt, ok := churchID.(int); ok {
		err := db.DB.QueryRow("SELECT name FROM churches WHERE id = $1", cidInt).Scan(&churchName)
		if err != nil {
			churchName = "Minha Igreja"
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"user_id":            userID,
		"user_name":          userName,
		"church_id":          churchID,
		"church_name":        churchName,
		"role":               role,
		"provisional_access": provisionalAccess,
	})
}

func GetUsersHandler(c *gin.Context) {
	churchID, _ := c.Get("church_id")
	users, err := db.GetAllUsers(churchID.(int))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao buscar usuários"})
		return
	}
	c.JSON(http.StatusOK, users)
}

func CreateUserHandler(c *gin.Context) {
	churchID, _ := c.Get("church_id")

	var req struct {
		Name     string `json:"name" binding:"required"`
		Username string `json:"username" binding:"required"`
		Password string `json:"password" binding:"required"`
		Role     string `json:"role" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos"})
		return
	}

	// Criptografar senha
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao processar senha"})
		return
	}

	_, err = db.DB.Exec("INSERT INTO users (church_id, name, username, password_hash, role) VALUES ($1, $2, $3, $4, $5)",
		churchID.(int), req.Name, req.Username, string(hashedPassword), req.Role)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao criar usuário: " + err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Usuário criado com sucesso"})
}

func ToggleProvisionalAccessHandler(c *gin.Context) {
	churchID, _ := c.Get("church_id")
	idStr := c.Param("id")
	targetUserID, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
		return
	}

	var payload struct {
		Grant bool `json:"grant"`
	}
	if err := c.BindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Payload inválido"})
		return
	}

	if err := db.UpdateProvisionalAccess(targetUserID, churchID.(int), payload.Grant); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao atualizar permissão"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Permissão atualizada com sucesso"})
}
func ForgotPasswordHandler(c *gin.Context) {
	var req struct {
		Target string `json:"target" binding:"required"` // Email ou Telefone
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Informe seu e-mail ou telefone"})
		return
	}

	// Buscar usuário pelo e-mail ou telefone
	var user db.User
	query := "SELECT id, church_id, name, username, email, phone FROM users WHERE email = $1 OR phone = $1 LIMIT 1"
	err := db.DB.QueryRow(query, req.Target).Scan(&user.ID, &user.ChurchID, &user.Name, &user.Username, &user.Email, &user.Phone)

	if err != nil {
		// Por segurança, não informamos se o usuário existe ou não
		c.JSON(http.StatusOK, gin.H{"message": "Se os dados estiverem corretos, você receberá sua nova senha em instantes."})
		return
	}

	// Gerar nova senha temporária
	tempPass := "IIGD1234"
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(tempPass), bcrypt.DefaultCost)

	// Atualizar no banco
	_, err = db.DB.Exec("UPDATE users SET password_hash = $1 WHERE id = $2", string(hashedPassword), user.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao resetar senha"})
		return
	}

	// Simular envio (Log de Atividade)
	details := "Recuperação de senha solicitada para " + user.Name + " (Login: " + user.Username + "). Nova senha: " + tempPass
	service.LogActivity(user.ChurchID, user.ID, "Recuperação de Senha", details)

	// Aqui futuramente entrará a integração com API de SMS/WhatsApp ou E-mail
	// Por enquanto, o log de atividades servirá para auditoria

	c.JSON(http.StatusOK, gin.H{"message": "Senha resetada com sucesso! Use a senha temporária: " + tempPass})
}
