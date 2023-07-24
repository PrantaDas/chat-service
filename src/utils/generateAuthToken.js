const jwt = require('jsonwebtoken');

export default async function generateAuthToken(id) {
    try {
        if (!id) return;
        const token = jwt.sign(id, process.env.SECRET_KEY);
        if (!token) throw new Error('Invalid token');
        return token;
    }
    catch (err) {
        console.log(err);
        throw new Error('Failed to generate token');
    }
}
