const express = require('express')
const routes = express.Router()
const receitas = require('./data')
const admin = require('./controllers/admin')


// SITE //
routes.get('/', function(req, res) {
    return res.redirect("/main")
})

routes.get('/main', function(req, res) {
    return res.render("main/index", { receitas })
})

routes.get('/about', function(req, res) {
    return res.render("main/about")
})

routes.get('/receitas', function(req, res) {
    return res.render("main/receitas", { receitas })
})

routes.get("/receita/:index",function(req, res){
    const receitaId = req.params.index;
    return res.render('main/receita', { receita: receitas[receitaId] })
})


// Admin //

routes.get('/admin', function(req, res) {
    return res.redirect("/admin/recipes")
})

routes.get("/admin/recipes/", admin.index);
routes.get("/admin/recipes/create", admin.create);

routes.post("/admin/recipes", admin.post)


routes.get("/admin/recipes/:index",function(req, res){
    const receitaId = req.params.index;
    return res.render('admin/recipes/show', { receita: receitas[receitaId] })
})

routes.get("/admin/recipes/edit/:index",function(req, res){
    const receitaId = req.params.index;
    return res.render('admin/recipes/edit', { receita: receitas[receitaId] })
})

module.exports = routes