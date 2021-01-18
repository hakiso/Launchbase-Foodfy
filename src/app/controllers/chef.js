const Chef = require('../models/Chef')
const File = require('../models/File')
const Recipe = require('../models/Recipe')

module.exports = {
    async index(req, res) {
        let results = await Chef.all()
        const chefs = results.rows

        async function getImage(chefId){
            let results = await Chef.file(chefId)
            const files = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`)

            return files[0]
        }

        const chefsPromise = chefs.map(async chef => {
            chef.name = chef.name
            chef.src = await getImage(chef.file_id)
            return chef
        })

        const lastAdded = await Promise.all(chefsPromise)
    
        return res.render('admin/chef/index', { chefs: lastAdded })
      },
    create(req, res){
        return res.render("admin/chef/create")
    },
    async post(req, res){
        try {
            const keys = Object.keys(req.body)
            
            for (key of keys) {
              if (req.body[key] == "")
              return res.send("Please, fill all fields!")
            }
      
            let results = await File.create({ ...req.file })
            const fileId = results.rows[0].id


            results = await Chef.create(
                req.body, 
                fileId
                )
              const chefId = results.rows[0].id
          
              return res.redirect(`/admin/chef/${chefId}`)
            } 
            catch (err) {
              console.error(err)
            }
    },
    async show(req, res) {
        let results = await Chef.find(req.params.id)
        const chef = results.rows[0]

        chef.src = `${req.protocol}://${req.headers.host}${chef.path.replace("public", "")}`

        if(!chef) return res.send('Chef not found!')

        results = await Chef.findRecipesChef(chef.id)
        const recipes = results.rows

        async function getImage(recipeId){
            let results = await Recipe.files(recipeId)
            const files = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`)

            return files[0]
        }

        const recipesPromise = recipes.map(async recipe => {
            recipe.title = recipe.title
            recipe.src = await getImage(recipe.id)
            recipe.length = recipes.length
            return recipe
        })

        const lastAdded = await Promise.all(recipesPromise)
        
        return res.render("admin/chef/show", { chef, recipes: lastAdded })
    },
    async edit(req, res) {
        let results = await Chef.find(req.params.id)
        const chef = results.rows[0]

        if (!chef) return res.send ('Chef not found!')

        results = await Chef.file(chef.file_id)
        const chefFile = results.rows[0]
        
        chefFile.src = `${req.protocol}://${req.headers.host}${chefFile.path.replace("public", "")}`
        
        return res.render ("admin/chef/edit", { chef, file: chefFile })
    },
    async put(req, res) {
        try {
            const keys = Object.keys(req.body)
            
            for (key of keys) {
              if (req.body[key] == "")
              return res.send("Please, fill all fields!")
            }

            let results = await Chef.find(req.body.id)
            let file_id = results.rows[0].file_id
    
            if (req.file) {
              const results = await File.update(
                file_id,
                {...req.file}
              )
    
              let id = results.rows[0].id
              await Chef.update(req.body, id)
            } 
            else{
              await Chef.update_name(req.body)
            }

            return res.redirect(`/admin/chef/${req.body.id}`)
        } 
        catch (err) {
          console.error(err)
        }
    },
    async delete(req, res){
        try {
            const { id } = req.body;
        
            // --> Buscando o chefe para excluir
            const chef = (await Chef.find(id)).rows[0];
        
            if (!chef) return res.send("Chef não encontrado!");
        
            if(chef.total_recipes >= 1){
              res.send("Chefes que possuem receitas não podem ser excluídos!")
            } 
            
            else {
              // --> Deletando o chef e o arquivo do chefe buscado
            await Chef.delete(id);
            await File.delete(chef.file_id);
        
            // --> Redirecionando para a pagina com todos os chefs.
            return res.redirect("/admin/chef");
            }
            
          } catch (error) {
            throw new Error(error);
          }
    }
}

