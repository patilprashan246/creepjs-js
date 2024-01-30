const puppeteer = require('puppeteer');
const fs = require('fs');

// Define the log file path
const logFilePath = 'scrape_log.txt';

/**
 * Function to append logs to a file.
 * @param {string} message - The message to log.
 */
function log(message) {
    const timestamp = new Date().toISOString();
    // Append the log message to the log file with a timestamp
    fs.appendFileSync(logFilePath, `${timestamp} - ${message}\n`);
}

/**
 * Function to log errors with a specific iteration context.
 * @param {Error} error - The error object.
 * @param {number} iteration - The iteration number during which the error occurred.
 */
function logError(error, iteration) {
    log(`Error in iteration ${iteration}: ${error.message}`);
    console.error('Error during scraping:', error);
}


/**
 * Scrapes data from a specified website in each iteration.
 * @param {number} iteration - The current iteration number.
 */
async function scrapeData(iteration) {
    let browser;
    try {
        // Launch a headless browser
        browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        log(`Iteration ${iteration} started.`);
        
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36');
        await page.goto('https://abrahamjuliot.github.io/creepjs/', { waitUntil: 'networkidle0' });

        // Take a screenshot of the page
        await page.screenshot({ path: `screenshot_${iteration}.png` });
        log(`Screenshot for iteration ${iteration} saved.`);

        // Create a PDF of the page
        await page.pdf({ path: `webpage_${iteration}.pdf`, format: 'A4' });
        log(`PDF for iteration ${iteration} created.`);

        // Set up the POST request data
        const data = {
            url: 'https://creepjs-api.web.app/fp',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json, text/plain, */*',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'en-US,en;q=0.9',
                'Content-Length': '853',
                'Origin': 'https://abrahamjuliot.github.io',
                'Referer': 'https://abrahamjuliot.github.io/',
                'Sec-Ch-Ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
                'Sec-Ch-Ua-Mobile': '?0',
                'Sec-Ch-Ua-Platform': '"Windows"',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'cross-site',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
            },
            body: JSON.stringify([
                "KANg440lYwnldNxxD90co6yGygzvOelD4g3mB7mRquyvKL/FTXtiY6jp32B1zATKySTVTJ4k4KDUtzX6fS/Y3bbh0UZ5nG+H3Mp95C/TP8asRP7VMMI54W9pHKbYfeMd9pyndpQucm52jFyYN0eGj8CvF1n2Jy5WnQT+0UmIMY5cqfKDB3cAxHMtIaniHbDcTJI79qaKBx2kKxv1eP94yDAaThW7A9qTOLptgz+KF88hH0zm7os9ZfI6NBwMB6l342vQwNsio++njba/8MFK4wc48ZB4KAEVyTnQdJWh0tRTZwX9/8dByqGSydphk8v5XPL2BEdrw/8aNiRCqIdBSv4mJJzOR5ucnyLzu94iFcXx15vDF6xz+q1NzrxQ4Wq5RJAvkXbXESho+73FYzb9zkJhFFXF3MLQ4vH24fzZBFmqT5Od6phqp7ysaDSZFwVpnk0Rk5Xl86ZrbhIIii6abD+Zxgt3X7rLOVUsJbrrk9hOfx03FaudOzPNBJYl6jH50v6uAs+/eSjh4+KJysjAgKT7BFcXN0N1vK7+sJ/lZT4neDnMKlhc9OYs1qAXbVpRO7flZbEy5AKJu5s0TP7YZgmXjotyEKAAVqVgg1/W7CmS9oGmc/Q94Ki4KrXzsNzPE7Xl4BusqTRpGpClyOeBO2ptLJRY8zaA/VfOkOQLdf1US6//r2jrY9hslNothaRzERSToftiAZ1CcVEddbzDL31C4RPe/3G/stqmMiYKm/apcY+k2dBO2s50Y0lPTnDRuSfZnJ3ik8APCV0=",
                "PNVSeBn1OwYN6aCB",
                "hLxp01uh2mabENxp3hFuYgQW9ZTH2hKvI_hoN9ODj6c"
              ])
        };

        // Execute a POST request within the page context and get the JSON response
        const response = await page.evaluate(async (data) => {
            return fetch(data.url, {
                method: data.method,
                headers: data.headers,
                body: data.body
            }).then(response => response.json());
        }, data);

        // Extract and structure the data from the response
        const extractedData = {
            trustScore: response.score,
            lies: response.hasLied,
            bot: response.bot,
            fingerprint: response.fingerprint
        };

        // Save the extracted data to a JSON file
        fs.writeFileSync(`output_${iteration}.json`, JSON.stringify(extractedData, null, 2));
        log(`Data for iteration ${iteration} saved.`);

    } catch (error) {       
        logError(error, iteration);
    } finally {
        if (browser) {
            await browser.close();
        }
    }

    log(`Iteration ${iteration} completed.`);
}

/**
 * Main function to control the flow of iterations.
 */
async function main() {
    for (let i = 1; i <= 3; i++) {
        try {
            // Run the scrape for each iteration
            await scrapeData(i);
        } catch (error) {            
            logError(error, i);
        }
    }
}

// Start the script
main();
