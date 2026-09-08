import { useEffect, useState } from 'react'
import { onValue, ref } from 'firebase/database'
import { db } from '../firebase'
import Badge from './Badge'

function toWhatsappLink(contact) {
  const digits = (contact || '').replace(/[^\d+]/g, '').replace('+', '')
  return `https://wa.me/${digits}`
}

export default function ServiceDirectory() {
  const [members, setMembers] = useState([])
  const [badges, setBadges] = useState({})

  useEffect(() => {
    const unsubUsers = onValue(ref(db, 'users'), (snap) => {
      const data = snap.val() || {}
      const list = Object.entries(data)
        .map(([uid, u]) => ({ uid, ...u }))
        .filter((u) => u.serviceVisible && u.service)
      setMembers(list)
    })
    const unsubBadges = onValue(ref(db, 'badges'), (snap) => setBadges(snap.val() || {}))
    return () => {
      unsubUsers()
      unsubBadges()
    }
  }, [])

  return (
    <div className="service-directory">
      <h2>Annuaire des services</h2>
      {members.length === 0 && <p>Aucun membre n'a encore publié son service.</p>}
      <div className="member-grid">
        {members.map((m) => (
          <div key={m.uid} className="member-card">
            <h3>{m.prenom} {m.nom}</h3>
            {m.titre && <p className="titre">{m.titre}</p>}
            <p className="service">{m.service}</p>
            {m.contactVisible && <p className="contact">{m.contact}</p>}
            {m.lieuVisible && m.lieuHabitation && <p className="lieu">{m.lieuHabitation}</p>}
            <div className="badges">
              {Object.keys(m.badges || {}).map((bId) => (
                <Badge key={bId} badge={badges[bId]} />
              ))}
            </div>
            <a className="contact-btn" href={toWhatsappLink(m.contact)} target="_blank" rel="noreferrer">
              Contacter sur WhatsApp
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}
