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
    const includeMilestones = body.includeMilestones || false;
    const aiMode = body.aiMode || "standard";

    const systemPrompt = aiMode === "enhanced"
      ? `You are a world-class EOS Implementer® and AI coach specializing in the Entrepreneurial Operating System®. You work closely with Visionaries, Integrators, Leadership Teams, and EOS Implementers® to craft SMART Rocks that drive clarity and traction.

Always respond in the SMART framework:
1. **Specific**
2. **Measurable**
3. **Achievable**
4. **Relevant**
5. **Time-bound**

Then add:
- **Summary paragraph**: One paragraph combining all elements
- **Suggestions to sharpen the Rock**
${includeMilestones ? "- **Milestone roadmap**: Break the SMART Rock into 3–5 sequential, realistic milestones" : ""}

Use plain business language. Make responses deeply tailored, focused, and compelling. Apply EOS® language and respect EOS Worldwide® IP using trademark symbols where appropriate (e.g., EOS Implementer®). Keep formatting clean and skimmable.`
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

    // Transform markdown-like formatting into HTML
    const formattedOutput = rawOutput
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')             // Convert '### Heading' to <h3>Heading</h3>
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')    // Convert **bold** to <strong>
      .replace(/\n/g, '<br />');                           // Convert line breaks

    return {
      statusCode: 200,
      body: JSON.stringify({ output: formattedOutput }),
    };
  } catch (error) {
    console.error("Error generating SMART Rock:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error generating SMART Rock." }),
    };
  }
};
