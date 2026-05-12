package auth

import (
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/user/crm_eclesia/internal/db"
)

func getJwtKey() []byte {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		return []byte("chave_padrao_muito_insegura")
	}
	return []byte(secret)
}

type Claims struct {
	UserID   int    `json:"user_id"`
	ChurchID int    `json:"church_id"`
	Role     string `json:"role"`
	jwt.RegisteredClaims
}

func GenerateToken(userID int, churchID int, role string) (string, error) {
	expirationTime := time.Now().Add(24 * time.Hour)
	claims := &Claims{
		UserID:   userID,
		ChurchID: churchID,
		Role:     role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(getJwtKey())
}

func AuthRequired() gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenString, err := c.Cookie("jwt")
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Não autenticado"})
			return
		}

		claims := &Claims{}
		token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
			return getJwtKey(), nil
		})

		if err != nil || !token.Valid {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Token inválido"})
			return
		}

		c.Set("user_id", claims.UserID)
		c.Set("church_id", claims.ChurchID)
		c.Set("role", claims.Role)
		c.Next()
	}
}

func RoleRequired(requiredRole string) gin.HandlerFunc {
	return func(c *gin.Context) {
		role, exists := c.Get("role")
		if !exists {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Acesso negado"})
			return
		}
		
		if role == "super_admin" {
			c.Next()
			return
		}

		if role == requiredRole {
			c.Next()
			return
		}

		if requiredRole == "pastor" {
			userID, existsID := c.Get("user_id")
			churchID, existsChurch := c.Get("church_id")
			if existsID && existsChurch {
				if idInt, ok := userID.(int); ok {
					user, err := db.GetUserByID(idInt)
					if err == nil && user.ProvisionalAccess && user.ChurchID == churchID.(int) {
						c.Next()
						return
					}
				}
			}
		}

		c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Acesso negado"})
	}
}

func SubscriptionRequired() gin.HandlerFunc {
	return func(c *gin.Context) {
		churchID, exists := c.Get("church_id")
		if !exists {
			// Super Admins don't have church isolation on themselves usually, 
			// but they need to access the platform.
			role, _ := c.Get("role")
			if role == "super_admin" {
				c.Next()
				return
			}
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Contexto de igreja não encontrado"})
			return
		}

		var status string
		err := db.DB.QueryRow("SELECT status FROM churches WHERE id = $1", churchID).Scan(&status)
		if err != nil || status != "active" {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{
				"error": "Acesso bloqueado por inadimplência ou status inativo. Entre em contato com o suporte.",
			})
			return
		}

		c.Next()
	}
}
