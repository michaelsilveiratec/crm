package api

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/user/crm_eclesia/internal/db"
)

func CreateMemberHandler(c *gin.Context) {
	churchID, _ := c.Get("church_id")
	userID, _ := c.Get("user_id")

	var m db.Member
	if err := c.ShouldBindJSON(&m); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos"})
		return
	}

	// Validação simples da foto em base64.
	// O frontend já limita em 2MB, mas aqui protegemos também o backend.
	if len(m.PhotoURL) > 3_000_000 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "A foto enviada é muito grande. Envie uma imagem menor."})
		return
	}

	m.ChurchID = churchID.(int)
	m.CreatedBy = userID.(int)

	if err := db.CreateMember(&m); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao criar membro"})
		return
	}

	db.SaveActivity(
		churchID.(int),
		userID.(int),
		"Cadastro de Membro",
		"Cadastrou o novo membro/visitante: "+m.Name,
	)

	c.JSON(http.StatusCreated, m)
}

func GetMembersHandler(c *gin.Context) {
	churchID, _ := c.Get("church_id")

	members, err := db.GetAllMembers(churchID.(int))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao buscar membros"})
		return
	}

	if members == nil {
		members = []db.Member{}
	}

	c.JSON(http.StatusOK, members)
}

func GetBirthdaysHandler(c *gin.Context) {
	churchID, _ := c.Get("church_id")

	members, err := db.GetAllMembers(churchID.(int))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao buscar aniversariantes"})
		return
	}

	if members == nil {
		members = []db.Member{}
	}

	c.JSON(http.StatusOK, members)
}
