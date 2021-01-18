const db = require('../../config/db')

module.exports = {
    all() {
        return db.query (`
        SELECT recipes.id as recipe_id, * 
        FROM recipes
        JOIN chefs ON (recipes.chef_id = chefs.id)
        ORDER BY recipes.created_at DESC
    `)
    },
    create(data) {
        const query = `
            INSERT INTO recipes (
                chef_id,
                title,
                ingredients,
                preparation,
                information
            ) VALUES ($1, $2, $3, $4, $5)
            RETURNING id
        `

        const values = [
            data.chef,
            data.title,
            data.ingredients,
            data.preparation,
            data.information
        ]

        return db.query(query, values)
    },
    find(id) {
        return db.query (`SELECT * FROM recipes WHERE ID = $1`, [id])
    },
    findBy(filter) {
        return db.query(`SELECT *
        FROM recipes
        WHERE recipes.title ILIKE '%${filter}%'
        ORDER BY title ASC`)
    },
    update(data) {
        const query = `
        UPDATE recipes SET
            chef_id=($1),
            title=($2),
            ingredients=($3),
            preparation=($4),
            information=($5)
        WHERE id = $6
        `

        const values = [
            data.chef,
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            data.id
        ]

        return db.query(query, values)

    },
    delete(id) {
        return db.query (`DELETE FROM recipes WHERE id = $1`, [id])
    },
    files(id) {
        return db.query (`
            SELECT * 
            FROM recipes
            JOIN recipe_files ON (recipes.id = recipe_files.recipe_id)
            JOIN files ON (recipe_files.file_id = files.id)
            WHERE recipes.id = $1
        `, [id])
    },
    chefsSelectOptions() {
        const query = `
        SELECT name, id FROM chefs
      ORDER BY name ASC
    `
    return db.query(query)
    },
    searchpage(params) {
        const { filter, limit, offset } = params

        let query = "", 
            filterQuery = "",
            subQuery = `(
              SELECT count(*) 
              FROM recipes
            ) AS total`
    
        if (filter) {
          filterQuery = `
            WHERE recipes.title ILIKE '%${filter}%'
          `
    
          subQuery = `(
            SELECT count(*) 
            FROM recipes
            ${filterQuery}
          ) AS total`
        }
        
        query = `
          SELECT recipes.*, ${subQuery}, chefs.name AS chef_name
          FROM recipes
          LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
          ${filterQuery}
          ORDER BY recipes.title ASC
          LIMIT $1 OFFSET $2
        `
    
        return db.query(query, [limit, offset])
      
    },
    receitas(params) {
        const { filter, limit, offset, callback } = params

        let query = "",
            filterQuery = "",
            totalQuery = `(
                SELECT count(*) FROM recipes
            ) AS total`
        
        if( filter ) {
            filterQuery = `${query}
            WHERE recipes.title ILIKE '%${filter}%'
            `

            totalQuery = `(
                SELECT count(*) FROM recipes
                ${filterQuery}
            )as total`
        }

        query = `SELECT recipes.*, chefs.name AS chef_name, ${totalQuery}
        FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        ${filterQuery}
        ORDER BY recipes.title ASC
        LIMIT $1 OFFSET $2
        `
        return db.query(query , [limit, offset])
    },
}