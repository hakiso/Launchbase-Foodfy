const Recipe = require('../models/Recipe')
const Chef = require('../models/Chef')

module.exports = {
    index(req, res){
        Recipe.foodfyrecipes(function (recipes) {
            return res.render("main/index", { recipes })
        })
            
    },
    show(req, res){
        return res.render("main/show")
    },
    receitas(req, res) {
        let { filter, page, limit } = req.query

        page = page || 1
        limit = limit || 9
        let offset = limit * (page - 1)

        const params = {
            filter,
            page,
            limit,
            offset,
            callback(recipes) {
                const pagination = {
                    filter,
                    total: Math.ceil(recipes[0].total / limit),
                    page
                }

                return res.render("main/receitas", { recipes, pagination, filter})
            }
        }

        Recipe.receitas(params)
    },
    chefs(req, res) {
        Chef.all(function(chefs) {
            return res.render("main/chefs", {chefs})
        })
    },
    receita(req, res) {
        Recipe.find(req.params.id, function(recipe) {
            if (!recipe) return res.send("Recipe not found!")

            return res.render("main/receita", { recipe })
        })
    },
    searchpage(req, res) {
        let { filter, page, limit } = req.query

        page = page || 1
        limit = limit || 9
        let offset = limit * (page - 1)

        const params = {
            filter,
            page,
            limit,
            offset,
            callback(recipes) {
                const pagination = {
                    filter,
                    total: Math.ceil(recipes[0].total / limit),
                    page
                }

                return res.render("main/searchpage", { recipes, pagination, filter })
            }
        }

        Recipe.searchpage(params)
   },
}