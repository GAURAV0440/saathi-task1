const normalizeVisaData = ({ country, passport, travel_dates, purpose, rawRequirements }) => {
  return {
    country: country.trim(),
    passport: passport.trim(),
    travel_dates: travel_dates.trim(),
    purpose: purpose.trim(),
    requirements: rawRequirements.map((req) => req.trim()),
  };
};

module.exports = normalizeVisaData;
