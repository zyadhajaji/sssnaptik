const fetch = require('node-fetch');

exports.handler = async (event) => {
  try {
    const file = event.queryStringParameters.file;
    if (!file) {
      return { statusCode: 400, body: "Missing file parameter." };
    }

    const response = await fetch(file);
    if (!response.ok) throw new Error("Failed to fetch file.");

    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    const buffer = await response.buffer();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": "attachment; filename=tiktok_download.mp4",
        "Access-Control-Allow-Origin": "*"
      },
      body: buffer.toString('base64'),
      isBase64Encoded: true
    };

  } catch (err) {
    return { statusCode: 500, body: `Proxy error: ${err.message}` };
  }
};
