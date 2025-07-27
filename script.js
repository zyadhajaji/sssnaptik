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
  if (!url || !/^https?:\/\/(www\.)?tiktok\.com/.test(url)) {
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
      const optionsBox = document.getElementById('downloadOptions');

      // Show the download link
      optionsBox.innerHTML = `
        <p style="margin-top: 10px;">Your download link:</p>
        <a href="${data.link}" target="_blank" class="gold-btn">Click Here to Download</a>
      `;
    } else {
      alert(data.error || 'Error fetching video.');
    }
  } catch (err) {
    console.error(err);
    alert('Something went wrong.');
  }
}
