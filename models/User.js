const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    conformpassword: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false
    },
    img:{type:String},
  },
  {
    timestamps: true,
  }
);
const UserModel=mongoose.model("User", UserSchema);

module.exports = UserModel;