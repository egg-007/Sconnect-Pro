const activityRepository =
    require("../repositories/activityRepository");

const scheduleService =
    require("./scheduleService");

async function getAllActivities() {
    return await activityRepository.findAll();
}

async function createActivity(data) {
    const activity = {
        association_id:
            Number(data.association_id),

        facility_id:
            Number(data.facility_id),

        name:
            data.name?.trim(),

        season:
            data.season?.trim(),

        day_of_week:
            data.day_of_week,

        start_time:
            data.start_time,

        end_time:
            data.end_time,

        sub_zone:
            data.sub_zone?.trim() || null,

        max_capacity:
            Number(data.max_capacity),

        base_price:
            Number(data.base_price),

        age_category:
            data.age_category?.trim() || null,

        is_all_public:
            data.is_all_public === "true",

        is_risk_sport:
            data.is_risk_sport === "true",

        status: "active"
    };

    if (!activity.name) {
        throw new Error(
            "Activity name is required"
        );
    }

    if (!activity.season) {
        throw new Error(
            "Season is required"
        );
    }

    if (
        !Number.isFinite(activity.base_price) ||
        activity.base_price < 0
    ) {
        throw new Error(
            "Base price must be valid"
        );
    }

    await scheduleService.validateSchedule(
        activity
    );

    return await activityRepository.create(
        activity
    );
}

module.exports = {
    getAllActivities,
    createActivity
};