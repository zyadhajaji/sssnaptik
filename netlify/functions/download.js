// netlify/functions/download.js
const fetch = require('node-fetch');

exports.handler = async (event) => {
  try {
    const { url } = JSON.parse(event.body || "{}");

    if (!url || !url.includes('tiktok.com')) {
      return {
        statusCode: 400,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ success: false, error: 'Invalid TikTok URL' })
      };
    }

    // Use TikWM API (highest quality available)
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

    // Highest quality direct link
    const videoLink = data.data.hdplay || data.data.play || data.data.wmplay;

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        success: true,
        link: videoLink,
        filename: `tiktok_${Date.now()}.mp4`
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

};


