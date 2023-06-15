const express = require('express');
const axios = require('axios');

const app = express();

app.get('/trains', async (req, res) => {
  try {
    // to get current time and calculate the end time  
    const currentTime = new Date();
    const endTime = new Date(currentTime.getTime() + 12 * 60 * 60 * 1000);
    
  
    const currentTimeStr = currentTime.toISOString();
    const endTimeStr = endTime.toISOString();
    
    
    //http://104.211.219.98/train/trains
    const response = await axios.fetch(`http://104.211.219.98/train/trains?start_time=${currentTimeStr}&end_time=${endTimeStr}`, {
    
    headers: {
        'Authorization': 'MOJPat'  
      }
       
    })
     
    
    if (response.status === 200) {
      const trains = response.data;
      
      // Filter and sort the train data
      const filteredTrains = trains.filter(train => {
        const departureTime = new Date(train.departureTime);
        const timeDifference = departureTime.getTime() - currentTime.getTime();
        const minutesDifference = Math.floor(timeDifference / (1000 * 60));
        
        return minutesDifference >= 30;  
      });
      
      filteredTrains.sort((a, b) => {
         
        if (a.price < b.price) return -1;
        if (a.price > b.price) return 1;
        
      
        if (a.tickets > b.tickets) return -1;
        if (a.tickets < b.tickets) return 1;
        
        // Sort by descending order of departure time
        const aDepartureTime = new Date(a.departureTime);
        const bDepartureTime = new Date(b.departureTime);
        
        if (aDepartureTime > bDepartureTime) return -1;
        if (aDepartureTime < bDepartureTime) return 1;
        
        return 0;
      });
      
      res.json(filteredTrains);
    } else {
      res.status(500).json({ error: 'Unable to fetch train data.' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
