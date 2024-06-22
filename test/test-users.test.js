const request = require('supertest');
const { faker } = require('@faker-js/faker');
const rotaUsers = 'http://localhost:3000';

describe('Suite de testes crud (post, get, put, delete)', () => {

    const payload_usuario = {
        nome: faker.person.fullName({ firstName: 'Igor' }),
        telefone:faker.phone.number(),
        email: faker.internet.email(),
        senha: faker.internet.password()
    };
    const payload_usuario_sem_email = {
        nome: faker.person.fullName(),
        telefone: faker.phone.number(),
        senha: faker.internet.password()
    };

    let idUserToBeDeleted;

    it('Cadastrando um usuário, e consultando o retorno dos campos se foram os enviados', async () => {
        const response = await request(rotaUsers)
            .post('/users')
            .send(payload_usuario);
            
            idUserToBeDeleted = response.body.id;

            console.log('Responde BODY: ', response.body);
            expect(response.status).toBe(201);

            const{id, nome, telefone, email} = response.body;
            
            
            expect(id).toBeDefined();

            expect(nome).toBe(payload_usuario.nome);
            expect(telefone).toBe(payload_usuario.telefone);
            expect(email).toBe(payload_usuario.email);

            expect(response.body.senha).toBeUndefined();
    });

    it('Cadastrando um usuário faltando email, validar status code e mensagem de erro.', async () => {
        const response = await request(rotaUsers)
            .post('/users')
            .send(payload_usuario_sem_email);

            console.log('Responde BODY: ', response.body);
            expect(response.status).toBe(422);

            expect(response.body.error).toBe('Os seguintes campos são obrigatórios: email');
            
    });

    it('Alterar', async () => {

        const payload_novo_usuario = {
            nome: faker.person.fullName({ firstName: 'Igor' }),
            telefone:faker.phone.number(),
            email: faker.internet.email(),
            senha: faker.internet.password()
        };

        const responsePut = await request(rotaUsers)
            .put(`/users/${idUserToBeDeleted}`)
            .send(payload_novo_usuario);


            expect(responsePut.status).toBe(201);

            expect(responsePut.body.nome).toBe(payload_novo_usuario.nome);
            expect(responsePut.body.telefone).toBe(payload_novo_usuario.telefone);

            console.log('Usuário alterado: ', responsePut.body);




    });

    it('Deverá remover o registro cadastrado anteriormente e retornar 204', async () => {
        const response = await request(rotaUsers)
            .delete(`/users/${idUserToBeDeleted}`);

            console.log('Responde BODY: ', response.body);
            expect(response.status).toBe(204);

            //validar se realmente foi removido o registro
        const responseGet = await request(rotaUsers)
        .get(`/users/${idUserToBeDeleted}`)

        expect(responseGet.status).toBe(500);
        expect(responseGet.body).toEqual({ error: 'Erro ao obter dados do usuário' });
        console.log(responseGet.body);
            
    });



    // const payload_cadastro_usuário = {
    //     nome: "Igor",
    //     telefone: "(44)99997070",
    //     email: "iiii222i221@gmail.com",
    //     senha: "1234"
    // };

    // const payload_teste_alterar_usuario_sem_senha = {
    //     id: 2,
    //     nome: "Igor",
    //     telefone: "(44)99997070",
    //     email: "taynara1@gmail.com"
    // };

    // const payload_teste_alterar_usuario = {
    //     id: 2,
    //     nome: "Igor",
    //     telefone: "(44)99997070",
    //     email: "taynara1@gmail.com",
    //     senha: "1234"
    // }
    // let idUsuario;


    // it('Consulta todos os usuários...deve retornar status 200.', async () => {
    //     const response = await request(rota)
    //         .get('/users');
    //     console.log(response.body);
    //     expect(response.status).toBe(200);
    // });

    // it('Consulta todos os atividades...deve retornar status 200.', async () => {
    //     const response = await request(rota)
    //         .get('/activities');
    //     console.log(response.body);
    //     expect(response.status).toBe(200);
    // });

    // it.only('Cadastrar novos usuários...deve retornar status 201.', async () => {
    //     const response = await request(rota)
    //         .post('/users')
    //         .send(payload_cadastro_usuário);
    //     expect(response.status).toBe(201);
    //     expect(response.body).toHaveProperty('id');
    //     console.log('response: ', response.body);
    //     console.log('request: ', payload_cadastro_usuário);
    //     idUsuario = response.body.id;
    // });

    // it('Tentar cadastrar usuário existente...deve retornar status 422', async () => {
    //     const response = await request(rota)
    //         .post('/users')
    //         .send(payload_cadastro_usuário);
    //     console.log(response.body.error);
    //     expect(response.status).toBe(422);
    //     expect(response.body.error).toBe('E-mail já está em uso');
    // });

    // it('Tentar alterar usuário existente sem senha...deve retornar error de campo obrigatorio de senha', async () => {
    //     const response = await request(rota)
    //         .post('/users')
    //         .send(payload_teste_alterar_usuario_sem_senha);
    //     expect(response.body.error).toBe('Os seguintes campos são obrigatórios: senha');
    // });

    // it('Tentar alterar usuário existente sem senha...deve retornar o status 422', async () => {
    //     const response = await request(rota)
    //         .post('/users')
    //         .send(payload_teste_alterar_usuario_sem_senha);
    //     expect(response.statusCode).toBe(422);
    // });

    // it.only('Consultar o usuário cadastrado anteriormente.', async () => {
    //     const response = await request(rota)
    //         .get(`/users/${idUsuario}`);

    //     expect(response.status).toBe(200);
    //     expect(response.body).toHaveProperty('id', idUsuario);
    //     console.log('Usuário retornado: ', response.body);
    // });

    // // it('Cadastrar novos usuários...deve retornar status 200.', async () => {
    // //     const response = await request(rota)
    // //         .post('/users')
    // //         .send(payload_cadastro_usuário);
    // //     expect(response.statusCode).toBe(200)
    // //     .expect(response.body);
    // // });

})