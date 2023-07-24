import { NextApiRequest, NextApiResponse } from "next";
import { get } from '@vercel/edge-config';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const recentMsgId = await get("greeting")
    console.log(recentMsgId)
    res.status(200).json({ message: recentMsgId });
}