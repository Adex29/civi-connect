-- CiviConnect Supabase Database Schema

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Admins
CREATE TABLE IF NOT EXISTS admins (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Classrooms
CREATE TABLE IF NOT EXISTS classrooms (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  created_by TEXT REFERENCES admins(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Groups
CREATE TABLE IF NOT EXISTS groups (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  classroom_id TEXT NOT NULL REFERENCES classrooms(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Students
CREATE TABLE IF NOT EXISTS students (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  lrn TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  classroom_id TEXT NOT NULL REFERENCES classrooms(id) ON DELETE CASCADE,
  group_id TEXT REFERENCES groups(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Scenarios
CREATE TABLE IF NOT EXISTS scenarios (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  context TEXT,
  constraints JSONB DEFAULT '[]'::jsonb,
  mission_data JSONB DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'active',
  created_by TEXT REFERENCES admins(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Classroom Scenarios (Junction)
CREATE TABLE IF NOT EXISTS classroom_scenarios (
  id TEXT PRIMARY KEY,
  classroom_id TEXT NOT NULL REFERENCES classrooms(id) ON DELETE CASCADE,
  scenario_id TEXT NOT NULL REFERENCES scenarios(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT TRUE,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_classroom_scenario UNIQUE(classroom_id, scenario_id)
);

-- 7. Constraints
CREATE TABLE IF NOT EXISTS constraints (
  id TEXT PRIMARY KEY,
  scenario_id TEXT NOT NULL REFERENCES scenarios(id) ON DELETE CASCADE,
  step_number INT NOT NULL,
  description TEXT NOT NULL,
  criteria TEXT NOT NULL
);

-- 8. Assignments
CREATE TABLE IF NOT EXISTS assignments (
  id TEXT PRIMARY KEY,
  scenario_id TEXT NOT NULL REFERENCES scenarios(id) ON DELETE CASCADE,
  classroom_id TEXT NOT NULL REFERENCES classrooms(id) ON DELETE CASCADE,
  student_id TEXT REFERENCES students(id) ON DELETE CASCADE,
  group_id TEXT REFERENCES groups(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Submissions
CREATE TABLE IF NOT EXISTS submissions (
  id TEXT PRIMARY KEY,
  scenario_id TEXT NOT NULL REFERENCES scenarios(id) ON DELETE CASCADE,
  student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  group_id TEXT REFERENCES groups(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  content TEXT NOT NULL DEFAULT '',
  feedback TEXT DEFAULT '',
  score INT,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast query performance (Supabase Postgres Best Practice)
CREATE INDEX IF NOT EXISTS idx_classrooms_created_by ON classrooms(created_by);
CREATE INDEX IF NOT EXISTS idx_students_classroom ON students(classroom_id);
CREATE INDEX IF NOT EXISTS idx_students_lrn ON students(lrn);
CREATE INDEX IF NOT EXISTS idx_groups_classroom ON groups(classroom_id);
CREATE INDEX IF NOT EXISTS idx_classroom_scenarios_classroom ON classroom_scenarios(classroom_id);
CREATE INDEX IF NOT EXISTS idx_classroom_scenarios_scenario ON classroom_scenarios(scenario_id);
CREATE INDEX IF NOT EXISTS idx_constraints_scenario ON constraints(scenario_id);
CREATE INDEX IF NOT EXISTS idx_assignments_classroom ON assignments(classroom_id);
CREATE INDEX IF NOT EXISTS idx_submissions_student ON submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_submissions_scenario ON submissions(scenario_id);

-- Enable Row Level Security (RLS) & Policies
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE classrooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE classroom_scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE constraints ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Allow full CRUD access for server API calls
DROP POLICY IF EXISTS "Allow full access for server" ON admins;
CREATE POLICY "Allow full access for server" ON admins FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow full access for server" ON classrooms;
CREATE POLICY "Allow full access for server" ON classrooms FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow full access for server" ON groups;
CREATE POLICY "Allow full access for server" ON groups FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow full access for server" ON students;
CREATE POLICY "Allow full access for server" ON students FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow full access for server" ON scenarios;
CREATE POLICY "Allow full access for server" ON scenarios FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow full access for server" ON classroom_scenarios;
CREATE POLICY "Allow full access for server" ON classroom_scenarios FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow full access for server" ON constraints;
CREATE POLICY "Allow full access for server" ON constraints FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow full access for server" ON assignments;
CREATE POLICY "Allow full access for server" ON assignments FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow full access for server" ON submissions;
CREATE POLICY "Allow full access for server" ON submissions FOR ALL USING (true) WITH CHECK (true);
