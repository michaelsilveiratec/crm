package api

import (
	"bytes"
	"encoding/csv"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/user/crm_eclesia/internal/db"
)

func ExportMembersCSVHandler(c *gin.Context) {
	churchID, exists := c.Get("church_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Igreja não identificada"})
		return
	}

	members, err := db.GetAllMembers(churchID.(int))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao buscar membros para exportação"})
		return
	}

	var buffer bytes.Buffer

	// BOM UTF-8 para Excel abrir acentos corretamente
	buffer.WriteString("\xEF\xBB\xBF")

	writer := csv.NewWriter(&buffer)
	writer.Comma = ';'

	header := []string{
		"ID",
		"Nome",
		"E-mail",
		"WhatsApp",
		"Telefone",
		"Endereço",
		"Bairro",
		"Cidade",
		"Data de Nascimento",
		"Estado Civil",
		"Tipo",
		"Status Espiritual",
		"Observações",
		"Data de Cadastro",
	}

	if err := writer.Write(header); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao gerar cabeçalho do arquivo"})
		return
	}

	for _, m := range members {
		tipo := "Membro"
		if m.IsVisitor {
			tipo = "Visitante"
		}

		row := []string{
			strconv.Itoa(m.ID),
			m.Name,
			m.Email,
			m.WhatsApp,
			m.Phone,
			m.Address,
			m.Neighborhood,
			m.City,
			m.BirthDate,
			m.MaritalStatus,
			tipo,
			m.SpiritualStatus,
			m.Observations,
			m.CreatedAt,
		}

		if err := writer.Write(row); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao escrever dados no arquivo"})
			return
		}
	}

	writer.Flush()

	if err := writer.Error(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao finalizar arquivo CSV"})
		return
	}

	fileName := "membros-visitantes-" + time.Now().Format("2006-01-02") + ".csv"

	c.Header("Content-Type", "text/csv; charset=utf-8")
	c.Header("Content-Disposition", `attachment; filename="`+fileName+`"`)
	c.Data(http.StatusOK, "text/csv; charset=utf-8", buffer.Bytes())
}
