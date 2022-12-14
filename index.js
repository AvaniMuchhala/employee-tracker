const inquirer = require('inquirer');

// Menu options about next step
const menuQ = [
    {
        type: 'list',
        message: 'What would you like to do?',
        choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role'],
        name: 'action'
    }
];

const addDeptQ = [
    {
        type: 'input',
        message: 'Enter the name of the department:',
        name: 'deptName'       
    }
];

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
        type: 'input',
        message: 'Enter the department that the role belongs to:',
        name: 'department'
    }
];

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
        type: 'input',
        message: 'Enter the employee\'s role:',
        name: 'role'
    },
    {
        type: 'input',
        message: 'Enter the name of the employee\'s manager:',
        name: 'managerName'
    }
];

const updateEmployeeQ = [
    {
        type: 'list',
        message: 'Which employee\'s role do you want to update?',
        choices: ['Avani', 'Nilay'],
        name: 'employee'
    },
    {
        type: 'list',
        message: 'Which role would you like to now assign to the selected employee?',
        choices: ['Software Engineer', 'Accountant'],
        name: 'updatedRole'
    }
];

function viewDept() {
    console.log("View all departments");
    showMenu();
}

function viewRoles() {
    console.log("View all roles");
    showMenu();
}

function viewEmployees() {
    console.log("View all employees");
    showMenu();
}

function showMenu() {
    inquirer
        .prompt(menuQ)
        .then(menuA => {
            if (menuA.action === 'View all departments') {
                viewDept();
            } else if (menuA.action === 'View all roles') {
                viewRoles();
            } else if (menuA.action === 'View all employees') {
                viewEmployees();
            }
            return;
        });
}

function init() {
    console.log('Welcome to the Employee Tracker!');

    showMenu();
}

init();

