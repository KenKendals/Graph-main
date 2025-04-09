const jsonfile = require('jsonfile');
const moment = require('moment');
const simpleGit = require('simple-git');

const FILE_PATH = './data.json';

// 🔹 Set the date range for commits (Modify these dates as needed)
const START_DATE = moment("2025-03-24", "YYYY-MM-DD"); // Start date
const END_DATE = moment("2025-04-08", "YYYY-MM-DD");   // End date

/**
 * Recursively makes a series of Git commits with randomly generated dates
 * between the specified START_DATE and END_DATE.
 * 
 * @param {number} n - Number of commits to make.
 */
async function makeCommit(n) {
    // 🔹 If all commits are done, push them to Git
    if (n === 0) {
        console.log("✅ All commits done! Pushing to Git...");
        return simpleGit().push();
    }

    // 🔹 Dynamically import 'random-int' since it's an ES module
    const { default: randomInt } = await import('random-int');

    // 🔹 Generate a random number of days between START_DATE and END_DATE
    const randomDays = randomInt(0, END_DATE.diff(START_DATE, 'days'));

    // 🔹 Create a commit date by adding the random number of days to START_DATE
    const DATE = START_DATE.clone().add(randomDays, 'days').format();

    // 🔹 Prepare data to be written to the file
    const data = { date: DATE };
    console.log("📅 Committing for date:", DATE);

    // 🔹 Write the date to the JSON file, then commit and call `makeCommit` recursively
    jsonfile.writeFile(FILE_PATH, data, () => {
        simpleGit()
            .add([FILE_PATH]) // Stage the file for commit
            .commit(DATE, { '--date': DATE }, () => {
                makeCommit(n - 1); // Recursively call `makeCommit` with `n-1`
            });
    });
}

// 🔹 Call the function to make a set number of commits (modify the number as needed)
makeCommit(10); // This will create 100 commits in the specified date range



// node index.js command to run
// On a new machine try all these
//  touch .gitignore to create gitignore
// npm init -y to configure jason package
// npm install jsonfile moment simple-git random-int  (to install all packages)
// make sure to push index file with github desktop and also make sure to change the date before you start pushing
