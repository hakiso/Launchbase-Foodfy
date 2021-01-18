const Recipe = require('../models/Recipe')
const File = require('../models/File')
const Chef = require('../models/Chef')
const RecipeRelation = require('../models/RecipeRelation')

module.exports = {
    async index (req, res) {

        let results = await Recipe.all()
        let recipes = results.rows

        if (!recipes) return res.send('There aren\'t recipes to show')

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

        return res.render('admin/recipes/index', { recipes: lastAdded })
    },
    async create(req, res){
        try {
            let results = await Recipe.chefsSelectOptions()
            const chefOptions = results.rows
            
            return res.render('admin/recipes/create', { chefOptions })
            
          } catch (error) {
            console.error(error)
          }
    },
    async post(req, res) {

        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "" && key != "removed_files"){
                return res.send('Please, fill all fields!')
            }
        }

        if ( req.files.length == 0)
            return res.send('Please, send at least one image')

        const filesPromise = req.files.map(file => File.create({...file}))
        const fileResults = await Promise.all(filesPromise)
        
        const results = await Recipe.create(req.body)
        const recipeId = results.rows[0].id
        
        let filesObj = []
        
        fileResults.map(file => filesObj.push({
            file_id: file.rows[0].id,
            recipe_id: recipeId
        }))

        const recipePromise = filesObj.map(recipeRelation => File.createRecipeFile(recipeRelation))
        await Promise.all(recipePromise)
        

        return res.redirect(`recipes/${recipeId}`)

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

        return res.render('admin/recipes/edit', { recipe, files, chefOptions })
    },
    async put(req, res){
        const keys = Object.keys(req.body)

        for(key of keys) {
            if (req.body[key] =="" && key != "removed_files") {
                return res.send('Please, fill all fields!')
            }
        }


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

            await Recipe.update(req.body)      

            return res.redirect(`recipes/${req.body.id}`)

    },
    async delete(req, res){
        let results = await RecipeRelation.findAllImages(req.body.id)
        const files = results.rows
        
        await RecipeRelation.deleteByRelation(req.body.id)
        
        
        const fileResults = files.map(file => file.file_id)
                
        const filesPromise = fileResults.map(file => File.delete(file))
        await Promise.all(filesPromise)

        await Recipe.delete(req.body.id)

        return res.redirect('/admin/recipes')

    },
}