// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { IgApiClient } from "instagram-private-api";

async function postToInstagram(url, discordUser) {
  const ig = new IgApiClient();
  ig.state.generateDevice(process.env.INSTAGRAM_USERNAME);
  await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
  const response = await fetch(url);
  const blob = await response.blob();
  const arrayBuffer = await blob.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  try {
    await ig.publish.photo({
      file: buffer,
      caption: "Promoted on @abrys_fam by Discord user " + discordUser,
    });
  } catch (e) {
    console.log("🤖" + e);
  }
}

export default async function handler(req, res) {
  if (!req.body.url || !req.body.discordUser) {
    res.status(400).json({ error: "Please provide a url." });
    return;
  }
  const publishResult = await postToInstagram(req.body.url, req.body.discordUser);

  const { url, caption } = req.body;
  res.status(200).json({ popstarStatus: JSON.stringify(publishResult) });
}
