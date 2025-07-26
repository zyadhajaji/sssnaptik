function showOptions() {
  const url = document.getElementById('tiktokUrl').value.trim();
  const errorMessage = document.getElementById('errorMessage');
  const optionsBox = document.getElementById('downloadOptions');

  errorMessage.textContent = '';

  if (!url) {
    errorMessage.textContent = 'Please paste a TikTok link first.';
    return;
  }

  optionsBox.style.display = 'block';
}
async function downloadOption(option) {
  const url = document.getElementById('tiktokUrl').value.trim();
  const errorMessage = document.getElementById('errorMessage');
  const spinner = document.getElementById('loadingSpinner');

  errorMessage.textContent = '';

  if (!url) {
    errorMessage.textContent = 'Please paste a TikTok link first.';
    return;
  }

  try {
    spinner.style.display = 'block';
    const response = await fetch('/.netlify/functions/download', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, option })
    });
    const data = await response.json();
    spinner.style.display = 'none';

    if (data.success && data.link) {
      // Force file download
      fetchAndDownload(data.link, option);
    } else {
      errorMessage.textContent = data.error || 'Error fetching video.';
    }
  } catch (err) {
    spinner.style.display = 'none';
    errorMessage.textContent = 'Something went wrong.';
    console.error(err);
  }
}

async function fetchAndDownload(fileUrl, option) {
  try {
    const response = await fetch(fileUrl);
    const blob = await response.blob();
    const ext = option === 'mp3' ? 'mp3' : 'mp4';
    const fileName = `tiktok_download.${ext}`;

    const tempLink = document.createElement('a');
    tempLink.href = URL.createObjectURL(blob);
    tempLink.download = fileName;
    document.body.appendChild(tempLink);
    tempLink.click();
    tempLink.remove();

    // Cleanup after a short delay
    setTimeout(() => URL.revokeObjectURL(tempLink.href), 1000);
  } catch (err) {
    console.error('Download failed:', err);
    alert('Unable to download this file on your device. Try long-pressing the play button to save.');
  }
}

function toggleFAQ(element) {
  const faqItem = element.parentElement;
  faqItem.classList.toggle('active');
}

function openPopup(link) {
  const popup = document.getElementById('downloadPopup');
  const downloadLink = document.getElementById('downloadLink');
  downloadLink.href = link;
  popup.style.display = 'flex';
}

function closePopup() {
  document.getElementById('downloadPopup').style.display = 'none';
}
