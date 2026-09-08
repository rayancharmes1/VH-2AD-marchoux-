# Vase d'honneur — 2AD Marchoux

Application communautaire d'église : annuaire des services, informations liées au culte (texte/vocal), infos travail (texte/image), direct audio, rôles admin/semi-admin, badges.

Stack : **React (Vite) + Firebase (Auth + Realtime Database) + Agora (direct audio)**, déployée sur **Vercel**.

## 1. Créer le projet Firebase

1. Va sur https://console.firebase.google.com puis "Ajouter un projet".
2. Une fois le projet créé : **Authentication > Sign-in method** → active "Email/Mot de passe" et "Google".
3. **Realtime Database** → "Créer une base de données" (choisis une région proche, ex. europe-west1) → démarre en mode verrouillé.
4. Dans l'onglet **Règles** de la Realtime Database, colle le contenu du fichier `database.rules.json` de ce projet, puis publie.
5. **Paramètres du projet > Général > Vos applications** → ajoute une application Web → copie les valeurs affichées, elles vont dans le fichier `.env`.

## 2. Créer le compte Agora (pour le direct audio)

1. Crée un compte gratuit sur https://console.agora.io
2. Crée un projet, en mode "APP ID authentication" (sans certificat, plus simple pour démarrer).
3. Copie l'**App ID**.

> ⚠️ Sans certificat/token, n'importe qui connaissant l'App ID pourrait techniquement rejoindre le canal audio. Pour une sécurité renforcée plus tard, il faudra ajouter un petit serveur de génération de tokens (Agora fournit des exemples prêts à l'emploi).

## 3. Configurer les variables d'environnement

Copie `.env.example` en `.env` et renseigne toutes les valeurs (Firebase + Agora).

```bash
cp .env.example .env
```

## 4. Tester en local

```bash
npm install
npm run dev
```

Ouvre http://localhost:5173

## 5. Devenir administrateur (premier admin)

Aucun compte n'est admin par défaut. Après ta première inscription :

1. Va dans Firebase Console → Realtime Database → Données.
2. Trouve ton compte sous `users/{ton_uid}`.
3. Change le champ `role` de `"member"` à `"admin"`.
4. Reconnecte-toi dans l'app : le nouvel onglet "Administration" apparaît, tu peux alors nommer d'autres admins/semi-admins directement depuis l'app.

## 6. Mettre le projet sur GitHub

```bash
cd vase-honneur
git init
git add .
git commit -m "Première version - Vase d'honneur 2AD Marchoux"
git branch -M main
git remote add origin https://github.com/TON_COMPTE/vase-honneur.git
git push -u origin main
```

(Le fichier `.env` n'est jamais poussé, il est ignoré par `.gitignore`.)

## 7. Déployer sur Vercel

1. Sur https://vercel.com → "Add New Project" → importe le repo GitHub.
2. Vercel détecte automatiquement Vite. Garde les réglages par défaut.
3. Dans **Environment Variables**, ajoute exactement les mêmes clés que dans ton `.env` :
   - VITE_FIREBASE_API_KEY
   - VITE_FIREBASE_AUTH_DOMAIN
   - VITE_FIREBASE_DATABASE_URL
   - VITE_FIREBASE_PROJECT_ID
   - VITE_FIREBASE_STORAGE_BUCKET
   - VITE_FIREBASE_MESSAGING_SENDER_ID
   - VITE_FIREBASE_APP_ID
   - VITE_AGORA_APP_ID
4. Clique "Deploy".
5. Dans Firebase Console → Authentication → Settings → "Domaines autorisés", ajoute le domaine `*.vercel.app` (ou ton domaine final) sinon la connexion Google sera refusée.

## Ce que fait l'application

- **Inscription/connexion** : Google ou email/mot de passe. Champs : nom, prénom, titre/responsabilité (facultatif), travail/expérience (facultatif), contact WhatsApp (obligatoire, masquable), lieu d'habitation (facultatif, masquable). Avec Google, une courte page complète le contact obligatoire après la première connexion.
- **Annuaire des services** : les membres qui ont choisi d'apparaître y sont listés avec un bouton "Contacter sur WhatsApp" qui ouvre directement une discussion avec leur numéro.
- **Informations (culte)** : les admins et semi-admins publient du texte ou un vocal (2 min max). Chaque post a une durée de vie (24h par défaut, modifiable) ; une fois expiré, il est automatiquement supprimé de la base de données et de l'application. Chaque membre peut réagir avec un emoji.
- **Infos travail** : texte et image uniquement, même logique d'expiration (7 jours par défaut, modifiable).
- **Direct** : seul un admin peut démarrer un direct audio (via Agora) ; tous les membres inscrits peuvent l'écouter en temps réel.
- **Administration** (réservé aux admins) : création de badges (une ou deux couleurs), attribution de badges par membre, promotion/rétrogradation entre membre / semi-admin / admin.

## Notes techniques importantes

- Les vocaux et images sont stockés directement dans la Realtime Database (encodés en base64), pas dans Firebase Storage — cohérent avec l'architecture de R.COM. Pour un usage à grande échelle, il faudra migrer vers Firebase Storage.
- La suppression des posts expirés se fait côté client (au moment où quelqu'un ouvre l'app), car ce plan Firebase gratuit ne permet pas de tâches planifiées automatiques (Cloud Functions). Un post expiré ne s'affichera jamais, mais sa suppression physique de la base attend qu'un membre ouvre l'onglet concerné.
- Les règles de sécurité (`database.rules.json`) sont un bon point de départ mais mériteraient une relecture avant une mise en production à grande échelle.
