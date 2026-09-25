const registrationService =
    require("../services/registrationService");

const memberService =
    require("../services/memberService");

const activityService =
    require("../services/activityService");

const render =
    require("../core/renderer");

async function createForm(req, res) {
    try {
        const members =
            await memberService.getAllMembers();

        const activities =
            await activityService.getAllActivities();

        render(
            res,
            "registration-form",
            {
                members,
                activities
            }
        );

    } catch (error) {
        console.error(error);

        render(
            res,
            "error",
            {
                statusCode: 500,
                message:
                    "Unable to load registration form"
            },
            500
        );
    }
}

async function store(req, res) {
    try {
        const result =
            await registrationService
                .createRegistration(req.body);

        render(
            res,
            "checkout",
            result
        );

    } catch (error) {
        console.error(error);

        render(
            res,
            "error",
            {
                statusCode: 400,
                message:
                    error.message
            },
            400
        );
    }
}

module.exports = {
    createForm,
    store
};