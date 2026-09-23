const memberService =
    require("../services/memberService");

const familyRepository =
    require("../repositories/familyRepository");

const render = require("../core/renderer");

async function index(req, res) {
    try {
        const members =
            await memberService.getAllMembers();

        render(res, "members", {
            members
        });

    } catch (error) {
        console.error(error);

        render(
            res,
            "error",
            {
                statusCode: 500,
                message: "Unable to load members"
            },
            500
        );
    }
}

async function createForm(req, res) {
    try {
        const families =
            await familyRepository.findAll();

        render(res, "member-form", {
            families
        });

    } catch (error) {
        console.error(error);

        render(
            res,
            "error",
            {
                statusCode: 500,
                message: "Unable to load member form"
            },
            500
        );
    }
}

async function store(req, res) {
    try {
        await memberService.createMember(
            req.body
        );

        res.writeHead(302, {
            Location: "/members"
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