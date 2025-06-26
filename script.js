// script.js
async function submitGoal() {
  const userInput = document.getElementById("userInput").value;
  const output = document.getElementById("output");
  const suggestions = document.getElementById("suggestions");

  output.style.display = "none";  // Hide initially
  suggestions.innerHTML = "";

  output.textContent = "Thinking...";
  output.style.display = "block";  // Show while working

  try {
    const response = await fetch("/.netlify/functions/coach_smart_rocks", {
      method: "POST",
      body: JSON.stringify({ prompt: userInput }),
    });

    const data = await response.json();
    output.textContent = data.result || data.error || "Unexpected error.";

    if (data.result) {
      const altPrompt = `Suggest 3 alternate phrasings of this SMART Rock:\n\n${data.result}`;
      const suggestionsResponse = await fetch("/.netlify/functions/coach_smart_rocks", {
        method: "POST",
        body: JSON.stringify({ prompt: altPrompt }),
      });

      const suggestionsData = await suggestionsResponse.json();
      if (suggestionsData.result) {
        const lines = suggestionsData.result.split(/\n+/);
        lines.forEach(line => {
          const li = document.createElement("li");
          li.textContent = line.replace(/^\d+\.\s*/, "");
          suggestions.appendChild(li);
        });
      }
    }

  } catch (err) {
    output.textContent = "Failed to connect to server.";
    console.error(err);
  }
}
