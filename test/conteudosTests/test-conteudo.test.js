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

    const payload_alterar_conteudo = {
        titulo: 'IGOR',
        descricao: faker.word.words(8),
        tipoConteudo: faker.string.symbol(),
        conteudo: faker.word.words(10)
    };

    let idConteudoCadastrado;

    it('Criar novo conteúdo', async () => {

        const response = await request(rotaUsers)
            .post('/conteudos')
            .send(payload_cadastro_conteudo);
        console.log(response.body);

        //desestruturação do response para poder validar os dados recebidos com enviados
        const { titulo, descricao, tipoConteudo, conteudo, carro } = response.body;

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

    it('Consultar item cadastrado e verificar se os dados estão corretos', async () => {
        const response = await request(rotaUsers)
            .get(`/conteudos/${idConteudoCadastrado}`);
        console.log(response.body);

        //desestruturação do response para poder validar os dados recebidos com enviados
        const { id, titulo, descricao, tipoConteudo, conteudo, carro } = response.body;

        // valida se o status code está correto dessa consulta
        expect(response.status).toBe(200);

        // verifica se os dados buscados são os mesmo que os enviados no cadastro
        expect(id).toBe(idConteudoCadastrado);
        expect(titulo).toBe(payload_cadastro_conteudo.titulo);
        expect(descricao).toBe(payload_cadastro_conteudo.descricao);
        expect(tipoConteudo).toBe(payload_cadastro_conteudo.tipoConteudo);
        expect(conteudo).toBe(payload_cadastro_conteudo.conteudo);
    });

    it('Alterar o conteúdo consultado anteriormente e validar se os novos dados foram alterados ', async () => {
        const responsePut = await request(rotaUsers)
            .put(`/conteudos/${idConteudoCadastrado}`)
            .send(payload_alterar_conteudo);
        console.log(responsePut.body);

        //Você deverá alterar o conteúdo consultado anteriormente, e em seguida validar se realmente os dados foram alterados.

        expect(responsePut.status).toBe(201);

        // verifica se os dados alterados foram alterados para o id em especifico

        const responseGet = await request(rotaUsers)
            .get(`/conteudos/${idConteudoCadastrado}`);
        console.log(responseGet.body);
        expect(responseGet.status).toBe(200);
        expect(responseGet.body.id).toBe(idConteudoCadastrado);
        expect(responseGet.body.titulo).toBe(payload_alterar_conteudo.titulo);
        expect(responseGet.body.descricao).toBe(payload_alterar_conteudo.descricao);
        expect(responseGet.body.tipoConteudo).toBe(payload_alterar_conteudo.tipoConteudo);
        expect(responseGet.body.conteudo).toBe(payload_alterar_conteudo.conteudo);
    });

    it('Remover o conteúdo e garantir que foi removido e não existe mais para consulta', async () => {
        // Por fim, você deverá remover o conteúdo e garantir que o mesmo foi removido e não existe mais para consulta.
        const responseDelete = await request(rotaUsers)
            .delete(`/conteudos/${idConteudoCadastrado}`);
        // garante que a deleção ocorreu com sucesso
        expect(responseDelete.status).toBe(200); // should be 204 but it is 200

        // garante que o conteúdo não existe mais usando o mesmo delete
        const responseDeleteSame = await request(rotaUsers)
            .delete(`/conteudos/${idConteudoCadastrado}`);

        expect(responseDeleteSame.status).toBe(404);
        expect(responseDeleteSame.body.error).toBe('Erro ao excluir o conteúdo, o conteúdo não foi encontrado.');

        // garante que o conteúdo não existe mais usando o get

        const responseGet = await request(rotaUsers)
            .get(`/conteudos/${idConteudoCadastrado}`);

        expect(responseGet.status).toBe(404);
        expect(responseGet.body.error).toBe(`O conteúdo com o ID: ${idConteudoCadastrado} não foi encontrado.`);
    });
});