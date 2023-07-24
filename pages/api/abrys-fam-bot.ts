import { NextApiRequest, NextApiResponse } from "next";

import { Client, GatewayIntentBits, TextChannel } from "discord.js";
import { drizzle } from "drizzle-orm/node-postgres";
import { pgTable, serial, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { InferModel, isNull, eq, isNotNull, and } from "drizzle-orm";
import pg from "pg";

type TResponseBody = {
  newMessagesForPossiblePromotion?: number;
  nonPromotedPromotions?: number;
};

export async function getChannelState(): Promise<TResponseBody> {
  let responseBody: TResponseBody;

  const APPROVED_USERS = [
    "angular emoji",
    "angularemoji",
    "angular emoji#6001",
    "luluwav",
    "lulu.wav",
    "luluwav#5414",
    "sleeprides",
  ];

  const isDevMode = process.argv.includes("--dev");
  console.log(`isDevMode: ${isDevMode}`);

  // POSTGRES //

  const { Pool } = pg;

  const dbConnectionString = process.env.PG_DATABASE_CONNECTION_STRING;

  const pool = new Pool({
    connectionString: dbConnectionString,
  });

  console.log("dbConnStr: ", dbConnectionString);

  type Promotion = InferModel<typeof promotions>;
  const promotions = pgTable("promotions", {
    messageId: text("message_id").primaryKey(),
    discordUser: text("discord_user"),
    imageUrl: text("image_url"),
    igPostCode: text("ig_post_code"),
  });

  type Config = InferModel<typeof configTable>;
  const configTable = pgTable("config", {
    id: serial("id").primaryKey(),
    key: text("key"),
    value: text("value"),
  });

  const db = drizzle(pool);

  //   const knownLastMsgIdFromDb = await db
  //     .select()
  //     .from(configTable)
  //     .where(eq(configTable.key, "most_recent_message_id"));
  //   const knownLastMsgId = knownLastMsgIdFromDb[0].value;

  const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent],
  });

  client.login(process.env.DISCORD_TOKEN);

  const channelId = process.env.DISCORD_CHANNEL_ID;

  client.once("ready", async () => {
    console.log("🧽 I'm ready!");
    console.log("👀 Checking for messages");

    const channel: TextChannel = client.channels.cache.get(
      channelId!
    ) as TextChannel;

    const previouslyPromoted = (
      await db
        .select()
        .from(promotions)
        .where(
          and(isNotNull(promotions.igPostCode), isNotNull(promotions.messageId))
        )
    ).map((p) => p.messageId);

    console.log(previouslyPromoted.length, " messages have been promoted.");

    const allChannelMessages = await channel!.messages.fetch({ limit: 100 });
    console.log(allChannelMessages.size, " messages in the channel.");
    const newMessagesForPossiblePromotion = allChannelMessages.filter(
      (message) => {
        // console.log(
        //   `message.id: ${message.id} has ${
        //     previouslyPromoted.includes(message.id)
        //       ? "been promoted"
        //       : "not been promoted"
        //   }`
        // );
        return (
          message.attachments.size > 0 &&
          message.reactions.cache.size > 0 &&
          !previouslyPromoted.includes(message.id)
        );
      }
    );
    console.log(newMessagesForPossiblePromotion.size, " messages are new.");

    // update db to include new messages
    await Promise.all(
      newMessagesForPossiblePromotion.map(async (message) => {
        // const { id } = message;
        const promotion: Promotion = {
          messageId: message.id,
          discordUser: message.author.username,
          imageUrl: message.attachments.first()!.url,
          igPostCode: null,
        };
        // const newDbRecord = {
        //   discordUser: userWhoPosted,
        //   messageId: messageId,
        //   imageUrl: attachmentUrl,
        //   igPostCode: null,
        // };
        // await db.insert(promotions).values(newDbRecord).returning();
      })
    );

    console.log(
      newMessagesForPossiblePromotion.size,
      " new submission(s) to promote."
    );

    newMessagesForPossiblePromotion.map(async (message) => {
      const { id } = message;
      try {
        const actualMessage = await channel.messages.fetch(id);
        const userWhoPosted = actualMessage.author.username;
        const attachmentUrl = actualMessage.attachments.first()?.url;
        const reactors = await Promise.all(
          actualMessage.reactions.cache.map(async (reaction) => {
            const reactorsTmp = await reaction.users.fetch();
            return reactorsTmp.map((user) => user.username);
          })
        );
        const approvedReactors = reactors.map((reactor) => {
          return reactor.filter((reactor) => APPROVED_USERS.includes(reactor));
        });
        if (reactors.length > 0 && approvedReactors.length > 0) {
          const messageId = actualMessage.id;
          // const newDbRecord = {
          // 	discordUser: userWhoPosted,
          // 	messageId: messageId,
          // 	imageUrl: attachmentUrl,
          // 	igPostCode: "lol just a test",
          // };
          // await db.insert(promotions).values(newDbRecord).returning();
          // promoteItOnAbrys(attachmentUrl!, userWhoPosted, messageId);
        }
      } catch (err) {
        console.log(err);
      }
    });
    const nonPromotedPromotions = await db
      .select()
      .from(promotions)
      .where(isNull(promotions.igPostCode));
    console.log(nonPromotedPromotions.length, " submissions not approved yet.");

    // // update the most_recent_message_id in the db
    // await db
    // 	.update(configTable)
    // 	.set({ value: channel.lastMessageId })
    // 	.where(eq(configTable.key, "most_recent_message_id"));
    // console.log(`Updated last message id to ${channel.lastMessageId}`);
  });
  return responseBody!;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const channelState = await getChannelState();
    res.status(200).json(channelState);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
}
