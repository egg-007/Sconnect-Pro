const registrationRepository =
    require("../repositories/registrationRepository");

const memberRepository =
    require("../repositories/memberRepository");

const activityRepository =
    require("../repositories/activityRepository");

const eligibilityService =
    require("./eligibilityService");

async function createRegistration(data) {
    const member =
        await memberRepository.findById(
            Number(data.member_id)
        );

    if (!member) {
        throw new Error("Member not found");
    }

    const activity =
        await activityRepository.findById(
            Number(data.activity_id)
        );

    if (!activity) {
        throw new Error("Activity not found");
    }

    const eligible =
        eligibilityService.isEligibleForActivity({
            birthDate: member.birth_date,
            season: activity.season,
            activityAgeCategory: activity.age_category,
            isAllPublic: activity.is_all_public
        });

    if (!eligible) {
        throw new Error(
            "Member is not eligible for this activity age category"
        );
    }

    const medicalStatus =
        eligibilityService.getMedicalStatus({
            certificateDate:
                member.medical_certificate_date,

            isRiskSport:
                activity.is_risk_sport
        });

    const registration = {
        member_id: member.id,
        activity_id: activity.id,

        final_price:
            Number(data.final_price),

        payment_plan:
            Number(data.payment_plan || 1),

        status:
            medicalStatus === "compliant"
                ? "confirmed"
                : "medical_non_compliant"
    };

    return await registrationRepository.create(
        registration
    );
}

module.exports = {
    createRegistration
};