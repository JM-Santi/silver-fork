const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  database: 'company_db',
});

connection.connect(err => {
  if (err) throw err;
  console.log("WELCOME TO EMPLOYEE TRACKER");
  startMenu();
});

const startMenu = () => {
  inquirer.prompt({
      message: 'What would you like to do today?',
      name: 'menu',
      type: 'list',
      choices: [ 
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update employee role',
        'Exit',
      ],
    })
    .then(response => {
        switch (response.menu) {
        case 'View all departments':
          viewDepartment();
          break;
        case 'View all roles':
          viewRoles();
          break;
        case 'View all employees':
          viewEmployees();
          break;
        case 'Add a department':
          addDepartment();
          break;
        case 'Add a role':
          addRole();
          break;
        case 'Add an employee':
          addEmployee();
          break;
        case 'Update employee role':
          updateEmployee();
          break;
        case "Exit":
          connection.end();
          break;
        default:
          connection.end();
      }
    });
};

const viewDepartment = () => {
  connection.query('SELECT * FROM department', function (err, res) {
    if (err) throw err;
    console.table(res);
    startMenu();
  });
};

const viewRoles = () => {
  connection.query('SELECT * FROM role', function (err, res) {
    if (err) throw err;
    console.table(res);
    startMenu();
  });
};

const viewEmployees = () => {
  connection.query(
    'SELECT employee.id, first_name, last_name, title, salary, dept_name, manager_id FROM ((department JOIN role ON department.id = role.department_id) JOIN employee ON role.id = employee.role_id);',
    function (err, res) {
      if (err) throw err;
      console.table(res);
      startMenu();
    }
  );
};

const addDepartment = () => {
  inquirer.prompt([
      {
        name: 'department',
        type: 'input',
        message: 'What is the department name?',
      },
    ])
    .then(answer => {
      connection.query(
        'INSERT INTO department (dept_name) VALUES (?)',
        [answer.department],
        function (err, res) {
          if (err) throw err;
          console.log('Department added!');
          startMenu();
        }
      );
    });
};

const addRole = () => {
  inquirer.prompt([
      {
        name: 'roleTitle',
        type: 'input',
        message: 'What is the role title?',
      },
      {
        name: 'salary',
        type: 'input',
        message: 'What is the salary for this role?',
      },
      {
        name: 'deptId',
        type: 'input',
        message: 'What is the department ID number?',
      },
    ])
    .then(answer => {
      connection.query(
        'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)',
        [answer.roleTitle, answer.salary, answer.deptId],
        function (err, res) {
          if (err) throw err;
          console.log('Role added!');
          startMenu();
        }
      );
    });
};

const addEmployee = () => {
  inquirer.prompt([
      {
        name: 'nameFirst',
        type: 'input',
        message: "What is the employee's first name?",
      },
      {
        name: 'nameLast',
        type: 'input',
        message: "What is the employee's last name?",
      },
      {
        name: 'roleId',
        type: 'input',
        message: "What is the employee's role id?",
      },
      {
        name: 'managerId',
        type: 'input',
        message: 'What is the manager Id?',
      },
    ])
    .then(answer => {
      connection.query(
        'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)',
        [answer.nameFirst, answer.nameLast, answer.roleId, answer.managerId],
        function (err, res) {
          if (err) throw err;
          console.log('Employee added!');
          startMenu();
        }
      );
    });
};

const updateEmployee = () => {
  inquirer.prompt([
      {
        name: 'id',
        type: 'input',
        message: 'Enter employee id',
      },
      {
        name: 'roleId',
        type: 'input',
        message: 'Enter new role id',
      },
    ])
    .then(answer => {
      connection.query(
        'UPDATE employee SET role_id=? WHERE id=?',
        [answer.roleId, answer.id],
        function (err, res) {
          if (err) throw err;
          console.log('Employee updated!');
          startMenu();
        }
      );
    });
};
