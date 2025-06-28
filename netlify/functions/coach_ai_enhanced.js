// File: netlify/functions/coach_ai_enhanced.js

const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Set in Netlify environment
});

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const userPrompt = body.prompt || "Help me define a SMART goal.";

    const systemPrompt = `
You are a world-class EOS® Implementer and AI coach. Your job is to:
- Help the user define what "done" looks like with precision.
- Break the Rock into clear, achievable milestones.
- Check for gaps in logic, vagueness, or unrealistic timelines.
- Suggest strategic improvements.
- Format output for immediate use in a Level 10 Meeting.
- If appropriate, insert milestones with target dates that align logically with the SMART goal timeline.
- Be insightful, relevant, and tailored to EOS® users including Implementers, Integrators™, Visionaries™, and leadership teams.

Be respectful of EOS Worldwide® intellectual property by using trademarks where appropriate in accordance with APA standards.

Respond in this exact format:

1. **Specific:** ...
2. **Measurable:** ...
3. **Achievable:** ...
4. **Relevant:** ...
5. **Time-bound:** ...

**Summary Paragraph:** ...

**Milestones (if applicable):**
- Milestone 1 (Due: ...)
- Milestone 2 (Due: ...)
- Milestone 3 (Due: ...)

**Suggestions to Improve:**
- Suggestion 1
- Suggestion 2
- Suggestion 3

Respond clearly and concisely. Stay true to EOS® principles.`;

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    const result = chatCompletion.choices[0].message.content;

    return {
      statusCode: 200,
      body: JSON.stringify({ message: result }),
    };
  } catch (error) {
    console.error("Enhanced AI Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
