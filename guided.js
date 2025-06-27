// guided.js

document.getElementById("smart-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const specific = document.getElementById("specific").value.trim();
  const measurable = document.getElementById("measurable").value.trim();
  const achievable = document.getElementById("achievable").value.trim();
  const relevant = document.getElementById("relevant").value.trim();
  const timebound = document.getElementById("timebound").value.trim();

  if (!(specific && measurable && achievable && relevant && timebound)) {
    alert("Please fill out all fields before submitting.");
    return;
  }

  const userPrompt = `
Using the SMART framework, format the following input as a concise SMART Rock with single-sentence responses for each letter, followed by a brief summary paragraph:
1. Specific: ${specific}
2. Measurable: ${measurable}
3. Achievable: ${achievable}
4. Relevant: ${relevant}
5. Time-bound: ${timebound}
`;

  try {
    const res = await axios.post("/.netlify/functions/coach_smart_rocks", {
      prompt: userPrompt,
    });

    const output = document.getElementById("smart-response");
    output.textContent = res.data.response;
    document.getElementById("summary-output").classList.remove("hidden");
    document.getElementById("smart-form").classList.add("hidden");
  } catch (err) {
    alert("An error occurred while contacting the AI coach.");
    console.error(err);
  }
});
