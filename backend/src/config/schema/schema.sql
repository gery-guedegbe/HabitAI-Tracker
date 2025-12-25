-- =====================================================
-- USERS
-- =====================================================

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(100),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    reset_token TEXT,
    reset_token_expires TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- JOURNALS
-- =====================================================

CREATE TABLE IF NOT EXISTS journals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), 
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Date du journal (peut être détectée par l'IA ou laissée par défaut à CURRENT_DATE)
    journal_date DATE DEFAULT CURRENT_DATE,
    
    raw_text TEXT NOT NULL,
    
    -- JSONB pour stocker résumé, émotions, catégories, liste brute des tâches par l'IA
    ai_output JSONB,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_journals_user ON journals(user_id);

-- =====================================================
-- TASKS
-- =====================================================

CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  
    journal_id UUID NOT NULL REFERENCES journals(id) ON DELETE CASCADE,

    title TEXT NOT NULL,
    category VARCHAR(100),
    tags TEXT[],

    status VARCHAR(20) DEFAULT 'todo'
        CHECK (status IN ('todo', 'in_progress', 'done')),
    
    duration_minutes INTEGER CHECK (duration_minutes >= 0),
    
    confidence NUMERIC(3,2) CHECK (confidence >= 0 AND confidence <= 1),

    note TEXT,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_tasks_journal ON tasks(journal_id);