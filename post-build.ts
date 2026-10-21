import * as cheerio from 'cheerio';
import * as fs from 'fs';

const html = fs.readFileSync('dist/index.html').toString();
const $ = cheerio.load(html);

console.log('Post build script running...');


const script = $('script[src*="_astro"]').attr('src')
const css = $('link[href*="_astro"]').attr('href')

// From : /volvo/xc60/_astro/hoisted.5f5a3cf4.js
// To: _astro/hoisted.5f5a3cf4.js
const newScriptUrl = script.replace(/.*_astro\//, '_astro/')
const newCssUrl = css.replace(/.*_astro\//, '_astro/')

$('script[src*="_astro"]').attr('src', newScriptUrl)
$('link[href*="_astro"]').attr('href', newCssUrl)

// Check for empty alt tags
$('img').each((i, el) => {
    const alt = $(el).attr('alt');
    if (!alt) {
        console.error('Empty alt tag found:', $(el).attr('src'));
    }
    if (alt === 'undefined') {
        console.error('Undefined alt tag found:', $(el).attr('src'));
    }
});

// OG Image
const ogImage = $('meta[property="og:image"]').attr('content');
// Check for og:image tags
if (!ogImage) console.error('No og:image meta tag found');
// Check for undefined og:image tags
if (ogImage === 'undefined') console.error('Undefined og:image meta tag found');
// Check for empty og:image tags
if (ogImage === '') console.error('Empty og:image meta tag found');
// Check for default og:image tags
if (ogImage.includes('dbs-og-image')) console.error('Default og:image meta tag found please change it');

// Check for empty or # links
$('a').each((i, el) => {
    const href = $(el).attr('href');
    if (!href) {
        console.error('Empty href tag found for:', $(el).text().trim(), '-', $(el).attr('href'));
    }
    if (href === '#') {
        console.error('Placeholder link found for:', $(el).text().trim(), '-', $(el).attr('href'));
    }
});

// List all plausible tracking classes
const trackingLinks = $('[class*="plausible"]')

if (!trackingLinks.length) {
    console.error('No plausible tracking classes found');
}

if (trackingLinks.length > 0) {
    console.log('Plausible tracking classes:');
}

trackingLinks.each((i, el) => {
    const classes = $(el).attr('class').split(' ');
    classes.forEach((c) => {
        if (c.includes('plausible')) {
            console.log((c.split('=')[1]).replace(/\+/g, ' '));
        }
    });
});

if (trackingLinks.length > 0) console.log('-------------------');

// Remove flickity imports if not used
const carousel = $('.drive-hotspot-carousel');
if (!carousel.length) {
    $('script[src*="flickity"]').remove();
    $('link[href*="flickity"]').remove();
    console.log('Unused Flickity imports removed');
}

// Check for tracking scripts and tell me what they are
const trackingScripts = $('script[src]:not([src*="flickity"]):not([src*="_astro"])');
if (!trackingScripts.length) {
    console.error('No tracking scripts found');
}

if (trackingScripts.length > 0) {
    trackingScripts.each((i, el) => {
        console.log('Tracking script:', $(el).attr('src'));
    });
}


fs.writeFileSync('dist/index.html', $.html());

