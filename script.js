async function submitGoal() {
  const userInput = document.getElementById("userInput").value;
  const output = document.getElementById("output");

  output.textContent = "Thinking...";

  try {
    const response = await fetch("/.netlify/functions/coach_smart_rocks", {
      method: "POST",
      body: JSON.stringify({ prompt: userInput }),
    });

    const data = await response.json();
    output.textContent = data.result || data.error || "Unexpected error.";
  } catch (err) {
    output.textContent = "Failed to connect to server.";
    console.error(err);
  }
}
