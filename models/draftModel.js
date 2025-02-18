const { Schema, model,mongoose } = require('mongoose');
const draftSchema = new Schema({
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "companies"
    },
    branchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "branches"
    },
    party: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "parties"
    },
    generatedBy: {
        type : String,
        required : true
    },
    cartItems : {
        type : Array,
        required : true
    },
    totalAmount : {
        type : Number,
        required : true
    },
    totalQuantity : {
        type : Number,
        required : true
    },
    discount : {
        type : Number,
        required : true
    },
    paid: {
        type: Number,
        default: 0,
    },
    due: {
        type: Number,
        default: 0,
    },
    payment : {
        type : String,
        required : true
    },
    date : {
        type : Object,
        required : true
    },
}, { timestamps: true })

module.exports = model("drafts", draftSchema);