const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

const { profileController } = require('./controllers/profileController');
const { reviewsScraperController } = require('./controllers/reviewsScraperController');

app.get('/', (req, res) => {
  res.send('Welcome to the HomeStar Scraper API, please email us at manjeet.kmr28@gmail.com for complete documentation or support.');
});

app.get('/profile', profileController);
app.get('/reviews-scraper', reviewsScraperController);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
