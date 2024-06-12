import React, { useEffect, useState,useMemo } from "react";
import { AiFillDelete } from "react-icons/ai";
//import DarkMode from "./DarkMode/Darkmode";
import { BiLogOut } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import "./styles/task.css";
import Aos from "aos";
import axios from "axios";
import "aos/dist/aos.css";
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import 'bootstrap/dist/css/bootstrap.min.css';

const Task = ({ toast, tasks, setTasks }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusQuery,setStatusQuery] = useState("");
  const [task, setTask] = useState({
    name: "",
    description: "",
    status: "",
  });

  axios.defaults.withCredentials = true;
  useEffect(() => {
    Aos.init({ duration: 1000 });
    axios
      .get(`${process.env.REACT_APP_API_URL}task/getUserTasks`)
      .then((res) => {
        setTasks(res.data);
      })
      .catch((err) => console.log(err));
  }, [setTasks]);

  function handleOnchange(e) {
    e.preventDefault();
    setTask({
      ...task,
      [e.target.name]: e.target.value,
    });
  }

  const addTask = () => {
    if (task.name.trim() === "" ) {
      toast.error("Please enter task name");
      return;
    }
    if (task.description.trim() === "" ) {
      toast.error("Please enter task description");
      return;
    }
    if (task.status.trim() === "" ) {
      toast.error("Please select task status");
      return;
    }
    
    const newTask = task;
    axios
      .post(`${process.env.REACT_APP_API_URL}task/postTask`, newTask)
      .then((res) => {
        if(res.data.status === "success"){
          setTasks([...tasks, newTask]);
          console.log(tasks);
          setTask({ name: "", description: "", status: "" });
          toast.success(res.data.msg);
        } else {
          toast.error(res.data.msg);
        }
      }).catch((err) => {
        toast.error(err);
      }); 
  };

  const removeTask = (id) => {
    axios
      .delete(`${process.env.REACT_APP_API_URL}task/deleteTask/${id}`)
      .then((res) => {
        if(res.data.status === "success"){
          setTasks(tasks.filter((eachTask) => id !== eachTask._id));
          toast.success(res.data.msg);
        } else {
          toast.error(res.data.msg);
        }
      }).catch((err) => {
        toast.error(err);
      });  
  };

  const confirmDelete = (id) => {
    confirmAlert({
      title: 'Confirm Delete ?',
      message: 'Are you sure to delete this task?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => removeTask(id)
        },
        {
          label: 'No',
        }
      ]
    });
  };
  const updaateTaskStatus = (e,indx) => {
    let tempTasks = [...tasks];
    tempTasks[indx].status = e.target.value;
    axios
      .put(`${process.env.REACT_APP_API_URL}task/updateTask/${tempTasks[indx]._id}`,{status:e.target.value})
      .then((res) => {
        if(res.data.status === "success"){
          setTasks(tempTasks);
          toast.success(res.data.msg);
        } else {
          toast.error(res.data.msg);
        }
      }).catch((err) => {
        toast.error(err);
      }); 
  };

  const filterTasks = useMemo(() => {
    return tasks.filter((eachItem) => {
      return (eachItem.name.toLowerCase().includes(searchQuery.toLowerCase()) || eachItem.description.toLowerCase().includes(searchQuery.toLowerCase())) && eachItem.status.toLowerCase().includes(statusQuery.toLowerCase());
    });
  }, [tasks, searchQuery,statusQuery]);
  function logOut() {
    axios
      .get(`${process.env.REACT_APP_API_URL}auth/logout`)
      .then((res) => {
        window.sessionStorage.setItem("loggedIn", "");
        window.sessionStorage.setItem("username", "");
        navigate("/");
      })
      .catch((err) => console.log(err));
  }

  return (
    <div className="home-body-conatiner tasks-page" data-aos="zoom-in">
      <div className="header-wrap">
          <Container fluid>
            <Row>
              <Col sm={4}><h1>Task Manager</h1></Col>
              <Col sm={8}>
                  <h4 id="auth-name"> - {window.sessionStorage.getItem("username")}</h4>
                  <button className="nav-icon skull logout" onClick={logOut}>
                    <BiLogOut size={22} color="red" />
                  </button>
              </Col>
            </Row>
          </Container>
      </div>
      
      <div className="add-div">
      <Container fluid>
        <Row>
          <Col sm={3}>
          <input
            type="text"
            placeholder="Enter task"
            name="name"
            value={task.name || ""}
            onChange={(e) => handleOnchange(e)}
          />
          </Col>
          <Col sm={3}>
          <input
            type="text"
            placeholder="Enter task description"
            name="description"
            value={task.description || ""}
            onChange={(e) => handleOnchange(e)}
          />
          </Col>
          <Col sm={3}>
          <select
            name="status"
            placeholder="Select Status"
            value={task.status}
            onChange={(e) => handleOnchange(e)}
          >
            <option value="">Select Status</option>
            <option value="to_do">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          </Col>
          <Col sm={3}>
          <button id="add-bt" onClick={addTask}>
            Add Task
          </button>
          </Col>
      </Row>
        </Container>
      </div>
      <main className="task-body" data-aos="zoom-out">
        <h3>Task List</h3>

        <div className="search-bar">
          <h4>Filter:</h4>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            type="search"
            placeholder="Search"
          />
          <select
            value={statusQuery}
            onChange={(e) => setStatusQuery(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="to_do">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>

        </div>

        <div className="cur-task-list" data-aos="zoom-in">
            <Container fluid>
              <Row className="thead">
                <Col sm={4}>Task</Col>
                <Col sm={4}>Description</Col>
                <Col sm={3}>Status</Col>
                <Col sm={1}>Action</Col>
              </Row>
              {filterTasks.map((eachTask,indx) => (
                  <Row>
                  <Col sm={4}>{eachTask.name}</Col>
                  <Col sm={4}>{eachTask.description}</Col>
                  <Col sm={3}>
                      <select
                          value={eachTask.status}
                          onChange={(e) => updaateTaskStatus(e,indx)}
                        >
                          <option value="to_do">To Do</option>
                          <option value="in_progress">In Progress</option>
                          <option value="done">Done</option>
                        </select>
                  </Col>
                  <Col sm={1}>
                      <button
                          className="task-remove"
                          onClick={() => confirmDelete(eachTask._id)}
                        >
                          <AiFillDelete size={20} color="#FF6969" />
                        </button>
                  </Col>
                </Row>
              ))}
            </Container>
        </div>
      </main>
    </div>
  );
};

export default Task;
