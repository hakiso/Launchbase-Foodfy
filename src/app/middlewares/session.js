const Recipe = require('../models/Recipe');


function onlyUsers(req, res, next) {
    if (!req.session.userId) {
        return res.redirect('/admin/users/login');
    }

    next();
}

function onlyAdmin(req, res, next) {
    if (!req.session.isAdmin) {
        return res.redirect('/admin/users/profile');
    }

    next();
}

function isLoggedRedirectToUsers(req, res, next) {
    if (req.session.userId) {
        return res.redirect('/admin/users/list');
    }

    next();
}

async function allowEditMyRecipe(req, res, next) {
    const { id } = req.params;

    const recipe = await Recipe.findRecipeWithChef(id);

    if (req.session.userId == recipe.user_id || req.session.isAdmin) {
        next();
    } else {
        req.session.error = 'Descupe, você não tem permisão para acessar esta página!'
        return res.redirect(`/admin/recipes/${recipe.id}`);
    }
}


module.exports = {
    onlyUsers,
    onlyAdmin,
    isLoggedRedirectToUsers,
    allowEditMyRecipe
};