const http = require("http");
const path = require("path");
const serveStatic = require("serve-static");
const finalhandler = require("finalhandler");
const router = require("./src/core/router");
const pool = require("./src/config/db");

require("dotenv").config();

const PORT = process.env.PORT || 3000;

pool.query("SELECT NOW()")
    .then((result) => {
        console.log("Database connected:", result.rows[0]);
    })
    .catch((err) => {
        console.error("Database connection failed:", err.message);
    });

const serve = serveStatic(
    path.join(__dirname, "public")
);

const server = http.createServer((req, res) => {
    if (
        req.url.startsWith("/css/") ||
        req.url.startsWith("/js/") ||
        req.url.startsWith("/images/")
    ) {
        return serve(req, res, finalhandler(req, res));
    }

    router.lookup(req, res);
});

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});