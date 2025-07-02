const fetchPartnerAData = require("../services/partnerA");
const fetchPartnerBData = require("../services/partnerB");
const normalizeVisaData = require("../utils/normalize");
const MongoVisa = require("../models/mongoVisaModel");
const mysql = require("../db/mysql");
const fs = require("fs");

const postVisaRequirements = async (req, res) => {
  try {
    const { country, passport, travel_dates, purpose } = req.body;

    const dataA = await fetchPartnerAData({ country, passport, travel_dates, purpose });
    const dataB = await fetchPartnerBData({ country, passport, travel_dates, purpose });

    const normA = normalizeVisaData(dataA);
    const normB = normalizeVisaData(dataB);

    const combined = {
      ...normA,
      requirements: [...normA.requirements, ...normB.requirements],
    };

    const mongoEntry = new MongoVisa(combined);
    await mongoEntry.save();

    const sql = `INSERT INTO visa_requirements (country, passport, travel_dates, purpose, requirements)
                 VALUES (?, ?, ?, ?, ?)`;
    mysql.query(sql, [
      combined.country,
      combined.passport,
      combined.travel_dates,
      combined.purpose,
      JSON.stringify(combined.requirements),
    ]);

    const response = { message: "Visa requirements saved successfully!", data: combined };

    // ✅ Log POST response
    const postLogFile = "post_visa_log.json";
    const postLog = fs.existsSync(postLogFile)
      ? JSON.parse(fs.readFileSync(postLogFile))
      : [];
    postLog.push({
      type: "POST",
      timestamp: new Date().toISOString(),
      query: req.body,
      saved_data: combined,
    });
    fs.writeFileSync(postLogFile, JSON.stringify(postLog, null, 2));

    res.status(201).json(response);
  } catch (err) {
    console.error("❌ Error in postVisaRequirements:", err);
    res.status(500).json({ error: "Something went wrong." });
  }
};

const getVisaRequirements = async (req, res) => {
  try {
    const country = req.params.country;
    const results = await MongoVisa.find({ country });

    if (!results || results.length === 0) {
      return res.status(404).json({ message: "No data found for this country" });
    }

    // ✅ Log GET response
    const getLogFile = "get_visa_log.json";
    const getLog = fs.existsSync(getLogFile)
      ? JSON.parse(fs.readFileSync(getLogFile))
      : [];
    getLog.push({
      type: "GET",
      timestamp: new Date().toISOString(),
      country,
      result_count: results.length,
      results,
    });
    fs.writeFileSync(getLogFile, JSON.stringify(getLog, null, 2));

    res.status(200).json({ data: results });
  } catch (err) {
    console.error("❌ Error in getVisaRequirements:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { postVisaRequirements, getVisaRequirements };
