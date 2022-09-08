import User from "../models/User.js";
import { generateId } from "../helpers/generateId.js";
import generateJwt from "../helpers/generateJwt.js";
import { emailForgotPassword, emailRegister } from "../helpers/emails.js";
const register = async (req, res) => {
  //Envitar registros duplicados
  const { email } = req.body;
  const userExist = await User.findOne({ email: email });
  if (userExist) {
    const error = new Error("User already registered");
    return res.status(400).json({ msg: error.message });
  }

  try {
    const user = new User(req.body);
    user.token = generateId();
    await user.save();
    //Enviar ell email de confirmacion
    emailRegister({ email: user.email, name: user.name, token: user.token });
    res.json({
      msg: "User created correctly, check your email to confirm your account",
    });
  } catch (error) {}
};

const authUser = async (req, res) => {
  const { email, password } = req.body;
  //Comprobar si el usuario existe,
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error("The user not exist");
    return res.status(404).json({ msg: error.message });
  }
  //Si esta confirmado
  if (!user) {
    const error = new Error("Your Account hasn't been confirmed");
    return res.status(404).json({ msg: error.message });
  }
  //Comprobar passoword
  if (await user.checkPassword(password)) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateJwt(user._id),
    });
  } else {
    const error = new Error("The password is wrong");
    return res.status(403).json({ msg: error.message });
  }
};

const confirm = async (req, res) => {
  const { token } = req.params;
  const confirmUser = await User.findOne({ token });
  if (!confirmUser) {
    const error = new Error("Invalid Token");
    return res.status(403).json({ msg: error.message });
  }
  try {
    confirmUser.confirmated = true;
    confirmUser.token = "";
    await confirmUser.save();
    res.json({ msg: "User has been Confirmed" });
  } catch (error) {
    console.log(error);
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email });
  if (!user) {
    const error = new Error("The user not exist");
    return res.status(400).json({ msg: error.message });
  }

  try {
    user.token = generateId();
    await user.save();

    //Sent Email
    emailForgotPassword({
      email: user.email,
      name: user.name,
      token: user.token,
    });
    res.json({ msg: "We have sent an email with the instructions" });
  } catch (error) {
    console.log(error);
  }
};

const checkToken = async (req, res) => {
  const { token } = req.params;

  const validToken = await User.findOne({ token });
  if (validToken) {
    return res.json({ msg: "Valid Token, User Exist" });
  } else {
    const error = new Error("Invalid Token");
    return res.status(403).json({ msg: error.message });
  }
};
const newPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  const user = await User.findOne({ token });
  if (user) {
    user.password = password;
    user.token = "";
    await user.save();
    res.json({ msg: "Password has been successfully changed" });
  } else {
    const error = new Error("Invalid Token");
    return res.status(403).json({ msg: error.message });
  }
};

const profile = async (req, res) => {
  const { user } = req;

  res.json(user);
};
export {
  register,
  authUser,
  confirm,
  forgotPassword,
  checkToken,
  newPassword,
  profile,
};
