const pool = require("../config/db");

async function findAll() {
    const result = await pool.query(`
        SELECT
            id,
            name,
            email,
            phone,
            created_at
        FROM associations
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
            email,
            phone,
            created_at
        FROM associations
        WHERE id = $1
        `,
        [id]
    );

    return result.rows[0];
}

async function create(association) {
    const {
        name,
        email,
        phone
    } = association;

    const result = await pool.query(
        `
        INSERT INTO associations (
            name,
            email,
            phone
        )
        VALUES ($1, $2, $3)
        RETURNING *
        `,
        [
            name,
            email,
            phone
        ]
    );

    return result.rows[0];
}

async function update(id, association) {
    const {
        name,
        email,
        phone
    } = association;

    const result = await pool.query(
        `
        UPDATE associations
        SET
            name = $1,
            email = $2,
            phone = $3
        WHERE id = $4
        RETURNING *
        `,
        [
            name,
            email,
            phone,
            id
        ]
    );

    return result.rows[0];
}

async function remove(id) {
    const result = await pool.query(
        `
        DELETE FROM associations
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