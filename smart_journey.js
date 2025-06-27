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
  const suggestions = await getAISuggestions(userInput, step);

  if (suggestions.length > 0) {
    showSuggestionOptions(suggestions, step);
  } else {
    appendMessage("bot", "AI didn't respond as expected.");
  }
});

function appendMessage(sender, text) {
  const msg = document.createElement("div");
  msg.className = sender;
  msg.innerText = text;
  conversationBox.appendChild(msg);
  conversationBox.scrollTop = conversationBox.scrollHeight;
}

function showSuggestionOptions(suggestions, step) {
  const wrapper = document.createElement("div");
  wrapper.className = "bot";

  suggestions.forEach((suggestion, index) => {
    const btn = document.createElement("button");
    btn.textContent = suggestion;
    btn.onclick = () => {
      smartData[step.toLowerCase()] = suggestion;
      appendMessage("bot", `✅ Selected: ${suggestion}`);
      wrapper.remove();

      currentStepIndex++;

      if (currentStepIndex < steps.length) {
        appendMessage("bot", `Now let’s work on ${steps[currentStepIndex]}...`);
      } else {
        generateSmartSummary(smartData);
      }
    };
    wrapper.appendChild(btn);
  });

  conversationBox.appendChild(wrapper);
}

async function getAISuggestions(userInput, step) {
  try {
    const res = await fetch("/.netlify/functions/coach_smart_rocks", {
      method: "POST",
      body: JSON.stringify({ prompt: userInput, step }),
    });
    const data = await res.json();
    return data.suggestions || [];
  } catch (e) {
    return [];
  }
}

async function generateSmartSummary(smartData) {
  try {
    const res = await fetch("/.netlify/functions/coach_smart_rocks", {
      method: "POST",
      body: JSON.stringify({ step: "summary", smartData }),
    });
    const data = await res.json();
    showSummary(data.summary);
  } catch (e) {
    showSummary("Error generating SMART summary.");
  }
}

function showSummary(text) {
  summaryText.innerText = text;
  summaryContainer.style.display = "block";
}
