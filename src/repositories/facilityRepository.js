const pool = require("../config/db");

async function findAll() {
    const result = await pool.query(`
        SELECT
            id,
            name,
            type,
            address,
            erp_capacity,
            is_divisible,
            created_at
        FROM facilities
        ORDER BY id ASC
    `);

    return result.rows;
}

async function findById(id) {
    const result = await pool.query(
        `
        SELECT
            id,
            name,
            type,
            address,
            erp_capacity,
            is_divisible,
            created_at
        FROM facilities
        WHERE id = $1
        `,
        [id]
    );

    return result.rows[0];
}

async function create(facility) {
    const {
        name,
        type,
        address,
        erp_capacity,
        is_divisible
    } = facility;

    const result = await pool.query(
        `
        INSERT INTO facilities (
            name,
            type,
            address,
            erp_capacity,
            is_divisible
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
        `,
        [
            name,
            type,
            address,
            erp_capacity,
            is_divisible
        ]
    );

    return result.rows[0];
}

async function update(id, facility) {
    const {
        name,
        type,
        address,
        erp_capacity,
        is_divisible
    } = facility;

    const result = await pool.query(
        `
        UPDATE facilities
        SET
            name = $1,
            type = $2,
            address = $3,
            erp_capacity = $4,
            is_divisible = $5
        WHERE id = $6
        RETURNING *
        `,
        [
            name,
            type,
            address,
            erp_capacity,
            is_divisible,
            id
        ]
    );

    return result.rows[0];
}

async function remove(id) {
    const result = await pool.query(
        `
        DELETE FROM facilities
        WHERE id = $1
        RETURNING *
        `,
        [id]
    );

    return result.rows[0];
}

module.exports = {
    findAll,
    findById,
    create,
    update,
    remove
};