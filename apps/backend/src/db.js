import pkg from 'pg';
const { Pool } = pkg;

// Configura a conexão com o banco PostgreSQL
const pool = new Pool({
  user: 'postgres',
  password: 'ads21',
  host: 'localhost',
  port: 5432,
  database: 'saveme'
});

// Exporta a conexão para ser usada nas queries
export default pool;