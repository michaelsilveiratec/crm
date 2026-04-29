package db

import (
	"database/sql"
	"log"

	"golang.org/x/crypto/bcrypt"
	_ "modernc.org/sqlite"
)

var DB *sql.DB

func InitDB() {
	var err error
	DB, err = sql.Open("sqlite", "crm.db")
	if err != nil {
		log.Fatal("Erro ao abrir o banco de dados: ", err)
	}

	if err = DB.Ping(); err != nil {
		log.Fatal("Erro ao conectar ao banco de dados: ", err)
	}

	log.Println("Conectado ao SQLite com sucesso!")

	// Criação das tabelas
	queries := []string{
		`CREATE TABLE IF NOT EXISTS users (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT NOT NULL,
			username TEXT UNIQUE NOT NULL,
			password_hash TEXT NOT NULL,
			role TEXT CHECK(role IN ('pastor', 'obreiro')) NOT NULL,
			provisional_access BOOLEAN DEFAULT FALSE,
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP
		);`,
		`CREATE TABLE IF NOT EXISTS system_logs (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			message TEXT,
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP
		);`,
		`CREATE TABLE IF NOT EXISTS members (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT NOT NULL,
			address TEXT,
			phone TEXT,
			whatsapp TEXT NOT NULL,
			birth_date TEXT,
			attendant_name TEXT,
			marital_status TEXT,
			observations TEXT,
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			created_by INTEGER,
			FOREIGN KEY (created_by) REFERENCES users(id)
		);`,
	}

	for _, q := range queries {
		_, err = DB.Exec(q)
		if err != nil {
			log.Fatal("Erro ao criar tabelas: ", err)
		}
	}

	// Criar usuário pastor padrão se não existir
	seedDefaultUser()
}

func seedDefaultUser() {
	var count int
	err := DB.QueryRow("SELECT COUNT(*) FROM users WHERE username = 'pastor'").Scan(&count)
	if err != nil {
		log.Println("Erro ao verificar usuário padrão: ", err)
		return
	}

	if count == 0 {
		hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("admin123"), bcrypt.DefaultCost)
		_, err = DB.Exec("INSERT INTO users (name, username, password_hash, role) VALUES (?, ?, ?, ?)",
			"Pastor Administrador", "pastor", string(hashedPassword), "pastor")
		if err != nil {
			log.Println("Erro ao criar usuário pastor padrão: ", err)
		} else {
			log.Println("Usuário pastor padrão criado: pastor/admin123")
		}
	}
}

type User struct {
	ID               int    `json:"id"`
	Name             string `json:"name"`
	Username         string `json:"username"`
	PasswordHash     string `json:"-"`
	Role             string `json:"role"`
	ProvisionalAccess bool   `json:"provisional_access"`
}

type Member struct {
	ID            int    `json:"id"`
	Name          string `json:"name"`
	Address       string `json:"address"`
	Phone         string `json:"phone"`
	WhatsApp      string `json:"whatsapp"`
	BirthDate     string `json:"birth_date"`
	AttendantName string `json:"attendant_name"`
	MaritalStatus string `json:"marital_status"`
	Observations  string `json:"observations"`
	CreatedAt     string `json:"created_at"`
	CreatedBy     int    `json:"created_by"`
}

func CreateMember(m *Member) error {
	query := `INSERT INTO members (name, address, phone, whatsapp, birth_date, attendant_name, marital_status, observations, created_by)
	VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
	_, err := DB.Exec(query, m.Name, m.Address, m.Phone, m.WhatsApp, m.BirthDate, m.AttendantName, m.MaritalStatus, m.Observations, m.CreatedBy)
	return err
}

func GetAllMembers() ([]Member, error) {
	query := `SELECT id, name, address, phone, whatsapp, birth_date, attendant_name, marital_status, observations, created_at, created_by 
			  FROM members ORDER BY created_at DESC`
	rows, err := DB.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var members []Member
	for rows.Next() {
		var m Member
		err := rows.Scan(&m.ID, &m.Name, &m.Address, &m.Phone, &m.WhatsApp, &m.BirthDate, &m.AttendantName, &m.MaritalStatus, &m.Observations, &m.CreatedAt, &m.CreatedBy)
		if err != nil {
			return nil, err
		}
		members = append(members, m)
	}
	return members, nil
}

func GetUserByUsername(username string) (*User, error) {
	user := &User{}
	query := "SELECT id, name, username, password_hash, role, provisional_access FROM users WHERE username = ?"
	err := DB.QueryRow(query, username).Scan(&user.ID, &user.Name, &user.Username, &user.PasswordHash, &user.Role, &user.ProvisionalAccess)
	if err != nil {
		return nil, err
	}
	return user, nil
}
