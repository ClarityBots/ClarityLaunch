const { OpenAI } = require("openai");

let openai;

try {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
} catch (initError) {
  console.error("❌ Failed to initialize OpenAI:", initError);
}

exports.handler = async (event) => {
  try {
    if (!openai) {
      throw new Error("OpenAI client not initialized.");
    }

    const body = JSON.parse(event.body || "{}");
    const { prompt, step, smartData } = body;

    console.log("📥 Incoming request:", { step, prompt, smartData });

    if (!step) {
      throw new Error("Missing 'step' in request.");
    }

    // ✅ Handle summary request
    if (step === "summary") {
      if (!smartData || !smartData.specific) {
        throw new Error("Missing smartData for summary generation.");
      }

      const summaryPrompt = `
You are an expert EOS® facilitator. Using the SMART breakdown below, write a concise paragraph summarizing the complete SMART Rock in a way that’s ready to paste into Ninety.io. Avoid listing S-M-A-R-T; instead, consolidate into a natural business sentence.

SMART breakdown:
Specific: ${smartData.specific}
Measurable: ${smartData.measurable}
Achievable: ${smartData.achievable}
Relevant: ${smartData.relevant}
Time-bound: ${smartData["time-bound"]}
      `;

      const summaryResponse = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are an EOS facilitator." },
          { role: "user", content: summaryPrompt },
        ],
      });

      const summaryText = summaryResponse.choices[0].message.content.trim();
      console.log("✅ Summary response:", summaryText);

      return {
        statusCode: 200,
        body: JSON.stringify({ summary: summaryText }),
      };
    }

    // ✅ Handle SMART step coaching
    if (!prompt) {
      throw new Error("Missing 'prompt' for SMART step refinement.");
    }

    const coachingPrompt = `
You are an EOS® coach helping a client define their SMART Rock. Focus only on the "${step}" component. Respond with one concise, practical suggestion.

User's input: ${prompt}
`;

    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are an EOS SMART Rock coach." },
        { role: "user", content: coachingPrompt },
      ],
    });

    console.log("✅ AI raw response:", JSON.stringify(aiResponse, null, 2));

    const reply = aiResponse.choices?.[0]?.message?.content?.trim();
    console.log("🧠 Final reply:", reply);

    if (!reply) {
      throw new Error("No reply content found in AI response.");
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ reply }),
    };

  } catch (err) {
    console.error("❌ Function error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "An error occurred while processing your request." }),
    };
  }
};
