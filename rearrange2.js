const fs = require('fs');

const file = 'd:/GROVA/index.html';
let html = fs.readFileSync(file, 'utf8');

const extractSectionByRealId = (id, commentName) => {
    // The user's changes removed the leading spaces on comments
    const regex = new RegExp(`<!-- ========== SECTION: ${commentName} ========== -->[\\s\\S]*?<section id="${id}">[\\s\\S]*?</section>`, 'g');
    const match = html.match(regex);
    if (!match) {
        console.log("Failed to find", id);
        return '';
    }
    html = html.replace(match[0], '');
    return match[0];
}

const sHero = extractSectionByRealId('hero', 'HERO');
const sStats = extractSectionByRealId('stats', 'STATS COUNTER');
const sFeatures = extractSectionByRealId('features', 'WHY GROVA \\(Features\\)');
const sMenu = extractSectionByRealId('menu', 'MENU');
const sShowcase = extractSectionByRealId('showcase', 'FEATURED SHOWCASE');
const sTestimonials = extractSectionByRealId('testimonials', 'TESTIMONIALS');
const sHowItWorks = extractSectionByRealId('how-it-works', 'HOW IT WORKS');
const sSectionThree = extractSectionByRealId('section-three', 'BRAND REVEAL');
const sGallery = extractSectionByRealId('gallery', 'GALLERY MARQUEE');
const sNewsletter = extractSectionByRealId('newsletter', 'NEWSLETTER / CTA');

const newContent = `
${sHero}

${sGallery}

${sStats}

${sFeatures}

${sMenu}

${sShowcase}

${sTestimonials}

${sHowItWorks}

${sSectionThree}

${sNewsletter}
`;

html = html.replace(/<div id="content">[\s\S]*?<\/div><!-- \/#content -->/, `<div id="content">\n${newContent}\n  </div><!-- /#content -->`);

fs.writeFileSync(file, html);
console.log('Reordered successfully!');
