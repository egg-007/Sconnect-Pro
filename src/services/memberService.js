const memberRepository =
    require("../repositories/memberRepository");

const familyRepository =
    require("../repositories/familyRepository");

const eligibilityService =
    require("./eligibilityService");

async function getAllMembers() {
    return await memberRepository.findAll();
}

async function getMemberById(id) {
    return await memberRepository.findById(id);
}

async function createMember(data) {
    const family =
        await familyRepository.findById(
            Number(data.family_id)
        );

    if (!family) {
        throw new Error("Family not found");
    }

    if (!data.first_name?.trim()) {
        throw new Error("First name is required");
    }

    if (!data.last_name?.trim()) {
        throw new Error("Last name is required");
    }

    if (!data.birth_date) {
        throw new Error("Birth date is required");
    }

    const medicalStatus =
        eligibilityService.getMedicalStatus({
            certificateDate:
                data.medical_certificate_date || null,

            isRiskSport: false
        });

    const member = {
        family_id: Number(data.family_id),
        first_name: data.first_name.trim(),
        last_name: data.last_name.trim(),
        birth_date: data.birth_date,
        email: data.email?.trim() || null,
        phone: data.phone?.trim() || null,

        medical_certificate_date:
            data.medical_certificate_date || null,

        medical_status: medicalStatus,

        pass_sport_code:
            data.pass_sport_code?.trim() || null
    };

    return await memberRepository.create(member);
}

module.exports = {
    getAllMembers,
    getMemberById,
    createMember
};