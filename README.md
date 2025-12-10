# Archetype - Design Intelligence Profiler

Application de qualification de prospects pour le redesign web.

## Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **State**: Zustand
- **Styling**: Tailwind CSS + shadcn/ui
- **Deployment**: Vercel

## Setup

### 1. Installation des dépendances

```bash
cd archetype-app
npm install
```

### 2. Configuration Supabase

1. Créer un projet sur [supabase.com](https://supabase.com)
2. Copier les credentials dans `.env.local`:

```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. Exécuter le script SQL dans Supabase:
   - Aller dans SQL Editor
   - Copier le contenu de `supabase/migrations/001_initial_schema.sql`
   - Exécuter

### 3. Créer un utilisateur admin

Dans Supabase > Authentication > Users > Add user
- Email: votre email
- Mot de passe: votre mot de passe

### 4. Lancer en local

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

## Routes

### Client (Public)
- `/` - Landing page
- `/demo` - Démo du questionnaire (sans sauvegarde)
- `/q/[sessionId]` - Questionnaire avec sauvegarde

### Studio (Protégé)
- `/studio` - Dashboard
- `/studio/clients` - Liste des clients
- `/studio/clients/[id]` - Fiche client + prompts
- `/studio/settings` - Paramètres

### Auth
- `/auth/login` - Connexion

## Flow utilisateur

1. **Admin**: Se connecte au Studio
2. **Admin**: Crée un client avec son email
3. **Admin**: Copie le lien unique `/q/abc123`
4. **Admin**: Envoie le lien au prospect
5. **Prospect**: Remplit le questionnaire
6. **Admin**: Voit les réponses dans la fiche client
7. **Admin**: Génère un prompt pour V0/Lovable/Bolt

## Déploiement Vercel

```bash
vercel
```

Ajouter les variables d'environnement dans Vercel > Settings > Environment Variables.

## Structure

```
src/
├── app/                    # Routes Next.js
│   ├── (studio)/          # Routes protégées
│   ├── api/               # API Routes
│   ├── auth/              # Auth pages
│   └── q/[sessionId]/     # Questionnaire
├── components/
│   ├── questionnaire/     # Composants questionnaire
│   ├── studio/            # Composants dashboard
│   └── ui/                # shadcn/ui
├── config/                # Questions, skeletons, features
├── hooks/                 # Custom hooks
├── lib/                   # Utils, Supabase, prompts
├── stores/                # Zustand stores
└── types/                 # TypeScript types
```
