const TIKTOK_REGEX = /^https?:\/\/(www\.|m\.)?tiktok\.com|vt\.tiktok\.com/;

function showOptions() {
  const url = document.getElementById('tiktokUrl').value.trim();
  const optionsBox = document.getElementById('downloadOptions');
  const TIKTOK_REGEX = /(tiktok\.com|vt.tiktok\.com)/i;

  if (!url || !TIKTOK_REGEX.test(url)) {
    alert('Please paste a valid TikTok link.');
    return;
  }
  optionsBox.style.display = 'block';
}
async function downloadOption(format) {
  const url = document.getElementById('tiktokUrl').value.trim();
  const container = document.getElementById('downloadContainer');
  container.innerHTML = '<p style="color:yellow;">Processing your video...</p>';

  try {
    const response = await fetch('/.netlify/functions/download', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, option: format })
    });

    const data = await response.json();
    if (!data.success || !data.link) throw new Error(data.error || 'Download failed');

    // Detect if user is on iOS (Safari) and adjust behavior
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    const btn = document.createElement('a');
    btn.href = data.link;
    btn.className = 'gold-btn';

    if (isIOS) {
      btn.textContent = 'Open Video in New Tab';
      btn.target = '_blank';
    } else {
      btn.textContent = 'Download Video';
      btn.setAttribute('download', data.filename || 'tiktok_video.mp4');
    }

    container.innerHTML = '';
    container.appendChild(btn);

  } catch (err) {
    container.innerHTML = `<p style="color:red;">Error: ${err.message}</p>`;
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
