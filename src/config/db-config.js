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
    MYSQL_LOGGING = "false"
} = process.env;

const normalizeEnvValue = (value, fallback = "") => String(value ?? fallback).replace(/^"|"$/g, "").replace(/,$/, "").trim();

const mysqlHost = normalizeEnvValue(MYSQL_HOST, "127.0.0.1");
const mysqlPort = Number.parseInt(normalizeEnvValue(MYSQL_PORT, "3306"), 10) || 3306;
const mysqlUser = normalizeEnvValue(MYSQL_USER, "root");
const mysqlPassword = normalizeEnvValue(MYSQL_PASSWORD, "");
const mysqlDatabase = normalizeEnvValue(MYSQL_DATABASE, "school_management");
const mysqlDialect = normalizeEnvValue(MYSQL_DIALECT, "mysql");

const ensureDatabaseExists = async () => {
    const connection = await mysql.createConnection({
        host: mysqlHost,
        port: mysqlPort,
        user: mysqlUser,
        password: mysqlPassword
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
    }
});

export { Sequelize, ensureDatabaseExists, sequelize };

export default sequelize;