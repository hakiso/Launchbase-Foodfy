const express = require('express')
const routes = express.Router()
const multer = require('../app/middlewares/multer')
const admin = require('../app/controllers/admin')
const chef = require('../app/controllers/chef')

const { onlyAdmin, onlyUsers, allowEditMyRecipe } = require('../app/middlewares/session')
const RecipeValidator = require('../app/validators/recipe');
const ChefValidator = require('../app/validators/chefs');

// Admin //
routes.get("/recipes/", onlyUsers, admin.index)
routes.get("/recipes/create", onlyUsers, admin.create)
routes.get("/recipes/:id", onlyUsers, admin.show)
routes.get("/recipes/edit/:id", onlyUsers, allowEditMyRecipe, admin.edit)


routes.post("/recipes", onlyUsers, multer.array("photos", 5), RecipeValidator.post, admin.post)
routes.put("/recipes", onlyUsers, multer.array("photos", 5), RecipeValidator.put, admin.put)
routes.delete("/recipes", onlyUsers, admin.delete);


// Chef //
routes.get("/chefs/", onlyUsers, chef.index)
routes.get("/chefs/create", onlyAdmin, chef.create)
routes.get("/chefs/edit/:id", onlyAdmin, chef.edit)


routes.post("/chefs", onlyAdmin, multer.single("photos"), ChefValidator.create, chef.post)
routes.get("/chefs/:id", onlyUsers, chef.show)
routes.put("/chefs", onlyAdmin, ChefValidator.update, chef.put)
routes.delete("/chefs", onlyAdmin, chef.delete)

module.exports = routes