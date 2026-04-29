package main

import (
	"io/fs"
	"log"
	"net/http"

	"github.com/user/crm_eclesia"
	"github.com/user/crm_eclesia/internal/api"
	"github.com/user/crm_eclesia/internal/auth"
	"github.com/user/crm_eclesia/internal/db"
	"github.com/gin-gonic/gin"
)

func main() {
	// Inicializa o banco de dados
	db.InitDB()

	r := gin.Default()

	// Configura o sistema de arquivos embutido
	publicFS, err := fs.Sub(crm_eclesia.UI, "ui/dist")
	if err != nil {
		log.Fatal(err)
	}

	// Rotas de API
	apiGroup := r.Group("/api")
	{
		apiGroup.GET("/health", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"status": "ok"})
		})

		apiGroup.POST("/login", api.LoginHandler)
		apiGroup.POST("/logout", api.LogoutHandler)

		// Rotas protegidas (geral)
		authGroup := apiGroup.Group("/")
		authGroup.Use(auth.AuthRequired())
		{
			authGroup.GET("/me", api.MeHandler)
			authGroup.POST("/members", api.CreateMemberHandler)
		}

		// Rotas exclusivas para Pastor
		pastorGroup := apiGroup.Group("/pastor")
		pastorGroup.Use(auth.AuthRequired())
		pastorGroup.Use(auth.RoleRequired("pastor"))
		{
			pastorGroup.GET("/members", api.GetMembersHandler)
			pastorGroup.GET("/birthdays", api.GetBirthdaysHandler)
			pastorGroup.POST("/message", api.SendWhatsAppMessageHandler)
		}
	}

	// Serve os arquivos estáticos do frontend
	r.GET("/assets/*filepath", func(c *gin.Context) {
		c.FileFromFS(c.Request.URL.Path[1:], http.FS(publicFS))
	})

	// Rota raiz e Fallback para SPA
	indexHandler := func(c *gin.Context) {
		indexHTML, err := crm_eclesia.UI.ReadFile("ui/dist/index.html")
		if err != nil {
			c.String(http.StatusInternalServerError, "Erro ao carregar index.html")
			return
		}
		c.Data(http.StatusOK, "text/html; charset=utf-8", indexHTML)
	}

	r.GET("/", indexHandler)
	r.NoRoute(indexHandler)

	log.Println("Servidor iniciado em http://localhost:8888")
	if err := r.Run(":8888"); err != nil {
		log.Fatal("Erro ao iniciar o servidor: ", err)
	}
}
