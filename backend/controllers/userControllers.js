import { User } from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import TryCatch from "../utils/TryCatch.js";
import bcrypt from "bcrypt";

export const registerUser = TryCatch(async (req, res) => {
  const { name, email, password } = req.body;

  let user = await User.findOne({ email });

  if (user)
    return res.status(400).json({
      message: "User Already Exist",
    });

  const hashPassword = await bcrypt.hash(password, 10);

  user = await User.create({
    name,
    email,
    password: hashPassword,
  });

  generateToken(user._id, res);

  res.status(201).json({
    user,
    message: "User Registered",
  });
});

export const loginUser = TryCatch(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user)
    return res.status(400).json({
      message: "No User Exist",
    });

  const compPassword = await bcrypt.compare(password, user.password);

  if (!compPassword)
    return res.status(400).json({
      message: "Wrong Password",
    });

  generateToken(user._id, res);

  res.status(200).json({
    user,
    message: "User LoggedIn",
  });
});

export const myProfile = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id);

  res.json(user);
});

export const logoutUser = TryCatch(async (req, res) => {
  res.cookie("token", "", { maxAge: 0 });

  res.json({
    message: "Logged Out Successfully",
  });
});

export const saveToPlaylist = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user.playlist.includes(req.params.id)) {
    const index = user.playlist.indexOf(req.params.id);

    user.playlist.splice(index, 1);

    await user.save();

    return res.json({
      message: "Removed from playlist",
    });
  }

  user.playlist.push(req.params.id);

  await user.save();

  return res.json({
    message: "Added to playlist",
  });
});
