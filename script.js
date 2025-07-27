const TIKTOK_REGEX = /^https?:\/\/(www\.|m\.)?tiktok\.com|vt\.tiktok\.com/;

function showOptions() {
  const url = document.getElementById('tiktokUrl').value.trim();
  const optionsBox = document.getElementById('downloadOptions');

  if (!url || !TIKTOK_REGEX.test(url)) {
    alert('Please paste a valid TikTok link.');
    return;
  }
  optionsBox.style.display = 'block';
}

// Download option handler
async function downloadOption(format) {
  const url = document.getElementById('tiktokUrl').value.trim();
  const container = document.getElementById('downloadContainer');

  if (!url || !/^https?:\/\/(www\.)?tiktok\.com/.test(url)) {
    alert('Please paste a valid TikTok link.');
    return;
  }

  // Loading indicator
  container.innerHTML = `
    <div class="loading-indicator">
      <div class="spinner"></div>
      <p>Processing video...</p>
    </div>
  `;

  try {
    const response = await fetch('/.netlify/functions/download', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url, option: format })
    });

    const data = await response.json();
    if (!data.success) throw new Error(data.error || 'Download failed');

    // Create download link
    container.innerHTML = `
      <a href="${data.link}" class="gold-btn" target="_blank" download>
        Click to download
      </a>
    `;
  } catch (err) {
    container.innerHTML = `
      <div class="error-message">
        <p>Error: ${err.message}</p>
        <button onclick="this.parentElement.remove()">Try Again</button>
      </div>
    `;
  }
}

// FAQ toggle
function toggleFAQ(element) {
  element.parentElement.classList.toggle('active');
}

// Show hidden FAQs
function showMoreFAQs() {
  document.querySelectorAll('.hidden-faq').forEach(item => {
    item.style.display = 'block';
  });
  document.querySelector('.show-more-btn').style.display = 'none';
}
