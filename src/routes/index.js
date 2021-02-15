const express = require('express')
const routes = express.Router()

const foodfy = require('../app/controllers/foodfy')

const admin = require('./admin')
const users = require('./users')

routes.use('/admin', admin)
routes.use('/admin/users', users)

// SITE //
routes.get('/' , (req, res) =>{
    return res.redirect('/main')
})

routes.get("/main/", foodfy.index);
routes.get("/main/show", foodfy.show);
routes.get("/main/receitas", foodfy.receitas);
routes.get("/main/chefs", foodfy.chefs);

routes.get("/main/searchpage", foodfy.searchpage);
routes.get("/main/receita/:id", foodfy.receita);

module.exports = routes
