const inquirer = require('inquirer');
const mysql = require('mysql2/promise');
const cTable = require('console.table');
let db;

// Get list of employees for when user needs to select employee's manager
async function getEmployeeList() {
    const results = await db.execute('SELECT * FROM employee');
    console.log(results[0]);
    return results[0];
}

// Get list of roles for when user needs to select employee's role
async function getRoleList() {
    const results = await db.execute('SELECT * FROM role');
    console.log(results[0]);
    return results[0];
}

// Get list of departments for when user needs to select the dept that the new role belongs to
async function getDeptList() {
    // db.query('SELECT name FROM department', (err, result) => {
    //     console.log(result);    // array of objects
    //     const deptList = [];
    //     result.forEach(obj => deptList.push(obj.name));
    //     return deptList;
    // });
 
    // what if no departments in list?
    const results = await db.execute('SELECT * FROM department');
    console.log(results[0]);
    return results[0];
}

async function updateEmployee() {
    const roleChoices = await getRoleList();
    const roleTitles = [];
    roleChoices.forEach(role => roleTitles.push(role.title));

    const employeeChoices = await getEmployeeList();
    const employeeNames = [];
    employeeChoices.forEach(employee => employeeNames.push(employee.first_name + " " + employee.last_name));
    
    const updateEmployeeQ = [
        {
            type: 'list',
            message: 'Which employee\'s role do you want to update?',
            choices: employeeNames,
            name: 'employee'
        },
        {
            type: 'list',
            message: 'Which role would you like to now assign to the selected employee?',
            choices: roleTitles,
            name: 'updatedRole'
        }
    ];

    inquirer
        .prompt(updateEmployeeQ)
        .then(async (data) => {
            // Find ID of the employee that user selected
            let employeeID;
            employeeChoices.forEach(employee => {
                let employeeFullName = employee.first_name + " " + employee.last_name;
                if (employeeFullName === data.employee) {
                    employeeID = employee.id;
                }
            });
            
            // Find ID of the role that user selected
            let updatedRoleID;
            roleChoices.forEach(role => {
                if (role.title === data.updatedRole) {
                    updatedRoleID = role.id;
                }
            });            
             
            const result = await db.execute('UPDATE employee SET role_id = ? WHERE id = ?', [updatedRoleID, employeeID]);
            console.log(`${data.employee}'s role has been updated to ${data.updatedRole}!`);
            showMenu();
        });
}

async function addEmployee() {
    const roleChoices = await getRoleList();
    const roleTitles = [];
    roleChoices.forEach(role => roleTitles.push(role.title));

    const employeeChoices = await getEmployeeList();
    const employeeNames = [];
    employeeChoices.forEach(employee => employeeNames.push(employee.first_name + " " + employee.last_name));
    const addEmployeeQ = [
        {
            type: 'input',
            message: 'Enter the employee\'s first name',
            name: 'firstName' 
        },
        {
            type: 'input',
            message: 'Enter the employee\'s last name',
            name: 'lastName'
        },
        {
            type: 'list',
            message: 'Select the employee\'s role:',
            choices: roleTitles,
            name: 'role'
        },
        // what is employee doesnt have manager or is the manager?
        {
            type: 'list',
            message: 'Select the name of the employee\'s manager:',
            choices: employeeNames,
            name: 'managerName'
        }
    ];

    inquirer
        .prompt(addEmployeeQ)
        .then(async (data) => {
            // Find ID of the role that user selected
            let roleID;
            roleChoices.forEach(role => {
                if (role.title === data.role) {
                    roleID = role.id;
                }
            });

            // Find ID of the employee that user selected as their manager
            let managerID;
            employeeChoices.forEach(employee => {
                let employeeFullName = employee.first_name + " " + employee.last_name;
                if (employeeFullName === data.managerName) {
                    managerID = employee.id;
                }
            });

            const result = await db.execute('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [data.firstName, data.lastName, roleID, managerID]);
            console.log(`${data.firstName + " " + data.lastName} was added as an employee to the database!`);
            showMenu();
        });
}

async function addRole() {
    const deptChoices = await getDeptList();
    const deptNames = [];
    deptChoices.forEach(dept => deptNames.push(dept.name));

    const addRoleQ = [
        {
            type: 'input',
            message: 'Enter the name of the role:',
            name: 'roleName'
        },
        {
            type: 'input',
            message: 'Enter the salary of the role:',
            name: 'salary'
        },
        {
            type: 'list',
            message: 'Enter the department that the role belongs to:',
            choices: deptNames,
            name: 'department'
        }
    ];
    inquirer
        .prompt(addRoleQ)
        .then(async (data) => {
            // Find ID of the department that user selected
            let deptID;
            deptChoices.forEach(dept => {
                if (dept.name === data.department) {
                    deptID = dept.id;
                }
            });

            const result = await db.execute('INSERT INTO role (title, department_id, salary) VALUES (?, ?, ?)', [data.roleName, deptID, data.salary]);
            console.log(`${data.roleName} role was added to the database!`);
            showMenu();
        });
}

function addDept() {
    const addDeptQ = [
        {
            type: 'input',
            message: 'Enter the name of the department:',
            name: 'deptName'       
        }
    ];

    inquirer
        .prompt(addDeptQ)
        .then(async (data) => {
            // db.query('INSERT INTO department (name) VALUES (?)', data.deptName, (err, result) => {
            //     if (err) {
            //         console.log(err);
            //     } else {
            //         console.log(`${data.deptName} department was added to the database!`);
            //         showMenu();
            //     }
            // });

            const results = await db.execute('INSERT INTO department (name) VALUES (?)', [data.deptName]);
            console.log(`${data.deptName} department was added to the database!`);
            showMenu();
        });
}

async function viewEmployees() {
    console.log("View all employees");
    
    // db.query('SELECT * FROM employee', (err, result) => {
    //     if (err) {
    //         console.error(err);
    //     } else {
    //         console.table('EMPLOYEES', result);

    //         showMenu();
    //     }
    // });

    const result = await db.execute('SELECT * FROM employee');
    // console.log(result);
    console.table('EMPLOYEES', result[0]);
    showMenu();
}

async function viewRoles() {
    console.log("View all roles");

    // db.query('SELECT * FROM role', (err, result) => {
    //     if (err) {
    //         console.error(err);
    //     } else {
    //         console.table('ROLES', result);

    //         showMenu();
    //     }
    // });

    const result = await db.execute('SELECT * FROM role');
    // console.log(result);
    console.table('ROLES', result[0]);
    showMenu();
}

async function viewDepts() {
    console.log("View all departments");

    // db.query('SELECT * FROM department', (err, result) => {
    //     if (err) {
    //         console.error(err);
    //     } else {
    //         console.table('DEPARTMENTS', result);
    //         showMenu();
    //     }
    // });

    // db.execute('SELECT * FROM department')
    //     .then(result => {
    //         console.log(result);
    //         console.table('DEPARTMENTS', result[0]);
    //         showMenu();
    //     })
    //     .catch(err => console.error(err));

    const result = await db.execute('SELECT * FROM department');
    // console.log(result);
    console.table('DEPARTMENTS', result[0]);
    showMenu();
}

// Ask repeating questions to user about what action to take
function showMenu() {
    const menuQ = [
        {
            type: 'list',
            message: 'What would you like to do?',
            choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role'],
            name: 'action'
        }
    ];
    
    inquirer
        .prompt(menuQ)
        .then(menuA => {
            if (menuA.action === 'View all departments') {
                viewDepts();
            } else if (menuA.action === 'View all roles') {
                viewRoles();
            } else if (menuA.action === 'View all employees') {
                viewEmployees();
            } else if (menuA.action === 'Add a department') {
                addDept();
            } else if (menuA.action === 'Add a role') {
                addRole();
            } else if (menuA.action === 'Add an employee') {
                addEmployee();
            } else if (menuA.action === 'Update an employee role') {
                updateEmployee();
            }
            return;
        });
}

// Start program
async function init() {
    // Connect to database
    db = await mysql.createConnection(
        {
            host: 'localhost',
            user: 'root',
            password: 'root-pw',
            database: 'company_db'
        },
        console.log('Connected to company_db database.')
    );

    console.log('Welcome to the Employee Tracker!');

    showMenu();
}

init();

