package api

import (
	"net/http"
	"github.com/user/crm_eclesia/internal/db"
	"github.com/gin-gonic/gin"
)

func GetActivitiesHandler(c *gin.Context) {
	churchID, _ := c.Get("church_id")
	
	activities, err := db.GetRecentActivities(churchID.(int))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao buscar atividades recentes"})
		return
	}

	if activities == nil {
		activities = []db.ActivityItem{}
	}

	c.JSON(http.StatusOK, activities)
}
