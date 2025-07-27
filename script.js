function showOptions() {
  document.getElementById('options').style.display = 'block';
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
      window.open(data.link, '_blank');
    } else {
      alert(data.error || 'Something went wrong.');
    }
  } catch (err) {
    console.error(err);
    alert('Something went wrong.');
  }
}

function toggleFAQ(el) {
  const p = el.nextElementSibling;
  p.style.display = p.style.display === 'block' ? 'none' : 'block';
}

function toggleMoreFAQs() {
  const hiddenFAQs = document.querySelectorAll('.hidden-faq');
  hiddenFAQs.forEach(faq => {
    faq.style.display = faq.style.display === 'block' ? 'none' : 'block';
  });

  const btn = document.getElementById('showMoreBtn');
  btn.innerText = btn.innerText === 'Show More' ? 'Show Less' : 'Show More';
}
