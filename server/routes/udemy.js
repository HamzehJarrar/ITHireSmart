import express from 'express';
import axios from 'axios';

const router = express.Router();

const UDEMY_API_USERNAME = "0KWmNVILFwO3aO3C40S2DQTrAsWLSWje2KXrsqiS";
const UDEMY_API_PASSWORD = "ED4Qjpv5RywyfAwK1nocrGY1t2N7UfxysC4Z2l9gP1AYZXVWqdG8naoa9WbekRtclizy9dQLtbEmsUCtH6kq74gsLS6dMSQxw9ul35BIcbhuBi5NVQLvQnzZYL61A3p4";

router.get('/', async (req, res) => {
  const { search } = req.query;

  try {
    const response = await axios.get('https://www.udemy.com/api-2.0/courses/', {
      params: {
        search: search,
        page_size: 12
      },
      auth: {
        username: UDEMY_API_USERNAME,
        password: UDEMY_API_PASSWORD
      }
    });
    res.json(response.data);
  } catch (error) {
    
    console.error("Error fetching courses from Udemy:", error.response ? error.response.data : error.message);
    res.status(500).json({ message: "Failed to fetch courses from Udemy", error: error.response ? error.response.data : error.message });
  }
});



export default router;
