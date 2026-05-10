import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

app.post("/analyze", async (req, res) => {
  try {
    const data = req.body;

    const prompt = `
You are an expert GitHub recruiter AI.

Analyze this GitHub profile data:

${JSON.stringify(data, null, 2)}

Return STRICT JSON only in this format:

{
  "developerType": "",
  "summary": "",
  "insights": ["", "", ""],
  "focus": ""
}

Rules:
- Be realistic
- Sound professional
- Give meaningful insights
- Avoid generic praise
- Mention strengths and weaknesses
`;

    const response = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: "You are a GitHub profile analysis AI."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7
    });

    const content = response.choices[0].message.content;

    res.json({
      result: content
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "AI analysis failed"
    });
  }
});


app.post("/analyze-recruiter", async (req, res) => {
  try {

    const data = req.body;

    const prompt = `
You are an expert technical recruiter AI.

Candidate GitHub Data:
${JSON.stringify(data, null, 2)}

Recruiter Requirement:
${data.requirement}

Return STRICT JSON only:

{
  "matchScore": "",
  "strengths": ["", "", ""],
  
}

Rules:
- Be realistic
- Evaluate technical fit
- Mention strengths and missing skills
- Keep recommendation concise
`;

    const response =
      await client.chat.completions.create({
        model: "llama-3.1-8b-instant",

        messages: [
          {
            role: "system",
            content:
              "You are a technical recruiter AI.",
          },

          {
            role: "user",
            content: prompt,
          },
        ],

        temperature: 0.7,
      });

    const content =
      response.choices[0].message.content;
    
    const cleanContent = content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    console.log(cleanContent);
    res.json({
      result: cleanContent
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Recruiter AI failed",
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});