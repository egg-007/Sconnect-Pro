const pool = require("../config/db");

async function create(registration) {
    const result = await pool.query(
        `
        INSERT INTO registrations (
            member_id,
            activity_id,
            final_price,
            status,
            payment_plan
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
        `,
        [
            registration.member_id,
            registration.activity_id,
            registration.final_price,
            registration.status,
            registration.payment_plan
        ]
    );

    return result.rows[0];
}


async function countFamilyRegistrationsBySeason(
    familyId,
    season
) {
    const result = await pool.query(
        `
        SELECT COUNT(*) AS total

        FROM registrations r

        JOIN members m
            ON m.id = r.member_id

        JOIN activities a
            ON a.id = r.activity_id

        WHERE m.family_id = $1
          AND a.season = $2
          AND r.status != 'cancelled'
        `,
        [
            familyId,
            season
        ]
    );

    return Number(result.rows[0].total);
}


module.exports = {
    create,
    countFamilyRegistrationsBySeason
};