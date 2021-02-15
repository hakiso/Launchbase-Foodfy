const User = require('../models/User');


function checkAllFields(body) {
    // check if has all fields
    const keys = Object.keys(body)

    for(key of keys) {
        if (body[key] =="") {
            return {
                user: body,
                error: 'Por favor, preencha todos os campos.'
            }
        }
    }
}

async function post(req, res, next) {
    // check if has all fields
    const fillAllFields = checkAllFields(req.body)
    if(fillAllFields) {
        return res.render("admin/users/register", fillAllFields)
    }

    // Verifica se o usuário existe (email)
    let { email } = req.body;

    const user = await User.findOne({
        where: { email }
    });

    if (user) return res.render('admin/users/register', {
        user: req.body,
        error: 'E-mail em uso.'
    })

    next();
}

async function update(req, res, next) {

    const { id, email } = req.body;
    const user = await User.findOne({ where: { id } });

    if (email != user.email) {
        const isNotAvaliable = await User.findOne({ where: { email } });
        if (isNotAvaliable) return res.render('users/edit', {
            user: req.body,
            error: 'Este email já está cadastrado!'
        });
    }

    next();
}

async function adminExclude(req, res, next) {
    id = req.body.id;
    user_id = req.session.userId;
  
    let users = await User.all();
  
    if (id == user_id)
      return res.render("admin/users/list", {
        users,
        error: "Você não pode deletar sua própria conta!",
      });
    next();
  }

module.exports = {
    post,
    update,
    adminExclude
};