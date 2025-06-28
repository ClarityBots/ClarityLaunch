// main.js

document.addEventListener("DOMContentLoaded", () => {
  const generateBtn = document.getElementById("generateBtn");
  const outputContainer = document.getElementById("outputContainer");
  const goalInput = document.getElementById("goalInput");
  const roleSelect = document.getElementById("roleSelect");
  const enhancedAI = document.getElementById("enhancedAI");
  const includeMilestones = document.getElementById("includeMilestones");

  generateBtn.addEventListener("click", async () => {
    const userPrompt = goalInput.value.trim();
    if (!userPrompt) {
      outputContainer.innerHTML = "<p>Please enter a SMART Rock goal.</p>";
      return;
    }

    const payload = {
      prompt: userPrompt,
      role: roleSelect?.value || "",
      aiMode: enhancedAI?.checked ? "enhanced" : "standard",
      includeMilestones: includeMilestones?.checked || false
    };

    try {
      const response = await fetch("/.netlify/functions/coach_smart_rocks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      outputContainer.innerHTML = data.output ? `<div>${data.output}</div>` : "<p>No result received.</p>";
    } catch (err) {
      console.error("Error:", err);
      outputContainer.innerHTML = "<p>Error generating SMART Rock. Please try again.</p>";
    }
  });
});
