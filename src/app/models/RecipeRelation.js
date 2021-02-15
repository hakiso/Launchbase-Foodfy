const db = require ('../../config/db')

module.exports = {
    create({file_id, recipe_id}) {
        const query = `
            INSERT INTO recipe_files (
                file_id,
                recipe_id
            ) VALUES ($1, $2)
            RETURNING id
        `

        const values = [
            file_id,
            recipe_id
        ]

        return db.query(query, values)
    },
    deleteByRelation(recipe_id) {
        try {
            return db.query (`DELETE FROM recipe_files WHERE recipe_id = $1`, [recipe_id])
        } catch(err) {
            console.log(err)
        }
    },
    findAllImages(recipe_id) {
        return db.query (
            `SELECT * FROM files
                JOIN recipe_files ON (recipe_files.file_id = files.id)
            WHERE recipe_id = $1
            ORDER BY recipe_files.id ASC`, [recipe_id])
    }
}