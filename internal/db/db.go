package db

import (
	"database/sql"
	"log"
	"os"

	_ "github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
)

var DB *sql.DB

func InitDB() {
	var err error
	dbUrl := os.Getenv("DATABASE_URL")
	if dbUrl == "" {
		log.Fatal("DATABASE_URL não configurada no .env")
	}

	DB, err = sql.Open("postgres", dbUrl)
	if err != nil {
		log.Fatal("Erro ao abrir o banco de dados: ", err)
	}

	if err = DB.Ping(); err != nil {
		log.Fatal("Erro ao conectar ao banco de dados PostgreSQL. O Docker está rodando? Erro: ", err)
	}

	log.Println("Conectado ao PostgreSQL com sucesso!")

	// Criação das tabelas para arquitetura SaaS Multi-Tenant
	queries := []string{
		`CREATE TABLE IF NOT EXISTS churches (
			id SERIAL PRIMARY KEY,
			name VARCHAR(255) NOT NULL,
			slug VARCHAR(255) UNIQUE NOT NULL,
			email VARCHAR(255),
			phone VARCHAR(50),
			whatsapp VARCHAR(50),
			logo_url TEXT,
			plan VARCHAR(50) DEFAULT 'basic',
			status VARCHAR(50) DEFAULT 'active',
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		);`,
		`CREATE TABLE IF NOT EXISTS subscriptions (
			id SERIAL PRIMARY KEY,
			church_id INTEGER REFERENCES churches(id) ON DELETE CASCADE,
			plan VARCHAR(50) NOT NULL,
			status VARCHAR(50) DEFAULT 'trialing',
			trial_ends_at TIMESTAMP,
			expires_at TIMESTAMP,
			gateway VARCHAR(50),
			transaction_id VARCHAR(255),
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		);`,
		`CREATE TABLE IF NOT EXISTS users (
			id SERIAL PRIMARY KEY,
			church_id INTEGER REFERENCES churches(id) ON DELETE CASCADE,
			name VARCHAR(255) NOT NULL,
			username VARCHAR(255) NOT NULL,
			email VARCHAR(255),
			phone VARCHAR(50),
			password_hash VARCHAR(255) NOT NULL,
			role VARCHAR(50) CHECK(role IN ('pastor', 'obreiro', 'super_admin')) NOT NULL,
			provisional_access BOOLEAN DEFAULT FALSE,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			UNIQUE(church_id, username)
		);`,
		`CREATE TABLE IF NOT EXISTS system_logs (
			id SERIAL PRIMARY KEY,
			church_id INTEGER REFERENCES churches(id) ON DELETE CASCADE,
			message TEXT,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		);`,
		`CREATE TABLE IF NOT EXISTS members (
			id SERIAL PRIMARY KEY,
			church_id INTEGER REFERENCES churches(id) ON DELETE CASCADE,
			name VARCHAR(255) NOT NULL,
			address TEXT,
			phone VARCHAR(50),
			whatsapp VARCHAR(50) NOT NULL,
			birth_date VARCHAR(50),
			marital_status VARCHAR(50),
			is_visitor BOOLEAN DEFAULT TRUE, -- TRUE = Visitante, FALSE = Membro
			spiritual_status VARCHAR(100) DEFAULT 'EM_ACOMPANHAMENTO', -- CONVERTIDO, BATIZADO, MEMBRO_ATIVO, DISCIPULADO
			last_contact_date TIMESTAMP,
			follow_up_notes TEXT,
			observations TEXT,
photo_url TEXT,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
created_by INTEGER REFERENCES users(id)
		);`,
		`CREATE TABLE IF NOT EXISTS pastoral_visits (
			id SERIAL PRIMARY KEY,
			church_id INTEGER REFERENCES churches(id) ON DELETE CASCADE,
			member_id INTEGER REFERENCES members(id) ON DELETE CASCADE,
			address TEXT,
			visit_date DATE,
			visit_time TIME,
			responsible_id INTEGER REFERENCES users(id),
			conducted_by VARCHAR(255),
			notes TEXT,
			result TEXT,
			status VARCHAR(50) DEFAULT 'Agendada', -- Agendada, Realizada, Cancelada, Reagendada
			carried_holy_communion BOOLEAN DEFAULT FALSE,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		);`,
		`CREATE TABLE IF NOT EXISTS worker_messages (
			id SERIAL PRIMARY KEY,
			church_id INTEGER REFERENCES churches(id) ON DELETE CASCADE,
			sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
			recipient_id INTEGER, -- Removida a FK obrigatória para permitir 0 (Geral)
			subject VARCHAR(255),
			message TEXT,
			msg_type VARCHAR(50), -- AJUDA, URGENTE, VISITA, ORACAO, ENFERMIDADE
			is_read BOOLEAN DEFAULT FALSE,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		);`,
		`CREATE TABLE IF NOT EXISTS pastoral_messages (
			id SERIAL PRIMARY KEY,
			church_id INTEGER REFERENCES churches(id) ON DELETE CASCADE,
			categoria VARCHAR(50),
			titulo VARCHAR(255),
			mensagem TEXT,
			status VARCHAR(20) DEFAULT 'ATIVA',
			criado_por INTEGER,
			criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		);`,
		`CREATE TABLE IF NOT EXISTS message_sends (
			id SERIAL PRIMARY KEY,
			church_id INTEGER REFERENCES churches(id) ON DELETE CASCADE,
			message_id INTEGER REFERENCES pastoral_messages(id) ON DELETE SET NULL,
			member_id INTEGER REFERENCES members(id) ON DELETE SET NULL,
			telefone VARCHAR(50),
			mensagem_final TEXT,
			status VARCHAR(50),
			enviado_por INTEGER REFERENCES users(id),
			enviado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		);`,
		`CREATE TABLE IF NOT EXISTS activity_logs (
			id SERIAL PRIMARY KEY,
			church_id INTEGER REFERENCES churches(id) ON DELETE CASCADE,
			user_id INTEGER REFERENCES users(id),
			action TEXT NOT NULL,
			details TEXT,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		);`,
		`CREATE TABLE IF NOT EXISTS whatsapp_logs (
			id SERIAL PRIMARY KEY,
			church_id INTEGER REFERENCES churches(id) ON DELETE CASCADE,
			member_id INTEGER REFERENCES members(id) ON DELETE SET NULL,
			phone VARCHAR(50),
			message TEXT,
			status VARCHAR(50),
			error_msg TEXT,
			sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		);`,
		`CREATE TABLE IF NOT EXISTS audit_logs (
			id SERIAL PRIMARY KEY,
			church_id INTEGER REFERENCES churches(id) ON DELETE CASCADE,
			user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
			action VARCHAR(255),
			ip_address VARCHAR(50),
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		);`,
	}

	for _, q := range queries {
		_, err = DB.Exec(q)
		if err != nil {
			log.Fatal("Erro ao criar tabelas: ", err)
		}
	}

	// Forçar a remoção da constraint que está causando o erro 500
	DB.Exec("ALTER TABLE worker_messages DROP CONSTRAINT IF EXISTS worker_messages_recipient_id_fkey")

	// Adicionar colunas novas na tabela de membros (caso não existam)
	DB.Exec("ALTER TABLE members ADD COLUMN IF NOT EXISTS email VARCHAR(255)")
	DB.Exec("ALTER TABLE members ADD COLUMN IF NOT EXISTS neighborhood VARCHAR(100)")
	DB.Exec("ALTER TABLE members ADD COLUMN IF NOT EXISTS city VARCHAR(100)")
	DB.Exec("ALTER TABLE members ADD COLUMN IF NOT EXISTS is_visitor BOOLEAN DEFAULT TRUE")
	DB.Exec("ALTER TABLE members ADD COLUMN IF NOT EXISTS spiritual_status VARCHAR(100) DEFAULT 'NOVO'")
	DB.Exec("ALTER TABLE members ADD COLUMN IF NOT EXISTS last_contact_date TIMESTAMP")
	DB.Exec("ALTER TABLE members ADD COLUMN IF NOT EXISTS follow_up_notes TEXT")
	DB.Exec("ALTER TABLE members ADD COLUMN IF NOT EXISTS photo_url TEXT")

	// Migrações para Mensagens Pastorais
	DB.Exec("ALTER TABLE pastoral_messages ADD COLUMN IF NOT EXISTS criado_por INTEGER")
	DB.Exec("ALTER TABLE pastoral_messages ADD COLUMN IF NOT EXISTS criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
	DB.Exec("ALTER TABLE pastoral_messages ADD COLUMN IF NOT EXISTS atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP")

	DB.Exec("ALTER TABLE message_sends ADD COLUMN IF NOT EXISTS enviado_por INTEGER")
	DB.Exec("ALTER TABLE message_sends ADD COLUMN IF NOT EXISTS enviado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP")

	// Migrações para Usuários
	DB.Exec("ALTER TABLE users ADD COLUMN IF NOT EXISTS email VARCHAR(255)")
	DB.Exec("ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(50)")

	seedSuperAdminAndFirstChurch()
}

func seedSuperAdminAndFirstChurch() {
	var count int
	err := DB.QueryRow("SELECT COUNT(*) FROM churches").Scan(&count)
	if err != nil {
		log.Println("Erro ao verificar igrejas: ", err)
		return
	}

	// Criar a primeira igreja e super admin
	if count == 0 {
		var churchID int
		err = DB.QueryRow(`INSERT INTO churches (name, slug, plan, status) VALUES ($1, $2, $3, $4) RETURNING id`,
			"Bom Samaritano Matriz", "bom-samaritano-matriz", "enterprise", "active").Scan(&churchID)

		if err != nil {
			log.Println("Erro ao criar igreja inicial: ", err)
			return
		}

		// Subscription da igreja 1
		DB.Exec(`INSERT INTO subscriptions (church_id, plan, status) VALUES ($1, $2, $3)`, churchID, "enterprise", "active")

		// Super Admin
		hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("admin123"), bcrypt.DefaultCost)
		_, err = DB.Exec("INSERT INTO users (church_id, name, username, password_hash, role) VALUES ($1, $2, $3, $4, $5)",
			churchID, "Super Administrador", "superadmin", string(hashedPassword), "super_admin")

		// Pastor da igreja 1
		_, err = DB.Exec("INSERT INTO users (church_id, name, username, password_hash, role) VALUES ($1, $2, $3, $4, $5)",
			churchID, "Pastor Bom Samaritano", "pastor", string(hashedPassword), "pastor")

		if err != nil {
			log.Println("Erro ao criar usuários iniciais: ", err)
		} else {
			log.Println("Setup inicial concluído: Igreja 1, SuperAdmin e Pastor criados.")
		}
	}
}

type User struct {
	ID                int    `json:"id"`
	ChurchID          int    `json:"church_id"`
	Name              string `json:"name"`
	Username          string `json:"username"`
	Email             string `json:"email"`
	Phone             string `json:"phone"`
	PasswordHash      string `json:"-"`
	Role              string `json:"role"`
	ProvisionalAccess bool   `json:"provisional_access"`
}

type Member struct {
	ID              int    `json:"id"`
	ChurchID        int    `json:"church_id"`
	Name            string `json:"name"`
	Email           string `json:"email"`
	Address         string `json:"address"`
	Neighborhood    string `json:"neighborhood"`
	City            string `json:"city"`
	Phone           string `json:"phone"`
	WhatsApp        string `json:"whatsapp"`
	BirthDate       string `json:"birth_date"`
	MaritalStatus   string `json:"marital_status"`
	IsVisitor       bool   `json:"is_visitor"`
	SpiritualStatus string `json:"spiritual_status"`
	LastContactDate string `json:"last_contact_date"`
	FollowUpNotes   string `json:"follow_up_notes"`
	Observations    string `json:"observations"`
	PhotoURL        string `json:"photo_url"`
	CreatedAt       string `json:"created_at"`
	CreatedBy       int    `json:"created_by"`
}

type PastoralVisit struct {
	ID                   int    `json:"id"`
	ChurchID             int    `json:"church_id"`
	MemberID             int    `json:"member_id"`
	Address              string `json:"address"`
	VisitDate            string `json:"visit_date"`
	VisitTime            string `json:"visit_time"`
	ResponsibleID        int    `json:"responsible_id"`
	ConductedBy          string `json:"conducted_by"`
	Notes                string `json:"notes"`
	Result               string `json:"result"`
	Status               string `json:"status"`
	CarriedHolyCommunion bool   `json:"carried_holy_communion"`
	CreatedAt            string `json:"created_at"`
}

type WorkerMessage struct {
	ID          int    `json:"id"`
	ChurchID    int    `json:"church_id"`
	SenderID    int    `json:"sender_id"`
	RecipientID int    `json:"recipient_id"`
	Subject     string `json:"subject"`
	Message     string `json:"message"`
	MsgType     string `json:"msg_type"`
	IsRead      bool   `json:"is_read"`
	CreatedAt   string `json:"created_at"`
}

type PastoralMessage struct {
	ID           int    `json:"id"`
	ChurchID     int    `json:"church_id"`
	Categoria    string `json:"categoria"`
	Titulo       string `json:"titulo"`
	Mensagem     string `json:"mensagem"`
	Status       string `json:"status"`
	CriadoPor    int    `json:"criado_por"`
	CriadoEm     string `json:"criado_em"`
	AtualizadoEm string `json:"atualizado_em"`
}

func CreateMember(m *Member) error {
	toNull := func(s string) interface{} {
		if s == "" {
			return nil
		}
		return s
	}

	query := `INSERT INTO members (
		church_id, 
		name, 
		email, 
		address, 
		neighborhood, 
		city, 
		phone, 
		whatsapp, 
		birth_date, 
		marital_status, 
		is_visitor, 
		spiritual_status, 
		last_contact_date, 
		follow_up_notes, 
		observations, 
		photo_url,
		created_by
	)
	VALUES (
		$1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 
		$11, $12, $13, $14, $15, $16, $17
	) RETURNING id`

	return DB.QueryRow(
		query,
		m.ChurchID,
		m.Name,
		toNull(m.Email),
		toNull(m.Address),
		toNull(m.Neighborhood),
		toNull(m.City),
		toNull(m.Phone),
		toNull(m.WhatsApp),
		toNull(m.BirthDate),
		toNull(m.MaritalStatus),
		m.IsVisitor,
		m.SpiritualStatus,
		toNull(m.LastContactDate),
		toNull(m.FollowUpNotes),
		toNull(m.Observations),
		toNull(m.PhotoURL),
		m.CreatedBy,
	).Scan(&m.ID)
}

func GetAllMembers(churchID int) ([]Member, error) {
	query := `SELECT 
				id, 
				church_id, 
				name, 
				COALESCE(email, ''), 
				COALESCE(address, ''), 
				COALESCE(neighborhood, ''), 
				COALESCE(city, ''), 
				COALESCE(phone, ''), 
				COALESCE(whatsapp, ''), 
				COALESCE(birth_date::text, ''), 
				COALESCE(marital_status, ''), 
				is_visitor, 
				spiritual_status, 
				COALESCE(last_contact_date::text, ''), 
				COALESCE(follow_up_notes, ''), 
				COALESCE(observations, ''), 
				COALESCE(photo_url, ''),
				created_at, 
				COALESCE(created_by, 0)
			  FROM members 
			  WHERE church_id = $1 
			  ORDER BY created_at DESC`

	rows, err := DB.Query(query, churchID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var members []Member

	for rows.Next() {
		var m Member

		err := rows.Scan(
			&m.ID,
			&m.ChurchID,
			&m.Name,
			&m.Email,
			&m.Address,
			&m.Neighborhood,
			&m.City,
			&m.Phone,
			&m.WhatsApp,
			&m.BirthDate,
			&m.MaritalStatus,
			&m.IsVisitor,
			&m.SpiritualStatus,
			&m.LastContactDate,
			&m.FollowUpNotes,
			&m.Observations,
			&m.PhotoURL,
			&m.CreatedAt,
			&m.CreatedBy,
		)

		if err != nil {
			return nil, err
		}

		members = append(members, m)
	}

	return members, nil
}

func GetUserByUsername(username string) (*User, error) {
	user := &User{}
	query := "SELECT id, church_id, name, username, password_hash, role, provisional_access FROM users WHERE username = $1"
	err := DB.QueryRow(query, username).Scan(&user.ID, &user.ChurchID, &user.Name, &user.Username, &user.PasswordHash, &user.Role, &user.ProvisionalAccess)
	if err != nil {
		return nil, err
	}
	return user, nil
}

func GetUserByID(id int) (*User, error) {
	user := &User{}
	query := "SELECT id, church_id, name, username, password_hash, role, provisional_access FROM users WHERE id = $1"
	err := DB.QueryRow(query, id).Scan(&user.ID, &user.ChurchID, &user.Name, &user.Username, &user.PasswordHash, &user.Role, &user.ProvisionalAccess)
	if err != nil {
		return nil, err
	}
	return user, nil
}

func GetAllUsers(churchID int) ([]User, error) {
	query := "SELECT id, church_id, name, username, role, provisional_access FROM users WHERE church_id = $1 ORDER BY name ASC"
	rows, err := DB.Query(query, churchID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []User
	for rows.Next() {
		var u User
		if err := rows.Scan(&u.ID, &u.ChurchID, &u.Name, &u.Username, &u.Role, &u.ProvisionalAccess); err != nil {
			return nil, err
		}
		users = append(users, u)
	}
	return users, nil
}

func UpdateProvisionalAccess(userID int, churchID int, grant bool) error {
	_, err := DB.Exec("UPDATE users SET provisional_access = $1 WHERE id = $2 AND church_id = $3", grant, userID, churchID)
	return err
}

// VISITAS PASTORAIS
func CreateVisit(v *PastoralVisit) error {
	toNull := func(s string) interface{} {
		if s == "" {
			return nil
		}
		return s
	}

	query := `INSERT INTO pastoral_visits (church_id, member_id, address, visit_date, visit_time, conducted_by, notes, status, carried_holy_communion, responsible_id)
	VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`

	return DB.QueryRow(query,
		v.ChurchID,
		v.MemberID,
		toNull(v.Address),
		v.VisitDate,
		toNull(v.VisitTime),
		toNull(v.ConductedBy),
		toNull(v.Notes),
		v.Status,
		v.CarriedHolyCommunion,
		v.ResponsibleID).Scan(&v.ID)
}

func GetAllVisits(churchID int) ([]PastoralVisit, error) {
	// m.name vem do JOIN com a tabela members
	query := `SELECT v.id, v.church_id, v.member_id, m.name, 
				COALESCE(v.address, ''), 
				v.visit_date, 
				COALESCE(v.visit_time::text, ''), 
				COALESCE(v.conducted_by, ''), 
				COALESCE(v.notes, ''), 
				COALESCE(v.result, ''), 
				v.status, 
				v.carried_holy_communion, 
				v.created_at
			  FROM pastoral_visits v
			  JOIN members m ON v.member_id = m.id
			  WHERE v.church_id = $1 ORDER BY v.visit_date DESC`
	rows, err := DB.Query(query, churchID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var visits []PastoralVisit
	for rows.Next() {
		var v PastoralVisit
		var memberName string
		err := rows.Scan(&v.ID, &v.ChurchID, &v.MemberID, &memberName, &v.Address, &v.VisitDate, &v.VisitTime, &v.ConductedBy, &v.Notes, &v.Result, &v.Status, &v.CarriedHolyCommunion, &v.CreatedAt)
		if err != nil {
			return nil, err
		}
		// Podemos adicionar um campo virtual para o nome do membro se necessário
		visits = append(visits, v)
	}
	return visits, nil
}

// RECADOS DO OBREIRO
func CreateWorkerMessage(m *WorkerMessage) error {
	query := `INSERT INTO worker_messages (church_id, sender_id, recipient_id, subject, message, msg_type)
	VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`
	return DB.QueryRow(query, m.ChurchID, m.SenderID, m.RecipientID, m.Subject, m.Message, m.MsgType).Scan(&m.ID)
}

func GetAllWorkerMessages(churchID int) ([]WorkerMessage, error) {
	query := `SELECT m.id, m.church_id, m.sender_id, u.name as sender_name, 
				COALESCE(m.recipient_id, 0), 
				COALESCE(m.subject, ''), 
				COALESCE(m.message, ''), 
				COALESCE(m.msg_type, ''), 
				m.is_read, 
				m.created_at
			  FROM worker_messages m
			  JOIN users u ON m.sender_id = u.id
			  WHERE m.church_id = $1 ORDER BY m.created_at DESC`
	rows, err := DB.Query(query, churchID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var messages []WorkerMessage
	for rows.Next() {
		var m WorkerMessage
		var senderName string
		err := rows.Scan(&m.ID, &m.ChurchID, &m.SenderID, &senderName, &m.RecipientID, &m.Subject, &m.Message, &m.MsgType, &m.IsRead, &m.CreatedAt)
		if err != nil {
			return nil, err
		}
		messages = append(messages, m)
	}
	return messages, nil
}

// MENSAGENS PASTORAIS (MASSA)
func CreatePastoralMessage(m *PastoralMessage) error {
	query := `INSERT INTO pastoral_messages (church_id, categoria, titulo, mensagem, status, criado_por)
	VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`
	return DB.QueryRow(query, m.ChurchID, m.Categoria, m.Titulo, m.Mensagem, m.Status, m.CriadoPor).Scan(&m.ID)
}

func GetAllPastoralMessages(churchID int) ([]PastoralMessage, error) {
	query := `SELECT id, church_id, categoria, titulo, mensagem, status, 
			  COALESCE(criado_por, 0), COALESCE(criado_em::text, ''), COALESCE(atualizado_em::text, '') 
			  FROM pastoral_messages WHERE church_id = $1 ORDER BY criado_em DESC`
	rows, err := DB.Query(query, churchID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var messages []PastoralMessage
	for rows.Next() {
		var m PastoralMessage
		err := rows.Scan(&m.ID, &m.ChurchID, &m.Categoria, &m.Titulo, &m.Mensagem, &m.Status, &m.CriadoPor, &m.CriadoEm, &m.AtualizadoEm)
		if err != nil {
			return nil, err
		}
		messages = append(messages, m)
	}
	return messages, nil
}

func UpdatePastoralMessage(m *PastoralMessage) error {
	query := `UPDATE pastoral_messages SET categoria = $1, titulo = $2, mensagem = $3, status = $4, atualizado_em = CURRENT_TIMESTAMP 
			  WHERE id = $5 AND church_id = $6`
	_, err := DB.Exec(query, m.Categoria, m.Titulo, m.Mensagem, m.Status, m.ID, m.ChurchID)
	return err
}

func DeletePastoralMessage(id int, churchID int) error {
	_, err := DB.Exec("DELETE FROM pastoral_messages WHERE id = $1 AND church_id = $2", id, churchID)
	return err
}

// HISTÓRICO DE ENVIOS
type MessageSend struct {
	ID            int    `json:"id"`
	MessageTitle  string `json:"message_title"`
	MemberName    string `json:"member_name"`
	Telefone      string `json:"telefone"`
	MensagemFinal string `json:"mensagem_final"`
	Status        string `json:"status"`
	EnviadoPor    string `json:"enviado_por"`
	EnviadoEm     string `json:"enviado_em"`
}

func SaveMessageSend(s *MessageSend, churchID, messageID, memberID, userID int) error {
	_, err := DB.Exec(`INSERT INTO message_sends (church_id, message_id, member_id, telefone, mensagem_final, status, enviado_por) 
					  VALUES ($1, $2, $3, $4, $5, $6, $7)`,
		churchID, messageID, memberID, s.Telefone, s.MensagemFinal, s.Status, userID)
	return err
}

func GetMessageHistory(churchID int) ([]MessageSend, error) {
	query := `SELECT s.id, COALESCE(m.titulo, 'Mensagem Excluída'), COALESCE(mem.name, 'Contato Externo'), 
				     s.telefone, s.mensagem_final, s.status, COALESCE(u.name, 'Sistema'), s.enviado_em::text
			  FROM message_sends s
			  LEFT JOIN pastoral_messages m ON s.message_id = m.id
			  LEFT JOIN members mem ON s.member_id = mem.id
			  LEFT JOIN users u ON s.enviado_por = u.id
			  WHERE s.church_id = $1
			  ORDER BY s.enviado_em DESC LIMIT 50`

	rows, err := DB.Query(query, churchID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var history []MessageSend
	for rows.Next() {
		var s MessageSend
		if err := rows.Scan(&s.ID, &s.MessageTitle, &s.MemberName, &s.Telefone, &s.MensagemFinal, &s.Status, &s.EnviadoPor, &s.EnviadoEm); err != nil {
			return nil, err
		}
		history = append(history, s)
	}
	return history, nil
}

// LOGS DE ATIVIDADE
func SaveActivity(churchID, userID int, action, details string) error {
	_, err := DB.Exec(`INSERT INTO activity_logs (church_id, user_id, action, details) VALUES ($1, $2, $3, $4)`,
		churchID, userID, action, details)
	return err
}

type ActivityItem struct {
	ID        int    `json:"id"`
	UserName  string `json:"user_name"`
	Action    string `json:"action"`
	Details   string `json:"details"`
	CreatedAt string `json:"created_at"`
}

func GetRecentActivities(churchID int) ([]ActivityItem, error) {
	query := `SELECT a.id, u.name, a.action, COALESCE(a.details, ''), a.created_at::text 
			  FROM activity_logs a
			  JOIN users u ON a.user_id = u.id
			  WHERE a.church_id = $1
			  ORDER BY a.created_at DESC LIMIT 20`

	rows, err := DB.Query(query, churchID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var logs []ActivityItem
	for rows.Next() {
		var item ActivityItem
		if err := rows.Scan(&item.ID, &item.UserName, &item.Action, &item.Details, &item.CreatedAt); err != nil {
			return nil, err
		}
		logs = append(logs, item)
	}
	return logs, nil
}
