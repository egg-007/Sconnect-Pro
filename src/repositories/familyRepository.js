const pool = require("../config/db");

async function findAll() {
    const result = await pool.query(`
        SELECT
            id,
            name,
            family_quotient,
            is_resident,
            address,
            created_at
        FROM families
        ORDER BY id ASC
    `);

    return result.rows;
}

async function findById(id) {
    const result = await pool.query(
        `
        SELECT *
        FROM families
        WHERE id = $1
        `,
        [id]
    );

    return result.rows[0];
}

module.exports = {
    findAll,
    findById
};