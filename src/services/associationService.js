const associationRepository = require("../repositories/associationRepository");

async function getAllAssociations() {
    return await associationRepository.findAll();
}

async function getAssociationById(id) {
    return await associationRepository.findById(id);
}

function validateAssociation(data) {
    const association = {
        name: data.name?.trim(),
        email: data.email?.trim() || null,
        phone: data.phone?.trim() || null
    };

    if (!association.name) {
        throw new Error("Association name is required");
    }

    if (
        association.email &&
        !association.email.includes("@")
    ) {
        throw new Error("Invalid email address");
    }

    return association;
}

async function createAssociation(data) {
    const association = validateAssociation(data);

    return await associationRepository.create(association);
}

async function updateAssociation(id, data) {
    const existingAssociation =
        await associationRepository.findById(id);

    if (!existingAssociation) {
        throw new Error("Association not found");
    }

    const association = validateAssociation(data);

    return await associationRepository.update(
        id,
        association
    );
}

async function deleteAssociation(id) {
    const existingAssociation =
        await associationRepository.findById(id);

    if (!existingAssociation) {
        throw new Error("Association not found");
    }

    return await associationRepository.remove(id);
}

module.exports = {
    getAllAssociations,
    getAssociationById,
    createAssociation,
    updateAssociation,
    deleteAssociation
};