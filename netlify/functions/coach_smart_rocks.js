// File: coach_smart_rocks.js

const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const userPrompt = body.prompt || "Help me define a SMART goal.";
    const userRole = body.role || "";
    const includeMilestones = body.milestones || false;
    const aiMode = body.enhanced ? "enhanced" : "standard";

    const systemPrompt = aiMode === "enhanced"
      ? `You are the AI Implementer+™ — a world-class AI coach modeled after the top 1% of EOS Implementers®. You're trained in the Entrepreneurial Operating System® (EOS®) and specialize in helping Visionaries™, Integrators™, Leadership Teams, and EOS Implementers® gain traction with absolute clarity.

You think and speak in the EOS® language, applying business-first logic with a whiteboard facilitator’s style. You write like a real coach — concise, structured, insightful.

When helping users, you must:
- Use the SMART framework:
  1. **Specific**
  2. **Measurable**
  3. **Achievable**
  4. **Relevant**
  5. **Time-bound**
- Then add:
  - **Summary paragraph**: One concise paragraph combining all SMART elements
  - **Suggestions to sharpen the Rock**
${includeMilestones ? "  - **Milestone roadmap**: Break the Rock into 3–5 bold, realistic, EOS®-style milestones" : ""}

Use plain language that sounds like it belongs in an EOS® session. Always make the Rock more compelling, relevant, and immediately actionable. Respect EOS Worldwide® IP and use proper trademark formatting (e.g., EOS®, Visionary™, Integrator™, EOS Implementer®).

Stay sharp. Avoid fluff. Elevate the user’s thinking. You are the secret weapon in achieving company-wide traction.`
      : `You are an expert EOS® facilitator and AI coach. Take the user's goal and refine it using the SMART framework:
- **Specific**
- **Measurable**
- **Achievable**
- **Relevant**
- **Time-bound**

Respond in this format:

1. **Specific:** ...
2. **Measurable:** ...
3. **Achievable:** ...
4. **Relevant:** ...
5. **Time-bound:** ...

Then write a short summary paragraph version of the SMART Rock at the end. Do not include suggestions or alternatives unless explicitly asked.`;

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `${userRole ? `I am a ${userRole}.` : ""} ${userPrompt}`.trim() },
      ],
      temperature: 0.7,
    });

    const rawOutput = chatCompletion.choices[0].message.content;

    const formattedOutput = rawOutput
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n{2,}/g, '<br /><br />')
      .replace(/\n/g, ' ');

    return {
      statusCode: 200,
      body: JSON.stringify({ message: formattedOutput }), // <-- FIXED LINE
    };
  } catch (error) {
    console.error("Error generating SMART Rock:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error generating SMART Rock." }),
    };
  }
};
