const mongoose = require("mongoose");

const authDatabase = mongoose.createConnection(process.env.MONGO_URL);
const schema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    default: null,
  }

});

module.exports = authDatabase.model("Authentication", schema);
