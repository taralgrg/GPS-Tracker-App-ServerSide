const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// schema tells mongoose thes structure the type of data every user will have
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

//function to run before we save a user into a DB.
// instead of using arrow function " () => {} ", we use a
// function because we want to use 'this' refering to the object which we can
// access using function(), if not than 'this' refers to the context outside of this function.
userSchema.pre("save", function(next) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }

  // 10 is reference to how complex salt is.
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }

    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(candidatePassword) {
  const user = this;
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
      if (err) {
        return reject(err);
      }

      if (!isMatch) {
        return reject(false);
      }

      resolve(true);
    });
  });
};

// this call associates schema with mongoose library.
mongoose.model("User", userSchema);
