const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const { profileController } = require('./controllers/profileController');
const { reviewsScraperController } = require('./controllers/reviewsScraperController');

app.get('/profile', profileController);
app.get('/reviews-scraper', reviewsScraperController);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
