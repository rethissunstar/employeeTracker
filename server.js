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

// let startLoop = 0;
// inquirer
// .prompt([
//   {
//     type: 'checkbox',
//     message: 'Would you like to edit the database?',
//     name: 'activeChoice',
//     choices: ['yes, no']
//   }
// ])
// .then((response) =>{
// if (response == 'yes'){
//   for (startLoop=0; startLoop < 1;){

//   }
// }
//     }
// )
// for (startLoop = 0; startLoop < 1;){

db.connect((err) => {
  console.log('Connected to the employeeTracker database.');

  inquirer
    .prompt([
      {
        type: 'checkbox',
        message: 'Employee Tracker: What would you like to do?',
        name: 'MainChoice',
        choices: ['View', 'Add', 'Update', 'exit']
      }
    ])
    .then((response) => {
      console.log(response);
      if (response.MainChoice.includes('exit')) {
        startLoop = 1;
        db.end();
      }

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
                db.end();
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
                db.end();
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
                db.end();
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
                    db.end();
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
                  db.query('INSERT INTO employee_data (firstName, lastName, role_id, manager) VALUES (?, ?, ?, ?)',values,(err, results) => {
                      if (err) {
                        console.log('Error occurred while inserting into Employee_data: ' + err);
                        return;
                      }
                      console.log('Employee added successfully!');
                    }
                  );
                });
            }
            if (response.AddChoice.includes('Roles')) {
              console.log('You chose to add to Roles');

              db.query('SELECT id, name FROM department', function (error, results) {
                if (error) {
                  console.error(error);
                  db.end();
                  return;
                }

                const departmentList = results.map((result) => ({ name: result.name, value: result.id }));
                console.log(departmentList);

                inquirer
                  .prompt([
                    {
                      type: 'input',
                      message: 'What is the job Title?',
                      name: 'job_title'
                    },
                    {
                      type: 'checkbox',
                      message: 'What is the department id this job belongs?',
                      name: 'dept_id',
                      choices: departmentList
                    },
                    {
                      type: 'input',
                      message: 'What is the salary for this role',
                      name: 'salary'
                    }
                  ])
                  .then((response) => {
                    console.log(response);
                    const { job_title, dept_id, salary } = response;
                    const values = [job_title, dept_id, salary];
                    db.query('INSERT INTO roles (job_title, dept_id, salary) VALUES (?, ?, ?)',values,(err, results) => {
                        if (err) {
                          console.log('Error occurred while inserting into roles: ' + err);
                          return;
                        }
                        console.log('role added successfully!');
                        db.end();
                      }
                    );
                  });
              });
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
      db.end();
    });
});

//}


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});