import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  NIC: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: false,
    default: ''
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
    minlength: 10,
    maxlength: 10
  },
  address: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "admin", "operator"],
    default: "user",
  },
});

// Drop old email index if it exists
userSchema.post('syncIndexes', function() {
  this.collection.dropIndex('email_1').catch(() => {});
});

export default mongoose.model("User", userSchema);