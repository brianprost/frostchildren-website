import { NextApiRequest, NextApiResponse } from "next";

import {
  Client,
  GatewayIntentBits,
  MessageReaction,
  TextChannel,
} from "discord.js";
import { drizzle } from "drizzle-orm/node-postgres";
import { pgTable, serial, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { InferModel, isNull, eq, isNotNull, and } from "drizzle-orm";
import pg from "pg";

type TResponseBody = {
  newSubmissions?: number;
  nonPromotedPromotions?: number;
};

type Submission = {
  messageId: string;
  discordUser: string;
  imageUrl: string;
};

const isDevMode = process.argv.includes("--dev");
console.log(`isDevMode: ${isDevMode}`);

// POSTGRES //

const { Pool } = pg;

const dbConnectionString = process.env.PG_DATABASE_CONNECTION_STRING;

const pool = new Pool({
  connectionString: dbConnectionString,
});

type Promotion = InferModel<typeof promotions>;
const promotions = pgTable("promotions", {
  messageId: text("message_id").primaryKey(),
  discordUser: text("discord_user"),
  imageUrl: text("image_url"),
  igPostCode: text("ig_post_code"),
});

const db = drizzle(pool);

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent],
});

client.login(process.env.DISCORD_TOKEN);
const channelId = process.env.DISCORD_CHANNEL_ID;

export async function getNewSubmissions() {
  console.log(
    `👀 Checking for messages from ${process.env.DISCORD_CHANNEL_NAME}`
  );

  const channel: TextChannel = client.channels.cache.get(
    channelId!
  ) as TextChannel;
  const allChannelMessages = await channel!.messages.fetch({ limit: 100 });
  const submissionMessages = allChannelMessages.filter((message) => {
    return message.attachments.size > 0 && message.reactions.cache.size > 0;
  });
  console.log(submissionMessages.size, " messages are submissions.");

  const dbRecords = (await db.select().from(promotions)).map(
    (p) => p.messageId
  );

  const newSubmissions = allChannelMessages.filter((message) => {
    return (
      message.attachments.size > 0 &&
      message.reactions.cache.size > 0 &&
      !dbRecords.includes(message.id)
    );
  });
  console.log(newSubmissions.size, " messages are new.");

  // update db to include new messages
  const promises = newSubmissions.map(async (message) => {
    const promotion: Promotion = {
      messageId: message.id,
      discordUser: message.author.username,
      imageUrl: message.attachments.first()!.url,
      igPostCode: null,
    };
    return db.insert(promotions).values(promotion).returning();
  });

  const results = await Promise.allSettled(promises);
  results.forEach((result) => {
    if (result.status === "rejected") {
      console.error(result.reason);
    }
  });
}

/**
 * Retrieves all submissions that are not promotions.
 */
async function getApprovedSubmissions() {
  console.log("Checking for approved submissions.");
  const approvedReactors = [
    "angular emoji",
    "angularemoji",
    "angular emoji#6001",
    "luluwav",
    "lulu.wav",
    "luluwav#5414",
    "sleeprides",
  ];
  const submissionsFromDb = await db
    .select()
    .from(promotions)
    .where(isNull(promotions.igPostCode));
  console.log(submissionsFromDb.length, " submissions not promoted yet.");
  const channel: TextChannel = client.channels.cache.get(
    channelId!
  ) as TextChannel;
  let submissions: Submission[] = [];
  if (channel) {
    for (const s of submissionsFromDb) {
      const discordMessage = await channel.messages.fetch(s.messageId);
      const reactions = discordMessage.reactions.cache;
      if (!reactions) {
        continue;
      }
      const reactionUsers = await reactions.first()?.users.fetch();
      const hasApprovedReactors = approvedReactors.some((approvedReactor) => {
        return reactionUsers?.some((user) => {
          return user.username === approvedReactor;
        });
      });

      if (hasApprovedReactors) {
        console.log(
          "going to promote",
          s.messageId,
          "on abrys fam. because this is the list of approved reactors: ",
          reactionUsers?.map((user) => user.username)
        );
        submissions.push({
          messageId: s.messageId,
          discordUser: s.discordUser!,
          imageUrl: s.imageUrl!,
        });
      } else {
        console.log("no approved users reacted to ", s.messageId);
      }
    }
  }
  return submissions;
}

// async function promoteItOnAbrysFam(submissions: Submission[]) {
// newSubmissions.map(async (message) => {
//   const { id } = message;
//   try {
//     const actualMessage = await channel.messages.fetch(id);
//     const userWhoPosted = actualMessage.author.username;
//     const attachmentUrl = actualMessage.attachments.first()?.url;
//     const reactors = await Promise.all(
//       actualMessage.reactions.cache.map(async (reaction) => {
//         const reactorsTmp = await reaction.users.fetch();
//         return reactorsTmp.map((user) => user.username);
//       })
//     );
//     const approvedReactors = reactors.map((reactor) => {
//       return reactor.filter((reactor) => APPROVED_USERS.includes(reactor));
//     });
//     if (reactors.length > 0 && approvedReactors.length > 0) {
//       const messageId = actualMessage.id;
//       // const newDbRecord = {
//       // 	discordUser: userWhoPosted,
//       // 	messageId: messageId,
//       // 	imageUrl: attachmentUrl,
//       // 	igPostCode: "lol just a test",
//       // };
//       // await db.insert(promotions).values(newDbRecord).returning();
//       // promoteItOnAbrys(attachmentUrl!, userWhoPosted, messageId);
//     }
//   } catch (err) {
//     console.log(err);
//   }
// });
// const nonPromotedPromotions = await db
//   .select()
//   .from(promotions)
//   .where(isNull(promotions.igPostCode));
// console.log(nonPromotedPromotions.length, " submissions not approved yet.");
// // update the most_recent_message_id in the db
// await db
// 	.update(configTable)
// 	.set({ value: channel.lastMessageId })
// 	.where(eq(configTable.key, "most_recent_message_id"));
// console.log(`Updated last message id to ${channel.lastMessageId}`);
// }

async function postToInstagram(
  caption: string,
  imageUrl: string
): Promise<{ didPromote: boolean; response: string; igPostCode?: string }> {
  // for testing
  return {
    didPromote: true,
    response: "Promoted to https://www.instagram.com/p/CKZ3Z9YBZ3Y/",
    igPostCode: "CKZ3Z9YBZ3Y",
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const responseBody: TResponseBody = {};
    client.once("ready", async () => {
      await getNewSubmissions();
      const approvedSubmissions = await getApprovedSubmissions();
      if (approvedSubmissions.length < 1) {
        console.log("No submissions to promote.");
        return;
      }
      approvedSubmissions.forEach(async (submission) => {
        const { messageId, discordUser, imageUrl } = submission;
        const caption = `${discordUser} promoted it on @abrys_fam.`;
        const { didPromote, response, igPostCode } = await postToInstagram(
          caption,
          imageUrl
        );
        console.log("from Instagram: ", response);
        if (didPromote) {
          await db
            .update(promotions)
            .set({ igPostCode: igPostCode })
            .where(eq(promotions.messageId, messageId));
          console.log(
            `Updated DB record for ${messageId} with igPostCode ${igPostCode}`
          );
        } else {
          console.log(`Failed to promote ${messageId}`);
        }
      });
    });
    res.status(200).json(responseBody);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
}
