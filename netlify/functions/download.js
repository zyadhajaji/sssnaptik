const fetch = require("node-fetch");
const cheerio = require("cheerio");

exports.handler = async (event) => {
  try {
    const { url } = JSON.parse(event.body);

    if (!url) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, error: "No URL provided." }),
      };
    }

    const response = await fetch("https://snaptik.app/abc", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ url }),
    });

    const html = await response.text();
    const $ = cheerio.load(html);
    const videoLink = $("a.download_link").attr("href");

    if (!videoLink) {
      return {
        statusCode: 404,
        body: JSON.stringify({ success: false, error: "Video not found." }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, link: videoLink }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: "Failed to fetch video." }),
    };
  }
};
