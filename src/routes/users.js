const express = require('express')
const routes = express.Router()

const SessionController = require('../app/controllers/SessionController')
const UserController = require('../app/controllers/UserController')
const ProfileController = require('../app/controllers/ProfileController')

const UserValidator = require('../app/validators/user')
const SessionValidator = require('../app/validators/session')
const ProfileValidator = require('../app/validators/profile')

const { isLoggedRedirectToUsers, onlyAdmin, onlyUsers } = require('../app/middlewares/session')

routes.get('/login', isLoggedRedirectToUsers, SessionController.loginForm)
routes.post('/login', SessionValidator.login, SessionController.login)
routes.post('/logout', SessionController.logout)

// // reset password / forgot
routes.get('/forgot-password', SessionController.forgotForm)
routes.get('/password-reset', SessionController.resetForm)
routes.post('/forgot-password', SessionValidator.forgot, SessionController.forgot)
routes.post('/password-reset', SessionValidator.reset, SessionController.reset)

routes.get('/profile', onlyUsers, ProfileValidator.show, ProfileController.index) // Mostrar o formulário com dados do usuário logado
routes.put('/profile', onlyUsers, ProfileValidator.update, ProfileController.put)// Editar o usuário logado

routes.get('/register', onlyAdmin, UserController.registerForm)
routes.get('/:id/edit', onlyAdmin, UserController.edit)

// Rotas que o administrador irá acessar para gerenciar usuários
routes.get('/list', onlyAdmin, UserController.list) //Mostrar a lista de usuários cadastrados
routes.post('/register', onlyAdmin, UserValidator.post, UserController.post) //Cadastrar um usuário
routes.put('/', onlyAdmin, UserValidator.update, UserController.put) // Editar um usuário
routes.delete('/', onlyAdmin, UserValidator.adminExclude, UserController.delete) // Deletar um usuário

module.exports = routes
