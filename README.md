
# TASK MANAGER - MERN 

 The task manager app is simple task management application. The application will allow users to create, update, and delete tasks. Tasks should have a title, description, and a status (e.g., "To Do," "In Progress," "Done"). Users should also be able to view a list of tasks and filter them by status.

# Intrtoduction

 Welcome to our Task Manager App – your all-in-one solution for efficient task management. This application is designed to enhance your productivity by providing a unified platform for managing your daily activities. Whether you're an individual striving for personal organization or part of a collaborative team, our app is here to simplify your workflow.
# Features
# Task Management :

Anyone can register/login and manage his tasks.

Create task, update task status and  delete tasks with ease.

Search tasks using keyword  and status. keyword filters tasks according to task name and task description

# Notes - Functionality :

Capture ideas, thoughts, and important information effortlessly.

Edit and organize notes with rich text formatting and multimedia attachments.

## Technologies Used

- **Frontend:**
  - [HTML5](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5)
  - [CSS3](https://developer.mozilla.org/en-US/docs/Web/CSS)
  - [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
  - [React.js](https://reactjs.org/)

- **Backend:**
  - [Node.js](https://nodejs.org/)
  - [Express](https://expressjs.com/)

- **Database:**
  - [MongoDB](https://www.mongodb.com/)

- **Other Tools:**
  - [Git](https://git-scm.com/)
  - [GitHub](https://github.com/)
  - [VSCode](https://code.visualstudio.com/)
    
# Getting Started
## Prerequisites

Before you begin, ensure you have met the following requirements:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js; npm v6.14.6 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (v4.0 or higher)
- [Your preferred web browser](https://www.google.com/chrome/)

> Note: Make sure to install the specified versions or higher to avoid compatibility issues.

To check if you have Node.js and npm installed, run the following commands in your terminal:

```bash
node --version
npm --version
```
## How To Run
Create the file `BackEnd/.env` and `FrontEnd/.env`with with following details:

**FrontEnd**
```
REACT_APP_API_URL = your backend api with port
```
**BackEnd**
```
MONGO_URL = your mongoDb url either from atlas or from localhost shell
FRONTEND_DOMAIN = you react app url with port
SESSION_SECRET = anything you want
JWT_SECRET_KEY = anything you want
```
Start server i.e., BackEnd:
```
cd Task-Manager/BackEnd
npm install
npm start
```
Start Client i.e., FrontEnd:
```
cd Task-Manager/FrontEnd
npm install
npm start or npm run dev
```

# Thank You





