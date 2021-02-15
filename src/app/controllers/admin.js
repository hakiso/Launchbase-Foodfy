const Recipe = require('../models/Recipe')
const File = require('../models/File')
const Chef = require('../models/Chef')
const RecipeRelation = require('../models/RecipeRelation')

module.exports = {
    async index (req, res) {
        let { success, error } = req.session
        req.session.success = "", req.session.error = ""

        let results = await Recipe.all()
        let recipes = results.rows

        if (!recipes) return res.send('Não tem receitas para mostrar!')

        async function getImage(recipeId) {
            let results = await Recipe.files(recipeId)
            const files = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`)

            return files[0]
        }

        const recipesPromise = recipes.map(async recipe => {
            recipe.recipe_id = recipe.recipe_id
            recipe.title = recipe.title
            recipe.chef_name = recipe.name
            recipe.src = await getImage(recipe.recipe_id)
            return recipe
        })

        const lastAdded = await Promise.all(recipesPromise)

        return res.render('admin/recipes/index', { recipes: lastAdded, success, error })
    },
    async create(req, res){
        try {
            let results = await Recipe.chefsSelectOptions()
            const chefOptions = results.rows

            const { error } = req.session;
            req.session.error = '';
            
            return res.render('admin/recipes/create', { chefOptions, error })
            
          } catch (error) {
            console.error(error)
          }
    },
    async post(req, res) {
        const filesPromise = req.files.map(file => File.create({...file}))
        const fileResults = await Promise.all(filesPromise)

        const UserId = req.session.userId;
        
        const Reciperesults = await Recipe.create(req.body, UserId)
        const recipeId = Reciperesults.rows[0].id
        
        let results = await Recipe.all()
        let recipes = results.rows
        
        let filesObj = []
        
        fileResults.map(file => filesObj.push({
            file_id: file.rows[0].id,
            recipe_id: recipeId
        }))

        const recipePromise = filesObj.map(recipeRelation => File.createRecipeFile(recipeRelation))
        await Promise.all(recipePromise)

        async function getImage(recipeId) {
            let results = await Recipe.files(recipeId)
            const files = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`)

            return files[0]
        }

        const recipesPromise = recipes.map(async recipe => {
            recipe.recipe_id = recipe.recipe_id
            recipe.title = recipe.title
            recipe.chef_name = recipe.name
            recipe.src = await getImage(recipe.recipe_id)
            return recipe
        })

        const lastAdded = await Promise.all(recipesPromise)

        return res.render(`admin/recipes/index`, {
            recipes: lastAdded,
            success: "Receita criada com sucesso!"
        })
    },
    async show(req, res) {
        let results = await Recipe.find(req.params.id)
        const recipe = results.rows[0]
        
        if (!recipe)
            return res.send("Recipe not found!")

        results = await Chef.find(recipe.chef_id)
        const chef = results.rows[0]
                
        results = await RecipeRelation.findAllImages(recipe.id)
        const files = results.rows.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))
        
        return res.render("admin/recipes/show", { recipe, chef, files })
        
    },
    async edit(req, res){
        let results = await Recipe.find(req.params.id)
        const recipe = results.rows[0]

        if (!recipe) {
        return res.send('Receita não encontrada')
        }

        results = await Recipe.files(recipe.id)
        let files = results.rows
        files = files.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))

        results = await Recipe.chefsSelectOptions()
        const chefOptions = results.rows

        return res.render('admin/recipes/edit', { 
            recipe,
            files, 
            chefOptions
        })
    },
    async put(req, res){
        try {
            await Recipe.update(req.body)

            let results = await Recipe.all()
            let recipes = results.rows

            if (!recipes) return res.send('Não tem receitas para mostrar!')
            
            if (req.files.lenght != 0) {
                const filesPromise = req.files.map(file => File.create({...file}))
                const fileResults = await Promise.all(filesPromise)

                let filesObj = []

                fileResults.map(file => filesObj.push({
                    file_id: file.rows[0].id,
                    recipe_id: req.body.id
                }))

                const recipePromise = filesObj.map(recipeRelation => RecipeRelation.create(recipeRelation))
                await Promise.all(recipePromise)
            } 

            if (req.body.removed_files) {
                const removedFiles = req.body.removed_files.split(",")
                const lastIndex = removedFiles.length - 1
                removedFiles.splice(lastIndex, 1)

                const removedFilesPromise = removedFiles.map(id => File.deleteRecipeFile(id))

                await Promise.all(removedFilesPromise)
            }
            
            async function getImage(recipeId) {
                let results = await Recipe.files(recipeId)
                const files = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`)

                return files[0]
            }

            const recipesPromise = recipes.map(async recipe => {
                recipe.recipe_id = recipe.recipe_id
                recipe.title = recipe.title
                recipe.chef_name = recipe.name
                recipe.src = await getImage(recipe.recipe_id)
                return recipe
            })

            const lastAdded = await Promise.all(recipesPromise)

            return res.render(`admin/recipes/index`, {
                recipes: lastAdded,
                success: "Receita atualizada com sucesso!"
            })
            
        } catch (err) {
            console.error(err);
        }
    },
    async delete(req, res){
        let results = await RecipeRelation.findAllImages(req.body.id)
        const files = results.rows
        
        await RecipeRelation.deleteByRelation(req.body.id)
        
        const fileResults = files.map(file => file.file_id)
                
        const filesPromise = fileResults.map(file => File.delete(file))
        await Promise.all(filesPromise)

        await Recipe.delete(req.body.id)

        req.session.success = "Receita deletada com sucesso!"

        return res.redirect('/admin/recipes')
    },
}