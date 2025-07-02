const express = require("express");
const router = express.Router();
const { postVisaRequirements, getVisaRequirements } = require("../controllers/visaController");

router.post("/", postVisaRequirements);
router.get("/:country", getVisaRequirements);

module.exports = router;
