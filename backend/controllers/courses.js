const courseScraper = require('../utils/courseScraper.js');

const searchCourse = async (req, res) => {
  try {
    const { skill } = req.body;
    const { price, cert, level } = req.query;

    console.log(price, cert, level)

    // Prepare arguments dynamically
    const args = [skill];

    // Only push params if they are present
    if (price == 'true') args.push(price);
    else args.push(false);

    if (cert == 'true') args.push(cert);
    else args.push(false);

    if (level) args.push(level);
    else args.push(false);

    try {
      const courses = await courseScraper(...args);
      res.status(200).json(courses);
    } catch (error) {
      console.error("Error in scraping Courses: ", error);
      res.status(500).json({ message: "Failed to scrape courses" });
    }
  } catch (error) {
    console.error("Error in searching courses:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = searchCourse;
