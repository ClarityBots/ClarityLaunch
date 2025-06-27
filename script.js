document.addEventListener("DOMContentLoaded", () => {
  const modeToggle = document.getElementById("mode-toggle");
  const title = document.getElementById("builder-title");
  const output = document.getElementById("output");
  const form = document.getElementById("smart-form");
  const userInput = document.getElementById("user-input");

  // Initialize mode
  let mode = "classic";

  // Update UI based on mode
  const updateModeUI = () => {
    if (mode === "guided") {
      title.textContent = "SMART Rock Coach";
      userInput.placeholder = "Let's begin. What is your Rock?";
    } else {
      title.textContent = "SMART Rock Builder";
      userInput.placeholder = "Type your response...";
    }
    output.innerHTML = ""; // Clear output on mode change
  };

  // Toggle listener
  modeToggle.addEventListener("change", () => {
    mode = modeToggle.checked ? "guided" : "classic";
    updateModeUI();
    console.log("Switched to:", mode);
  });

  // Submit logic (basic structure)
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const userText = userInput.value.trim();
    if (!userText) return;

    output.innerHTML = `<p><em>Thinking...</em></p>`;

    try {
      const response = await fetch("/.netlify/functions/coach_smart_rocks", {
        method: "POST",
        body: JSON.stringify({
          prompt: userText,
          mode: mode,
        }),
      });

      const data = await response.json();
      output.innerHTML = `<pre>${data.result || "No response."}</pre>`;
    } catch (err) {
      output.innerHTML = `<p style="color:red;">Error: ${err.message}</p>`;
    }
  });

  updateModeUI(); // Run once on load
});
