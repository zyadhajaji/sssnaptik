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
      // Force direct download
      const a = document.createElement('a');
      a.href = data.link;
      a.download = 'tiktok-video.mp4';
      document.body.appendChild(a);
      a.click();
      a.remove();
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


  // Create notification element if it doesn't exist
  let notification = document.getElementById('notification');
  if (!notification) {
    notification = document.createElement('div');
    notification.id = 'notification';
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = '#FFD700';
    notification.style.color = '#000';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '5px';
    notification.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';
    notification.style.zIndex = '1000';
    notification.style.transition = 'opacity 0.3s ease-in-out';
    document.body.appendChild(notification);
  }
  // Set message and show notification
  notification.textContent = message;
  notification.style.opacity = '1';
  // Hide notification after 3 seconds
  setTimeout(() => {
    notification.style.opacity = '0';
  }, 3000);
}
