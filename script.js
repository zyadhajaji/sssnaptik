function showOptions() {
  const url = document.getElementById('tiktokUrl').value.trim();
  const optionsBox = document.getElementById('downloadOptions');

  if (!url || !/^https?:\/\/(www\.)?tiktok\.com/.test(url)) {
    alert('Please paste a valid TikTok link.');
    return;
  }
  optionsBox.style.display = 'block';
}

async function downloadOption(format) {
  const url = document.getElementById('tiktokUrl').value.trim();
  const container = document.getElementById('downloadContainer') || createDownloadContainer();
  container.innerHTML = `<p>Processing your video...</p>`;

  try {
    const response = await fetch('/.netlify/functions/download', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, option: format })
    });

    const data = await response.json();
    if (!data.success) throw new Error(data.error || 'Download failed');

    container.innerHTML = `<a href="${data.link}" download="${data.filename}" class="gold-btn">Click to Download</a>`;
  } catch (err) {
    container.innerHTML = `<p style="color:red;">Error: ${err.message}</p>`;
  }
}

// Create download container dynamically
function createDownloadContainer() {
  const container = document.createElement('div');
  container.id = 'downloadContainer';
  container.style.textAlign = 'center';
  document.querySelector('.download-box').appendChild(container);
  return container;
}
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
