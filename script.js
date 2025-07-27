function showOptions() {
  const url = document.getElementById('tiktokUrl').value.trim();
  const optionsBox = document.getElementById('downloadOptions');

  if (!url || !/^https?:\/\/(www\.)?tiktok\.com/.test(url)) {
    alert('Please paste a valid TikTok link.');
    return;
  }
  optionsBox.style.display = 'block';
}
async function downloadOption(option) {
  const url = document.getElementById('tiktokUrl').value.trim();
  if (!url) {
    alert('Please paste a TikTok link first.');
    return;
  }

  try {
    const response = await fetch('/api/download', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, option })
    });

    const data = await response.json();
    if (data.success && data.link) {
      showDownloadLink(data.link);
    } else {
      alert(data.error || 'Error fetching video.');
    }
  } catch (err) {
    console.error(err);
    alert('Something went wrong.');
  }
}

// ---- AD LOGIC ----
function startAd() {
  const countdownEl = document.getElementById('adCountdown');
  const downloadContainer = document.getElementById('downloadContainer');
  let seconds = 10;

  document.getElementById('startAdBtn').style.display = 'none';
  countdownEl.style.display = 'block';
  countdownEl.innerText = `Please wait ${seconds} seconds...`;

  const adTimer = setInterval(() => {
    seconds--;
    countdownEl.innerText = `Please wait ${seconds} seconds...`;
    if (seconds <= 0) {
      clearInterval(adTimer);
      countdownEl.innerText = "Ad finished!";
      showHDDownload();
    }
  }, 1000);
}

function showDownloadLink(videoUrl) {
  const downloadBox = document.querySelector('.download-box');

  // Remove any previous link
  const existingLink = document.getElementById('downloadLink');
  if (existingLink) existingLink.remove();

  // Create a new clickable link
  const link = document.createElement('a');
  link.id = 'downloadLink';
  link.href = videoUrl;
  link.textContent = 'Click here to download';
  link.target = '_blank';
  link.style.display = 'block';
  link.style.marginTop = '15px';
  link.style.color = '#FFD700';
  link.style.fontWeight = 'bold';
  link.style.textDecoration = 'underline';

  downloadBox.appendChild(link);
}
    const data = await response.json();
    if (data.success && data.link) {
      container.style.display = 'block';
      container.innerHTML = `<a href="${data.link}" target="_blank" class="gold-btn">Download 4K Video</a>`;
    } else {
      container.innerHTML = `<p style="color:red;">${data.error || 'Error fetching video.'}</p>`;
    }
  } catch (err) {
    container.innerHTML = `<p style="color:red;">Something went wrong.</p>`;
  }
}

function closeAdModal() {
  document.getElementById('adModal').style.display = 'none';
}

function toggleFAQ(element) {
  element.parentElement.classList.toggle('active');
}

function showMoreFAQs() {
  document.querySelectorAll('.hidden-faq').forEach(item => {
    item.style.display = 'block';
  });
  document.querySelector('.show-more-btn').style.display = 'none';
}
