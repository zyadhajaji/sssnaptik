const fetch = require('node-fetch');

exports.handler = async (event) => {
  try {
    const { url, option } = JSON.parse(event.body);

    if (!url) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, error: 'No URL provided' }),
      };
    }

    // Call TikTok API
    const apiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!data || !data.data) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, error: 'Video not found.' }),
      };
    }

    let fileLink = '';
    if (option === 'hd') fileLink = data.data.play;        // No watermark
    if (option === 'watermark') fileLink = data.data.wmplay; // With watermark
    if (option === 'mp3') fileLink = data.data.music;        // Audio

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, link: fileLink }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: 'Server error' }),
    };
  }
};
