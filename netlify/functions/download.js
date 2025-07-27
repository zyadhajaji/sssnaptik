const fetch = require('node-fetch');

exports.handler = async (event) => {
  try {
    const { url, option } = JSON.parse(event.body);

    if (!url || !/^https?:\/\/(www\.)?tiktok\.com/.test(url)) {
      return { statusCode: 400, body: JSON.stringify({ success: false, error: "Invalid TikTok URL." }) };
    }

    const apiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data?.data) {
      let videoLink = '';

      if (option === 'hd') videoLink = data.data.play;
      else if (option === 'watermark') videoLink = data.data.wmplay;
      else if (option === 'mp3') videoLink = data.data.music;

      if (!videoLink) {
        return { statusCode: 500, body: JSON.stringify({ success: false, error: "Could not get download link." }) };
      }

      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, link: videoLink }),
      };
    } else {
      return { statusCode: 404, body: JSON.stringify({ success: false, error: 'Video not found.' }) };
    }
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ success: false, error: 'Failed to fetch video.' }) };
  }
};
