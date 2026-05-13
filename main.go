package main

import (
	"io/fs"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/user/crm_eclesia/internal/api"
	"github.com/user/crm_eclesia/internal/auth"
	"github.com/user/crm_eclesia/internal/db"
)

func main() {
	// Carrega variáveis de ambiente do arquivo .env
	if err := godotenv.Load(); err != nil {
		log.Println("Aviso: arquivo .env não encontrado. Usando variáveis de ambiente do sistema.")
	}

	// Inicializa o banco de dados PostgreSQL
	if err := db.InitDB(); err != nil {
		log.Fatal("Erro crítico ao iniciar o banco de dados: ", err)
	}

	r := gin.Default()

	// Segurança Global
	r.Use(auth.SecurityHeaders())
	r.Use(auth.RateLimiter(100, time.Minute))

	// Corrige aviso de trusted proxies
	if err := r.SetTrustedProxies(nil); err != nil {
		log.Println("Aviso ao configurar trusted proxies:", err)
	}

	// Grupo principal da API
	apiGroup := r.Group("/api")
	{
		// Rotas públicas
		apiGroup.GET("/health", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{
				"status":      "ok",
				"environment": os.Getenv("APP_ENV"),
				"database":    "connected",
			})
		})

		apiGroup.POST("/login", api.LoginHandler)
		apiGroup.POST("/register", api.RegisterHandler)
		apiGroup.POST("/logout", api.LogoutHandler)
		apiGroup.POST("/forgot-password", api.ForgotPasswordHandler)

		// Rotas protegidas gerais
		authGroup := apiGroup.Group("/")
		authGroup.Use(auth.AuthRequired())
		authGroup.Use(auth.SubscriptionRequired())
		{
			authGroup.GET("/me", api.MeHandler)
			authGroup.POST("/members", api.CreateMemberHandler)
		}

		// Rotas exclusivas para Pastor Administrador
		pastorGroup := apiGroup.Group("/pastor")
		pastorGroup.Use(auth.AuthRequired())
		pastorGroup.Use(auth.SubscriptionRequired())
		pastorGroup.Use(auth.RoleRequired("pastor"))
		{
			// Dashboard
			pastorGroup.GET("/dashboard-stats", api.GetDashboardStatsHandler)
			pastorGroup.GET("/activities", api.GetActivitiesHandler)

			// Membros e visitantes
			pastorGroup.GET("/members", api.GetMembersHandler)
			pastorGroup.POST("/members", api.CreateMemberHandler)
			pastorGroup.PUT("/members/:id", api.UpdateMemberHandler)
			pastorGroup.DELETE("/members/:id", api.DeleteMemberHandler)
			pastorGroup.GET("/members/export", api.ExportMembersCSVHandler)

			// Aniversariantes
			pastorGroup.GET("/birthdays", api.GetBirthdaysHandler)

			// WhatsApp e mensagens
			pastorGroup.POST("/message", api.SendWhatsAppMessageHandler)
			pastorGroup.POST("/whatsapp/send", api.SendRealWhatsAppHandler)
			pastorGroup.GET("/whatsapp/logs", api.GetWhatsAppLogsHandler)

			// CRUD completo de usuários/obreiros
			pastorGroup.GET("/users", api.GetTeamUsersCRUDHandler)
			pastorGroup.POST("/users", api.CreateTeamUserCRUDHandler)
			pastorGroup.PUT("/users/:id", api.UpdateTeamUserCRUDHandler)
			pastorGroup.PUT("/users/:id/password", api.ResetTeamUserPasswordHandler)
			pastorGroup.DELETE("/users/:id", api.DeleteTeamUserCRUDHandler)
			pastorGroup.POST("/users/:id/grant-admin", api.ToggleTeamUserAccessCRUDHandler)

			// Visitas Pastorais
			pastorGroup.GET("/visits", api.GetVisitsHandler)
			pastorGroup.POST("/visits", api.CreateVisitHandler)
			pastorGroup.PUT("/visits/:id", api.UpdateVisitHandler)

			// Mensagens Pastorais
			pastorGroup.GET("/pastoral-messages", api.GetPastoralMessagesHandler)
			pastorGroup.POST("/pastoral-messages", api.CreatePastoralMessageHandler)
			pastorGroup.PUT("/pastoral-messages/:id", api.UpdatePastoralMessageHandler)
			pastorGroup.DELETE("/pastoral-messages/:id", api.DeletePastoralMessageHandler)
			pastorGroup.GET("/pastoral-history", api.GetMessageHistoryHandler)
			pastorGroup.POST("/pastoral-bulk-send", api.SendBulkPastoralMessageHandler)
		}

		// Rotas compartilhadas pela equipe
		teamGroup := apiGroup.Group("/team")
		teamGroup.Use(auth.AuthRequired())
		teamGroup.Use(auth.SubscriptionRequired())
		{
			teamGroup.POST("/messages", api.SendWorkerMessageHandler)
			teamGroup.GET("/messages", api.GetWorkerMessagesHandler)
		}

		// Rotas exclusivas para Obreiro
		workerGroup := apiGroup.Group("/worker")
		workerGroup.Use(auth.AuthRequired())
		workerGroup.Use(auth.SubscriptionRequired())
		workerGroup.Use(auth.RoleRequired("obreiro"))
		{
			workerGroup.GET("/members", api.GetMembersHandler)
			workerGroup.POST("/members", api.CreateMemberHandler)
			workerGroup.PUT("/members/:id", api.UpdateMemberHandler)
			workerGroup.DELETE("/members/:id", api.DeleteMemberHandler)

			workerGroup.GET("/visits", api.GetVisitsHandler)
			workerGroup.POST("/visits", api.CreateVisitHandler)
			workerGroup.PUT("/visits/:id", api.UpdateVisitHandler)
		}

		// Rotas exclusivas para Super Admin
		superAdminGroup := apiGroup.Group("/superadmin")
		superAdminGroup.Use(auth.AuthRequired())
		superAdminGroup.Use(auth.RoleRequired("super_admin"))
		{
			superAdminGroup.GET("/churches", api.SuperAdminGetChurches)
			superAdminGroup.PUT("/churches/:id/status", api.SuperAdminUpdateChurchStatus)
			superAdminGroup.GET("/stats", api.SuperAdminGetStats)
		}
	}

	// Serve os arquivos estáticos do frontend
	assetsFS, err := fs.Sub(UI, "ui/dist/assets")
	if err != nil {
		log.Fatal("Erro ao carregar assets do frontend. Verifique se ui/dist/assets existe: ", err)
	}

	r.StaticFS("/assets", http.FS(assetsFS))

	indexHandler := func(c *gin.Context) {
		indexFile, err := UI.ReadFile("ui/dist/index.html")
		if err != nil {
			c.String(http.StatusNotFound, "index.html não encontrado. Rode npm run build dentro da pasta ui antes do deploy.")
			return
		}

		c.Data(http.StatusOK, "text/html; charset=utf-8", indexFile)
	}

	r.GET("/", indexHandler)
	r.NoRoute(indexHandler)

	// Porta correta para Vercel e ambiente local
	port := os.Getenv("PORT")
	if port == "" {
		port = "8888"
	}

	log.Printf("Servidor SaaS iniciado na porta %s\n", port)

	if err := r.Run(":" + port); err != nil {
		log.Fatal("Erro ao iniciar o servidor: ", err)
	}
}
