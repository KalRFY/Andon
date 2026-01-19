const mysql = require('mysql2/promise');

(async () => {
  try {
    const conn = await mysql.createConnection({
      host: '103.190.28.222',
      port: 4111,
      user: 'administrator',
      password: '4dm1nComp1teR',
      database: 'mt-sys',
    });

    console.log('Connected to MySQL 8 remote successfully!\n');

    const [rows] = await conn.query('SHOW TABLES');
    console.log('📋 Tables in mt-sys:');
    console.table(rows);

    await conn.end();
  } catch (err) {
    console.error('Connection failed:', err.message);
  }
})();