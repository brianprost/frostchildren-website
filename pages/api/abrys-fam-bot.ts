import { NextApiRequest, NextApiResponse } from "next";

import {
  Client,
  Collection,
  GatewayIntentBits,
  MessageReaction,
  TextChannel,
} from "discord.js";
import { drizzle } from "drizzle-orm/node-postgres";
import { pgTable, serial, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { InferModel, isNull, eq, isNotNull, and } from "drizzle-orm";
import pg from "pg";

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
const promotions = pgTable("promotions_dev", {
  messageId: text("message_id").primaryKey(),
  discordUser: text("discord_user"),
  imageUrl: text("image_url"),
  igPostCode: text("ig_post_code"),
});

const db = drizzle(pool);

const channelId = process.env.DISCORD_CHANNEL_ID;

async function fetchMore(channel: TextChannel, limit: number) {
  if (!channel) {
    throw new Error(`Expected channel, got ${typeof channel}.`);
  }
  if (limit <= 100) {
    return channel.messages.fetch({ limit });
  }

  let collection = new Collection();
  let lastId = null;
  let options: { limit: number; before?: string } = { limit: 100 };
  let remaining = limit;

  while (remaining > 0) {
    options.limit = remaining > 100 ? 100 : remaining;
    remaining = remaining > 100 ? remaining - 100 : 0;

    if (lastId) {
      options.before = lastId;
    }

    let messages = await channel.messages.fetch(options);

    if (!messages.last()) {
      break;
    }

    collection = collection.concat(messages);
    lastId = messages.last()!.id;
  }

  return collection;
}

export async function getNewSubmissions(client: Client) {
  console.log(
    `👀 Checking for messages from ${process.env.DISCORD_CHANNEL_NAME}`
  );

  const channel: TextChannel = client.channels.cache.get(
    channelId!
  ) as TextChannel;
  const allChannelMessages = await fetchMore(channel, 100);

  const submissionMessages = allChannelMessages.filter((message: any) => {
    return message.attachments.size > 0 && message.reactions.cache.size > 0;
  });
  console.log(submissionMessages.size, " messages are submissions.");
  /**
   * a list of messages that I, @abrys_fam_bot, have already responded to.
   */
  const iPromotedPreviously = submissionMessages.filter((message: any) => {
    if (message.reference === null) {
      return false;
    }
    const repliedToMessageId = message.reference.messageId;
    const textSignalingAPromotion = "Promoted to https://www.instagram.com/p/";
    if (message.content.includes(textSignalingAPromotion)) {
      return true;
    }
    // console.log(message.content);
    // return repliedToMessageId;
  });
  console.log(
    iPromotedPreviously.size,
    " messages are ones I've promoted previously."
  );

  const dbRecords = (await db.select().from(promotions)).map(
    (p) => p.messageId
  );

  const newSubmissions = allChannelMessages.filter((message: any) => {
    return (
      message.attachments.size > 0 &&
      message.reactions.cache.size > 0 &&
      !dbRecords.includes(message.id) &&
      !iPromotedPreviously.has(message.id)
    );
  });
  console.log(newSubmissions.size, " messages are new.");

  // update db to include new messages
  const promises = newSubmissions.map(async (message: any) => {
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
async function getApprovedSubmissions(client: Client) {
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
  const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent],
  });
  let resBody: string[] = [];
  try {
    await new Promise<void>((resolve, reject) => {
      client.login(process.env.DISCORD_TOKEN);
      client.once("ready", async () => {
        try {
          await getNewSubmissions(client);
          const approvedSubmissions = await getApprovedSubmissions(client);
          if (approvedSubmissions.length < 1) {
            console.log("No submissions to promote.");
            resBody.push("No submissions to promote.");
            return;
          }

          const channel: TextChannel = client.channels.cache.get(
            channelId!
          ) as TextChannel;

          const promises = approvedSubmissions.map(async (submission) => {
            const { messageId, discordUser, imageUrl } = submission;
            const caption = `${discordUser} promoted it on @abrys_fam.`;
            const { didPromote, response, igPostCode } = await postToInstagram(
              caption,
              imageUrl
            );
            console.log("from Instagram: ", response);
            resBody.push("from Instagram: ", response);
            if (didPromote) {
              await db
                .update(promotions)
                .set({ igPostCode: igPostCode })
                .where(eq(promotions.messageId, messageId));
              console.log(
                `Updated DB record for ${messageId} with igPostCode ${igPostCode}`
              );
              resBody.push(
                `Updated DB record for ${messageId} with igPostCode ${igPostCode}`
              );
            } else {
              console.log(`Failed to promote ${messageId}`);
              resBody.push(`Failed to promote ${messageId}`);
            }
          });
          client.destroy();
          await Promise.all(promises);
          console.log("bye!");
          resBody.push("bye!");
          res.status(200).json(JSON.stringify(resBody));
        } catch (err) {
          client.destroy();
          console.log("bye!");
          resBody.push("bye!");
          res.status(500).json({ error: err });
        }
      });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
  client.destroy();
}
