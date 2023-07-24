const { Schema, model } = require('mongoose');
const paginate = require('mongoose-paginate-v2');
const populate = require('mongoose-autopopulate');

const roomSchema = new Schema({
    users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    roomStatus: { type: String, enum: ['open', 'closed'], default: 'open' },
    roomId: { type: String, required: true, unique: true, trim: true }
}, { timestamps: true });

roomSchema.plugin(paginate);
roomSchema.plugin(populate);

roomSchema.methods.toJSON = function () {
    const room = this.toObject();
    room.id = room._id;
    delete room._id;
    delete room.__v;
    return room;
};

const Room = model('Room', roomSchema);
module.exports = Room;