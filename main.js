// main.js

document.addEventListener("DOMContentLoaded", () => {
  const roleInput = document.getElementById("role");
  const goalInput = document.getElementById("goal");
  const enhancedCheckbox = document.getElementById("enhanced-ai");
  const milestoneCheckbox = document.getElementById("include-milestones");
  const generateBtn = document.getElementById("generate-btn");
  const outputContainer = document.getElementById("output");
  const startOverBtn = document.getElementById("start-over");

  const viewClassic = document.getElementById("view-classic");
  const viewGuided = document.getElementById("view-guided");

  // View switcher
  if (viewClassic && viewGuided) {
    viewClassic.addEventListener("click", () => {
      window.location.href = "index.html";
    });
    viewGuided.addEventListener("click", () => {
      window.location.href = "guided.html";
    });
  }

  // Clear fields
  startOverBtn.addEventListener("click", () => {
    roleInput.value = "";
    goalInput.value = "";
    enhancedCheckbox.checked = false;
    milestoneCheckbox.checked = false;
    outputContainer.innerHTML = "";
  });

  generateBtn.addEventListener("click", async () => {
    const role = roleInput.value.trim();
    const goal = goalInput.value.trim();
    const useEnhancedAI = enhancedCheckbox.checked;
    const includeMilestones = milestoneCheckbox.checked;

    if (!goal) {
      outputContainer.innerHTML = "<p>Please enter your goal.</p>";
      return;
    }

    let prompt = `
You are an expert EOS® Implementer helping a ${role || "user"} refine a ROCK using the SMART framework.

The user’s goal is: ${goal}

Respond with a SMART breakdown:
1. **Specific:** ...
2. **Measurable:** ...
3. **Achievable:** ...
4. **Relevant:** ...
5. **Time-bound:** ...

Then, write a summary paragraph that clearly defines the ROCK.

${useEnhancedAI ? "Also include three suggestions to improve this ROCK as a bulleted list." : ""}
${includeMilestones ? "Then break the ROCK into 3–5 logical milestones with interim due dates before the final deadline." : ""}
`;

    outputContainer.innerHTML = "<p>Thinking...</p>";

    try {
      const res = await fetch("/.netlify/functions/coach_smart_rocks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      outputContainer.innerHTML = data.message || "<p>Something went wrong.</p>";
    } catch (err) {
      console.error(err);
      outputContainer.innerHTML = "<p>Error generating response.</p>";
    }
  });
});
