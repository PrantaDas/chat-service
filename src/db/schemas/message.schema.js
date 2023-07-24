const { Schema, model } = require('mongoose');
const paginate = require('mongoose-paginate-v2');
const populate = require('mongoose-autopopulate');

const messageSchema = new Schema({
    from: { type: Schema.Types.ObjectId, ref: 'User', required: true, description: 'User is required' },
    message: { type: String, required: true, description: 'Message is required' },
    status: { type: String, enum: ['read', 'unread'], default: 'unread' },
    room: { type: Schema.Types.ObjectId, ref: 'Room', required: true, description: 'Room is required' }
}, { timestamps: true });

messageSchema.plugin(paginate);
messageSchema.plugin(populate);

messageSchema.methods.toJSON = function () {
    const message = this.toObject();
    message.id = message._id;
    delete message._id;
    delete message.__v;
    return message;
};

const Message = model('Message', messageSchema);
module.exports = Message;