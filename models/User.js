import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
      trim: true,
    },
    password: {
      type: String,
      require: true,
      trim: true,
    },
    email: {
      type: String,
      require: true,
      trim: true,
      unique: true,
    },

    token: {
      type: String,
    },
    confirmated: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

//Este pre significa que despues de guardar en la bd el usuario ejecute este script
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    //esto es para que si el usuario quiere modificar el usuario no se hashe el password de nuevo. tipo no hashee lo hasheado y next te manda al siguiente middleware
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.checkPassword = async function (passowordForm) {
  return await bcrypt.compare(passowordForm, this.password);
};
const User = mongoose.model("User", userSchema);

export default User;
