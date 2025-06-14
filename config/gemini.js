import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import fetch from "node-fetch";
import pdfjsLib from "pdfjs-dist";

import path from "path";
import url from "url";

dotenv.config();
const { getDocument, GlobalWorkerOptions } = pdfjsLib;

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
GlobalWorkerOptions.workerSrc = path.join(
  __dirname,
  "../node_modules/pdfjs-dist/build/pdf.worker.js"
);

const genAI = new GoogleGenerativeAI(process.env.G_API_KEY);
const model = genAI.getGenerativeModel({
  model: "models/gemini-1.5-flash-latest",
});

async function fetchPdfText(pdfUrl) {
  try {
    const response = await fetch(pdfUrl);
    if (!response.ok) throw new Error(`Failed to fetch PDF from ${pdfUrl}`);
    const arrayBuffer = await response.arrayBuffer();

    const pdf = await getDocument({ data: arrayBuffer }).promise;

    let fullText = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map((item) => item.str).join(" ");
      fullText += pageText + "\n";
    }
    return fullText;
  } catch (error) {
    console.error("PDF text extraction error:", error.message);
    throw error;
  }
}

async function processBook(bookUrl, queryType, question = " ") {
  try {
    const bookText = await fetchPdfText(bookUrl);

    const promptText =
      queryType === "summary"
        ? `Please provide a concise summary of the following book text:\n\n${bookText}`
        : `Based on the following book text, answer the question:\n${question}\n\n${bookText}`;

    const parts = [
      {
        text: promptText,
      },
    ];

    const result = await model.generateContent({
      contents: [{ parts }],
    });

    const text = result.response.text();
    return { success: true, response: text };
  } catch (error) {
    console.error("Error processing book:", error);
    return {
      success: false,
      error:
        "Server error: Unable to process the PDF text or quota exceeded. Please try again later.",
    };
  }
}

export default processBook;
