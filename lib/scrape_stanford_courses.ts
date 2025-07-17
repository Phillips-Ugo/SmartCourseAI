import axios from 'axios';
import * as cheerio from 'cheerio';
import { writeFileSync } from 'fs';
import { Course } from './universities';

// Stanford Course Catalog URL (example)
const STANFORD_COURSE_CATALOG_URL = 'https://explorecourses.stanford.edu/CourseSearch/search?view=catalog&catalog=&page=0&filter-coursestatus-Active=on&filter-term-Autumn=on&academicYear=20232024';

async function scrapeStanfordCourses() {
  const courses: Course[] = [];
  const { data } = await axios.get(STANFORD_COURSE_CATALOG_URL);
  const $ = cheerio.load(data);

  // Example selector logic (update as needed for real Stanford catalog structure)
  $('.courseInfo').each((_: number, el: cheerio.Element) => {
    const code = $(el).find('.courseNumber').text().trim();
    const title = $(el).find('.courseTitle').text().trim();
    const credits = 0; // TODO: Parse credits from the page
    const professors: { name: string; rating?: number }[] = [];
    // TODO: Parse professors and fetch ratings from RateMyProfessors
    const prerequisites: string[] = [];
    // TODO: Parse prerequisites
    const department = ''; // TODO: Parse department
    const summary = $(el).find('.courseDescription').text().trim();

    courses.push({
      code,
      name: title,
      credits,
      professors,
      prerequisites,
      department,
      summary,
    });
  });

  writeFileSync('lib/universities/stanford.json', JSON.stringify(courses, null, 2));
  console.log(`Scraped ${courses.length} Stanford courses.`);
}

scrapeStanfordCourses().catch(console.error); 