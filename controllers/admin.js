const fs = require('fs')
const data = require('../data.json')
const receitas = require('../data')
const { arrayFix } = require('../utils')

exports.index = function(req, res) {
    return res.render("admin/recipes/index", { receitas })
}

exports.create = function(req, res) {
    return res.render("admin/recipes/create")
}

// post
exports.post = function(req, res){

    const keys = Object.keys(req.body);

    let {img_url, ingredients, preparos, adicional_info } = req.body;

    for(let key of keys) {
        if(req.body[key] == "")
            return res.send("Please, fill all inputs!")
    }

    let id = 1;
    const lastId = data.recipes[data.recipes.length - 1]

    if(lastId) {
        id = lastId.id + 1
    } 


    data.recipes.push ({
        id,
        img_url,
        ingredients,
        preparos,
        adicional_info
    })

    fs.writeFile("data.json",JSON.stringify(data,null,2), function(err){
        if(err) return res.send("Write file error!")


        return res.redirect("/admin/recipes")
    })
}

// show
exports.show = function(req, res) {
    const { id } = req.params

    const foundRecipe = data.recipes.find(function(recipe){
        return recipe.id == id
    }) 

    if (!foundRecipe) return res.send("Recipe not found!")

    return res.render("admin/recipes/show", { recipe:foundRecipe })
}

// edit
exports.edit = function(req,res){
    const {id} = req.params

    const foundRecipe = data.recipes.find(function(recipe){
        return recipe.id == id
    })

    if(!foundRecipe) return res.send("Recipe not found!!")

    return res.render("admin/recipes/edit", {recipe:foundRecipe})
}


// put 
exports.put = function(req, res){
    const {id} = req.body
    let index = 0

    const foundRecipe = data.recipes.find(function(recipe,foundIndex){
        if(recipe.id == id){
            index = foundIndex
            return true
        }
    })

    if(!foundRecipe) return res.send("Recipe not found!!")

    const recipe = {
        ...foundRecipe,
        ...req.body,
        ingredients: arrayFix(req.body.ingredients),
        preparos: arrayFix(req.body.preparos),
        id: Number(req.body.id)
    }

    data.recipes[index] = recipe

    fs.writeFile("data.json",JSON.stringify(data,null,2), function(err){
        if(err) return res.send("Write file error!")


        return res.redirect(`/admin/recipes/${id}`)
    })
}

// delete
exports.delete = function(req, res){
    const {id} = req.body

    const filterRecipes = data.recipes.filter(function(recipe){
        return recipe.id != id       
    })

    data.recipes = filterRecipes

    fs.writeFile("data.json",JSON.stringify(data,null,2), function(err){
        if(err) return res.send("Write file error!")


        return res.redirect(`/admin/recipes`)
    })
}