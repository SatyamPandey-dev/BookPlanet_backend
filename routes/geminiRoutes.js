import express from "express";
import processBook from "../config/gemini.js";

const router = express.Router();

router.post("/action", async (req, res) => {
  const { bookUrl, queryType, question } = req.body;

  if (!bookUrl) {
    return res.status(400).json({ error: "bookUrl is required." });
  }

  if (!["summary", "question"].includes(queryType)) {
    return res
      .status(400)
      .json({ error: 'Invalid queryType. Must be "summary" or "question".' });
  }

  if (queryType === "question" && !question) {
    return res
      .status(400)
      .json({ error: 'Question is required for queryType "question".' });
  }

  const result = await processBook(bookUrl, queryType, question);

  if (result.success) {
    res.json({ result: result.response });
  } else {
    res.status(500).json({ error: result.error });
  }
});

export default router;
