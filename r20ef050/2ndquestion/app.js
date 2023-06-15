const express = require('express');
const axios = require('axios');
const app = express();
app.get('/numbers', async (req, res) => {
    try {
      const { url } = req.query;
      
      if (!url) {
        res.status(400).json({ error: 'URL parameter is required.' });
        return;
      }
      
      // Convert URL query parameter to an array
      const urls = Array.isArray(url) ? url : [url];
      
      // Store the promises for each request
      const requests = urls.map(async (url) => {
        try {
          // Make a request to the URL
          const response = await axios.get(url, { timeout: 500 });
          
          if (response.status === 200 && Array.isArray(response.data.numbers)) {
            // Extract the numbers from the response
            return response.data.numbers;
          } else {
            console.error(`Invalid response from ${url}`);
          }
        } catch (error) {
          console.error(`Error accessing ${url}:`, error.message);
        }
      });
      
      // Wait for all requests to finish
      const results = await Promise.all(requests);
      
      // Merge and sort the numbers
      const mergedNumbers = [...new Set(results.flat())].sort((a, b) => a - b);
      
      res.json({ numbers: mergedNumbers });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Something went wrong.' });
    }
  });
  const port = 3000;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
    