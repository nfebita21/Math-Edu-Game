import 'dotenv/config';
import mysql from 'mysql2/promise';

const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  connectionLimit: 10
});

// connection.connect((err) => {
//   if (err) {
//     console.error('Koneksi gagal:', err);
//     return;
//   }
//   console.log('Koneksi berhasil ke database!');
// });

export default connection;