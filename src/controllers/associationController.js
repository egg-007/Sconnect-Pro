const associationService =
    require("../services/associationService");

const render = require("../core/renderer");

async function index(req, res) {
    try {
        const associations =
            await associationService.getAllAssociations();

        render(res, "associations", {
            associations
        });

    } catch (error) {
        console.error(error);

        render(
            res,
            "error",
            {
                statusCode: 500,
                message: "Unable to load associations"
            },
            500
        );
    }
}

async function show(req, res, params) {
    try {
        const association =
            await associationService.getAssociationById(
                params.id
            );

        if (!association) {
            return render(
                res,
                "error",
                {
                    statusCode: 404,
                    message: "Association not found"
                },
                404
            );
        }

        res.writeHead(200, {
            "Content-Type": "application/json; charset=utf-8"
        });

        res.end(JSON.stringify(association));

    } catch (error) {
        console.error(error);

        render(
            res,
            "error",
            {
                statusCode: 500,
                message: "Unable to load association"
            },
            500
        );
    }
}

function createForm(req, res) {
    render(res, "association-form");
}

async function store(req, res) {
    try {
        await associationService.createAssociation(req.body);

        res.writeHead(302, {
            Location: "/associations"
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

async function editForm(req, res, params) {
    try {
        const association =
            await associationService.getAssociationById(
                params.id
            );

        if (!association) {
            return render(
                res,
                "error",
                {
                    statusCode: 404,
                    message: "Association not found"
                },
                404
            );
        }

        render(res, "association-edit", {
            association
        });

    } catch (error) {
        console.error(error);

        render(
            res,
            "error",
            {
                statusCode: 500,
                message: "Unable to load association"
            },
            500
        );
    }
}

async function update(req, res, params) {
    try {
        await associationService.updateAssociation(
            params.id,
            req.body
        );

        res.writeHead(302, {
            Location: "/associations"
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

async function remove(req, res, params) {
    try {
        await associationService.deleteAssociation(
            params.id
        );

        res.writeHead(302, {
            Location: "/associations"
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
    store,
    editForm,
    update,
    remove
};