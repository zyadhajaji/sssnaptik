exports.handler = async (event) => {
  try {
    const { url, option } = JSON.parse(event.body || "{}");

    if (!url || !url.includes('tiktok.com')) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, error: 'Invalid TikTok URL' })
      };
    }

    const apiUrl = `https://api.tikwm.com/?url=${encodeURIComponent(url)}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!data?.data) {
      return {
        statusCode: 404,
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
      headers: { "Access-Control-Allow-Origin": "*" },
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
      body: JSON.stringify({ success: false, error: err.message || 'Server error' })
    };
  }
};
