const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userSchema = mongoose.Schema(
  {
    name: { type: String, require: true },
    email: { type: String, require: true },
    password: { type: String, require: true },
    picture: {
      type: String,
      require: true,
      default:
        "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=2048x2048&w=is&k=20&c=6hQNACQQjktni8CxSS_QSPqJv2tycskYmpFGzxv3FNs=",
    },
  },
  { timeStamps: true, toJSON: { getters: true } }
);
// userSchema.methods.matchPassword = async (enteredPassword) => {
// const is = await bcrypt.compare(enteredPassword, this.password);
//   if (is) return true;
//   else return false;
// };

userSchema.pre("save", async function (next) {
  const user = this;
  if (this.isModified("password") || this.isNew()) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    // this.password = hash;
    next();
  } else return next();
});

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
