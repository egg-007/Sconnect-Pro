const activityRepository =
    require("../repositories/activityRepository");

const facilityRepository =
    require("../repositories/facilityRepository");

async function validateSchedule(data) {
    const facility =
        await facilityRepository.findById(
            data.facility_id
        );

    if (!facility) {
        throw new Error("Facility not found");
    }

    const maxCapacity =
        Number(data.max_capacity);

    if (
        !Number.isInteger(maxCapacity) ||
        maxCapacity <= 0
    ) {
        throw new Error(
            "Maximum capacity must be greater than 0"
        );
    }

    if (
        maxCapacity >
        facility.erp_capacity
    ) {
        throw new Error(
            `Activity capacity cannot exceed ERP capacity (${facility.erp_capacity})`
        );
    }

    if (
        !data.start_time ||
        !data.end_time ||
        data.start_time >= data.end_time
    ) {
        throw new Error(
            "Start time must be before end time"
        );
    }

    const conflicts =
        await activityRepository.findConflicts({
            facility_id: data.facility_id,
            day_of_week: data.day_of_week,
            start_time: data.start_time,
            end_time: data.end_time,
            sub_zone: data.sub_zone || null
        });

    if (conflicts.length > 0) {
        const conflict = conflicts[0];

        throw new Error(
            `Schedule conflict with "${conflict.name}" (${conflict.start_time} - ${conflict.end_time})`
        );
    }

    return true;
}

module.exports = {
    validateSchedule
};