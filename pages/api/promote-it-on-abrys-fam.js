// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      await verifyRequestSignatures(req, res, req.body);
    //   await handlePostRequest(req, res);
    return res.status(200).json({ type: 1 });
    } catch (err) {
      console.error(err);
      res.status(401).end("Unauthorized");
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}

function verifyRequestSignatures(req, res, buf) {
  const signature = req.headers["x-hub-signature"];
  if (!signature) {
    throw new Error("Couldn't validate the signature.");
  } else {
    const elements = signature.split("=");
    const signatureHash = elements[1];
    const expectedHash = crypto
      .createHmac("sha1", process.env.SECRET)
      .update(buf)
      .digest("hex");
    if (signatureHash !== expectedHash) {
      throw new Error("Couldn't validate the request signature.");
    }
  }
}