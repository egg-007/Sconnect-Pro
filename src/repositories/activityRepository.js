const pool = require("../config/db");

async function findAll() {
    const result = await pool.query(`
        SELECT
            a.*,
            f.name AS facility_name,
            ass.name AS association_name
        FROM activities a
        JOIN facilities f
            ON f.id = a.facility_id
        JOIN associations ass
            ON ass.id = a.association_id
        ORDER BY a.id ASC
    `);

    return result.rows;
}

async function findConflicts({
    facility_id,
    day_of_week,
    start_time,
    end_time,
    sub_zone
}) {
    const result = await pool.query(
        `
        SELECT
            id,
            name,
            start_time,
            end_time,
            sub_zone
        FROM activities
        WHERE facility_id = $1
          AND day_of_week = $2
          AND status != 'cancelled'

          AND start_time < $4
          AND end_time > $3

          AND (
                sub_zone IS NULL
                OR sub_zone = ''
                OR $5::varchar IS NULL
                OR $5::varchar = ''
                OR sub_zone = $5
          )
        `,
        [
            facility_id,
            day_of_week,
            start_time,
            end_time,
            sub_zone
        ]
    );

    return result.rows;
}

async function create(activity) {
    const result = await pool.query(
        `
        INSERT INTO activities (
            association_id,
            facility_id,
            name,
            season,
            day_of_week,
            start_time,
            end_time,
            sub_zone,
            max_capacity,
            base_price,
            age_category,
            is_all_public,
            is_risk_sport,
            status
        )
        VALUES (
            $1, $2, $3, $4, $5, $6, $7,
            $8, $9, $10, $11, $12, $13, $14
        )
        RETURNING *
        `,
        [
            activity.association_id,
            activity.facility_id,
            activity.name,
            activity.season,
            activity.day_of_week,
            activity.start_time,
            activity.end_time,
            activity.sub_zone,
            activity.max_capacity,
            activity.base_price,
            activity.age_category,
            activity.is_all_public,
            activity.is_risk_sport,
            activity.status
        ]
    );

    return result.rows[0];
}

async function findById(id) {
    const result = await pool.query(
        `
        SELECT *
        FROM activities
        WHERE id = $1
        `,
        [id]
    );

    return result.rows[0];
}
module.exports = {
    findAll,
    findById,
    findConflicts,
    create
};