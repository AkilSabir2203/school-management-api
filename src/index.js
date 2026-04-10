import express from "express";

import ServerConfig from "./config/server-config.js";
import apiRoutes from "./routes/index.js";
import { globalErrorHandler, notFound } from "./middlewares/index.js";
import { sequelize } from "./models/index.js";
import { ensureDatabaseExists, waitForDatabaseConnection } from "./config/db-config.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.redirect("/api/v1/info");
});

app.use(async (req, res, next) => {
    const isHealthRoute = req.path === "/" || req.path === "/api/v1/info";

    if (isHealthRoute) {
        return next();
    }

    try {
        await waitForDatabaseConnection();
        return next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Database connection failed",
            error: error.message,
            data: {}
        });
    }
});

app.use("/api", apiRoutes);

app.use(notFound);
app.use(globalErrorHandler);

export default app;

const initializeDatabase = async () => {
    await ensureDatabaseExists();
    await waitForDatabaseConnection();
    await sequelize.sync();
};

if (!process.env.VERCEL) {
    waitForDatabaseConnection()
        .then(() => sequelize.sync())
        .then(() => {
            app.listen(ServerConfig.PORT, () => {
                console.log(`Server started on PORT : ${ServerConfig.PORT}`);
            });
        })
        .catch((err) => console.error(err));
}