// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import { IgApiClient } from "instagram-private-api";
// import { initializeApp } from "firebase/app";
// import { getFirestore, doc, setDoc } from "firebase/firestore";

// const firebaseConfig = {
//   apiKey: process.env.FIREBASE_API_KEY,
//   authDomain: process.env.FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.FIREBASE_PROJECT_ID,
//   storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.FIREBASE_APP_ID,
// };

// const firebaseApp = initializeApp(firebaseConfig);
// const firestore = getFirestore(firebaseApp);

// async function postToInstagram(url, discordUser) {
//   const ig = new IgApiClient();
//   ig.state.generateDevice(process.env.INSTAGRAM_USERNAME);
//   await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
//   const response = await fetch(url);
//   const blob = await response.blob();
//   const arrayBuffer = await blob.arrayBuffer();
//   const buffer = Buffer.from(arrayBuffer);
//   try {
//     await ig.publish.photo({
//       file: buffer,
//       caption: "Promoted on @abrys_fam by Discord user " + discordUser,
//     });
//     return true;
//   } catch (e) {
//     console.log("🤖" + e);
//     return false;
//   }
// }

// export default async function handler(req, res) {
//   if (!req.body.url || !req.body.discordUser) {
//     res.status(400).json({ error: "Please provide a url." });
//     return;
//   }
//   // due to the edge runtime, and my laziness, we need to reject PNG photos for now
//   if (req.body.url.endsWith(".png")) {
//     res.status(400).json({
//       error:
//         "PNG photos are not supported. I know...annoying. Tell SleepRides to get on it.",
//     });
//     return;
//   }
//   const { url, discordUser } = req.body;
//   const didPromoteToAbrysFamInstagram = await postToInstagram(url, discordUser);
//   const imageFileName = url
//     .split("/")
//     .pop()
//     ?.split(".")[0]
//     .normalize("NFD")
//     .replace(/[\u0300-\u036f]/g, "");
//   await setDoc(
//     doc(
//       firestore,
//       `discord/bots/promote-it-on-abrys-fam/${discordUser}_${imageFileName}`
//     ),
//     {
//       promoted_on_abrys_fam: didPromoteToAbrysFamInstagram,
//     },
//     { merge: true }
//   );

//   res.status(200).json({ success: didPromoteToAbrysFamInstagram });
// }
