const Recipe = require('../models/Recipe')

const db = require('../../config/db')
const fs = require('fs');

module.exports = {
    async list() {
        try {
            return db.query(`SELECT * FROM users ORDER BY users.id ASC`);
        } catch (err) {
            console.log(err);
        }
    },
    async all() {
        try {
          results = await db.query(`SELECT * FROM users`);
          return results.rows;
        } catch (err) {
          console.error(err);
        }
      },
    async create(data) {
        try {
            const query = `INSERT INTO users (
                name,
                email,
                password,
                is_admin
            ) VALUES ($1, $2, $3, $4)
            RETURNING id`;

            if (data.is_admin == null) {
                data.is_admin = false;
            } else {
                data.is_admin = true;
            }

            const values = [
                data.name,
                data.email,
                data.passwordHash,
                data.is_admin
            ];

            const results = await db.query(query, values);

            return results.rows[0].id;
        } catch (err) {
            console.log(err);
        }
    },
    find(id) {
        const query = 'SELECT users.* FROM users WHERE id = $1';

        return db.query(query, [id]);
    },
    async findOne(filters) {
        let query = "SELECT * FROM users"

      Object.keys(filters).map(key => {
          query = `${query}
          ${key}
          `

          Object.keys(filters[key]).map(field => {
              query = `${query} ${field} = '${filters[key][field]}'`
          })
      })

      const results = await db.query(query)
      
      return results.rows[0]
    },
    async update(id, fields) {
        try {
            let query = 'UPDATE users SET';

            Object.keys(fields).map((key, index, array) => {
                if ((index + 1) < array.length) {
                    query = `${query}
                    ${key} = '${fields[key]}',
                `;
                } else {
                    // Última iteração
                    query = `${query}
                    ${key} = '${fields[key]}'
                    WHERE id = ${id}
                `;
                }
            });

            return db.query(query);
        } catch (err) {
            console.log(err);
        }
    },
    async updateAdmin(data) {
        try {
            const query = `UPDATE users SET 
                    name = $1,
                    email = $2,
                    is_admin = $3
                WHERE id = $4`;

            if (data.is_admin == null) {
                data.is_admin = false;
            } else {
                data.is_admin = true;
            }

            const values = [
                data.name,
                data.email,
                data.is_admin,
                data.id
            ];

            return db.query(query, values);
        } catch (err) {
            console.log(err);
        }
    },
    async delete(id) {
        try {
            let results = await await db.query(`SELECT recipes.* FROM recipes WHERE recipes.user_id=$1`, [id]);
            const recipes = results.rows;
    
            const allFilesPromise = recipes.map(recipe =>
                Recipe.file(recipe.id)
            );
    
            let promiseResults = await Promise.all(allFilesPromise);
    
            for (let index = 0; index < recipes.length; index++) {
                await db.query(`DELETE FROM recipe_files WHERE recipe_files.recipe_id = $1`, [recipes[index].id]);
            }
    
            await db.query(`DELETE FROM users WHERE id=$1`, [id]);
    
            promiseResults.map(results => {
                results.rows.map(file => {
                    try {
                        fs.unlinkSync(file.path);
                    } catch (error) {
                        console.error(error);
                    }
                });
            });
        } catch (error) {
            console.error(error);
        }
    }
}