import { useState } from 'react'
import { ref, set } from 'firebase/database'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'

export default function MyProfile() {
  const { user, profile } = useAuth()
  const [form, setForm] = useState({
    titre: profile?.titre || '',
    experience: profile?.experience || '',
    contact: profile?.contact || '',
    contactVisible: !!profile?.contactVisible,
    lieuHabitation: profile?.lieuHabitation || '',
    lieuVisible: !!profile?.lieuVisible,
    service: profile?.service || '',
    serviceVisible: !!profile?.serviceVisible
  })
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
    setSaved(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.contact) {
      setError('Le contact est obligatoire.')
      return
    }
    await set(ref(db, `users/${user.uid}`), { ...profile, ...form })
    setSaved(true)
  }

  if (!profile) return null

  return (
    <div className="my-profile">
      <h2>Mon profil</h2>
      <div className="profile-summary">
        <p><strong>{profile.prenom} {profile.nom}</strong></p>
        <p className="muted">{profile.email}</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form profile-form">
        {error && <p className="error">{error}</p>}
        {saved && <p className="success">Profil mis à jour.</p>}

        <input placeholder="Titre / responsabilité (facultatif)" value={form.titre} onChange={(e) => update('titre', e.target.value)} />
        <input placeholder="Travail ou expérience (facultatif)" value={form.experience} onChange={(e) => update('experience', e.target.value)} />

        <label className="field-with-toggle">
          <input placeholder="Contact WhatsApp (obligatoire)" value={form.contact} onChange={(e) => update('contact', e.target.value)} required />
          <span><input type="checkbox" checked={form.contactVisible} onChange={(e) => update('contactVisible', e.target.checked)} /> Afficher mon contact publiquement</span>
        </label>

        <label className="field-with-toggle">
          <input placeholder="Lieu d'habitation (facultatif)" value={form.lieuHabitation} onChange={(e) => update('lieuHabitation', e.target.value)} />
          <span><input type="checkbox" checked={form.lieuVisible} onChange={(e) => update('lieuVisible', e.target.checked)} /> Afficher mon lieu d'habitation</span>
        </label>

        <label className="field-with-toggle">
          <input placeholder="Mon service" value={form.service} onChange={(e) => update('service', e.target.value)} />
          <span><input type="checkbox" checked={form.serviceVisible} onChange={(e) => update('serviceVisible', e.target.checked)} /> Apparaître dans l'annuaire des services</span>
        </label>

        <button type="submit">Enregistrer</button>
      </form>
    </div>
  )
}
