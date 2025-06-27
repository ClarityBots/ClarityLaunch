// smart_journey.js
const steps = ["Specific", "Measurable", "Achievable", "Relevant", "Time-bound"];
let currentStepIndex = 0;
let smartData = {};
let conversationBox = document.getElementById("conversation");
let inputField = document.getElementById("userInput");
let submitBtn = document.getElementById("submitBtn");
let summaryContainer = document.getElementById("summaryContainer");
let summaryText = document.getElementById("summaryText");

submitBtn.addEventListener("click", async () => {
  const userInput = inputField.value.trim();
  if (!userInput) return;

  appendMessage("user", userInput);
  inputField.value = "";

  const step = steps[currentStepIndex];
  const aiResponse = await getAIResponse(userInput, step);
  appendMessage("bot", aiResponse);

  const confirm = await waitForUserApproval();
  if (confirm) {
    smartData[step.toLowerCase()] = aiResponse;
    currentStepIndex++;

    if (currentStepIndex < steps.length) {
      appendMessage("bot", `Now let's work on **${steps[currentStepIndex]}**.`);
    } else {
      const summary = await getSummaryFromBackend(smartData);
      showSummary(summary);
    }
  } else {
    appendMessage("bot", `Okay, let’s try a new response for **${step}**.`);
  }
});

function appendMessage(sender, text) {
  const msg = document.createElement("div");
  msg.className = sender;
  msg.innerText = text;
  conversationBox.appendChild(msg);
  conversationBox.scrollTop = conversationBox.scrollHeight;
}

function waitForUserApproval() {
  return new Promise((resolve) => {
    const approveBtn = document.createElement("button");
    approveBtn.textContent = "Accept";
    approveBtn.onclick = () => {
      approveBtn.remove();
      reviseBtn.remove();
      resolve(true);
    };

    const reviseBtn = document.createElement("button");
    reviseBtn.textContent = "Revise";
    reviseBtn.onclick = () => {
      approveBtn.remove();
      reviseBtn.remove();
      resolve(false);
    };

    conversationBox.appendChild(approveBtn);
    conversationBox.appendChild(reviseBtn);
  });
}

async function getAIResponse(userInput, step) {
  try {
    const res = await fetch("/.netlify/functions/coach_smart_rocks", {
      method: "POST",
      body: JSON.stringify({ prompt: userInput, step }),
    });
    const data = await res.json();
    return data.reply || "AI didn't respond as expected.";
  } catch (e) {
    return "Error contacting AI.";
  }
}

async function getSummaryFromBackend(smartData) {
  try {
    const res = await fetch("/.netlify/functions/coach_smart_rocks", {
      method: "POST",
      body: JSON.stringify({ step: "summary", smartData }),
    });
    const data = await res.json();
    return data.summary || "Could not generate summary.";
  } catch (e) {
    return "Error generating summary.";
  }
}

document.getElementById("copySummaryBtn").addEventListener("click", () => {
  navigator.clipboard.writeText(summaryText.innerText);
  alert("Summary copied to clipboard!");
});

function showSummary(text) {
  summaryText.innerText = text;
  summaryContainer.style.display = "block";
}
