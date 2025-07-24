const fs = require('fs');

function writeReviewsToTempFile(tempFile, reviews) {
  fs.writeFileSync(tempFile, JSON.stringify(reviews));
}

function readAndCleanupTempFile(tempFile, fallbackReviews) {
  try {
    const reviewsJson = JSON.parse(fs.readFileSync(tempFile, 'utf-8'));
    fs.unlinkSync(tempFile);
    return reviewsJson;
  } catch (e) {
    return fallbackReviews;
  }
}

module.exports = { writeReviewsToTempFile, readAndCleanupTempFile };
