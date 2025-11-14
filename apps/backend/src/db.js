import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: 'postgres',
  password: 'ads21',
  host: 'localhost',
  port: 5432,
  database: 'saveme'
});

export default pool;