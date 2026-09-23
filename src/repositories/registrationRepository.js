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

module.exports = {
    create
};