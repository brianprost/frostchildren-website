import { verifyKey } from 'discord-interactions'; // You may need to install this package

export default function handler(req, res) {
  const signature = req.headers['x-signature-ed25519'];
  const timestamp = req.headers['x-signature-timestamp'];
  const json = JSON.stringify(req.body);
  const isVerified = verifyKey(json, signature, timestamp, process.env.DISCORD_PUBLIC_KEY);

  if (!isVerified) {
    res.status(401).send('Invalid request signature');
    return;
  }

  switch (req.body.type) {
    case 1: // Ping event
      res.status(200).json({ type: 1 });
      break;
    default:
      // Handle other interaction types here
      res.status(200).json({
        type: 4,
        data: {
          tts: false,
          content: "Congrats on sending your command!",
          embeds: [],
          allowed_mentions: { parse: [] },
        },
      });
      break;
  }
}
