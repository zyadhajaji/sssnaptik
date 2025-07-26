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
      openPopup(data.link);
    } else {
      errorMessage.textContent = data.error || 'Error fetching video.';
    }
  } catch (err) {
    spinner.style.display = 'none';
    errorMessage.textContent = 'Something went wrong.';
    console.error(err);
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
