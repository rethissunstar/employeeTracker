const express = require('express');
// Import and require mysql2 and inquirer
const mysql = require('mysql2');
const inquirer = require('inquirer');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // TODO: Add MySQL password
    password: 'theDragon@123',
    database: 'employeeTracker_db'
  },
  console.log(`Connected to the employeeTracker database.`)
);

inquirer
  .prompt([
    {
        type: 'checkbox',
        message: 'What would you like to do? ',
        name: 'Main Choice',
        choices: ['View', 'Add', 'Update']

    }
  ])
  .then((response) =>
    console.log(response));
  

