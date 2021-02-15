const db = require('../../config/db')

module.exports = {
    async all() {
        try {
        return db.query (`
        SELECT recipes.id as recipe_id, * 
        FROM recipes
        JOIN chefs ON (recipes.chef_id = chefs.id)
        ORDER BY recipes.created_at DESC
        `)
        } catch (err) {
            console.log(err);
        }
    },
    async create(data, userId) {
        try {
        const query = `
            INSERT INTO recipes (
                chef_id,
                user_id,
                title,
                ingredients,
                preparation,
                information
            ) VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id
        `

        const values = [
            data.chef,
            userId,
            data.title,
            data.ingredients,
            data.preparation,
            data.information
        ]

        return db.query(query, values)
        } catch (err) {
            console.log(err);
        }
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
    file(id) {
        try {
            return db.query(`
            SELECT files.* FROM files LEFT JOIN recipe_files ON (files.id = recipe_files.file_id) LEFT
            JOIN recipes ON (recipes.id = recipe_files.recipe_id) WHERE recipes.id = $1
            `, [id]);
        } catch (error) {
            console.error(error);
        }
    },
    chefsSelectOptions() {
        const query = `
        SELECT name, id FROM chefs
      ORDER BY name ASC
    `
    return db.query(query)
    },
    async findRecipeWithChef(id) {
        try {
            const results = await db.query(`SELECT recipes.*, 
                chefs.name AS author FROM recipes
                LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
                WHERE recipes.id=$1`, [id]);

            return results.rows[0];
        } catch (err) {
            console.error(err);
        }
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
          ORDER BY recipes.updated_at DESC
          LIMIT $1 OFFSET $2
        `
    
        return db.query(query, [limit, offset])
      
    },
    receitas(params) {
        const { filter, limit, offset } = params

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
        ORDER BY recipes.created_at DESC
        LIMIT $1 OFFSET $2
        `
        return db.query(query , [limit, offset])
    }
}