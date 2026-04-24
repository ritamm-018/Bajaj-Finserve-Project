const { processData } = require("../utils/processor");

// Personal details — update these before submission
const USER_ID = "johndoe_17091999";
const EMAIL_ID = "john.doe@srmist.edu.in";
const COLLEGE_ROLL_NUMBER = "RA2111003010001";

/**
 * POST /bfhl
 * Accepts { data: string[] } and returns structured hierarchy insights.
 */
async function processDataHandler(req, res) {
  try {
    const { data } = req.body;

    // Basic input validation
    if (!data) {
      return res.status(400).json({
        error: "Missing required field: data",
      });
    }

    if (!Array.isArray(data)) {
      return res.status(400).json({
        error: "Field 'data' must be an array of strings",
      });
    }

    const result = processData(data);

    return res.status(200).json({
      user_id: USER_ID,
      email_id: EMAIL_ID,
      college_roll_number: COLLEGE_ROLL_NUMBER,
      hierarchies: result.hierarchies,
      invalid_entries: result.invalidEntries,
      duplicate_edges: result.duplicateEdges,
      summary: result.summary,
    });
  } catch (err) {
    console.error("Error processing /bfhl request:", err);
    return res.status(500).json({ error: "Failed to process request" });
  }
}

module.exports = { processData: processDataHandler };
