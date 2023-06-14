import { verifyKey } from 'discord-interactions'; // You may need to install this package
import { initializeApp } from "firebase/app";
import { IgApiClient } from "instagram-private-api";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
// import { getAuth, signInWithCustomToken } from "firebase/auth";
import { Client, GatewayIntentBits, TextChannel } from "discord.js";
import sharp from "sharp";

export default function handler(req: any, res: any) {
  const signature = req.headers['x-signature-ed25519'];
  const timestamp = req.headers['x-signature-timestamp'];
  const json = JSON.stringify(req.body);
  const isVerified = verifyKey(json, signature, timestamp, process.env.DISCORD_PUBLIC_KEY!);

  if (!isVerified) {
    res.status(401).send('Invalid request signature');
    return;
  }

  switch (req.body.type) {
    case 1: // Ping event
      res.status(200).json({ type: 1 });
      break;
    default:
      const { URL, discordUser } = req.body.data;
      console.log(URL, discordUser);
      promoteItOnAbrys(URL, discordUser);
      res.status(200).json({ type: 4, data: { content: "Congrats on sending your command!" } });
      // const postHash = `${messageDate}_${messageAuthor}_${getImageFileName(
      //   attachment?.url ?? ""
      // )}`;
      // res.status(200).json({
      //   type: 4,
      //   data: {
      //     tts: false,
      //     content: "Congrats on sending your command!",
      //     embeds: [],
      //     allowed_mentions: { parse: [] },
      //   },
      // });
      break;
  }
}

function botLog(message: string) {
  console.log(`🤖 ${message}`);
}

async function promoteItOnAbrys(
  url: string,
  discordUser: string,
  // postHash: string
): Promise<{ didPromote: boolean; response: string }> {
  botLog(
    `\nAttempting to post image url: ${url} from Discord user ${discordUser}`
  );

  // const attachment = reaction.message.attachments.first();
  // const channelName = (reaction.message.channel as TextChannel).name;
  // const messageAuthor = reaction.message.author!.username;
  // const messageDate = formatDate(reaction.message.createdAt);
  // const postHash = `${messageDate}_${messageAuthor}_${getImageFileName(
  //   attachment?.url ?? ""
  // )}`;
  // const dbRecord = await getDoc(
  //   doc(firestore, `promote-it-on-abrys-fam-bot/${postHash}`)
  // );

  // if (dbRecord.data()?.promoted_on_insta) {
  //   return;
  // }

  // const isEligableToPromote =
  //   channelName.includes(process.env.DISCORD_CHANNEL_NAME!) &&
  //   APPROVED_USERS.includes(user.username!) &&
  //   reaction.count! > 0;

  // if (isEligableToPromote) {
  //   const reactors = await reaction.users.fetch();
  //   if (
  //     APPROVED_USERS.some((username) =>
  //       reactors.some((u) => u.username === username)
  //     )
  //   ) {
  //     if (attachment) {
  //       reaction.message.reply(
  //         "Summoning an abrys to promote this on @abrys_fam ..."
  //       );
  //       const didPromoteItOnAbrysFam = await promoteItOnAbrys(
  //         attachment.url,
  //         messageAuthor,
  //         postHash
  //       );
  //       try {
  //         reaction.message.reply(didPromoteItOnAbrysFam.response);
  //       } catch (error) {
  //         botLog(error);
  //         reaction.message.reply(`⛔️ Uh oh, ${error}`);
  //       }
  //     }
  //   }
  // }

  if (url.match(/\.(jpe?g|png|gif|bmp|webp|tiff?|heic|heif)$/i) == null) {
    botLog(`${discordUser}'s image is not a valid image`);
    return { didPromote: false, response: "Not a valid image" };
  }
  try {
    const didPromoteToAbrysFamInstagram = await postToInstagram(
      url,
      discordUser
    );

    // await setDoc(
    //   doc(firestore, `promote-it-on-abrys-fam-bot/${postHash}`),
    //   {
    //     image_url: url,
    //     discord_user: discordUser,
    //     promoted_on_insta: didPromoteToAbrysFamInstagram.didPromote,
    //     ig_post_code:
    //       didPromoteToAbrysFamInstagram.didPromote &&
    //       `https://www.instagram.com/p/${didPromoteToAbrysFamInstagram.igPostCode}/`,
    //   },
    //   { merge: true }
    // );

    return {
      didPromote: didPromoteToAbrysFamInstagram.didPromote,
      response: didPromoteToAbrysFamInstagram.response,
    };
  } catch (error) {
    const timestamp = new Date();
    botLog(
      `${timestamp} Error promoting ${discordUser}'s ${getImageFileName(
        url
      )} to @abrys_fam: ${error}`
    );

    return {
      didPromote: false,
      response: `Error promoting. Tell @SleepRides to look at the logs around ${timestamp}`,
    };
  }
}

async function postToInstagram(
  url: string,
  discordUser: string
): Promise<{ didPromote: boolean; response: string; igPostCode?: string }> {
  const ig = new IgApiClient();
  ig.state.generateDevice(process.env.IG_USERNAME!);
  await ig.account.login(process.env.IG_USERNAME!, process.env.IG_PASSWORD!);
  
  const response = await fetch(url);
  let imageBuffer = await response.arrayBuffer();

  const metadata = await sharp(imageBuffer).metadata();
  if (metadata.width! < 320 || metadata.height! < 320) {
    botLog(`${discordUser}'s image is too small`);
    return { didPromote: false, response: "Image is too small" };
  }

  const photoBuffer = await sharp(imageBuffer)
    .resize({ width: 1080, withoutEnlargement: true })
    .jpeg({ quality: 100 })
    .toBuffer();
  const photo = {
    file: photoBuffer,
    caption: `${discordUser} promoted it on @abrys_fam.`,
  };

  try {
    const res = await ig.publish.photo(photo);
    const igPostCode = res.media.code;
    botLog(`Promoted to Instagram: ${igPostCode}`);
    return {
      didPromote: true,
      response:
        res.status === "ok"
          ? `Promoted to https://www.instagram.com/p/${igPostCode}/`
          : "Weird-ass error. You should never be reading this message. Tell @SleepRides to look at the logs",
      igPostCode: igPostCode,
    };
  } catch (e) {
    botLog(e);
    return { didPromote: false, response: e };
  }
}

function getImageFileName(url: string): string {
  return (
    url
      .split("/")
      .pop()
      ?.split(".")[0]
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") ?? ""
  );
}

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");
  const second = String(date.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}