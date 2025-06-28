<!-- File: guided.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>SMART Rock Builder – Guided</title>
  <link rel="stylesheet" href="style.css" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet" />
  <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
</head>
<body>
  <div class="container">
    <h1>SMART Rock Builder – Guided Mode</h1>

    <div class="user-role">
      <label for="guided-user-role">I am a:</label>
      <select id="guided-user-role">
        <option value="">Select...</option>
        <option value="visionary">Visionary</option>
        <option value="integrator">Integrator</option>
        <option value="EOS Implementer">EOS Implementer®</option>
        <option value="leadership">Leadership Team Member</option>
        <option value="self">Self-Implementer</option>
      </select>
    </div>

    <form id="guided-form">
      <label for="specific">1. Specific – What exactly do you want to accomplish?</label>
      <textarea id="specific" name="specific" required></textarea>

      <label for="measurable">2. Measurable – How will you track success?</label>
      <textarea id="measurable" name="measurable" required></textarea>

      <label for="achievable">3. Achievable – Why is this realistic and doable?</label>
      <textarea id="achievable" name="achievable" required></textarea>

      <label for="relevant">4. Relevant – Why does this matter to your business/life?</label>
      <textarea id="relevant" name="relevant" required></textarea>

      <label for="timebound">5. Time-bound – What is your deadline?</label>
      <textarea id="timebound" name="timebound" required></textarea>

      <button type="submit">Generate SMART Rock</button>
    </form>

    <h2>AI Output</h2>
    <div id="guided-response-box"></div>
    <button id="guided-reset">Start Over</button>

    <!-- Enhanced AI Toggle -->
    <div class="toggle-container">
      <label class="switch">
        <input type="checkbox" id="guided-ai-toggle" />
        <span class="slider round"></span>
      </label>
      <span id="ai-mode-label">Standard AI | Enhanced AI</span>
    </div>

    <!-- Milestone Toggle -->
    <div class="toggle-container">
      <label class="switch">
        <input type="checkbox" id="guided-milestone-toggle" />
        <span class="slider round"></span>
      </label>
      <span id="milestone-label">Milestones Off | Milestones On</span>
    </div>

    <!-- Page Toggle -->
    <div class="toggle-container">
      <label class="switch">
        <input type="checkbox" id="mode-toggle" />
        <span class="slider round"></span>
      </label>
      <span id="mode-label">Classic | Guided</span>
    </div>
  </div>

  <script>
    const form = document.getElementById("guided-form");
    const responseBox = document.getElementById("guided-response-box");
    const resetBtn = document.getElementById("guided-reset");
    const roleSelect = document.getElementById("guided-user-role");
    const aiToggle = document.getElementById("guided-ai-toggle");
    const milestoneToggle = document.getElementById("guided-milestone-toggle");
    const modeToggle = document.getElementById("mode-toggle");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const prompt = `
You are an expert EOS® Implementer. Help this ${roleSelect.value || "unspecified role"} refine their goal using the SMART framework:

1. Specific: ${form.specific.value}
2. Measurable: ${form.measurable.value}
3. Achievable: ${form.achievable.value}
4. Relevant: ${form.relevant.value}
5. Time-bound: ${form.timebound.value}

Respond in this format:

1. **Specific:** ...
2. **Measurable:** ...
3. **Achievable:** ...
4. **Relevant:** ...
5. **Time-bound:** ...

Then write a short summary paragraph version of the SMART Rock at the end.`;

      let finalPrompt = prompt;

      if (aiToggle.checked) {
        finalPrompt += `

Also provide 3 expert-level suggestions to make this Rock sharper and more likely to succeed.`;
      }

      if (milestoneToggle.checked) {
        finalPrompt += `

Finally, break the SMART Rock into 3–5 milestone checkpoints, each with a short label and target date before the final due date.`;
      }

      responseBox.innerHTML = "<p><em>Generating your SMART Rock...</em></p>";

      try {
        const res = await axios.post("/.netlify/functions/coach_smart_rocks", {
          prompt: finalPrompt,
        });

        const formatted = res.data.message
          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
          .replace(/\n/g, "<br>");

        responseBox.innerHTML = `<div class="ai-response">${formatted}</div>`;
      } catch (err) {
        responseBox.innerHTML = "<p>Error generating SMART Rock. Please try again.</p>";
        console.error(err);
      }
    });

    resetBtn.addEventListener("click", () => {
      form.reset();
      responseBox.innerHTML = "";
      aiToggle.checked = false;
      milestoneToggle.checked = false;
      roleSelect.selectedIndex = 0;
    });

    modeToggle.addEventListener("change", () => {
      window.location.href = "index.html";
    });
  </script>
</body>
</html>
