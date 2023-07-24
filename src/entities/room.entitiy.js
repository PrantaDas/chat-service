const createAllowed = new Set(['users', 'roomStatus', 'roomId']);
const { v4 } = require('uuid');

const createRoom = async (req, res) => {
    try {
        if (!users) return res.status(400).send({ message: 'Bad request' });
        const isValid = Object.keys(req.body).every((key) => createAllowed.has(key));
        if (isValid) return res.status(400).send({ message: 'Bad request' });

    }

    catch (err) {
        console.log(err);
        return res.status(500).send({ message: err.message || 'Something went wrong' });
    }
};