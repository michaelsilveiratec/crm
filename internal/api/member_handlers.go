package api

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/user/crm_eclesia/internal/db"
)

// CreateMemberHandler — POST /api/pastor/members
func CreateMemberHandler(c *gin.Context) {
	churchID, userID, ok := GetChurchAndUser(c)
	if !ok {
		return
	}

	var m db.Member
	if !BindJSON(c, &m) {
		return
	}

	if len(m.PhotoURL) > 3_000_000 {
		JSONError(c, http.StatusBadRequest, "A foto enviada é muito grande. Envie uma imagem menor.")
		return
	}

	m.ChurchID = churchID
	m.CreatedBy = userID

	if err := db.CreateMember(&m); err != nil {
		JSONError(c, http.StatusInternalServerError, "Erro ao criar membro.")
		return
	}

	db.SaveActivity(churchID, userID, "Cadastro de Membro", "Cadastrou: "+m.Name)
	c.JSON(http.StatusCreated, m)
}

// GetMembersHandler — GET /api/pastor/members
func GetMembersHandler(c *gin.Context) {
	churchID, ok := GetChurchID(c)
	if !ok {
		return
	}

	members, err := db.GetAllMembers(churchID)
	if err != nil {
		JSONError(c, http.StatusInternalServerError, "Erro ao buscar membros.")
		return
	}

	c.JSON(http.StatusOK, EnsureSlice(members))
}

// UpdateMemberHandler — PUT /api/pastor/members/:id
func UpdateMemberHandler(c *gin.Context) {
	churchID, userID, ok := GetChurchAndUser(c)
	if !ok {
		return
	}

	memberID, ok := ParseIDParam(c)
	if !ok {
		return
	}

	var m db.Member
	if !BindJSON(c, &m) {
		return
	}

	if m.Name == "" {
		JSONError(c, http.StatusBadRequest, "O nome do membro é obrigatório.")
		return
	}

	if len(m.PhotoURL) > 3_000_000 {
		JSONError(c, http.StatusBadRequest, "A foto enviada é muito grande. Envie uma imagem menor.")
		return
	}

	m.ID = memberID
	m.ChurchID = churchID

	if err := db.UpdateMember(&m); err != nil {
		JSONError(c, http.StatusInternalServerError, "Erro ao atualizar membro.")
		return
	}

	db.SaveActivity(churchID, userID, "Edição de Membro", "Editou: "+m.Name)
	JSONSuccess(c, "Membro atualizado com sucesso.")
}

// DeleteMemberHandler — DELETE /api/pastor/members/:id
func DeleteMemberHandler(c *gin.Context) {
	churchID, userID, ok := GetChurchAndUser(c)
	if !ok {
		return
	}

	memberID, ok := ParseIDParam(c)
	if !ok {
		return
	}

	if err := db.DeleteMember(memberID, churchID); err != nil {
		JSONError(c, http.StatusInternalServerError, "Erro ao excluir membro.")
		return
	}

	db.SaveActivity(churchID, userID, "Exclusão de Membro", fmt.Sprintf("Excluiu membro ID %d", memberID))
	JSONSuccess(c, "Membro excluído com sucesso.")
}

// GetBirthdaysHandler — GET /api/pastor/birthdays
func GetBirthdaysHandler(c *gin.Context) {
	churchID, ok := GetChurchID(c)
	if !ok {
		return
	}

	all, err := db.GetAllMembers(churchID)
	if err != nil {
		JSONError(c, http.StatusInternalServerError, "Erro ao buscar aniversariantes.")
		return
	}

	// Filtra pelo mês atual — BirthDate formato "YYYY-MM-DD"
	currentMonth := fmt.Sprintf("%02d", int(time.Now().Month()))
	var birthdays []db.Member
	for _, m := range all {
		if len(m.BirthDate) >= 7 && m.BirthDate[5:7] == currentMonth {
			birthdays = append(birthdays, m)
		}
	}

	c.JSON(http.StatusOK, EnsureSlice(birthdays))
}
