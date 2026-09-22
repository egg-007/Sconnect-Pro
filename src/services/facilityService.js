const facilityRepository = require("../repositories/facilityRepository");

async function getAllFacilities() {
    return await facilityRepository.findAll();
}

async function getFacilityById(id) {
    return await facilityRepository.findById(id);
}

async function createFacility(data) {
    const facility = {
        name: data.name,
        type: data.type,
        address: data.address || null,
        erp_capacity: Number(data.erp_capacity),
        is_divisible: data.is_divisible === "true"
    };

    if (!facility.name || !facility.type) {
        throw new Error("Name and type are required");
    }

    if (
        !Number.isInteger(facility.erp_capacity) ||
        facility.erp_capacity <= 0
    ) {
        throw new Error("ERP capacity must be greater than 0");
    }

    return await facilityRepository.create(facility);
}

module.exports = {
    getAllFacilities,
    getFacilityById,
    createFacility
};