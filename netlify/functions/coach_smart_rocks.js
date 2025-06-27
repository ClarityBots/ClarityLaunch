// netlify/functions/coach_smart_rocks.js

const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.handler = async function (event) {
  try {
    const body = JSON.parse(event.body || "{}");
    const userPrompt = body.prompt || "Help me define a SMART goal.";
    const step = body.step || "Specific";
    const smartData = body.smartData || {};

    // 🎯 Handle final summary generation
    if (step === "summary") {
      const summaryPrompt = `
You are an expert EOS® facilitator. A user has defined a SMART goal with the following:

Specific: ${smartData.specific}
Measurable: ${smartData.measurable}
Achievable: ${smartData.achievable}
Relevant: ${smartData.relevant}
Time-bound: ${smartData["time-bound"]}

Create a concise SMART Rock summary they can copy into a tool like Ninety.io. Keep it one paragraph and easy to understand.
`;

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "system", content: summaryPrompt }],
      });

      return {
        statusCode: 200,
        body: JSON.stringify({
          summary: response.choices[0].message.content.trim(),
        }),
      };
    }

    // 🧠 Generate 2–3 options for a specific SMART step
    const suggestionPrompt = `
You are an EOS® implementer helping a user refine their goal using the SMART method. The current step is **${step}**.

Original goal: ${userPrompt}

Suggest 2–3 excellent **${step}** options that would help this goal become more SMART. Only return the list of suggestions without explanation.
`;

    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: suggestionPrompt }
      ],
    });

    const raw = aiResponse.choices[0].message.content.trim();
    const suggestions = raw
      .split(/\n+/)
      .map(s => s.replace(/^\d+[\.\)]?\s*/, "").trim())
      .filter(s => s.length > 0);

    return {
      statusCode: 200,
      body: JSON.stringify({ suggestions }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || "Unknown error" }),
    };
  }
};
