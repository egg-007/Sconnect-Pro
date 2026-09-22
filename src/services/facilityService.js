const facilityRepository = require("../repositories/facilityRepository");

async function getAllFacilities() {
    return await facilityRepository.findAll();
}

async function getFacilityById(id) {
    return await facilityRepository.findById(id);
}

function validateFacility(data) {
    const facility = {
        name: data.name?.trim(),
        type: data.type?.trim(),
        address: data.address?.trim() || null,
        erp_capacity: Number(data.erp_capacity),
        is_divisible: data.is_divisible === "true"
    };

    if (!facility.name) {
        throw new Error("Facility name is required");
    }

    if (!facility.type) {
        throw new Error("Facility type is required");
    }

    if (
        !Number.isInteger(facility.erp_capacity) ||
        facility.erp_capacity <= 0
    ) {
        throw new Error("ERP capacity must be greater than 0");
    }

    return facility;
}

async function createFacility(data) {
    const facility = validateFacility(data);

    return await facilityRepository.create(facility);
}

async function updateFacility(id, data) {
    const existingFacility = await facilityRepository.findById(id);

    if (!existingFacility) {
        throw new Error("Facility not found");
    }

    const facility = validateFacility(data);

    return await facilityRepository.update(id, facility);
}

async function deleteFacility(id) {
    const existingFacility = await facilityRepository.findById(id);

    if (!existingFacility) {
        throw new Error("Facility not found");
    }

    return await facilityRepository.remove(id);
}

module.exports = {
    getAllFacilities,
    getFacilityById,
    createFacility,
    updateFacility,
    deleteFacility
};