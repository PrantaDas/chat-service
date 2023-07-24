const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');
const paginate = require('mongoose-paginate-v2');

const userSchema = new Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, trim: true },
    socketId: { type: String, trim: true, unique: true },
    status: { type: String, enum: ['active', 'deactive'], default: 'deactive' }
}, { timestamps: true });

userSchema.methods.toJSON = function () {
    const user = this.toObject();
    user.id = user._id;
    delete user._id;
    delete user.password;
    delete user.__v;
    return user;
};

userSchema.plugin(paginate);

userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 10);
    }
    next();
});

userSchema.statics.findByCreds = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error('User not found');
    const isValidPass = await bcrypt.compare(password, user.password);
    if (!isValidPass) throw new Error('Pass validation failed');
    return user;
};

const User = model('User', userSchema);
module.exports = User;