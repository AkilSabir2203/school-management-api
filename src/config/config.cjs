require("dotenv").config();

const normalizeEnvValue = (value, fallback = "") => String(value ?? fallback).replace(/^"|"$/g, "").replace(/,$/, "").trim();
const getPort = () => Number.parseInt(normalizeEnvValue(process.env.MYSQL_PORT, "3306"), 10) || 3306;

module.exports = {
	development: {
		username: normalizeEnvValue(process.env.MYSQL_USER, "root"),
		password: normalizeEnvValue(process.env.MYSQL_PASSWORD, ""),
		database: normalizeEnvValue(process.env.MYSQL_DATABASE, "school_management"),
		host: normalizeEnvValue(process.env.MYSQL_HOST, "127.0.0.1"),
		port: getPort(),
		dialect: "mysql",
		logging: false
	},
	test: {
		username: normalizeEnvValue(process.env.MYSQL_USER, "root"),
		password: normalizeEnvValue(process.env.MYSQL_PASSWORD, ""),
		database: normalizeEnvValue(process.env.MYSQL_TEST_DATABASE, "school_management_test"),
		host: normalizeEnvValue(process.env.MYSQL_HOST, "127.0.0.1"),
		port: getPort(),
		dialect: "mysql",
		logging: false
	},
	production: {
		username: normalizeEnvValue(process.env.MYSQL_USER, "root"),
		password: normalizeEnvValue(process.env.MYSQL_PASSWORD, ""),
		database: normalizeEnvValue(process.env.MYSQL_DATABASE, "school_management"),
		host: normalizeEnvValue(process.env.MYSQL_HOST, "127.0.0.1"),
		port: getPort(),
		dialect: "mysql",
		logging: false,
		dialectOptions: {
			ssl: {
				require: true,
				rejectUnauthorized: false
			}
		}
	}
};
