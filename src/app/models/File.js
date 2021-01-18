const db = require('../../config/db')
const fs = require('fs')

module.exports = {
   create ({filename, path}) {
        const query = `
            INSERT INTO files (
                name,
                path
            ) VALUES ($1, $2)
            RETURNING id
        `

        const values = [
            filename,
            path
        ]

        return db.query(query, values)
  },
  async delete(id) {
    try {
      const result = await db.query(`SELECT * FROM files WHERE id = $1`, [id])
      const file = result.rows[0]

      fs.unlinkSync(file.path)

      return db.query(`DELETE FROM files WHERE id = $1`, [id])

    } catch (error) {
      console.error(error)
    }
  },
  async createRecipeFile({ file_id, recipe_id }) {
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
  find(recipeId) {
    const query = `
      SELECT * 
      FROM files
      WHERE id IN (
        SELECT file_id
        FROM recipe_files
        WHERE recipe_id = $1
      )
      ORDER BY id
    `

    return db.query(query, [recipeId])
  },  
  async deleteRecipeFile(id) {
    try {
      const result = await db.query(`SELECT * FROM files WHERE id = $1`, [id])
      const file   = result.rows[0]

      fs.unlinkSync(file.path)

      await db.query(`DELETE FROM recipe_files WHERE file_id = $1`, [id])

      return db.query(`DELETE FROM files WHERE id = $1`, [id])

    } catch (error) {
      console.error(error)
    }
  }
}