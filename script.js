function isTikTokUrl(url) {
  return /^(https?:\/\/)?(www\.)?tiktok\.com/.test(url);
}

function showOptions() {
  const url = document.getElementById('tiktokUrl').value.trim();
  const errorMsg = document.getElementById('errorMsg');
  const optionsBox = document.getElementById('downloadOptions');

  errorMsg.textContent = '';
  if (!url) {
    errorMsg.textContent = 'Please paste a TikTok link.';
    return;
  }

  if (!isTikTokUrl(url)) {
    errorMsg.textContent = 'Please enter a valid TikTok URL.';
    return;
  }

  optionsBox.style.display = 'block';
}

let adTimer;
function startAdTimer(option) {
  const adMessage = document.getElementById('adMessage');
  adMessage.textContent = 'Please wait 30 seconds...';
  let seconds = 30;

  clearInterval(adTimer);
  adTimer = setInterval(() => {
    seconds--;
    adMessage.textContent = `Please wait ${seconds} seconds...`;
    if (seconds <= 0) {
      clearInterval(adTimer);
      adMessage.textContent = 'Download ready!';
      downloadOption(option);
    }
  }, 1000);
}

async function downloadOption(option) {
  const url = document.getElementById('tiktokUrl').value.trim();
  if (!url || !isTikTokUrl(url)) {
    alert('Please paste a valid TikTok link.');
    return;
  }

  try {
    const response = await fetch('/.netlify/functions/download', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, option })
    });

    const data = await response.json();
    if (data.success && data.link) {
      const a = document.createElement('a');
      a.href = data.link;
      a.download = '';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      alert(data.error || 'Error fetching video.');
    }
  } catch (err) {
    console.error(err);
    alert('Something went wrong.');
  }
}

function toggleFAQ(element) {
  const faqItem = element.parentElement;
  faqItem.classList.toggle('active');
}

function showMoreFAQs() {
  document.querySelectorAll('.hidden-faq').forEach(item => {
    item.style.display = 'block';
  });
  document.querySelector('.show-more-btn').style.display = 'none';
}
