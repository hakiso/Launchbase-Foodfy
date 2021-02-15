const Recipe = require('../models/Recipe')

function checkAllFields(body) {
    const keys = Object.keys(body)
    for (const key of keys) {
        if (body[key] == "" && key != "information" && key != "removed_files") {
            return {
                recipe: body,
                error: "Por favor preencha todos os campos."
            }
        }
    }
}

async function post(req, res, next) {
    try {
        let results = await Recipe.chefsSelectOptions()
        const chefOptions = results.rows

        const checkedFields = checkAllFields(req.body)
        if(checkedFields) return res.render("admin/recipes/create", { ...checkedFields, chefOptions })

        if(req.files.length == 0) return res.render("admin/recipes/create", {
            recipe: req.body,
            chefOptions,
            error: "Envie ao menos uma imagem!"
        })

        next()
    } catch (err) {
        console.error(err)
    }
}

async function put(req, res, next) {
    try {
        let results = await Recipe.chefsSelectOptions()
        const chefOptions = results.rows

        const checkedFields = checkAllFields(req.body)
        if(checkedFields) return res.render("admin/recipes/edit", { ...checkedFields, chefOptions })

        next();

    } catch (err) {
        console.error(err)
    }
}

module.exports = {
    post,
    put
}