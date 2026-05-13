package api

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/user/crm_eclesia/internal/db"
)

// CreateVisitHandler — POST /api/pastor/visits  |  /api/worker/visits
func CreateVisitHandler(c *gin.Context) {
	churchID, userID, ok := GetChurchAndUser(c)
	if !ok {
		return
	}

	var v db.PastoralVisit
	if !BindJSON(c, &v) {
		return
	}

	if v.VisitDate == "" {
		JSONError(c, http.StatusBadRequest, "A data da visita é obrigatória.")
		return
	}

	v.ChurchID = churchID
	v.ResponsibleID = userID

	if err := db.CreateVisit(&v); err != nil {
		JSONError(c, http.StatusInternalServerError, "Erro ao agendar visita.")
		return
	}

	db.SaveActivity(churchID, userID, "Agendamento de Visita", "Agendou visita para "+v.VisitDate)
	c.JSON(http.StatusCreated, v)
}

// UpdateVisitHandler — PUT /api/pastor/visits/:id  |  /api/worker/visits/:id
func UpdateVisitHandler(c *gin.Context) {
	churchID, userID, ok := GetChurchAndUser(c)
	if !ok {
		return
	}

	visitID, ok := ParseIDParam(c)
	if !ok {
		return
	}

	var v db.PastoralVisit
	if !BindJSON(c, &v) {
		return
	}

	if v.VisitDate == "" {
		JSONError(c, http.StatusBadRequest, "A data da visita é obrigatória.")
		return
	}

	v.ID = visitID
	v.ChurchID = churchID
	// Mantém o responsible_id se o frontend não enviou (obreiro editando sua visita)
	if v.ResponsibleID == 0 {
		v.ResponsibleID = userID
	}

	if err := db.UpdateVisit(&v); err != nil {
		JSONError(c, http.StatusInternalServerError, "Erro ao atualizar visita.")
		return
	}

	db.SaveActivity(churchID, userID, "Edição de Visita", "Atualizou visita do dia "+v.VisitDate)
	JSONSuccess(c, "Visita atualizada com sucesso.")
}

// GetVisitsHandler — GET /api/pastor/visits  |  /api/worker/visits
func GetVisitsHandler(c *gin.Context) {
	churchID, ok := GetChurchID(c)
	if !ok {
		return
	}

	visits, err := db.GetAllVisits(churchID)
	if err != nil {
		JSONError(c, http.StatusInternalServerError, "Erro ao buscar visitas.")
		return
	}

	c.JSON(http.StatusOK, EnsureSlice(visits))
}
