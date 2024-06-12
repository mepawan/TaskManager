const mongoose = require("mongoose");
const dataDatabase = mongoose.createConnection(process.env.MONGO_URL);


const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
	  enum: ['to_do', 'in_progress', 'done'],
    default: 'to_do',
  },
  created_by_id:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Authentication'
},
});

module.exports = dataDatabase.model("Task", taskSchema);
