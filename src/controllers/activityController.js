const activityService = require("../services/activityService");
const facilityService = require("../services/facilityService");
const associationService = require("../services/associationService");
const render = require("../core/renderer");

async function index(req, res) {
    try {
        const activities =
            await activityService.getAllActivities();

        render(res, "activities", {
            activities
        });

    } catch (error) {
        console.error(error);

        render(
            res,
            "error",
            {
                statusCode: 500,
                message: "Unable to load activities"
            },
            500
        );
    }
}

async function createForm(req, res) {
    try {
        const facilities =
            await facilityService.getAllFacilities();

        const associations =
            await associationService.getAllAssociations();

        render(res, "activity-form", {
            facilities,
            associations
        });

    } catch (error) {
        console.error(error);

        render(
            res,
            "error",
            {
                statusCode: 500,
                message: "Unable to load activity form"
            },
            500
        );
    }
}

async function store(req, res) {
    try {
        await activityService.createActivity(req.body);

        res.writeHead(302, {
            Location: "/activities"
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
    createForm,
    store
};