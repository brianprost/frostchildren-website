// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
    // extract url from post request body
    const { url, caption } = req.body;
    res.status(200).json({ popstarStatus: "You are now famous" });
  }
  