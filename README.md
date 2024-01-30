# Puppeteer Web Scraping for CreepJS

This project contains a Node.js script that uses Puppeteer to scrape data from [CreepJS](https://abrahamjuliot.github.io/creepjs/). It performs a series of automated tasks to capture screenshots, generate PDFs, and fetch specific data via API calls, which is then saved in JSON format.

## Installation

To run this project, you'll need Node.js and npm installed on your system.

### Steps:

1. Clone the GitHub repository:
   ```bash
   git clone [Your-Repository-Link]

2. Navigate to the project directory:
cd [Your-Project-Directory]

3. Install the dependencies:
npm install

## Usage
To start the scraping process, run the following command in the terminal:
node scrape.js

This will initiate a series of automated web scraping tasks for 3 iterations, capturing data from the CreepJS page.

## Output
The script generates the following files in each iteration:

screenshot_[iteration].png: A screenshot of the CreepJS webpage.
webpage_[iteration].pdf: A PDF version of the webpage.
output_[iteration].json: JSON file containing extracted data like trust score, lies, bot status, and fingerprint.

## Troubleshooting and Challenges
Puppeteer Installation: Ensure Puppeteer is correctly installed as it downloads a Chromium instance.
Network Issues: The script may fail if there are network connectivity problems.
Page Structure Changes: If the structure of the CreepJS page changes, the script might need updates.
Achieving High Trust Score
The script mimics human-like interactions to maximize the trust score.
Randomized user-agent strings help in appearing less bot-like.
