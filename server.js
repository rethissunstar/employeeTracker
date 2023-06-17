
// const inquirer = require('inquirer');
// const express = require('express');
// // Import and require mysql2 and inquirer
// const mysql = require('mysql2');


// const PORT = process.env.PORT || 3001;
// const { default: Choices } = require('inquirer/lib/objects/choices');
// const app = express();

// // Express middleware
// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());

// // Connect to database
// const db = mysql.createConnection(
//   {
//     host: 'localhost',
//     // MySQL username,
//     user: 'root',
//     // TODO: Add MySQL password
//     password: 'theDragon@123',
//     database: 'employeeTracker_db'
//   },
//   console.log(`Connected to the employeeTracker database.`)
// );

// inquirer
//   .prompt([
//     {
//         type: 'checkbox',
//         message: 'What would you like to do? ',
//         name: 'Main Choice',
//         choices: ['View', 'Add', 'Update']

//     }
//   ])
//   .then((response) =>
//     console.log(response));
  
const inquirer = require('inquirer');
const express = require('express');
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'theDragon@123',
  database: 'employeeTracker_db'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ' + err.stack);
    return;
  }
  console.log('Connected to the employeeTracker database.');

  inquirer
    .prompt([
      {
        type: 'checkbox',
        message: 'Employee Tracker: What would you like to do?',
        name: 'MainChoice',
        choices: ['View', 'Add', 'Update']
      }
    ])
    .then((response) => {
      console.log(response);

      if (response.MainChoice.includes('View')) {
        console.log('You chose to view');
        inquirer
          .prompt([
            {
              type: 'checkbox',
              message: 'Employee Tracker: What would you like to see?',
              name: 'ViewChoice',
              choices: ['Departments', 'Employees', 'Roles']
            }
          ])
          .then((response) => {
            if (response.ViewChoice.includes('Departments')) {
              console.log('You chose to view Departments');
              db.query('SELECT * FROM department', (err, results) => {
                if (err) {
                  console.log(err);
                  return;
                }
                console.log('Departments:');
                console.table(results);
                //db.end(); // Close the database connection after displaying the departments
              });
            }
            if (response.ViewChoice.includes('Employees')) {
              console.log('You chose to view Employees');
              db.query('SELECT * FROM employee_data', (err, results) => {
                if (err) {
                  console.log(err);
                  return;
                }
                console.log('Employees:');
                console.table(results);
                //db.end(); // Close the database connection after displaying the departments
              });
            }
            if (response.ViewChoice.includes('Roles')) {
              console.log('You chose to view Roles');
              db.query('SELECT * FROM roles', (err, results) => {
                if (err) {
                  console.log(err);
                  return;
                }
                console.log('Roles:');
                console.table(results);
                //db.end(); // Close the database connection after displaying the departments
              });
            }
          });
      }

      if (response.MainChoice.includes('Add')) {
        console.log('You chose to add');
        inquirer
          .prompt([
            {
              type: 'checkbox',
              message: 'Employee Tracker: What would you like to Add to?',
              name: 'AddChoice',
              choices: ['Departments', 'Employees', 'Roles']
            }
          ])
          .then((response) => {
            if (response.AddChoice.includes('Departments')) {
              console.log('You chose to add to Departments');
              inquirer
                .prompt([
                  {
                    type: 'input',
                    message: 'What is the name of the department?',
                    name: 'name'
                  }
                ])
                .then((response) => {
                  console.log(response);
                  db.query('INSERT INTO department SET ?', response, (err, results) => {
                    if (err) {
                      console.log('Error occurred while inserting into departments: ' + err);
                      return;
                    }
                    console.log('Department added successfully!');
                  });
                });
            }
            if (response.AddChoice.includes('Employees')) {
              console.log('You chose to add to Employees');
              inquirer
              .prompt([
                {
                  type: 'input',
                  message: 'What is the first name of the employee?',
                  name: 'firstName'
                },
                {
                  type: 'input',
                  message: 'What is the last name of the employee?',
                  name: 'lastName'
                },
                {
                  type: 'input',
                  message: 'What is the role id of the employee?',
                  name: 'role_id'
                },
                {
                  type: 'input',
                  message: 'Who is the manager of the employee?',
                  name: 'manager'
                }
              ])
              .then((response) => {
                console.log(response);
                const { firstName, lastName, role_id, manager } = response;
                const values = [firstName, lastName, role_id, manager];
                db.query('INSERT INTO employee_data (firstName, lastName, role_id, manager) VALUES (?, ?, ?, ?)', values, (err, results) => {
                  if (err) {
                    console.log('Error occurred while inserting into departments: ' + err);
                    return;
                  }
                  console.log('Department added successfully!');
                });
              });
            }
            if (response.AddChoice.includes('Roles')) {
              console.log('You chose to add to Roles');
              // Code to add roles
            }
          });
      }

      if (response.MainChoice.includes('Update')) {
        console.log('You chose to update');
        // Code for updating data
      }
    })
    .catch((err) => {
      console.error('Error occurred while prompting: ' + err);
    });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});