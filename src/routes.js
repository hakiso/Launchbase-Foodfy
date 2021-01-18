const express = require('express')
const routes = express.Router()
const multer = require('./app/middlewares/multer')
const admin = require('./app/controllers/admin')
const chef = require('./app/controllers/chef')
const foodfy = require('./app/controllers/foodfy')



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


// Admin //
routes.get("/admin/recipes/", admin.index);
routes.get("/admin/recipes/create", admin.create);
routes.get("/admin/recipes/:id", admin.show);
routes.get("/admin/recipes/edit/:id", admin.edit);


routes.post("/admin/recipes", multer.array("photos", 5), admin.post)
routes.put("/admin/recipes", multer.array("photos", 5), admin.put)
routes.delete("/admin/recipes", admin.delete);


// Chef //
routes.get("/admin/chef/", chef.index);
routes.get("/admin/chef/create", chef.create);
routes.get("/admin/chef/edit/:id", chef.edit);


routes.post("/admin/chef", multer.single("photos"), chef.post)
routes.get("/admin/chef/:id", chef.show);
routes.put("/admin/chef", chef.put);
routes.delete("/admin/chef", chef.delete);

module.exports = routes