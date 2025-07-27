	// Add CORS middleware
	const cors = require('cors');
	const corsOptions = {
	  origin: '*',  // Allow all origins (temp fix)
	  methods: ['GET', 'POST'],
	  allowedHeaders: ['Content-Type']
	};
	// Updated Lambda handler
	exports.handler = cors(corsOptions)(async (event) => {
	  try {
	    const { url, option } = JSON.parse(event.body);
	    // Validate input
	    if (!url || !url.includes('tiktok.com')) {
	      return { statusCode: 400, body: JSON.stringify({ error: 'Invalid TikTok URL' }) };
	    }
	    // Updated API endpoint (replace with your actual endpoint)
	    const apiUrl = `https://api.tikwm.com/?url=${encodeURIComponent(url)}`;
	    // Add timeout (prevents hanging)
	    const response = await fetch(apiUrl, { timeout: 10000 });
	    // Handle non-JSON responses
	    const contentType = response.headers.get('content-type');
	    let data;
	    if (contentType?.includes('application/json')) {
	      data = await response.json();
	    } else {
	      return { statusCode: 500, body: JSON.stringify({ error: 'Invalid API response' }) };
	    }
	    // Enhanced error handling
	    if (!data?.data) {
	      return { statusCode: 404, body: JSON.stringify({ error: 'Video not found' }) };
	    }
	    // Improved file format handling
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
	        'Content-Type': 'application/json',
	        'Access-Control-Allow-Origin': '*'
	      },
	      body: JSON.stringify({
	        success: true,
	        link: videoLink,
	        filename: `tiktok_${Date.now()}.${option === 'mp3' ? 'mp3' : 'mp4'}`
	      })
	    };
	  } catch (err) {
	    console.error('Server Error:', err);
	    return {
	      statusCode: 500,
	      body: JSON.stringify({
	        success: false,
	        error: err.message || 'Internal server error'
	      })
	    };
	  }
	});
