const registrationRepository =
    require("../repositories/registrationRepository");

const memberRepository =
    require("../repositories/memberRepository");

const activityRepository =
    require("../repositories/activityRepository");

const familyRepository =
    require("../repositories/familyRepository");

const eligibilityService =
    require("./eligibilityService");

const pricingService =
    require("./pricingService");


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


    const family =
        await familyRepository.findById(
            member.family_id
        );

    if (!family) {
        throw new Error("Family not found");
    }


    const eligible =
        eligibilityService.isEligibleForActivity({
            birthDate: member.birth_date,
            season: activity.season,
            activityAgeCategory:
                activity.age_category,
            isAllPublic:
                activity.is_all_public
        });


    if (!eligible) {
        throw new Error(
            "Member is not eligible for this activity"
        );
    }


    const medicalStatus =
        eligibilityService.getMedicalStatus({
            certificateDate:
                member.medical_certificate_date,

            isRiskSport:
                activity.is_risk_sport
        });


    const familyRegistrationCount =
        await registrationRepository
            .countFamilyRegistrationsBySeason(
                family.id,
                activity.season
            );


    const hasPassSport =
        Boolean(member.pass_sport_code);


    const finalPrice =
        pricingService.calculatePrice({
            basePrice:
                activity.base_price,

            isResident:
                family.is_resident,

            familyRegistrationCount,

            familyQuotient:
                Number(
                    family.family_quotient
                ),

            hasPassSport
        });


    const paymentPlan =
        Number(data.payment_plan || 1);


    if (
        paymentPlan !== 1 &&
        paymentPlan !== 3
    ) {
        throw new Error(
            "Payment plan must be 1 or 3"
        );
    }


    const registration = {
        member_id:
            member.id,

        activity_id:
            activity.id,

        final_price:
            finalPrice,

        payment_plan:
            paymentPlan,

        status:
            medicalStatus === "compliant"
                ? "confirmed"
                : "medical_non_compliant"
    };


    const createdRegistration =
        await registrationRepository.create(
            registration
        );


    let installments = null;


    if (paymentPlan === 3) {
        installments =
            pricingService.calculateInstallments(
                finalPrice
            );
    }


    return {
        registration:
            createdRegistration,

        pricing: {
            base_price:
                Number(
                    activity.base_price
                ),

            is_resident:
                family.is_resident,

            family_registration_count:
                familyRegistrationCount,

            family_quotient:
                Number(
                    family.family_quotient
                ),

            has_pass_sport:
                hasPassSport,

            final_price:
                finalPrice,

            installments
        }
    };
}


module.exports = {
    createRegistration
};