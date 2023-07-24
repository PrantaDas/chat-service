const createAllowed = new Set(['users', 'roomStatus', 'roomId']);
const { v4 } = require('uuid');
const Room = require('../db/schemas/room.schema');

const createRoom = async (req, res) => {
    try {
        if (!req?.body?.users) return res.status(400).send({ message: 'Bad request' });
        const isValid = Object.keys(req.body).every((key) => createAllowed.has(key));
        if (isValid) return res.status(400).send({ message: 'Bad request' });
        const roomId = v4();
        req.body.roomId = roomId;
        const room = new Room(req.body);
        await room.save();
        return res.status(200).send(room);
    }

    catch (err) {
        console.log(err);
        return res.status(500).send({ message: err.message || 'Something went wrong' });
    }
};

const deleteRoom = async (req, res) => {
    try {
        const { id } = req.params;
        const room = await Room.findOne({ _id: id });
        if (!room) return res.status(404).send({ message: 'Room not found' });
        await room.deleteOne();
        return res.status(200).send({ message: 'Room deleted' });
    }
    catch (err) {
        console.log(err);
        return res.status(500).send({ message: err.message || 'Something went wrong' });
    }
};

module.exports = { createRoom, deleteRoom };