package api

import (
	"net/http"
	"github.com/user/crm_eclesia/internal/db"
	"github.com/gin-gonic/gin"
)

func CreateVisitHandler(c *gin.Context) {
	churchID, _ := c.Get("church_id")
	userID, _ := c.Get("user_id")
	
	var v db.PastoralVisit
	if err := c.ShouldBindJSON(&v); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos"})
		return
	}

	v.ChurchID = churchID.(int)
	v.ResponsibleID = userID.(int)

	if err := db.CreateVisit(&v); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao agendar visita: " + err.Error()})
		return
	}

	// Registrar atividade recente
	db.SaveActivity(churchID.(int), userID.(int), "Agendamento de Visita", "Agendou uma visita para o dia " + v.VisitDate)

	c.JSON(http.StatusCreated, v)
}

func GetVisitsHandler(c *gin.Context) {
	churchID, _ := c.Get("church_id")
	
	visits, err := db.GetAllVisits(churchID.(int))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao buscar visitas: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, visits)
}
