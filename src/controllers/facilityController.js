const facilityService = require("../services/facilityService");
const render = require("../core/renderer");

async function index(req, res) {
    try {
        const facilities = await facilityService.getAllFacilities();

        render(res, "facilities", {
            facilities
        });

    } catch (error) {
        console.error(error);

        render(
            res,
            "error",
            {
                statusCode: 500,
                message: "Unable to load facilities"
            },
            500
        );
    }
}

async function show(req, res, params) {
    try {
        const facility = await facilityService.getFacilityById(params.id);

        if (!facility) {
            return render(
                res,
                "error",
                {
                    statusCode: 404,
                    message: "Facility not found"
                },
                404
            );
        }

        res.writeHead(200, {
            "Content-Type": "application/json; charset=utf-8"
        });

        res.end(JSON.stringify(facility));

    } catch (error) {
        console.error(error);

        render(
            res,
            "error",
            {
                statusCode: 500,
                message: "Unable to load facility"
            },
            500
        );
    }
}

function createForm(req, res) {
    render(res, "facility-form");
}

async function store(req, res) {
    try {
        await facilityService.createFacility(req.body);

        res.writeHead(302, {
            Location: "/facilities"
        });

        res.end();

    } catch (error) {
        console.error(error);

        render(
            res,
            "error",
            {
                statusCode: 400,
                message: error.message
            },
            400
        );
    }
}

module.exports = {
    index,
    show,
    createForm,
    store
};