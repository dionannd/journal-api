import pgp from "pg-promise";
import Promise from "bluebird";
import dotenv from "dotenv";

dotenv.config();

const systemDb = {
    client: "pg",
    connection: {
        user: process.env.DB_USER,
        database: process.env.DB_NAME,
        port: parseInt(process.env.DB_PORT, 10),
        host: process.env.DB_HOST,
        password: process.env.DB_PASSWORD,
        poolsize: 200,
        max: 1000,
        min: 0,
        idleTimeoutMillis: 60000,        
    },
    pool: { min: 0, max: 1000 },
    acquireConnectionTimeout: 10000,
};

const pgPromise = pgp({
    promiseLib: Promise,
    async connect(client, dc, useCount) {
        if (useCount === 0 && dc && dc.email) {
            const email = encodeURI(dc.email);
            await client.query(`SET SESSION "app.user" = '${email}'`);
        }
    },
})

export const mainDb = pgPromise(systemDb.connection);