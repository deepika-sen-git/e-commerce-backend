const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  if(!name.trim() || !email.trim() || !password.trim() || !role.trim() ){
      return  res.status(201).json({ success:false, message: "All fields required" });
};
  
  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashed,
    role,
  });

  res.status(201).json({ token: generateToken(user) });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

if( !email || !password ){
    return  res.status(201).json({ success:false, message: "All fields required" });
};
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: "Invalid credentials" });

  res.json({ token: generateToken(user) });
};
