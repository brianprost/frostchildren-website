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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await new Promise<void>((resolve, reject) => {
    client.once("ready", async () => {
      try {
        const channel: TextChannel = client.channels.cache.get(
          channelId!
        ) as TextChannel;

        const messages = await fetchMore(channel, 50);
        console.log(`There are ${messages.size} messages in the channel.`);

        const submissions: Submission[] = [];
        const msgsWithAttachments = messages.filter(
          (msg: any) => msg.attachments.size > 0
        );
        console.log(
          `There are ${msgsWithAttachments.size} messages with attachments in the channel.`
        );

        const msgsWithReactions = msgsWithAttachments.filter(
          (msg: any) => msg.reactions.cache.size > 0
        );
        console.log(
          `There are ${msgsWithReactions.size} messages with reactions in the channel.`
        );

        /**
         * To detect if a message has been promoted previously, we need to check if there is a reply to the message, from us, that contains an Instagram URL.
         */
        // Assume you have a list of messages to loop through
        const previouslyPromotedMessages = new Collection();
        for (const message of messages) {
          // Check if the message has a reference
          if (message.reference) {
            // Fetch the referenced message
            const reply = await message.fetchReference();
            // Check if the referenced message is yours and contains an Instagram URL
            if (
              reply.author.id === client.user!.id &&
              reply.content.includes("instagram.com")
            ) {
              // Do something with the message that you have already replied to
              console.log(
                `Already replied to $ {message.author.username} with $ {reply.content}`
              );
            }
          }
        }

        console.log(
          `There are ${previouslyPromotedMessages.size} messages that were promoted previously.`
        );
        // for (const msg of previouslyPromotedMessages.values()) {
        //   console.log("msg content: ", msg.content);
        //   // create a promotion record
        //   // const promotion: Promotion = {
        //   //     messageId: msg.id,
        //   //     discordUser: msg.author.id,
        //   //     imageUrl: msg.attachments.first().url,
        //   //     igPostCode: null,
        //   // };
        // }
        resolve();
        res.status(200).json({ msgsWithAttachments });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
      }
    });
  });
}

async function fetchMore(channel: any, limit = 250) {
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
    lastId = messages.last().id;
  }

  return collection;
}
