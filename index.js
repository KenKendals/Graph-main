const jsonfile = require('jsonfile');
const moment = require('moment');
const simpleGit = require('simple-git');

const FILE_PATH = './data.json';

// 🔹 Set the date range for commits (Modify these dates as needed)
const START_DATE = moment("2023-06-01", "YYYY-MM-DD"); // Start date
const END_DATE = moment("2023-12-31", "YYYY-MM-DD");   // End date

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
makeCommit(100); // This will create 100 commits in the specified date range
