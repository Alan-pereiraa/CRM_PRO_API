SELECT 'CREATE DATABASE crm_pro_db_test'
WHERE NOT EXISTS (
  SELECT FROM pg_database WHERE datname = 'crm_pro_db_test'
)\gexec