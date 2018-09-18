const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys.config");
const User = require("../models/user.model");

const errorHandler = require("../utils/errorHandler.util");

module.exports.login = async function (req, res) {
  const candidate = await User.findOne({
    email: req.body.email
  });

  if (candidate) {
    // password verification, the email exists
    const passwordResult = bcrypt.compareSync(
      req.body.password,
      candidate.password
    );
    if (passwordResult) {
      // password is ok, can generate a token
      const token = jwt.sign({
          email: candidate.email,
          userId: candidate._id
        },
        keys.jwt, {
          expiresIn: 3600
        }
      );
      res.status(200).json({
        token: `Bearer ${token}`
      });
    } else {
      res.status(401).json({
        message: "passwords not correct, try again"
      });
    }
  } else {
    // user with the email not exists, error
    res.status(404).json({
      message: `user with ${req.body.email} not exists`
    });
  }
};

module.exports.register = async function (req, res) {
  // required email and password
  const candidate = await User.findOne({
    email: req.body.email
  });
  if (candidate) {
    // user is defined, error
    res.status(409).json({
      message: "user with the email have been created. try another email"
    });
  } else {
    // not user with the email, can create a new user
    const salt = bcrypt.genSaltSync(10);
    const passwordGen = req.body.password;
    const user = new User({
      email: req.body.email,
      password: bcrypt.hashSync(passwordGen, salt)
    });
    try {
      await user.save();
      res.status(201).json({
        message: "account has been created",
        user
      });
    } catch (error) {
      // error
      errorHandler(res, error);
    }
  }
};