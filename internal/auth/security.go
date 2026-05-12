package auth

import (
	"net/http"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
)

func SecurityHeaders() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("X-Frame-Options", "DENY")
		c.Header("X-Content-Type-Options", "nosniff")
		c.Header("X-XSS-Protection", "1; mode=block")
		c.Header("Content-Security-Policy", "default-src 'self' https:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:;")
		c.Header("Referrer-Policy", "strict-origin-when-cross-origin")
		c.Next()
	}
}

// RateLimiter simples em memória por IP
var (
	ips = make(map[string][]time.Time)
	mu  sync.Mutex
)

func RateLimiter(limit int, window time.Duration) gin.HandlerFunc {
	return func(c *gin.Context) {
		ip := c.ClientIP()
		mu.Lock()
		defer mu.Unlock()

		now := time.Now()
		// Limpa registros antigos
		var valid []time.Time
		for _, t := range ips[ip] {
			if now.Sub(t) < window {
				valid = append(valid, t)
			}
		}

		if len(valid) >= limit {
			c.AbortWithStatusJSON(http.StatusTooManyRequests, gin.H{"error": "Muitas requisições. Tente novamente mais tarde."})
			return
		}

		ips[ip] = append(valid, now)
		c.Next()
	}
}
