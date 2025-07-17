import axios from 'axios';
import * as cheerio from 'cheerio';
import { writeFileSync } from 'fs';
import { Course } from './universities';

// MIT Course Catalog URL (example)
const MIT_COURSE_CATALOG_URL = 'https://catalog.mit.edu/subjects/';

async function scrapeMITCourses() {
  const courses: Course[] = [];
  const { data } = await axios.get(MIT_COURSE_CATALOG_URL);
  const $ = cheerio.load(data);

  // Example selector logic (update as needed for real MIT catalog structure)
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

  writeFileSync('lib/universities/mit.json', JSON.stringify(courses, null, 2));
  console.log(`Scraped ${courses.length} MIT courses.`);
}

scrapeMITCourses().catch(console.error); 