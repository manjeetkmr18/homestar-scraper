// Helper to extract reviews from a page (to be used in page.evaluate)
function extractReviewsFromPage() {
  const reviewContainers = [
    document.querySelectorAll('[data-testid="reviews-list"] > li'),
    document.querySelectorAll(".sc-bf4b46f1-1"),
    document.querySelectorAll(".reviews-list li, .reviews-container li"),
    document.querySelectorAll(".review-item, .review-container, .review"),
    document.querySelectorAll('[class*="review" i]'),
    document.querySelectorAll("article"),
    document.querySelectorAll(".feedback-item"),
  ];
  let reviewElements = null;
  for (const container of reviewContainers) {
    if (container && container.length > 0) {
      reviewElements = container;
      break;
    }
  }
  if (!reviewElements || reviewElements.length === 0) {
    return [];
  }
  return Array.from(reviewElements).map((review) => {
    const customer =
      review
        .querySelector(
          ".author, .reviewer-name, .customer-name, h3, .sc-999aa16d-1"
        )
        ?.textContent?.trim() || "Unknown customer";
    const ratingEl = review.querySelector(
      ".sc-8c600053-2, .rating, .stars, meter"
    );
    let rating = "Not rated";
    if (ratingEl) {
      rating =
        ratingEl.getAttribute("value") ||
        ratingEl.textContent?.match(
          /Rating:\s*(\d+(\.\d+)?)\s*out of 5/i
        )?.[1] ||
        ratingEl.textContent?.trim() ||
        "Not rated";
    }
    const date =
      review
        .querySelector(".sc-8c600053-3, .date, time, small")
        ?.textContent?.trim() || "Unknown date";
    const jobTitle =
      review.querySelector(".sc-738101b3-0")?.textContent?.trim() || "";
    const content =
      review
        .querySelector(".review-content, .review-text, p, .sc-a1f5538b-1 > p")
        ?.textContent?.trim() || "";
    return { customer, rating, date, jobTitle, content };
  });
}

module.exports = { extractReviewsFromPage };
