// netlify/functions/download.js
const fetch = require('node-fetch'); // Make sure node-fetch v2.x is installed

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ success: false, error: 'Method Not Allowed' })
      };
    }

    const { url, option } = JSON.parse(event.body || "{}");

    if (!url || !url.includes('tiktok.com')) {
      return {
        statusCode: 400,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ success: false, error: 'Invalid TikTok URL' })
      };
    }

    // Use a stable TikTok downloader API
    const apiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch video data (status ${response.status})`);
    }

    const data = await response.json();

    if (!data || !data.data) {
      return {
        statusCode: 404,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ success: false, error: 'Video not found' })
      };
    }

    const formatMap = {
      hd: data.data.play,
      watermark: data.data.wmplay,
      mp3: data.data.music,
      app: data.data.app_link
    };

    const videoLink = formatMap[option] || data.data.play;

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        success: true,
        link: videoLink,
        filename: `tiktok_${Date.now()}.${option === 'mp3' ? 'mp3' : 'mp4'}`
      })
    };
  } catch (err) {
    console.error('Error:', err);
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ success: false, error: err.message || 'Internal Server Error' })
    };
  }
};

