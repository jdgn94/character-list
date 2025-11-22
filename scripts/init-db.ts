import * as mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || 'password',
        });

        const dbName = process.env.DB_NAME || 'my_database';

        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
        console.log(`Database ${dbName} created or already exists.`);

        await connection.end();
    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    }
}

bootstrap();
