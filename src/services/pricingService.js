function calculatePrice({
    basePrice,
    isResident,
    familyRegistrationCount,
    familyQuotient,
    hasPassSport
}) {
    let price = Number(basePrice);

    if (!isResident) {
        price *= 1.35;
    }

    if (familyRegistrationCount === 1) {
        price *= 0.85;
    }

    if (familyRegistrationCount >= 2) {
        price *= 0.70;
    }

    if (familyQuotient < 600) {
        price *= 0.60;
    } else if (
        familyQuotient >= 600 &&
        familyQuotient <= 900
    ) {
        price *= 0.80;
    }

    if (hasPassSport) {
        price -= 50;
    }

    if (price < 15) {
        price = 15;
    }

    return Number(price.toFixed(2));
}

function calculateInstallments(total) {
    total = Number(total);

    const second = Number(
        (total * 0.30).toFixed(2)
    );

    const third = Number(
        (total * 0.30).toFixed(2)
    );

    const first = Number(
        (total - second - third).toFixed(2)
    );

    return {
        first,
        second,
        third
    };
}

module.exports = {
    calculatePrice,
    calculateInstallments
};