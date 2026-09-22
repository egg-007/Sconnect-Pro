const http = require("http");
const path = require("path");
const serveStatic = require("serve-static");
const finalhandler = require("finalhandler");
const router = require("./src/core/router");
const pool = require("./src/config/db");

require("dotenv").config();

const PORT = process.env.PORT || 3000;

const serve = serveStatic(
    path.join(__dirname, "public")
);

async function testDatabaseConnection() {
    try {
        const result = await pool.query("SELECT NOW()");

        console.log("Database connection successful");
        console.log("PostgreSQL time:", result.rows[0].now);

    } catch (error) {
        console.error(
            "Database connection failed:",
            error.message
        );
    }
}

testDatabaseConnection();

const server = http.createServer((req, res) => {

    if (
        req.url.startsWith("/css/") ||
        req.url.startsWith("/js/") ||
        req.url.startsWith("/images/")
    ) {
        return serve(
            req,
            res,
            finalhandler(req, res)
        );
    }

    router.lookup(req, res);
});

server.listen(PORT, () => {
    console.log(
        `Server running on http://localhost:${PORT}`
    );
});