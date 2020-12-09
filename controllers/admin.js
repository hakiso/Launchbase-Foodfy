const fs = require('fs')
const data = require('../data.json')
const receitas = require('../data')


exports.index = function(req, res) {
    return res.render("admin/recipes/index", { receitas })
}

exports.create = function(req, res) {
    return res.render("admin/recipes/create")
}

// post
exports.post =  function(req, res) {
    
    const keys = Object.keys(req.body)

    for(key of keys) {
        
        if (req.body[key] == "") {
            return res.send("Please, fill all fields!")
        }
    }

    let {img_url, ingredients, passos, adicional_info } = req.body

    const id = Number(data.recipes.length + 1)


    data.recipes.push({
        id,
        img_url,
        ingredients,
        passos,
        adicional_info
    })

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if (err) return res.send("Runtime Error!")

        return res.redirect("/admin/recipes")
    })

    //return res.send(req.body)
}
