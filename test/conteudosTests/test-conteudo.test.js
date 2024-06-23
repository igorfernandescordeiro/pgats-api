require('dotenv').config();
const request = require('supertest');
const { faker } = require('@faker-js/faker');


const rotaUsers = process.env.URL_USERS;


describe('Testes integrados da toda de conteúdos', () => {
    const payload_cadastro_conteudo = {
        titulo: faker.string.alpha(10),
        descricao: faker.word.words(10),
        tipoConteudo: faker.string.symbol(),
        conteudo: faker.word.words(12)
    };

    let idConteudoCadastrado;

    it('Criar novo conteúdo', async () => {

        const response = await request(rotaUsers)
            .post('/conteudos')
            .send(payload_cadastro_conteudo);
            console.log(response.body);
            const{titulo, descricao, tipoConteudo, conteudo} = response.body;
            console.log(`titulo: ${titulo}, descricao: ${descricao}, tipoConteudo: ${tipoConteudo}, conteudo: ${conteudo}`);

            // salva o id para utilizar em testes de alteração e deleção
            idConteudoCadastrado = response.body.id;

            

            // verifica se o conteudo está retornando os dados esperados
            expect(titulo).toBe(payload_cadastro_conteudo.titulo);
            expect(descricao).toBe(payload_cadastro_conteudo.descricao);
            expect(tipoConteudo).toBe(payload_cadastro_conteudo.tipoConteudo);
            expect(conteudo).toBe(payload_cadastro_conteudo.conteudo);


            // verifica se o status code está correto
            expect(response.status).toBe(201);
    });
});