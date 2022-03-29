// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next'

export type Credentials = {
  "access_token": string,
  "expires_in": number;
  "scope": string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { code } = req.query;
    console.log(code);
    const headers = { 'Content-Type': 'application/json' }
    const body = {
      "grant_type": "authorization_code",
      "client_id": config.CLIENT_ID,
      "client_secret": config.CLIENT_SECRET,
      "code": code,
      "redirect_uri": config.REDIRECT_URI
    }

    const { data } = await axios.post<Credentials>(
      'https://auth.atlassian.com/oauth/token', 
      { headers, body }
    )

    res.status(200).json(data)
  } catch (e: any) {
    res.status(e.response.status).json(e)
  }
}

const config = {
  CLIENT_ID: 'q7BPfsrFgPvZPMVOSoqIEoT49ajnSIOh',
  CLIENT_SECRET: '8992rg_UHpZG4vaisHgHLJ3Vqfykz01vq7TJuzi_Dqe0lH1H7cnRhEz6fyKXPs-u',
  REDIRECT_URI: 'https://bitbucket-dashboard.vercel.app',
}