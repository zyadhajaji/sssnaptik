const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
  try {
    const { url, option } = JSON.parse(event.body);

    if (!url) {
      return { statusCode: 400, body: JSON.stringify({ success: false, error: 'No URL provided.' }) };
    }

    // Log all links (for analytics)
    const logPath = path.join('/tmp', 'tiktok_links.txt');
    fs.appendFileSync(logPath, `${new Date().toISOString()} - ${url}\n`);

    // Fetch from SnapTik
    const apiUrl = `https://snaptik.app/abc?url=${encodeURIComponent(url)}`; // Example endpoint
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!data || !data.data || !data.data.video_url) {
      return { statusCode: 404, body: JSON.stringify({ success: false, error: 'Video not found.' }) };
    }

    const videoTitle = (data.data.title || 'video').replace(/[^\w\s]/gi, '').split(' ').join('-');
    let downloadLink = data.data.video_url;

    // Add filename to link
    if (option === 'mp3') {
      downloadLink = data.data.music_url;
      downloadLink += `?download=Savetik-${videoTitle}.mp3`;
    } else {
      downloadLink += `?download=Savetik-${videoTitle}.mp4`;
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, link: downloadLink })
    };

  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: JSON.stringify({ success: false, error: 'Failed to fetch video.' }) };
  }
};
