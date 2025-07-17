import axios from 'axios';
import * as cheerio from 'cheerio';
import { writeFileSync } from 'fs';
import { Course } from './universities';

// IIT Course Catalog URL (example)
const IIT_COURSE_CATALOG_URL = 'https://bulletin.iit.edu/courses/';

async function scrapeIITCourses() {
  const courses: Course[] = [];
  const { data } = await axios.get(IIT_COURSE_CATALOG_URL);
  const $ = cheerio.load(data);

  // Example selector logic (update as needed for real IIT catalog structure)
  $('.courseblock').each((_: number, el: cheerio.Element) => {
    const code = $(el).find('.courseblocktitle strong').first().text().trim();
    const title = $(el).find('.courseblocktitle').text().split('.').slice(1).join('.').trim();
    const credits = 0; // TODO: Parse credits from the page
    const professors: { name: string; rating?: number }[] = [];
    // TODO: Parse professors and fetch ratings from RateMyProfessors
    const prerequisites: string[] = [];
    // TODO: Parse prerequisites
    const department = ''; // TODO: Parse department
    const summary = $(el).find('.courseblockdesc').text().trim();

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

  writeFileSync('lib/universities/iit.json', JSON.stringify(courses, null, 2));
  console.log(`Scraped ${courses.length} IIT courses.`);
}

scrapeIITCourses().catch(console.error); 