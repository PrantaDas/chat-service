const User = require("../db/schemas/user.schema");
const { default: generateAuthToken } = require("../utils/generateAuthToken");

const createAllowed = new Set(['name', 'email', 'password']);
const updateAllowed = new Set(['name', 'email', 'password', 'oldPassword', 'newPassword']);

const register = async (req, res) => {
    try {
        if (!req.body.email || !req.body.password) return res.status(400).send({ message: 'Email and password are required' });
        const isValid = Object.keys(req.body).every((key) => createAllowed.has(key));
        if (!isValid) return res.status(400).send({ message: 'Bad request' });
        const user = new User(req.body);
        await user.save();
        return res.status(201).send(user);
    }
    catch (err) {
        console.log(err);
        return res.status(500).send({ message: err.message || 'Something went wrong' });
    }
};

const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).send({ message: 'Email and password are required' });
        const user = await User.findByCreds(email, password);
        if (!user) return res.status(404).send({ message: 'User not found' });
        const token = generateAuthToken(user._id);
        return res.status(200).cookie('token', token, { httpOnly: true, sameSite: 'None', secure: true, expires: new Date(Date.now() + 259200000) }).send(user);
    }
    catch (err) {
        console.log(err);
        return res.status(500).send({ message: err.message || 'Something went wrong' });
    }
};

const signOut = async (req, res) => {
    try {
        res.clearCooke('token', { httpOnly: true, sameSite: 'None', secure: true, expres: new Date(Date.now()) });
        return res.status(200).send({ message: 'Logout successful' });
    }
    catch (err) {
        console.log(err);
        return res.status(500).send({ message: err.message || 'Something went wrong' });
    }
};


const me = async (req, res) => {
    try {
        return res.status(200).send(req.user);
    }
    catch (err) {
        console.log(err);
        return res.status(500).send({ message: err.message || 'Something went wrong' });
    }
};

const getOne = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findOne({ _id: id });
        if (!user) return res.status(404).send({ message: 'User not found' });
        return res.status(200).send(user);
    }
    catch (err) {
        console.log(err);
        return res.status(500).send({ message: err.message || 'Something went wrong' });
    }
};


const updateOwn = async (req, res) => {
    try {
        const isValid = Object.keys(req.body).every((key) => updateAllowed.has(key));
        if (!isValid) return res.status(400).send({ message: 'Bad request' });
        let user;
        if (req?.body?.olPassword) {
            user = await User.findByCreds(req.user.email, req.body.olPassword);
            user.password = req.body.newPassword;
        }
        else user = await User.findOne({ email: req.user.email });
        if (!user) return res.status(404).send({ message: 'User not found' });
        Object.keys(req.body).forEach((key) => user[key] = req.body[key]);
        await user.save();
        return res.status(200).send(user);
    }
    catch (err) {
        console.log(err);
        return res.status(500).send({ message: err.message || 'Something went wrong' });
    }
};

const getAll = async (req, res) => {
    try {
        const users = await User.find({ ...req.query || {} });
        if (!users) return res.status(404).send({ message: 'No User found' });
        return res.status(200).send(users);
    }
    catch (err) {
        console.log(err);
        return res.status(500).send({ message: err.message || 'Something went wrong' });
    }
};

const deleteOne = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findOne({ _id: id });
        if (!user) return res.status(404).send({ message: 'User not found' });
        await user.deleteOne();
        return res.status(200).send({ message: 'User deleted successfully' });
    }
    catch (err) {
        console.log(err);
        return res.status(500).send({ message: err.message || 'Something went wrong' });
    }
};

module.exports = { register, signIn, me, getOne, updateOwn, getAll, deleteOne, signIn };