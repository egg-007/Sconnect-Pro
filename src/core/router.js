const findMyWay = require("find-my-way");
const render = require("./renderer");
const bodyParser = require("body-parser");

const facilityController = require("../controllers/facilityController");

const router = findMyWay({
    defaultRoute: (req, res) => {
        render(
            res,
            "error",
            {
                statusCode: 404,
                message: "Page not found"
            },
            404
        );
    }
});

const urlencodedParser = bodyParser.urlencoded({
    extended: false
});

router.on("GET", "/", (req, res) => {
    render(res, "home");
});

router.on("GET", "/activities", (req, res) => {
    res.writeHead(200, {
        "Content-Type": "text/plain; charset=utf-8"
    });

    res.end("Activities page");
});


/* FACILITIES */

router.on(
    "GET",
    "/facilities",
    facilityController.index
);

router.on(
    "GET",
    "/facilities/create",
    facilityController.createForm
);

router.on(
    "GET",
    "/facilities/:id/edit",
    facilityController.editForm
);

router.on(
    "GET",
    "/facilities/:id",
    facilityController.show
);

router.on(
    "POST",
    "/facilities",
    (req, res) => {
        urlencodedParser(req, res, () => {
            facilityController.store(req, res);
        });
    }
);

router.on(
    "POST",
    "/facilities/:id/update",
    (req, res, params) => {
        urlencodedParser(req, res, () => {
            facilityController.update(req, res, params);
        });
    }
);

router.on(
    "POST",
    "/facilities/:id/delete",
    (req, res, params) => {
        urlencodedParser(req, res, () => {
            facilityController.remove(req, res, params);
        });
    }
);


module.exports = router;