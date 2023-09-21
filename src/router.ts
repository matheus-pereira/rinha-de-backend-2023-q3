import { Router } from "express";
import { validate as isValidUUID  } from "uuid";
import { count, create, findById, search } from "./repository";
import { validate } from "./validate";
import { Pessoa } from "types";

const createRouter = () => {
    const router = Router();

    router.post('/pessoas', validate, async (req, res) => {
        try {
            const { id } = await create(req.body as Pessoa);
            res.status(200).setHeader('Location', `/pessoas/${id}`).end();
        } catch (e) {
            res.status(422).end();
        }
    });

    router.get('/pessoas/:id', async (req, res) => {
        const { id } = req.params;

        if (!isValidUUID(id)) {
            res.status(404).end();
            return;
        }

        const result = await findById(id);
        if (!result) {
            res.status(404).end();
            return;
        }

        res.status(200).send(result);
    });

    router.get('/pessoas', async (req, res) => {
        const { t } = req.query;
        if (!t) {
            res.status(400).end();
            return;
        }

        const result = await search(t as string);
        res.status(200).send(result);
    });

    router.get('/contagem-pessoas', async (_, res) => {
        const result = await count();
        res.status(200).send(result);
    });

    return router;
}

export { createRouter };