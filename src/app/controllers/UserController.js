const User = require('../models/User')

const { hash } = require('bcryptjs');
const { randomPassword } = require('../../lib/randomPassword');
const mailer = require('../../lib/mailer');


module.exports = {
    registerForm(req, res) {
        return res.render('admin/users/register')
    },
    async list(req, res) {
        const users = await User.list()

        const { error, success } = req.session;
            req.session.error = '';
            req.session.success = '';

        return res.render('admin/users/list', {
            error,
            success,
            users: users.rows,
            users_page: true
        })
    },
    async post(req, res) {
        try {

            // Cria uma senha aleatória
            const password = randomPassword(8);

            // Hash de senha
            const passwordHash = await hash(password, 8);

            const data = {
                ...req.body,
                passwordHash
            }

            const userId = await User.create(data);

            req.session.userId = userId

            await mailer.sendMail({
                to: data.email,
                from: 'no-replay@foodfy.com.br',
                subject: 'Cadastro Foodfy',
                html: `
                <h2>Sua conta no Foodfy foi criada com sucesso.</h2>
                <p>Informações de acesso:</p>
                <p>E-mail: ${data.email}</p>
                <p>Senha: ${password}</p>
                <p>Clique no link abaixo para acessar o Foodfy</p>
                <p>
                    <a href="http://localhost:3000/admin/users/login" target="_blank">
                        ACESSAR FOODFY
                    </a>
                </p>
            `,
            });

            req.session.success = 'Usuário cadastrado com sucesso!';

            return res.redirect(`/admin/users/list`);
        } catch (err) {
            console.error(err);
        }
    },
    async put(req, res) {
        try {
            const data = {
                ...req.body
            }

            await User.updateAdmin(data);

            const users = await User.list()

            return res.render("admin/users/list", {
                users: users.rows,
                success: "Conta atualizada com sucesso!"
            })

        } catch (error) {
            console.error(error);

            return res.render('admin/users/edit', {
                error: 'Algum erro aconteceu.'
            });
        }
    },
    async edit(req, res) {
        try {
            const { id } = req.params;

            let results = await User.find(id);

            const user = results.rows[0];

            return res.render('admin/users/edit', { user });
        } catch (error) {
            console.error(error);
        }
    },
    async delete(req, res) {
        try {
            await User.delete(req.body.id)
           
            req.session.success = 'Conta deletada com sucesso!';

            return res.redirect(`/admin/users/list`);

        }catch(err) {
            console.error(err)
            
            return res.render("admin/users/list", {
                user: req.body,
                error: "Erro ao tentar deletar sua conta!"
            })
        }
    }
}