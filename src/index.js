import express from "express";

import { ServerConfig } from "./config/index.js";
import apiRoutes from "./routes/index.js";
import { globalErrorHandler, notFound } from "./middlewares/index.js";
import { sequelize } from "./models/index.js";
import { ensureDatabaseExists } from "./config/db-config.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRoutes);

app.use(notFound);
app.use(globalErrorHandler);

const startServer = async () => {
    try {
        await ensureDatabaseExists();
        await sequelize.authenticate();
        await sequelize.sync();

        app.listen(ServerConfig.PORT, () => {
            console.log(`Successfully started the server on PORT : ${ServerConfig.PORT}`);
        });
    } catch (error) {
        console.error("Unable to prepare the database:", error.message);
        process.exit(1);
    }
};

startServer();