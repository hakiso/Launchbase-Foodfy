const db = require('../../config/db')
const fs = require('fs')

module.exports = {
    all() {
        return db.query(`
          SELECT chefs.*, count(recipes) AS total_recipes
          FROM chefs 
          LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
          GROUP BY chefs.id
          ORDER BY total_recipes DESC
          `)
    },
    create( data, file_id ) {
        const query = `
        INSERT INTO chefs (
            name,
            file_id
        ) VALUES ($1, $2)
        RETURNING id
    `

    const values = [
        data.name,
        file_id
    ]

    return db.query(query, values)
    },
    find(id) {
        return db.query(`
            SELECT chefs.*,
                    files.path as path
            FROM chefs 
            LEFT JOIN files ON (chefs.file_id = files.id)
            WHERE chefs.id = $1
        `, [id])
    },
    findRecipesChef(chef_id){
        return db.query(`
        SELECT * 
        FROM recipes 
        WHERE chef_id = $1
        ORDER BY recipes.created_at DESC
        `, [chef_id])
    },
    update(data, file_id) {
        const query = `
        UPDATE chefs SET
            name=($1),
            file_id=($2)
        WHERE id = $3
        `

        const values = [
            data.name,
            file_id,
            data.id
        ]

    return db.query(query, values)   
    },
    update_name(data) {
        const query = `
        UPDATE chefs SET
        name = ($1)
        WHERE id = $2
        `
        const values = [
          data.name,
          data.id
        ]
    
        return db.query(query, values)
    },
    async delete(id) {
      try {
        const results = await db.query(`
          SELECT files.* FROM files
          INNER JOIN chefs ON (files.id = chefs.file_id)
          WHERE chefs.id = $1`, [id]
        )
        const removedFiles = results.rows.map( async file => {
          fs.unlinkSync(file.path)
  
          await db.query(`DELETE FROM chefs WHERE id = $1`, [id])
          return db.query(`DELETE FROM files WHERE id = $1`, [file.id])
        })
      }
      catch (err) {
        console.error(err) 
      }
    },
    file(id) {
        return db.query('SELECT * FROM files WHERE id = $1', [id])
    },
    files(id) {
        try {
            return db.query(`
              SELECT files.* FROM files
              LEFT JOIN chefs ON (files.id = chefs.file_id)
              WHERE chefs.id = $1`, [id]
            )
          } 
          catch (err) {
            console.error(err)
          }
    },
}
