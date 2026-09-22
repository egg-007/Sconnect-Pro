const findMyWay = require("find-my-way");
const render = require("./renderer");
const bodyParser = require("body-parser");

const facilityController =
    require("../controllers/facilityController");

const associationController =
    require("../controllers/associationController");

const activityController =
    require("../controllers/activityController");


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


const urlencodedParser =
    bodyParser.urlencoded({
        extended: false
    });


/* HOME */

router.on(
    "GET",
    "/",
    (req, res) => {
        render(res, "home");
    }
);


/* ACTIVITIES */

router.on(
    "GET",
    "/activities",
    activityController.index
);

router.on(
    "GET",
    "/activities/create",
    activityController.createForm
);

router.on(
    "POST",
    "/activities",
    (req, res) => {

        urlencodedParser(
            req,
            res,
            () => {
                activityController.store(
                    req,
                    res
                );
            }
        );

    }
);


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

        urlencodedParser(
            req,
            res,
            () => {
                facilityController.store(
                    req,
                    res
                );
            }
        );

    }
);

router.on(
    "POST",
    "/facilities/:id/update",
    (req, res, params) => {

        urlencodedParser(
            req,
            res,
            () => {
                facilityController.update(
                    req,
                    res,
                    params
                );
            }
        );

    }
);

router.on(
    "POST",
    "/facilities/:id/delete",
    (req, res, params) => {

        urlencodedParser(
            req,
            res,
            () => {
                facilityController.remove(
                    req,
                    res,
                    params
                );
            }
        );

    }
);


/* ASSOCIATIONS */

router.on(
    "GET",
    "/associations",
    associationController.index
);

router.on(
    "GET",
    "/associations/create",
    associationController.createForm
);

router.on(
    "GET",
    "/associations/:id/edit",
    associationController.editForm
);

router.on(
    "GET",
    "/associations/:id",
    associationController.show
);

router.on(
    "POST",
    "/associations",
    (req, res) => {

        urlencodedParser(
            req,
            res,
            () => {
                associationController.store(
                    req,
                    res
                );
            }
        );

    }
);

router.on(
    "POST",
    "/associations/:id/update",
    (req, res, params) => {

        urlencodedParser(
            req,
            res,
            () => {
                associationController.update(
                    req,
                    res,
                    params
                );
            }
        );

    }
);

router.on(
    "POST",
    "/associations/:id/delete",
    (req, res, params) => {

        urlencodedParser(
            req,
            res,
            () => {
                associationController.remove(
                    req,
                    res,
                    params
                );
            }
        );

    }
);


module.exports = router;