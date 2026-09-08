import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import ServiceDirectory from '../components/ServiceDirectory'
import PostFeed from '../components/PostFeed'
import PostComposer from '../components/PostComposer'
import LiveAudio from '../components/LiveAudio'
import AdminPanel from '../components/AdminPanel'
import MyProfile from './MyProfile'

const TABS = ['Service', 'Informations', 'Infos travail', 'Direct', 'Mon profil', 'Administration']

export default function Home() {
  const { profile, isSemiAdmin, isAdmin, logout } = useAuth()
  const [tab, setTab] = useState('Service')

  const visibleTabs = TABS.filter((t) => t !== 'Administration' || isAdmin)

  return (
    <div className="home">
      <header className="topbar">
        <div className="brand">
          <img src="/logo.png" alt="Vase d'honneur" className="logo" />
          <h1>Vase d'honneur — 2AD Marchoux</h1>
        </div>
        <div className="user-chip">
          <span>{profile?.prenom} {profile?.nom} {isAdmin && '(Admin)'} {!isAdmin && isSemiAdmin && '(Semi-admin)'}</span>
          <button onClick={logout}>Déconnexion</button>
        </div>
      </header>

      <nav className="tabs">
        {visibleTabs.map((t) => (
          <button key={t} className={tab === t ? 'tab active' : 'tab'} onClick={() => setTab(t)}>
            {t}
          </button>
        ))}
      </nav>

      <main className="tab-content">
        {tab === 'Service' && <ServiceDirectory />}

        {tab === 'Informations' && (
          <div>
            {isSemiAdmin && (
              <PostComposer basePath="posts/culte" allowedTypes={['texte', 'vocal']} defaultDurationHours={24} />
            )}
            <PostFeed basePath="posts/culte" />
          </div>
        )}

        {tab === 'Infos travail' && (
          <div>
            {isSemiAdmin && (
              <PostComposer basePath="posts/travail" allowedTypes={['texte', 'image']} defaultDurationHours={168} />
            )}
            <PostFeed basePath="posts/travail" />
          </div>
        )}

        {tab === 'Direct' && <LiveAudio />}

        {tab === 'Mon profil' && <MyProfile />}

        {tab === 'Administration' && isAdmin && <AdminPanel />}
      </main>
    </div>
  )
}
