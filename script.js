function showOptions() {
  const url = document.getElementById('tiktokUrl').value.trim();
  const optionsBox = document.getElementById('downloadOptions');
  if (url === '') {
    alert('Please paste a TikTok link first.');
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
    const response = await fetch('/.netlify/functions/download', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, option })
    });

    const data = await response.json();
    if (data.success && data.link) {
      triggerDownloadPopup(data.link);
    } else {
      alert(data.error || 'Error fetching video.');
    }
  } catch (err) {
    console.error(err);
    alert('Something went wrong.');
  }
}

/**
 * Triggers the native browser "download" popup (especially for iOS Safari)
 * by creating a hidden <a> tag with download attribute and clicking it.
 */
function triggerDownloadPopup(videoUrl) {
  const link = document.createElement('a');
  link.href = videoUrl;
  link.setAttribute('download', 'tiktok_video.mp4');
  link.style.display = 'none';
  document.body.appendChild(link);

  // Simulate click
  link.click();

  // Clean up
  document.body.removeChild(link);
}

function toggleFAQ(element) {
  const faqItem = element.parentElement;
  faqItem.classList.toggle('active');
}

function showMoreFAQs() {
  const hiddenItems = document.querySelectorAll('.hidden-faq');
  hiddenItems.forEach(item => {
    item.style.display = 'block';
  });
  document.querySelector('.show-more-btn').style.display = 'none';
}
