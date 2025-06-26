const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const userPrompt = body.prompt || "Help me define a SMART goal.";

    const systemPrompt = `
You are an expert EOS® facilitator and AI coach. Take the user's goal and refine it using the SMART framework:
- **S**pecific
- **M**easurable
- **A**chievable
- **R**elevant
- **T**ime-bound

Respond in this format:

1. **Specific:** ...
2. **Measurable:** ...
3. **Achievable:** ...
4. **Relevant:** ...
5. **Time-bound:** ...

Then write a short summary paragraph version of the SMART Rock at the end. Do not include suggestions or alternatives unless explicitly asked.
`;

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
    });

    const result = chatCompletion.choices[0].message.content;
    return {
      statusCode: 200,
      body: JSON.stringify({ result }),
    };

  } catch (error) {
    console.error("Error in coach_smart_rocks.js:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "An error occurred while processing your request." }),
    };
  }
};
