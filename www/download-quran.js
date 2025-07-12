const fs = require('fs');
const https = require('https');

// Function to download JSON data
function downloadJson(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            let data = '';
            response.on('data', (chunk) => {
                data += chunk;
            });
            response.on('end', () => {
                resolve(JSON.parse(data));
            });
        }).on('error', (error) => {
            reject(error);
        });
    });
}

// Function to save JSON data to file
function saveJson(data, filename) {
    return new Promise((resolve, reject) => {
        fs.writeFile(filename, JSON.stringify(data, null, 2), 'utf8', (error) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
}

// Main function to download and save Quran data
async function downloadQuranData() {
    try {
        console.log('Downloading Quran data...');
        
        // Download Arabic Quran
        const quranData = await downloadJson('https://api.alquran.cloud/v1/quran/quran-uthmani');
        await saveJson(quranData, 'quran-uthmani.json');
        console.log('Arabic Quran data saved successfully');
        
        // Download English translation
        const translationData = await downloadJson('https://api.alquran.cloud/v1/quran/en.sahih');
        await saveJson(translationData, 'en.sahih.json');
        console.log('English translation data saved successfully');
        
        // Download other translations
        const translations = [
            { code: 'en.pickthall', url: 'https://api.alquran.cloud/v1/quran/en.pickthall' },
            { code: 'en.yusufali', url: 'https://api.alquran.cloud/v1/quran/en.yusufali' }
        ];
        
        for (const translation of translations) {
            const data = await downloadJson(translation.url);
            await saveJson(data, `${translation.code}.json`);
            console.log(`${translation.code} translation saved successfully`);
        }
        
        console.log('All Quran data downloaded and saved successfully!');
    } catch (error) {
        console.error('Error downloading Quran data:', error);
    }
}

// Run the download
downloadQuranData(); 