import { verifyKey } from 'discord-interactions'; // You may need to install this package
import { initializeApp } from "firebase/app";
import { IgApiClient } from "instagram-private-api";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
// import { getAuth, signInWithCustomToken } from "firebase/auth";
import { Client, GatewayIntentBits, TextChannel } from "discord.js";
import sharp from "sharp";

export default async function handler(req: any, res: any) {
  const signature = req.headers['x-signature-ed25519'];
  const timestamp = req.headers['x-signature-timestamp'];
  const { type, attachmentUrl, discordUser, isBrian, attachment, messageAuthor, messageDate } = req.body;

  const json = JSON.stringify(req.body);
  const isVerified = verifyKey(json, signature, timestamp, process.env.DISCORD_PUBLIC_KEY!);

  if (!isVerified && isBrian != true) {
    res.status(401).send('Invalid request signature');
    return;
  }

  switch (type) {
    case 1:
      res.status(200).json({ type: 1 });
      break;
    default:
      // if (!interaction.isCommand()) return;

      // const { commandName } = interaction;

      // if (commandName === 'ping') {
      //   await interaction.reply('pong');
      // }
      console.log(JSON.stringify(req.body, null, 2));
      res.status(200).json({ type: 4, data: { content: "Congrats on sending your command!" } })
      // const { didPromote, response } = await promoteItOnAbrys(attachmentUrl, discordUser);
      // res.status(200).json({
      //   type: 4, data: {
      //     didPromote,
      //     response,
      //   }
      // });
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

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
const firestore = getFirestore(firebaseApp);

async function promoteItOnAbrys(
  url: string,
  discordUser: string,
  // postHash: string
): Promise<{ didPromote: boolean; response: string }> {
  // const attachment = reaction.message.attachments.first();
  // const channelName = (reaction.message.channel as TextChannel).name;
  // const messageAuthor = reaction.message.author!.username;
  // const messageDate = formatDate(reaction.message.createdAt);
  // const postHash = `${messageDate}_${messageAuthor}_${getImageFileName(
  //   attachment?.url ?? ""
  // )}`;
  const postHash = `${formatDate(new Date())}_${discordUser}_${getImageFileName(url)}`

  console.log(`Promoting ${discordUser}'s ${getImageFileName(url)} to @abrys_fam`)

  const dbRecord = await getDoc(
    doc(firestore, `promote-it-on-abrys-fam-bot/${postHash}`)
  );

  if (dbRecord.data()?.promoted_on_insta) {
    return {
      didPromote: false,
      response: `⛔️ This image has already been promoted to abrys_fam: ${dbRecord.data()?.ig_post_code}`,
    }
  }

  if (url.match(/\.(jpe?g|png|gif|bmp|webp|tiff?|heic|heif)$/i) == null) {
    return { didPromote: false, response: "Not a valid image" };
  }

  try {
    const didPromoteToAbrysFamInstagram = await postToInstagram(
      url,
      discordUser
    );

    await setDoc(
      doc(firestore, `promote-it-on-abrys-fam-bot/${postHash}`),
      {
        image_url: url,
        discord_user: discordUser,
        promoted_on_insta: didPromoteToAbrysFamInstagram.didPromote,
        ig_post_code:
          didPromoteToAbrysFamInstagram.didPromote &&
          `https://www.instagram.com/p/${didPromoteToAbrysFamInstagram.igPostCode}/`,
      },
      { merge: true }
    );

    return {
      didPromote: didPromoteToAbrysFamInstagram.didPromote,
      response: didPromoteToAbrysFamInstagram.response,
    };
  } catch (error) {
    const timestamp = new Date();
    console.error(`${timestamp} Error promoting ${discordUser}'s ${getImageFileName(
      url
    )} to @abrys_fam: ${error}`);

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
    return {
      didPromote: true,
      response:
        res.status === "ok"
          ? `Promoted to https://www.instagram.com/p/${igPostCode}/`
          : "Weird-ass error. You should never be reading this message. Tell @SleepRides to look at the logs",
      igPostCode: igPostCode,
    };
  } catch (e) {
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