import { RequestHandler } from 'express';
import Joi from 'joi';

const schema = Joi.object({
    apelido: Joi.string().max(32).required(),
    nome: Joi.string().max(100).required(),
    nascimento: Joi.date().iso().required(),
    stack: Joi.array().items(Joi.string().max(32).required()).allow(null)
});

const validate: RequestHandler = (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
        res.status(422).end();
        return;
    }
    next();
}

export { validate };