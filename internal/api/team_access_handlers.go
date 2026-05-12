package api

import (
	"net/http"
	"strconv"
	"strings"
	"sync"

	"github.com/gin-gonic/gin"
	"github.com/user/crm_eclesia/internal/db"
	"golang.org/x/crypto/bcrypt"
)

var teamAccessMigrationOnce sync.Once
var teamAccessMigrationErr error

type TeamUserResponse struct {
	ID                int    `json:"id"`
	Name              string `json:"name"`
	Username          string `json:"username"`
	Email             string `json:"email"`
	Phone             string `json:"phone"`
	Role              string `json:"role"`
	ProvisionalAccess bool   `json:"provisional_access"`
}

func ensureTeamAccessColumns() error {
	teamAccessMigrationOnce.Do(func() {
		_, teamAccessMigrationErr = db.DB.Exec(`
			ALTER TABLE users 
			ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP NULL
		`)
	})

	return teamAccessMigrationErr
}

func getChurchAndUser(c *gin.Context) (int, int, bool) {
	churchID, existsChurch := c.Get("church_id")
	userID, existsUser := c.Get("user_id")

	if !existsChurch || !existsUser {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Sessão inválida"})
		return 0, 0, false
	}

	return churchID.(int), userID.(int), true
}

func GetTeamUsersCRUDHandler(c *gin.Context) {
	if err := ensureTeamAccessColumns(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao preparar tabela de usuários"})
		return
	}

	churchID, exists := c.Get("church_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Igreja não identificada"})
		return
	}

	rows, err := db.DB.Query(`
		SELECT 
			id,
			COALESCE(name, ''),
			COALESCE(username, ''),
			COALESCE(email, ''),
			COALESCE(phone, ''),
			role,
			COALESCE(provisional_access, false)
		FROM users
		WHERE church_id = $1
		  AND deleted_at IS NULL
		ORDER BY 
			CASE WHEN role = 'pastor' THEN 0 ELSE 1 END,
			name ASC
	`, churchID.(int))

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao buscar usuários"})
		return
	}
	defer rows.Close()

	users := []TeamUserResponse{}

	for rows.Next() {
		var u TeamUserResponse

		if err := rows.Scan(
			&u.ID,
			&u.Name,
			&u.Username,
			&u.Email,
			&u.Phone,
			&u.Role,
			&u.ProvisionalAccess,
		); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao ler usuários"})
			return
		}

		users = append(users, u)
	}

	c.JSON(http.StatusOK, users)
}

func CreateTeamUserCRUDHandler(c *gin.Context) {
	if err := ensureTeamAccessColumns(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao preparar tabela de usuários"})
		return
	}

	churchID, loggedUserID, ok := getChurchAndUser(c)
	if !ok {
		return
	}

	var payload struct {
		Name     string `json:"name"`
		Username string `json:"username"`
		Email    string `json:"email"`
		Phone    string `json:"phone"`
		Password string `json:"password"`
	}

	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos"})
		return
	}

	payload.Name = strings.TrimSpace(payload.Name)
	payload.Username = strings.TrimSpace(payload.Username)
	payload.Email = strings.TrimSpace(payload.Email)
	payload.Phone = strings.TrimSpace(payload.Phone)

	if payload.Name == "" || payload.Username == "" || payload.Password == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Nome, login e senha são obrigatórios"})
		return
	}

	if len(payload.Password) < 6 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "A senha precisa ter no mínimo 6 caracteres"})
		return
	}

	var exists int
	err := db.DB.QueryRow(`
		SELECT COUNT(*) 
		FROM users 
		WHERE church_id = $1 
		  AND username = $2
		  AND deleted_at IS NULL
	`, churchID, payload.Username).Scan(&exists)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao validar usuário"})
		return
	}

	if exists > 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Já existe um usuário ativo com este login nesta igreja"})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(payload.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao proteger a senha"})
		return
	}

	var id int
	err = db.DB.QueryRow(`
		INSERT INTO users (
			church_id,
			name,
			username,
			email,
			phone,
			password_hash,
			role,
			provisional_access,
			deleted_at
		)
		VALUES ($1, $2, $3, $4, $5, $6, 'obreiro', false, NULL)
		RETURNING id
	`,
		churchID,
		payload.Name,
		payload.Username,
		nullIfEmpty(payload.Email),
		nullIfEmpty(payload.Phone),
		string(hashedPassword),
	).Scan(&id)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao criar usuário"})
		return
	}

	db.SaveActivity(
		churchID,
		loggedUserID,
		"Cadastro de Usuário",
		"Criou o acesso do obreiro: "+payload.Name,
	)

	c.JSON(http.StatusCreated, gin.H{
		"id":      id,
		"message": "Obreiro criado com sucesso",
	})
}

func UpdateTeamUserCRUDHandler(c *gin.Context) {
	if err := ensureTeamAccessColumns(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao preparar tabela de usuários"})
		return
	}

	churchID, loggedUserID, ok := getChurchAndUser(c)
	if !ok {
		return
	}

	userID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
		return
	}

	var payload struct {
		Name     string `json:"name"`
		Username string `json:"username"`
		Email    string `json:"email"`
		Phone    string `json:"phone"`
	}

	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos"})
		return
	}

	payload.Name = strings.TrimSpace(payload.Name)
	payload.Username = strings.TrimSpace(payload.Username)
	payload.Email = strings.TrimSpace(payload.Email)
	payload.Phone = strings.TrimSpace(payload.Phone)

	if payload.Name == "" || payload.Username == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Nome e login são obrigatórios"})
		return
	}

	var exists int
	err = db.DB.QueryRow(`
		SELECT COUNT(*) 
		FROM users 
		WHERE church_id = $1 
		  AND username = $2 
		  AND id <> $3
		  AND deleted_at IS NULL
	`, churchID, payload.Username, userID).Scan(&exists)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao validar login"})
		return
	}

	if exists > 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Já existe outro usuário ativo com este login nesta igreja"})
		return
	}

	result, err := db.DB.Exec(`
		UPDATE users
		SET name = $1,
			username = $2,
			email = $3,
			phone = $4
		WHERE id = $5
		  AND church_id = $6
		  AND role = 'obreiro'
		  AND deleted_at IS NULL
	`,
		payload.Name,
		payload.Username,
		nullIfEmpty(payload.Email),
		nullIfEmpty(payload.Phone),
		userID,
		churchID,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao atualizar usuário"})
		return
	}

	rows, _ := result.RowsAffected()
	if rows == 0 {
		c.JSON(http.StatusForbidden, gin.H{"error": "Somente obreiros ativos podem ser editados por esta tela"})
		return
	}

	db.SaveActivity(
		churchID,
		loggedUserID,
		"Edição de Usuário",
		"Editou o acesso do obreiro: "+payload.Name,
	)

	c.JSON(http.StatusOK, gin.H{"message": "Obreiro atualizado com sucesso"})
}

func ResetTeamUserPasswordHandler(c *gin.Context) {
	if err := ensureTeamAccessColumns(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao preparar tabela de usuários"})
		return
	}

	churchID, loggedUserID, ok := getChurchAndUser(c)
	if !ok {
		return
	}

	userID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
		return
	}

	var payload struct {
		Password string `json:"password"`
	}

	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos"})
		return
	}

	if len(payload.Password) < 6 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "A nova senha precisa ter no mínimo 6 caracteres"})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(payload.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao proteger a senha"})
		return
	}

	result, err := db.DB.Exec(`
		UPDATE users
		SET password_hash = $1
		WHERE id = $2
		  AND church_id = $3
		  AND role = 'obreiro'
		  AND deleted_at IS NULL
	`,
		string(hashedPassword),
		userID,
		churchID,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao resetar senha"})
		return
	}

	rows, _ := result.RowsAffected()
	if rows == 0 {
		c.JSON(http.StatusForbidden, gin.H{"error": "Somente senha de obreiro ativo pode ser resetada por esta tela"})
		return
	}

	db.SaveActivity(
		churchID,
		loggedUserID,
		"Reset de Senha",
		"Resetou a senha de um obreiro",
	)

	c.JSON(http.StatusOK, gin.H{"message": "Senha atualizada com sucesso"})
}

func DeleteTeamUserCRUDHandler(c *gin.Context) {
	if err := ensureTeamAccessColumns(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao preparar tabela de usuários"})
		return
	}

	churchID, loggedUserID, ok := getChurchAndUser(c)
	if !ok {
		return
	}

	userID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
		return
	}

	if userID == loggedUserID {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Você não pode remover o próprio acesso"})
		return
	}

	result, err := db.DB.Exec(`
		UPDATE users
		SET 
			deleted_at = NOW(),
			provisional_access = false,
			username = username || '_removido_' || id
		WHERE id = $1
		  AND church_id = $2
		  AND role = 'obreiro'
		  AND deleted_at IS NULL
	`, userID, churchID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao remover usuário"})
		return
	}

	rows, _ := result.RowsAffected()
	if rows == 0 {
		c.JSON(http.StatusForbidden, gin.H{"error": "Somente obreiros ativos podem ser removidos por esta tela"})
		return
	}

	db.SaveActivity(
		churchID,
		loggedUserID,
		"Remoção de Usuário",
		"Removeu o acesso de um obreiro",
	)

	c.JSON(http.StatusOK, gin.H{"message": "Obreiro removido com sucesso"})
}

func ToggleTeamUserAccessCRUDHandler(c *gin.Context) {
	if err := ensureTeamAccessColumns(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao preparar tabela de usuários"})
		return
	}

	churchID, loggedUserID, ok := getChurchAndUser(c)
	if !ok {
		return
	}

	userID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
		return
	}

	var payload struct {
		Grant bool `json:"grant"`
	}

	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos"})
		return
	}

	result, err := db.DB.Exec(`
		UPDATE users
		SET provisional_access = $1
		WHERE id = $2
		  AND church_id = $3
		  AND role = 'obreiro'
		  AND deleted_at IS NULL
	`, payload.Grant, userID, churchID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao atualizar acesso"})
		return
	}

	rows, _ := result.RowsAffected()
	if rows == 0 {
		c.JSON(http.StatusForbidden, gin.H{"error": "Somente obreiros ativos podem ter acesso liberado ou bloqueado"})
		return
	}

	action := "Bloqueio de Acesso"
	detail := "Bloqueou o acesso provisório de um obreiro"

	if payload.Grant {
		action = "Liberação de Acesso"
		detail = "Liberou o acesso provisório de um obreiro"
	}

	db.SaveActivity(
		churchID,
		loggedUserID,
		action,
		detail,
	)

	c.JSON(http.StatusOK, gin.H{"message": "Acesso atualizado com sucesso"})
}

func nullIfEmpty(value string) interface{} {
	value = strings.TrimSpace(value)

	if value == "" {
		return nil
	}

	return value
}
