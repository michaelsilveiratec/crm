package api

import (
	"net/http"
	"strconv"
	"strings"
	"unicode"

	"github.com/gin-gonic/gin"
)

// GetChurchAndUser extrai churchID e userID do contexto do Gin com checagem de existência.
// Emite resposta 401 automaticamente e retorna false se algum valor estiver ausente.
func GetChurchAndUser(c *gin.Context) (churchID int, userID int, ok bool) {
	cid, existsC := c.Get("church_id")
	uid, existsU := c.Get("user_id")

	if !existsC || !existsU {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Sessão inválida. Faça login novamente."})
		return 0, 0, false
	}

	churchID, ok1 := cid.(int)
	userID, ok2 := uid.(int)

	if !ok1 || !ok2 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Sessão corrompida. Faça login novamente."})
		return 0, 0, false
	}

	return churchID, userID, true
}

// GetChurchID extrai apenas o churchID do contexto.
func GetChurchID(c *gin.Context) (int, bool) {
	cid, exists := c.Get("church_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Igreja não identificada."})
		return 0, false
	}
	id, ok := cid.(int)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Sessão inválida."})
		return 0, false
	}
	return id, true
}

// ParseIDParam lê o parâmetro "id" da URL e retorna o inteiro correspondente.
// Emite resposta 400 automaticamente em caso de erro.
func ParseIDParam(c *gin.Context) (int, bool) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil || id <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido."})
		return 0, false
	}
	return id, true
}

// ParseIDQuery lê o parâmetro de query "id" e retorna o inteiro correspondente.
func ParseIDQuery(c *gin.Context, key string) (int, bool) {
	idStr := c.Query(key)
	id, err := strconv.Atoi(idStr)
	if err != nil || id <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Parâmetro '" + key + "' inválido."})
		return 0, false
	}
	return id, true
}

// BindJSON faz o bind do JSON e emite erro 400 padronizado se falhar.
// Retorna true se bem-sucedido.
func BindJSON(c *gin.Context, dst any) bool {
	if err := c.ShouldBindJSON(dst); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos: " + err.Error()})
		return false
	}
	return true
}

// SanitizePhone remove todos os caracteres não-numéricos de um número de telefone.
func SanitizePhone(phone string) string {
	var b strings.Builder
	for _, r := range phone {
		if unicode.IsDigit(r) {
			b.WriteRune(r)
		}
	}
	return b.String()
}

// EnsureSlice garante que um slice nil seja convertido para slice vazio,
// evitando que o JSON serialize como null em vez de [].
func EnsureSlice[T any](s []T) []T {
	if s == nil {
		return []T{}
	}
	return s
}

// JSONError emite uma resposta de erro JSON padronizada.
func JSONError(c *gin.Context, status int, msg string) {
	c.JSON(status, gin.H{"error": msg})
}

// JSONSuccess emite uma resposta de sucesso JSON padronizada.
func JSONSuccess(c *gin.Context, msg string) {
	c.JSON(http.StatusOK, gin.H{"message": msg})
}
