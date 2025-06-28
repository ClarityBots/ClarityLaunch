function initModeSwitch() {
  document.querySelectorAll('.mode').forEach(el => {
    el.addEventListener('click', () => {
      const mode = el.getAttribute('data-mode');
      window.location = mode === 'guided' ? 'guided.html' : 'index.html';
    });
  });
}

async function handleSubmit({ promptEl, roleEl, enhancedEl, milestoneEl, resultEl }) {
  const prompt = promptEl.value.trim();
  if (!prompt || !roleEl.value) {
    resultEl.textContent = 'Please select your role and enter a goal.';
    return;
  }

  resultEl.textContent = 'Loading…';
  try {
    const resp = await fetch('/.netlify/functions/coach_smart_rocks', {
      method: 'POST',
      body: JSON.stringify({
        prompt,
        role: roleEl.value,
        enhanced: enhancedEl.checked,
        milestones: milestoneEl.checked,
      })
    });
    const { text } = await resp.json();
    resultEl.textContent = text || 'No result received.';
  } catch (err) {
    resultEl.textContent = 'Error generating SMART Rock. Please try again.';
  }
}

function bindClassic() {
  document.getElementById('submitBtn').addEventListener('click', () => {
    handleSubmit({
      promptEl: document.getElementById('prompt'),
      roleEl: document.getElementById('role'),
      enhancedEl: document.getElementById('useEnhanced'),
      milestoneEl: document.getElementById('includeMilestones'),
      resultEl: document.getElementById('result'),
    });
  });
  document.getElementById('startOverBtn').addEventListener('click', () => {
    window.location = 'index.html';
  });
}

function bindGuided() {
  document.getElementById('submit-guided').addEventListener('click', () => {
    handleSubmit({
      promptEl: document.getElementById('prompt-guided'),
      roleEl: document.getElementById('role-guided'),
      enhancedEl: document.getElementById('useEnhanced-guided'),
      milestoneEl: document.getElementById('includeMilestones-guided'),
      resultEl: document.getElementById('result-guided'),
    });
  });
  document.getElementById('startOver-guided').addEventListener('click', () => {
    window.location = 'guided.html';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initModeSwitch();
  if (document.body.textContent.includes('Classic Mode')) bindClassic();
  else bindGuided();
});
