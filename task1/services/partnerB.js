const cheerio = require("cheerio");

const fakeHTML = `
  <html>
    <body>
      <ul id="requirements">
        <li>Visa application form</li>
        <li>Travel insurance covering €30,000</li>
        <li>Bank statements of last 3 months</li>
        <li>Cover letter stating purpose of visit</li>
      </ul>
    </body>
  </html>
`;

const fetchPartnerBData = async ({ country, passport, travel_dates, purpose }) => {
  const $ = cheerio.load(fakeHTML);
  const rawRequirements = [];
  $("#requirements li").each((i, el) => {
    rawRequirements.push($(el).text());
  });

  return {
    country,
    passport,
    travel_dates,
    purpose,
    rawRequirements,
  };
};

module.exports = fetchPartnerBData;
