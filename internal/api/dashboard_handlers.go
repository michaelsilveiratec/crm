package api

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/user/crm_eclesia/internal/db"
)

func GetDashboardStatsHandler(c *gin.Context) {
	churchID, ok := GetChurchID(c)
	if !ok {
		return
	}

	var stats struct {
		TotalMembers     int              `json:"total_members"`
		NewMembersMonth  int              `json:"new_members_month"`
		BirthdaysMonth   int              `json:"birthdays_month"`
		ActiveMessages   int              `json:"active_messages"`
		GrowthData       []MonthlyCount   `json:"growth_data"`
		RecentActivities []Activity       `json:"recent_activities"`
		BirthdaysToday   []BirthdayPerson `json:"birthdays_today"`
	}
	stats.BirthdaysToday = []BirthdayPerson{}

	// 1. Total de Membros
	db.DB.QueryRow("SELECT COUNT(*) FROM members WHERE church_id = $1", churchID).Scan(&stats.TotalMembers)

	// 2. Novos membros este mês
	now := time.Now()
	firstOfMonth := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, time.Local)
	db.DB.QueryRow("SELECT COUNT(*) FROM members WHERE church_id = $1 AND created_at >= $2", churchID, firstOfMonth).Scan(&stats.NewMembersMonth)

	// 3. Aniversariantes do mês (Postgres syntax)
	db.DB.QueryRow("SELECT COUNT(*) FROM members WHERE church_id = $1 AND EXTRACT(MONTH FROM TO_DATE(birth_date, 'YYYY-MM-DD')) = $2",
		churchID, int(now.Month())).Scan(&stats.BirthdaysMonth)

	// 4. Mensagens Ativas
	db.DB.QueryRow("SELECT COUNT(*) FROM pastoral_messages WHERE church_id = $1 AND status = 'ATIVA'", churchID).Scan(&stats.ActiveMessages)

	// 5. Dados de crescimento (últimos 6 meses)
	for i := 5; i >= 0; i-- {
		m := now.AddDate(0, -i, 0)
		monthName := m.Format("Jan")
		var count int
		start := time.Date(m.Year(), m.Month(), 1, 0, 0, 0, 0, time.Local)
		end := start.AddDate(0, 1, 0)

		db.DB.QueryRow("SELECT COUNT(*) FROM members WHERE church_id = $1 AND created_at >= $2 AND created_at < $3",
			churchID, start, end).Scan(&count)

		stats.GrowthData = append(stats.GrowthData, MonthlyCount{Month: monthName, Count: count})
	}

	// 6. Atividades recentes (Audit Logs)
	rows, _ := db.DB.Query(`SELECT a.action, u.name, a.created_at
		FROM audit_logs a
		LEFT JOIN users u ON a.user_id = u.id
		WHERE a.church_id = $1
		ORDER BY a.created_at DESC LIMIT 5`, churchID)

	if rows != nil {
		defer rows.Close()
		for rows.Next() {
			var act Activity
			rows.Scan(&act.Action, &act.UserName, &act.Date)
			stats.RecentActivities = append(stats.RecentActivities, act)
		}
	}

	// 6. Aniversariantes de HOJE
	bRows, _ := db.DB.Query(`SELECT id, name, whatsapp, birth_date FROM members
		WHERE church_id = $1 AND
		EXTRACT(DAY FROM TO_DATE(birth_date, 'YYYY-MM-DD')) = $2 AND
		EXTRACT(MONTH FROM TO_DATE(birth_date, 'YYYY-MM-DD')) = $3`,
		churchID, now.Day(), int(now.Month()))

	if bRows != nil {
		defer bRows.Close()
		for bRows.Next() {
			var bp BirthdayPerson
			bRows.Scan(&bp.ID, &bp.Name, &bp.WhatsApp, &bp.Date)
			stats.BirthdaysToday = append(stats.BirthdaysToday, bp)
		}
	}

	stats.GrowthData = EnsureSlice(stats.GrowthData)
	stats.RecentActivities = EnsureSlice(stats.RecentActivities)

	c.JSON(http.StatusOK, stats)
}

type BirthdayPerson struct {
	ID       int    `json:"id"`
	Name     string `json:"name"`
	WhatsApp string `json:"whatsapp"`
	Date     string `json:"date"`
}

type MonthlyCount struct {
	Month string `json:"month"`
	Count int    `json:"count"`
}

type Activity struct {
	Action   string    `json:"action"`
	UserName string    `json:"user_name"`
	Date     time.Time `json:"date"`
}
