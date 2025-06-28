// File: main.js

document.addEventListener("DOMContentLoaded", () => {
  const roleSelect = document.getElementById("user-role");
  const inputField = document.getElementById("classic-input");
  const submitBtn = document.getElementById("classic-submit");
  const responseBox = document.getElementById("classic-response-box");
  const resetBtn = document.getElementById("classic-reset");
  const modeToggle = document.getElementById("mode-toggle");
  const aiToggle = document.getElementById("ai-mode-toggle");
  const milestoneToggle = document.getElementById("milestone-toggle");

  submitBtn.addEventListener("click", async () => {
    const role = roleSelect.value;
    const input = inputField.value.trim();
    const enhancedAI = aiToggle.checked;
    const includeMilestones = milestoneToggle.checked;

    if (!input) {
      responseBox.innerHTML = "<p>Please enter your goal before submitting.</p>";
      return;
    }

    let prompt = `
You are an expert EOS® Implementer. Help this ${role || "unspecified role"} refine their goal using the SMART framework:
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

Then write a short summary paragraph version of the SMART Rock at the end.`;

    if (enhancedAI) {
      prompt += `

Also provide 3 expert-level suggestions to make this Rock sharper and more likely to succeed.`;
    }

    if (includeMilestones) {
      prompt += `

Finally, break the SMART Rock into 3–5 milestone checkpoints, each with a short label and target date before the final due date.`;
    }

    prompt += `

User's original goal:
"${input}"
`;

    responseBox.innerHTML = "<p><em>Generating your SMART Rock...</em></p>";

    try {
      const res = await axios.post("/.netlify/functions/coach_smart_rocks", {
        prompt,
      });

      const text = res.data.message || "No response from AI.";
      const formatted = text
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\n/g, "<br>");

      responseBox.innerHTML = `<div class="ai-response">${formatted}</div>`;
    } catch (err) {
      responseBox.innerHTML = "<p>Error generating SMART Rock. Please try again.</p>";
      console.error(err);
    }
  });

  resetBtn.addEventListener("click", () => {
    roleSelect.selectedIndex = 0;
    inputField.value = "";
    responseBox.innerHTML = "";
    milestoneToggle.checked = false;
  });

  modeToggle.addEventListener("change", () => {
    window.location.href = "guided.html";
  });
});
