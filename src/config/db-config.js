import dotenv from "dotenv";
import Sequelize from "sequelize";
import mysql from "mysql2/promise";

dotenv.config();

const {
    MYSQL_HOST = "127.0.0.1",
    MYSQL_PORT = 3306,
    MYSQL_USER = "root",
    MYSQL_PASSWORD = "",
    MYSQL_DATABASE = "school_management",
    MYSQL_DIALECT = "mysql",
    MYSQL_LOGGING = "false",
    MYSQL_SSL = "false",
    MYSQL_SSL_REJECT_UNAUTHORIZED = "true",
    MYSQL_AUTO_CREATE_DATABASE = "true",
    DB_CONNECT_RETRIES = "10",
    DB_CONNECT_RETRY_DELAY_MS = "3000"
} = process.env;

const normalizeEnvValue = (value, fallback = "") => String(value ?? fallback).replace(/^"|"$/g, "").replace(/,$/, "").trim();

const mysqlHost = normalizeEnvValue(MYSQL_HOST, "127.0.0.1");
const mysqlPort = Number.parseInt(normalizeEnvValue(MYSQL_PORT, "3306"), 10) || 3306;
const mysqlUser = normalizeEnvValue(MYSQL_USER, "root");
const mysqlPassword = normalizeEnvValue(MYSQL_PASSWORD, "");
const mysqlDatabase = normalizeEnvValue(MYSQL_DATABASE, "school_management");
const mysqlDialect = normalizeEnvValue(MYSQL_DIALECT, "mysql");
const mysqlSslEnabled = normalizeEnvValue(MYSQL_SSL, "false") === "true";
const mysqlSslRejectUnauthorized = normalizeEnvValue(MYSQL_SSL_REJECT_UNAUTHORIZED, "true") === "true";
const mysqlSslConfig = mysqlSslEnabled ? { rejectUnauthorized: mysqlSslRejectUnauthorized } : undefined;
const isVercelRuntime = Boolean(process.env.VERCEL);
const autoCreateDatabase = normalizeEnvValue(MYSQL_AUTO_CREATE_DATABASE, isVercelRuntime ? "false" : "true") === "true";
const dbConnectRetries = Number.parseInt(normalizeEnvValue(DB_CONNECT_RETRIES, isVercelRuntime ? "15" : "10"), 10) || 10;
const dbConnectRetryDelayMs = Number.parseInt(normalizeEnvValue(DB_CONNECT_RETRY_DELAY_MS, "3000"), 10) || 3000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const ensureDatabaseExists = async () => {
    if (!autoCreateDatabase) {
        return;
    }

    const connection = await mysql.createConnection({
        host: mysqlHost,
        port: mysqlPort,
        user: mysqlUser,
        password: mysqlPassword,
        connectTimeout: 10000,
        ssl: mysqlSslConfig
    });

    try {
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${mysqlDatabase}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    } finally {
        await connection.end();
    }
};

const sequelize = new Sequelize(mysqlDatabase, mysqlUser, mysqlPassword, {
    host: mysqlHost,
    port: mysqlPort,
    dialect: mysqlDialect,
    logging: normalizeEnvValue(MYSQL_LOGGING, "false") === "true" ? console.log : false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    dialectOptions: {
        connectTimeout: 10000,
        ...(mysqlSslConfig ? { ssl: mysqlSslConfig } : {})
    }
});

const waitForDatabaseConnection = async () => {
    let lastError;

    for (let attempt = 1; attempt <= dbConnectRetries; attempt += 1) {
        try {
            await sequelize.authenticate();
            return;
        } catch (error) {
            lastError = error;

            if (attempt < dbConnectRetries) {
                console.warn(
                    `Database connection attempt ${attempt}/${dbConnectRetries} failed. Retrying in ${dbConnectRetryDelayMs}ms.`
                );
                await sleep(dbConnectRetryDelayMs);
            }
        }
    }

    throw lastError;
};

export { Sequelize, ensureDatabaseExists, sequelize, waitForDatabaseConnection };

export default sequelize;