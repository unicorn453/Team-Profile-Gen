const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./src/page-template.js");

// Array for team members
const teamMembers = [];

// prompt user for manager's details
function promptManager() {
  return inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "Enter the manager's name:",
    },
    {
      type: "input",
      name: "id",
      message: "Enter the manager's employee ID:",
    },
    {
      type: "input",
      name: "email",
      message: "Enter the manager's email:",
    },
    {
      type: "input",
      name: "officeNumber",
      message: "Enter the manager's office number:",
    },
  ]);
}

// prompt after each team member building for the next action
function promptNextAction() {
  return inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: "What would you like to do next?",
      choices: ["Add an Engineer", "Add an Intern", "Finish building the team"],
    },
  ]);
}

// prompt user for engineer's details
function promptEngineer() {
  return inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "Enter the engineer's name:",
    },
    {
      type: "input",
      name: "id",
      message: "Enter the engineer's employee ID:",
    },
    {
      type: "input",
      name: "email",
      message: "Enter the engineer's email:",
    },
    {
      type: "input",
      name: "github",
      message: "Enter the engineer's GitHub username:",
    },
  ]);
}

//  prompt user for intern's details
function promptIntern() {
  return inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "Enter the intern's name:",
    },
    {
      type: "input",
      name: "id",
      message: "Enter the intern's employee ID:",
    },
    {
      type: "input",
      name: "email",
      message: "Enter the intern's email:",
    },
    {
      type: "input",
      name: "school",
      message: "Enter the intern's school:",
    },
  ]);
}

// Function to write the data from prompt to HTML file
function writeToFile(fileName, data) {
  fs.writeFile(fileName, data, (err) => {
    if (err) {
      console.error("Error writing to file:", err);
    } else {
      console.log(`Successfully wrote to ${fileName}`);
    }
  });
}

// Main function to gather user input and generate HTML
async function init() {
  try {
    // Prompt for manager's details
    const managerData = await promptManager();
    const manager = new Manager(
      managerData.name,
      managerData.id,
      managerData.email,
      managerData.officeNumber
    );
    teamMembers.push(manager);

    // Prompt for next action
    let nextAction = await promptNextAction();
    // continue prompting user until "Finish building the team" is chosen
    while (nextAction.action !== "Finish building the team") {
      if (nextAction.action === "Add an Engineer") {
        // Prompt for engineer's details
        const engineerData = await promptEngineer();
        const engineer = new Engineer(
          engineerData.name,
          engineerData.id,
          engineerData.email,
          engineerData.github
        );
        teamMembers.push(engineer);
      } else if (nextAction.action === "Add an Intern") {
        // Prompt for intern's details
        const internData = await promptIntern();
        const intern = new Intern(
          internData.name,
          internData.id,
          internData.email,
          internData.school
        );
        teamMembers.push(intern);
      }

      // Prompt for next action
      nextAction = await promptNextAction();
    }
    // Generate HTML using the render function
    const html = render(teamMembers);

    // Write HTML to file
    writeToFile(outputPath, html);
  } catch (error) {
    console.error("An error occurred:", error);
  }
}
init();
