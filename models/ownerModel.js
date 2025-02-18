const { Schema, model,mongoose } = require('mongoose');
const jwt = require ("jsonwebtoken");
const bcrypt = require ("bcrypt");
const crypto = require ("crypto");

const ownerSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name!']
    },
    email: {
        type: String,
        required: [true, 'Please enter your email!'],

    },
    password: {
        type: String,
        required: [true, 'Please enter your password!'],
        minLength: [6, 'Password must be at least 6 characters'],
        select: false,
    },
    role: {
        type: String,
        default: 'owner',
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "companies"
    },
    branchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "branches"
    },
    status: {
        type: String,
        default: 'Pending'
    },
    image: {
        type: String,
        default: ''
    },
    note: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
}, { timestamps: true })

ownerSchema.index({
    name: 'text',
    email: 'text'
}, {
    weights: {
        name: 5,
        email: 4,
    }
})

ownerSchema.methods.getResetToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetToken;
}


module.exports = model("owners", ownerSchema);