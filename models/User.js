const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Add bcryptjs

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['patient', 'doctor', 'admin'],
    default: 'patient',
  },
  profile: {
    age: Number,
    gender: String,
    contact: String,
    specialization: String, // Only for doctors
    bio: String,
  },
}, { timestamps: true });

// Pre-save hook to hash password
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10); // Hash with 10 salt rounds
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
