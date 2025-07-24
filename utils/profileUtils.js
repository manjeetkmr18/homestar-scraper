async function scrapeProfileData(page) {
  try {
    const profileData = await page.evaluate(() => {
      const data = {};
      // Extract company name
      const nameElement = document.querySelector('[data-testid="profile-hero-title"]');
      data.companyName = nameElement ? nameElement.textContent.trim() : null;

      // Extract company image
      const imageElement = document.querySelector('.sc-c2e56f08-5 img');
      data.companyImage = imageElement ? imageElement.getAttribute('src') : null;

      // Extract rating
      const ratingElement = document.querySelector('[data-testid="rating-average"] strong');
      data.rating = ratingElement ? parseFloat(ratingElement.textContent.trim()) : null;

      // Extract reviews count
      const reviewsElement = document.querySelector('.sc-d585af5e-3');
      data.reviewsCount = reviewsElement ? parseInt(reviewsElement.textContent.replace(/\D/g, ''), 10) : 0;

      // Extract location
      const locationElement = document.querySelector('[data-testid="service-pro-location"]');
      data.location = locationElement ? locationElement.textContent.trim() : null;

      // Extract "About the Company"
      const aboutElement = document.querySelector('[data-testid="about-this-company-text-content"]');
      data.aboutCompany = aboutElement ? aboutElement.textContent.trim() : null;

      return data;
    });
    return profileData;
  } catch (error) {
    throw error;
  }
}

module.exports = { scrapeProfileData };
