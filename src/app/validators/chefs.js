async function create(req, res, next) {
    const keys = Object.keys(req.body)
  
    for (key of keys) {
      if (req.body[key] === "")
        return res.render("admin/chefs/create", {
          chef: req.body,
          error: "Por favor, preencha todos os campos."
        })
    }
  
  
    next()
  }
  
  async function update(req, res, next) {
    const keys = Object.keys(req.body)
  
    for (key of keys) {
      if (req.body[key] === "" & key !== "removed_files")
        return res.render("admin/chefs/create", {
          chef: req.body,
          error: "Por favor, preencha todos os campos."
        })
    }
  
    next()
  }
  
  module.exports = {
    create,
    update
  }