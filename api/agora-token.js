import { RtcTokenBuilder, RtcRole } from 'agora-access-token'

// Fonction serverless Vercel (déployée automatiquement depuis /api).
// Ne fonctionne PAS avec `npm run dev` seul — uniquement une fois déployée
// sur Vercel (ou via `vercel dev` en local).
export default function handler(req, res) {
  const { channel, uid, role } = req.query

  const appId = process.env.VITE_AGORA_APP_ID
  const appCertificate = process.env.AGORA_APP_CERTIFICATE

  if (!appId || !appCertificate) {
    res.status(500).json({ error: 'Configuration Agora manquante côté serveur (App ID ou certificat).' })
    return
  }
  if (!channel || !uid) {
    res.status(400).json({ error: 'Paramètres "channel" et "uid" requis.' })
    return
  }

  const agoraRole = role === 'host' ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER
  const expirationTimeInSeconds = 3600 // le token est valable 1h
  const currentTimestamp = Math.floor(Date.now() / 1000)
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds

  const token = RtcTokenBuilder.buildTokenWithAccount(
    appId,
    appCertificate,
    channel,
    String(uid),
    agoraRole,
    privilegeExpiredTs
  )

  res.status(200).json({ token })
}
