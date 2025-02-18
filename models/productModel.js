const { Schema, model, mongoose } = require("mongoose");

const productSchema = new Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "owners",
    },
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "branches",
    },
    purchase_price: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      default: 0,
    },
    unit: {
      type: String,
      default: "Pcs",
    },
    serial: {
      type: Array,
    },
    count: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      required: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "companies",
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

productSchema.index(
  {
    name: "text",
    category: "text",
  },
  {
    weights: {
      name: 5,
      category: 4,
    },
  }
);

module.exports = model("products", productSchema);
