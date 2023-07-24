import decodeAuthToken from '../utils/decodeAuthToken';

const jwt = require('jsonwebtoken');

export default async function auth(req, res, next) {
    try {
        const cookie = req?.cookies?.token;
        if (!cookie) return res.status(401).send({ message: 'Unauthorized' });
        const user = await decodeAuthToken(cookie);
        if (!user || user.status === 'deactive') return res.status(401).send({ message: 'Unauthorized' });
        req.user = user;
        next();
    }
    catch (err) {
        conosle.log(err);
        return res.status(500).send({ message: 'Something went wrong' });
    }
};