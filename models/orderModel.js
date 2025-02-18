const { Schema, model, mongoose } = require("mongoose");
const orderSchema = new Schema(
  {
    orderNo: {
      type: Number,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "companies",
    },
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "branches",
    },
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "transactions",
    },
    party: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "parties",
    },
    generatedBy: {
      type: String,
      required: true,
    },
    cartItems: {
      type: Array,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    totalQuantity: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    paid: {
      type: Number,
      default: 0,
    },
    due: {
      type: Number,
      default: 0,
    },
    payment: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model("orders", orderSchema);
