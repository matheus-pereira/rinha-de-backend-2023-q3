import { Client, Pool } from 'pg';
import { Pessoa } from 'types';
import { v4 as uuidv4 } from 'uuid';

let pool: Pool;

const start = async () => {
    try {
        pool = new Pool({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'rinha_backend',
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
        });

        await pool.query(`
            create table if not exists pessoas (
                id uuid primary key,
                apelido varchar(32) not null unique,
                nome varchar(100) not null,
                nascimento varchar(10) not null,
                stack varchar(32)[]
            )
        `);
    } catch(e) {
        console.error('createRepository', e);
    }
};

const create = async(pessoa: Pessoa) => {
    const text = 'INSERT INTO pessoas(id, apelido, nome, nascimento, stack) VALUES($1, $2, $3, $4, $5) RETURNING id';
    const values = [uuidv4(), pessoa.apelido, pessoa.nome, pessoa.nascimento, pessoa.stack]
    const result = await pool.query(text, values);
    return result.rows[0];
}

const findById = async (id: string) => {
    const text = 'SELECT id, apelido, nome, nascimento, stack FROM pessoas WHERE id = $1';
    const result = await pool.query(text, [id]);
    return result.rows?.[0];
}

const search = async (t: string) => {
    const text = `
        SELECT
            id, apelido, nome, nascimento, stack
        FROM pessoas
        WHERE apelido LIKE $1
            OR nome LIKE $1
            OR array_to_string(stack, ',') LIKE $1
    `;
    const result = await pool.query(text, [`%${t}%`]);
    return result.rows;
}

const count = async () => {
    const client = new Client({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'rinha_backend',
    });
    await client.connect();
    const result = await client.query('SELECT COUNT(*) FROM pessoas');
    await client.end();
    return result.rows[0].count;
}

export { start, create, findById, search, count };