import bcrypt from "bcrypt"; //library
import User from "./../models/User.js";
import jwt from "jsonwebtoken";

const postSignup = async (req, res) => {
  const { name, email, phone, address, password, rePassword } = req.body;

  if (password !== rePassword) {
    return res
      .status(400)
      .json({ success: false, message: "Passwords does not match" });
  }

  if (!name) {
    return res
      .status(400)
      .json({ success: false, message: "Name is required" });
  }

  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Email is required" });
  }

  if (!phone) {
    return res
      .status(400)
      .json({ success: false, message: "Phone is required" });
  }

  if (!address) {
    return res
      .status(400)
      .json({ success: false, message: "Address is required" });
  }

  const salt = bcrypt.genSaltSync(10);

  try {
    const newUser = new User({
      name,
      email,
      phone,
      address,
      password: bcrypt.hashSync(password, salt),
    });

    const savedUser = await newUser.save();

    return res.json({
      success: true,
      message: "Signup successful, please login",
      data: {
        name: savedUser.name,
        email: savedUser.email,
        phone: savedUser.phone,
        address: savedUser.address,
      },
    });
  } catch (error) {
    if (error.message.includes("duplicate key error")) {
      return res.status(400).json({
        success: false,
        message: `${Object.keys(error.keyValue)} '${Object.values(
          error.keyValue
        )}' already exists`,
      });
    }
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// LOGIN
const postLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Email and password is required" });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: "Please signup first before logging in",
    });
  }

  const isPasswordMatch = bcrypt.compareSync(password, user.password);

  const userDetails = {
    email: user.email,
    role: user.role,
    name: user.name,
    _id: user._id,
  };

  if (isPasswordMatch) {
    const jwtToken = jwt.sign(userDetails, process.env.JWT_SECRET);

    res.setHeader("Authorization", `Bearer ${jwtToken}`);
    // res.cookie("jwt", jwtToken, { httpOnly: true, secure: true });
    res.cookie("jwt", jwtToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 60 * 60 * 1000,
    });

    req.session.jwtToken = jwtToken;

    return res.json({
      success: true,
      token: jwtToken,
      data: userDetails,
      message: "Login successful",
    });
  } else {
    return res
      .status(400)
      .json({ success: false, message: "Invalid credentials" });
  }
};

export { postSignup, postLogin };
