const mongoose = require("mongoose");

const CartSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    products: [
      {
        productId: {
          type: String,
          // required: true,
        },
        quantity: {
          type: Number,
          default: 0,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);
const CartModel = mongoose.model("Cart", CartSchema);

module.exports = CartModel;
