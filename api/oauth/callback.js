module.exports = async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send('Missing authorization code.');
  }

  try {
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: process.env.HUBSPOT_CLIENT_ID,
      client_secret: process.env.HUBSPOT_CLIENT_SECRET,
      redirect_uri: process.env.HUBSPOT_REDIRECT_URI,
      code,
    });

    const response = await fetch('https://api.hubapi.com/oauth/v1/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Token exchange failed:', data);
      return res.status(500).send('Failed to complete authorization.');
    }

    console.log('OAuth tokens received successfully.');
    return res.status(200).send('Hershey Law is now connected to HubSpot. You can close this window.');
  } catch (err) {
    console.error(err);
    return res.status(500).send('Something went wrong during authorization.');
  }
};
