const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const { spawn } = require('child_process');
const fs = require('fs');
const app = express();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server Started on Port ${PORT}`));

app.get('/api/wikimedia', async (req, res) => {
  const { articleTitle, lang} = req.query;
  console.log("Language Selected: ");
  console.log(lang);
  try {
    const wikiURI = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exlimit=1&titles=${articleTitle}&explaintext=1&exsectionformat=plain`;
    const response = await axios.get(wikiURI);
    const articleHtml = response.data;
    const $ = cheerio.load(articleHtml);
    const plainText = $('body').text();
    // Write plainText to a file
    fs.writeFileSync('input.txt', plainText);
    // Run the summarizer.py script with input.txt as an argument
    const pythonProcess = spawn('python', ['summarizer.py', 'input.txt',lang]);
    pythonProcess.stdout.on('data', (data) => {
      console.log(data.toString());
    });

    // Handle Python process exit
    pythonProcess.on('exit', (code) => {
      console.log(`Python process exited with code ${code}`);
      const result = fs.readFileSync('summary.txt', 'utf-8');
      const cleanSummary = removeHtmlTags(result);
      res.send(cleanSummary);
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Cannot access this Article!' });
  }
});

// Function to remove HTML tags from a string
function removeHtmlTags(htmlText) {
  const $ = cheerio.load(htmlText);
  return $.text();
}
