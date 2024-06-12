const taskRoutes = require("express").Router();
const taskModel = require("../Models/TaskModel");

taskRoutes.get("/getUserTasks", async (req, res) => {
  const { _id } = req.user;
  const tasks = await taskModel.find({created_by_id:_id});
  res.json(tasks);
});

taskRoutes.post("/postTask", async (req, res) => {
  const { _id } = req.user;
  const newTask = req.body;
  
  if(newTask.name.trim() === ""){
    res.json({ status:"error",msg: "Missing task name" });
  } else if(newTask.description.trim() === ""){
    res.json({ status:"error",msg: "Missing task descripton" });
  } else if(newTask.status.trim() === ""){
    res.json({ status:"error",msg: "Missing task status" });
  } else {
    if(newTask.status.trim() == 'to_do' || newTask.status.trim() == 'in_progress' || newTask.status.trim() == 'done'){
      try {
        newTask.created_by_id = _id;
        const task = new taskModel(newTask);
        await task.save();
        res.json({ status:"success",msg: "Task added successfully" });
      } catch (e) {
        res.json({ status:"error",msg: e });
      }
    } else {
      res.json({ status:"error",msg: "Invalid status value" });
    }
  }
  
});

taskRoutes.put("/updateTask/:id", async (req, res) => {
  const { _id } = req.user;
  const { id } = req.params;
  const { status } = req.body;
  if(status == 'to_do' || status == 'in_progress' || status == 'done'){
      await taskModel.findOneAndUpdate({ _id: id,created_by_id:_id },{status:status})
        .then(() => {
          res.json({ status:"success",msg: "Task status updated successfully" });
        })
        .catch((err) => {
          res.json({ status:"error",msg: err });
        });
  } else {
    res.json({ status:"error",msg: "Invalid status value" });
  }
});

taskRoutes.delete("/deleteTask/:id", async (req, res) => {
  const { _id } = req.user;
  const { id } = req.params;
  await taskModel.deleteOne({ _id: id,created_by_id:_id })
    .then(() => {
      res.json({ status:"success",msg: "Task Deleted successfully" });
    })
    .catch((err) => {
      res.json({ status:"error",msg: err });
    });
});

module.exports = taskRoutes;
