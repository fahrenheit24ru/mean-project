const jwtStrategy = require("passport-jwt").Strategy;
const extractJwt = require("passport-jwt").ExtractJwt;
const keys = require("../config/keys.config");
const mongoose = require("mongoose");
const User = mongoose.model("users");
const options = {
  jwtFromRequest: extractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: keys.jwt
};

module.exports = passport => {
  passport.use(
    new jwtStrategy(options, async (payload, done) => {
      const user = await User.findById(payload.userId).select("email id");
      try {
        if (user) {
          done(null, user);
        } else {
          // user not found
          done(null, false);
        }
      } catch (error) {
        console.log(error);
      }
    })
  );
};