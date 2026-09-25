function calculateAgeAtEndOfSeason(birthDate, seasonEndYear) {
    const birth = new Date(birthDate);

    return seasonEndYear - birth.getFullYear();
}

function getAgeCategory(age) {
    if (age < 6) {
        return "Baby-Sport";
    }

    if (age >= 7 && age <= 8) {
        return "U9";
    }

    if (age >= 9 && age <= 10) {
        return "U11";
    }

    if (age >= 11 && age <= 12) {
        return "U13";
    }

    if (age >= 13 && age <= 14) {
        return "U15";
    }

    if (age >= 15 && age <= 17) {
        return "U18";
    }

    if (age >= 18 && age <= 39) {
        return "Senior";
    }

    if (age >= 40) {
        return "Master";
    }

    return "Unknown";
}

function isMedicalCertificateValid({
    certificateDate,
    isRiskSport
}) {
    if (!certificateDate) {
        return false;
    }

    const certificate = new Date(certificateDate);
    const today = new Date();

    const maxYears = isRiskSport ? 1 : 3;

    const expirationDate = new Date(certificate);

    expirationDate.setFullYear(
        expirationDate.getFullYear() + maxYears
    );

    return expirationDate >= today;
}

function getMedicalStatus({
    certificateDate,
    isRiskSport
}) {
    const valid = isMedicalCertificateValid({
        certificateDate,
        isRiskSport
    });

    return valid
        ? "compliant"
        : "medical_non_compliant";
}

function isEligibleForActivity({
    birthDate,
    season,
    activityAgeCategory,
    isAllPublic
}) {
    if (isAllPublic) {
        return true;
    }

    const seasonEndYear = Number(
        season.split("-")[1]
    );

    const age = calculateAgeAtEndOfSeason(
        birthDate,
        seasonEndYear
    );

    const memberCategory = getAgeCategory(age);

    return memberCategory === activityAgeCategory;
}

module.exports = {
    calculateAgeAtEndOfSeason,
    getAgeCategory,
    isMedicalCertificateValid,
    getMedicalStatus,
    isEligibleForActivity
};