CREATE TABLE IF NOT EXISTS subject (
  subject_id SERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  subject_data JSONB
);

CREATE TABLE IF NOT EXISTS course (
  course_id SERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  course_data JSONB,
  subject_id INT REFERENCES subject ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS file (
  file_id SERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  file_data JSONB,
  course_id INT REFERENCES course ON DELETE SET NULL ON UPDATE CASCADE
);