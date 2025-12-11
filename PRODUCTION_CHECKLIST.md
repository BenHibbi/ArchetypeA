# Checklist de Mise en Production - Archetype

## Vue d'ensemble

Ce document décrit toutes les étapes pour déployer Archetype en production.

---

## 1. Variables d'environnement

### Sur Vercel (ou ton hébergeur) :

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[ton-projet].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[ta-clé-anon]

# OpenAI (pour la transcription vocale et génération de prompts)
OPENAI_API_KEY=sk-...

# Groq (alternative pour Whisper)
GROQ_API_KEY=gsk_...

# URL de production
NEXT_PUBLIC_APP_URL=https://archetype.design
```

---

## 2. Configuration Supabase

### A. Exécuter les migrations

Dans le dashboard Supabase > SQL Editor, exécute les migrations dans l'ordre :

1. `001_initial_schema.sql`
2. `002_add_voice_fields.sql`
3. `003_add_business_info_to_responses.sql`
4. `005_add_showroom.sql`
5. `006_add_user_isolation.sql`
6. **`007_add_user_approvals.sql`** (NOUVEAU - système d'approbation)

### B. Approuver ton compte

Après avoir exécuté la migration 007, approuve ton propre compte :

```sql
-- Remplace par ton email
UPDATE user_profiles
SET status = 'approved',
    approved_at = NOW(),
    approved_by = 'system'
WHERE email = 'ton@email.com';
```

### C. Configurer l'authentification

Dans Supabase Dashboard > Authentication > URL Configuration :

- **Site URL** : `https://archetype.design`
- **Redirect URLs** :
  - `https://archetype.design/**`
  - `https://archetype.design/auth/callback`

### D. Désactiver l'inscription publique (optionnel)

Si tu veux contrôler 100% des inscriptions, dans Authentication > Settings :
- Désactive "Enable signups" (les utilisateurs devront te contacter)

OU garde les inscriptions actives et utilise le système d'approbation manuelle.

---

## 3. Configuration DNS

Chez ton registrar (ex: Cloudflare, Namecheap...) :

```
Type    Name    Value               TTL
A       @       76.76.21.21         Auto
CNAME   www     cname.vercel-dns.com Auto
```

Sur Vercel > Settings > Domains :
- Ajoute `archetype.design` et `www.archetype.design`

---

## 4. Déploiement Vercel

### A. Connexion du repo

1. Va sur vercel.com
2. Import ton repo GitHub
3. Configure :
   - **Framework Preset** : Next.js
   - **Root Directory** : `archetype-app`
   - **Build Command** : `npm run build`
   - **Output Directory** : `.next`

### B. Variables d'environnement

Ajoute toutes les variables listées en section 1 dans :
Vercel > Settings > Environment Variables

### C. Premier déploiement

```bash
# Local
git add .
git commit -m "Production ready"
git push origin main
```

Vercel déploiera automatiquement.

---

## 5. Workflow d'approbation manuelle

### Quand quelqu'un s'inscrit :

1. L'utilisateur crée un compte → Il arrive sur `/auth/pending`
2. Tu reçois une notif (à configurer si besoin)
3. Dans Supabase Dashboard > Table Editor > user_profiles :
   - Tu vois les nouveaux utilisateurs avec `status = 'pending'`
   - Pour approuver : change `status` en `'approved'`
   - Pour refuser : change `status` en `'rejected'`

### Script SQL rapide pour approuver :

```sql
-- Approuver un utilisateur
UPDATE user_profiles
SET status = 'approved', approved_at = NOW(), approved_by = 'admin'
WHERE email = 'utilisateur@email.com';

-- Voir tous les utilisateurs en attente
SELECT * FROM user_profiles WHERE status = 'pending' ORDER BY requested_at DESC;
```

---

## 6. Tests avant lancement

### Checklist de validation :

- [ ] Page d'accueil charge correctement
- [ ] Démo fonctionne (questionnaire complet)
- [ ] Inscription crée bien un profil `pending`
- [ ] Page d'attente s'affiche pour les non-approuvés
- [ ] Après approbation, accès au Studio
- [ ] Création de client fonctionne
- [ ] Lien questionnaire fonctionne pour les clients
- [ ] Réponses s'enregistrent correctement
- [ ] Génération de prompt fonctionne
- [ ] Showroom fonctionne
- [ ] Pages légales accessibles
- [ ] Menu déroulant fonctionne

---

## 7. Éléments à personnaliser

### Dans les pages légales :

- `mentions-legales/page.tsx` : Remplacer [Adresse], [SIRET], [Directeur]
- `cgu-cgv/page.tsx` : Vérifier les CGU/CGV, ajouter médiateur
- `confidentialite/page.tsx` : Vérifier la conformité RGPD

### Emails :

- Remplacer `contact@archetype.design`, `support@archetype.design`, `dpo@archetype.design` par tes vraies adresses

---

## 8. Monitoring & Analytics (optionnel)

### Recommandations :

- **Analytics** : Vercel Analytics (intégré) ou Plausible
- **Errors** : Sentry
- **Uptime** : UptimeRobot ou Vercel Status

---

## 9. Sécurité

### Vérifications :

- [ ] Variables d'environnement non exposées côté client (sauf NEXT_PUBLIC_*)
- [ ] RLS activé sur toutes les tables Supabase
- [ ] HTTPS forcé
- [ ] Headers de sécurité (Vercel les ajoute par défaut)

---

## 10. Post-lancement

### Priorités :

1. **Tester** tous les flows avec un vrai utilisateur
2. **Monitorer** les erreurs les premiers jours
3. **Documenter** les problèmes rencontrés
4. **Communiquer** l'URL aux premiers utilisateurs

---

## Commandes utiles

```bash
# Build local pour tester
npm run build

# Vérifier les types
npx tsc --noEmit

# Lancer en mode production local
npm run build && npm start
```

---

## Support

En cas de problème :
- Logs Vercel : vercel.com/dashboard > Ton projet > Deployments > Logs
- Logs Supabase : Dashboard > Logs
- Erreurs frontend : Console navigateur (F12)
