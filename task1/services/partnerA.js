const fetchPartnerAData = async ({ country, passport, travel_dates, purpose }) => {
  return {
    country,
    passport,
    travel_dates,
    purpose,
    rawRequirements: [
      "Valid passport with 6 months validity",
      "2 passport-size photos",
      "Confirmed return flight tickets",
      "Proof of accommodation",
    ],
  };
};

module.exports = fetchPartnerAData;
