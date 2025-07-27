// Global variables
let adTimer;
let skipTimer;
function showOptions() {
  const url = document.getElementById('tiktokUrl').value.trim();
  const optionsBox = document.getElementById('downloadOptions');
  if (url === '') {
    // Use a more user-friendly notification instead of alert
    showNotification('Please paste a TikTok link first.');
    return;
  }
  optionsBox.style.display = 'block';
}
async function downloadOption(option) {
  const url = document.getElementById('tiktokUrl').value.trim();
  if (!url) {
    showNotification('Please paste a TikTok link first.');
    return;
  }
  try {
    // Show loading state
    const downloadBtn = event.target;
    const originalText = downloadBtn.textContent;
    downloadBtn.textContent = 'Processing...';
    downloadBtn.disabled = true;
    const response = await fetch('/.netlify/functions/download', {  // Updated URL
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, option })
    });
    const data = await response.json();
    // Reset button state
    downloadBtn.textContent = originalText;
    downloadBtn.disabled = false;
    if (data.success && data.link) {
      if (option === 'hd') {
        // Show ad for 4K download
        showAd(data.link);
      } else {
        // Direct download for other options
        window.open(data.link, '_blank');
      }
    } else {
      showNotification(data.error || 'Error fetching video.');
    }
  } catch (err) {
    console.error(err);
    showNotification('Something went wrong.');
    // Reset button state in case of error
    const downloadBtn = event.target;
    downloadBtn.textContent = 'Download';
    downloadBtn.disabled = false;
  }
}
function showAd(videoLink) {
  const adContainer = document.getElementById('adContainer');
  const skipBtn = document.getElementById('skipAdBtn');
  // Show ad container
  adContainer.style.display = 'block';
  // Set video link as data attribute
  adContainer.dataset.videoLink = videoLink;
  // Start ad timer (30 seconds)
  adTimer = setTimeout(() => {
    // Hide ad container
    adContainer.style.display = 'none';
    // Open video link
    window.open(videoLink, '_blank');
  }, 30000);
  // Show skip button after 10 seconds
  setTimeout(() => {
    skipBtn.style.display = 'inline-block';
  }, 10000);
}
function skipAd() {
  // Clear the ad timer
  clearTimeout(adTimer);
  // Get the video link from the container
  const videoLink = document.getElementById('adContainer').dataset.videoLink;
  // Hide the ad container
  document.getElementById('adContainer').style.display = 'none';
  // Open the video link
  window.open(videoLink, '_blank');
}
document.addEventListener("DOMContentLoaded", () => {
  const faqItems = document.querySelectorAll('.faq-item');
  const showMoreBtn = document.querySelector('.show-more-btn');

  // Toggle FAQ answers
 function toggleHiddenFAQs() {
  const hiddenFaqs = document.querySelectorAll('.faq-item.hidden-faq');
  hiddenFaqs.forEach((faq) => {
    faq.classList.toggle('hidden-faq');
  });

  const showMoreBtn = document.querySelector('.show-more-btn');
  showMoreBtn.textContent = document.querySelectorAll('.faq-item.hidden-faq').length > 0 
    ? 'Show More' 
    : 'Show Less';
}

  faqItems.forEach((item) => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    const icon = item.querySelector('.faq-icon');

    question.addEventListener('click', () => {
      item.classList.toggle('active');
      question.setAttribute('aria-expanded', item.classList.contains('active'));

      // Animate the answer
      if (item.classList.contains('active')) {
        answer.style.maxHeight = answer.scrollHeight + 'px';
        icon.textContent = '-';
      } else {
        answer.style.maxHeight = 0;
        icon.textContent = '+';
      }
    });

    // Keyboard support (Enter or Space)
    question.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        question.click();
      }
    });
  });

  // Show More Button functionality
  if (showMoreBtn) {
    showMoreBtn.addEventListener('click', () => {
      const hiddenFaqs = document.querySelectorAll('.faq-item.hidden-faq');
      hiddenFaqs.forEach((faq) => {
        faq.classList.toggle('hidden-faq');
      });

      // Update button text
      if (document.querySelectorAll('.faq-item.hidden-faq').length > 0) {
        showMoreBtn.textContent = 'Show More';
      } else {
        showMoreBtn.textContent = 'Show Less';
      }
    });
  }
});
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
