const Recipe = require('../models/Recipe')
const RecipeRelation = require('../models/RecipeRelation')
const Chef = require('../models/Chef')

module.exports = {
    async index (req, res) {

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

        return res.render('main/index', { recipes: lastAdded })
            
    },
    show(req, res){
        return res.render("main/show")
    },
    async receitas(req, res) {
        try{
            let { filter, page, limit} = req.query 
        
            page = page || 1 
            limit = limit || 6 
            let offset = limit * (page -1)
        
            const params = {
                filter,
                page,
                limit,
                offset
        }
        
        let results = await Recipe.receitas(params)
        const recipes = results.rows
        if (recipes[0] == undefined) {
            return res.render("main/receitas", {
              filter,
            });
          }

        const pagination ={
            total: Math.ceil(recipes[0].total/limit),
            page
        }

        async function getImage(recipeId) {
            let results = await Recipe.files(recipeId);
            const file = results.rows[0];
    
            return `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`;
        }
    
        const recipesPromise = recipes.map(async recipe => {
            recipe.image = await getImage(recipe.id);
            return recipe;
        });
    
        const allRecipes = await Promise.all(recipesPromise);
        
        return res.render("main/receitas", {recipes : allRecipes, pagination, filter})
    
        }catch (err){
        console.error(err)
        }
    },
    async chefs(req, res) {
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
    
        return res.render('main/chefs', { chefs: lastAdded })
    },
    async receita(req, res) {
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
        
        return res.render("main/receita", { recipe, chef, files })
    },
    async searchpage(req, res) {
        try{
            let { filter, page, limit} = req.query 
        
            page = page || 1 
            limit = limit || 6 
            let offset = limit * (page -1)
        
            const params = {
                filter,
                page,
                limit,
                offset
        }
        
        let results = await Recipe.searchpage(params)
        const recipes = results.rows
        if (recipes[0] == undefined) {
            return res.render("main/searchpage", {
              filter,
            });
          }

        const pagination ={
            total: Math.ceil(recipes[0].total/limit),
            page
        }

        async function getImage(recipeId) {
            let results = await Recipe.files(recipeId);
            const file = results.rows[0];
    
            return `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`;
        }
    
        const recipesPromise = recipes.map(async recipe => {
            recipe.image = await getImage(recipe.id);
            return recipe;
        });
    
        const allRecipes = await Promise.all(recipesPromise);
        
        return res.render("main/searchpage", {recipes : allRecipes, pagination, filter})
    
        }catch (err){
        console.error(err)
        }
    }
}