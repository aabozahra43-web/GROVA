const fs = require('fs');

const file = 'd:/GROVA/index.html';
let html = fs.readFileSync(file, 'utf8');

// Extract sections
const extractSection = (id) => {
    const regex = new RegExp(`<!-- ========== SECTION: ${id}.*?========== -->[\\s\\S]*?<section id="${id}">[\\s\\S]*?</section>`, 'g');
    const match = html.match(regex);
    if (!match) return '';
    html = html.replace(match[0], `__PLACEHOLDER_${id}__`);
    return match[0];
};

const extractSectionByRealId = (id, commentName) => {
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
const sFeatures = extractSectionByRealId('features', 'WHY GROVA \\(Features\\)');
const sSectionThree = extractSectionByRealId('section-three', 'BRAND REVEAL');
const sStats = extractSectionByRealId('stats', 'STATS COUNTER');
const sMenu = extractSectionByRealId('menu', 'MENU');
const sHowItWorks = extractSectionByRealId('how-it-works', 'HOW IT WORKS');
const sShowcase = extractSectionByRealId('showcase', 'FEATURED SHOWCASE');
const sTestimonials = extractSectionByRealId('testimonials', 'TESTIMONIALS');
const sGallery = extractSectionByRealId('gallery', 'GALLERY MARQUEE');
const sNewsletter = extractSectionByRealId('newsletter', 'NEWSLETTER / CTA');

const newContent = `
${sHero}

${sStats}

${sFeatures}

${sMenu}

${sShowcase}

${sTestimonials}

${sHowItWorks}

${sSectionThree}

${sGallery}

${sNewsletter}
`;

html = html.replace(/<div id="content">[\s\S]*?<\/div><!-- \/#content -->/, `<div id="content">\n${newContent}\n  </div><!-- /#content -->`);

fs.writeFileSync(file, html);
console.log('Reordered successfully!');
