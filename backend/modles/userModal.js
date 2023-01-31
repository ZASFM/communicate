const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const userModal = mongoose.Schema({
   name: {
      type: String,
      required: true,
   },
   email: {
      type: String,
      required: true,
      unique: true,
   },
   password: {
      type: String,
      required: true
   },
   pic: {
      type: String,
      default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
   }
}, {
   timestamps: true
})

userModal.pre('save', async function (next) {
   const salt = await bcryptjs.genSalt(10);
   this.password = await bcryptjs.hash(this.password, salt);
   next();
})

userModal.methods.matchPassword = async function (passwordInput) {
   const correctPassword = await bcryptjs.compare(passwordInput, this.password);
   return correctPassword;
}

const User = mongoose.model('User', userModal);
module.exports = User;