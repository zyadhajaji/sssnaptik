const fetch = require('node-fetch');
exports.handler = async (event) => {
  try {
    const { url, option } = JSON.parse(event.body || '{}');
    if (!url) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, error: "No URL provided." }),
      };
    }
    const apiUrl = `https://www.ssstik.io//api/?url=${encodeURIComponent(url)}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    if (data && data.data) {
      let videoLink = '';
      if (option === 'hd') {
        videoLink = data.data.play;
      } else if (option === 'watermark') {
        videoLink = data.data.wmplay;
      } else if (option === 'mp3') {
        videoLink = data.data.music;
      }
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, link: videoLink }),
      };
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({ success: false, error: 'Video not found.' }),
      };
    }
  } catch (err) {
    console.error(err);
    console.log('API Response:', data);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: 'Failed to fetch video.' }),
    };
  }
};
