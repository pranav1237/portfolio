import { clearSessionCookie, sendJson } from './_session.js';

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end('Method not allowed');
  res.setHeader('Set-Cookie', clearSessionCookie());
  return sendJson(res, 200, { connected: false });
}
