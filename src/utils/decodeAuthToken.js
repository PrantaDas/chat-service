import User from '../db/schemas/user.schema';

const jwt = require('jsonwebtoken');

export default async function decodeAuthToken(token) {
    try {
        if (!token) return;
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findOne({ _id: decoded.id });
        if (!user) throw new Error('User not found');
        return user;
    }
    catch (err) {
        console.log(err);
    }
};
