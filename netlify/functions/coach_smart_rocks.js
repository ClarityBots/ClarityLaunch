// coach_smart_rocks.js

const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // from Netlify environment
});

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const userPrompt = body.prompt || "Help me define a SMART goal.";

    const systemPrompt = `
You are an expert EOS® facilitator and AI coach. Take the user's goal and refine it using the SMART framework:
- Specific
- Measurable
- Achievable
- Relevant
- Time-bound

Respond in this format:

1. **Specific:** ...
2. **Measurable:** ...
3. **Achievable:** ...
4. **Relevant:** ...
5. **Time-bound:** ...

Then write a short summary paragraph version of the SMART Rock at the end.

Also list 3 suggestions to improve or sharpen the SMART Rock. Format them as a bulleted list.
    `;

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    const result = chatCompletion.choices?.[0]?.message?.content || "No response generated.";

    return {
      statusCode: 200,
      body: JSON.stringify({ message: result }),
    };
  } catch (error) {
    console.error("End – Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
