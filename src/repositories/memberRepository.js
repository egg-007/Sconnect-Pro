const pool = require("../config/db");

async function findAll() {
    const result = await pool.query(`
        SELECT
            m.id,
            m.family_id,
            m.first_name,
            m.last_name,
            m.birth_date,
            m.email,
            m.phone,
            m.medical_certificate_date,
            m.medical_status,
            m.pass_sport_code,
            m.created_at,
            f.name AS family_name
        FROM members m
        JOIN families f
            ON f.id = m.family_id
        ORDER BY m.id ASC
    `);

    return result.rows;
}

async function findById(id) {
    const result = await pool.query(
        `
        SELECT
            m.*,
            f.name AS family_name
        FROM members m
        JOIN families f
            ON f.id = m.family_id
        WHERE m.id = $1
        `,
        [id]
    );

    return result.rows[0];
}

async function create(member) {
    const result = await pool.query(
        `
        INSERT INTO members (
            family_id,
            first_name,
            last_name,
            birth_date,
            email,
            phone,
            medical_certificate_date,
            medical_status,
            pass_sport_code
        )
        VALUES (
            $1, $2, $3, $4, $5,
            $6, $7, $8, $9
        )
        RETURNING *
        `,
        [
            member.family_id,
            member.first_name,
            member.last_name,
            member.birth_date,
            member.email,
            member.phone,
            member.medical_certificate_date,
            member.medical_status,
            member.pass_sport_code
        ]
    );

    return result.rows[0];
}

module.exports = {
    findAll,
    findById,
    create
};