import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

// Helper to build RateMyProfessors search URL
function buildSearchUrl(profName: string, university: string) {
  const query = encodeURIComponent(`${profName} ${university}`);
  return `https://www.ratemyprofessors.com/search/professors/100?q=${query}`;
}

// Helper to scrape the first professor's rating from search results
async function scrapeProfessorRating(profName: string, university: string): Promise<number | null> {
  try {
    const searchUrl = buildSearchUrl(profName, university);
    const { data } = await axios.get(searchUrl);
    const $ = cheerio.load(data);
    // Find the first professor card
    const profCard = $('[data-qa="professor-card"]').first();
    if (!profCard.length) return null;
    // Extract the link to the professor's page
    const profLink = profCard.find('a').attr('href');
    if (!profLink) return null;
    // Visit the professor's page
    const profUrl = `https://www.ratemyprofessors.com${profLink}`;
    const { data: profData } = await axios.get(profUrl);
    const $$ = cheerio.load(profData);
    // Extract the rating (look for the rating value)
    const ratingText = $$('[data-qa="rating-label overall-rating"]').first().text().trim();
    const rating = parseFloat(ratingText);
    if (isNaN(rating)) return null;
    return rating;
  } catch (err) {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const profName = searchParams.get('name');
  const university = searchParams.get('university');
  if (!profName || !university) {
    return NextResponse.json({ error: 'Missing name or university' }, { status: 400 });
  }
  const rating = await scrapeProfessorRating(profName, university);
  if (rating === null) {
    return NextResponse.json({ error: 'Rating not found' }, { status: 404 });
  }
  return NextResponse.json({ rating });
} 