package api

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/user/crm_eclesia/internal/db"
)

func GetActivitiesHandler(c *gin.Context) {
	churchID, ok := GetChurchID(c)
	if !ok {
		return
	}

	activities, err := db.GetRecentActivities(churchID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao buscar atividades recentes"})
		return
	}

	c.JSON(http.StatusOK, EnsureSlice(activities))
}
