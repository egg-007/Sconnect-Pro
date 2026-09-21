const ejs = require("ejs");
const path = require("path");

function render(res, view, data = {}, statusCode = 200) {
    const filePath = path.join(
        __dirname,
        "../../views/pages",
        `${view}.ejs`
    );

    ejs.renderFile(filePath, data, (err, html) => {
        if (err) {
            res.writeHead(500, {
                "Content-Type": "text/plain; charset=utf-8"
            });

            return res.end("Rendering error");
        }

        res.writeHead(statusCode, {
            "Content-Type": "text/html; charset=utf-8"
        });

        res.end(html);
    });
}

module.exports = render;