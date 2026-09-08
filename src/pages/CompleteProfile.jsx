import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function CompleteProfile() {
  const { user, completeMemberProfile } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    titre: '',
    experience: '',
    contact: '',
    contactVisible: true,
    lieuHabitation: '',
    lieuVisible: false,
    service: '',
    serviceVisible: true
  })

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.contact) {
      setError('Le contact est obligatoire.')
      return
    }
    await completeMemberProfile(user.uid, form)
    navigate('/')
  }

  return (
    <div className="auth-page">
      <h1>Encore une étape</h1>
      <p>Complète ta fiche membre avant de continuer.</p>
      <form onSubmit={handleSubmit} className="auth-form">
        {error && <p className="error">{error}</p>}
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
        <button type="submit">Valider</button>
      </form>
    </div>
  )
}
