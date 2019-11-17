CREATE TABLE file (
  file_id SERIAL PRIMARY KEY, 
  created_at TIMESTAMPTZ, 
  updated_at TIMESTAMPTZ,  
  file_data JSONB);