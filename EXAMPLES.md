# 📝 Exemples de Descriptions de Journée

Voici des exemples de textes que vous pouvez utiliser pour tester l'extraction IA des tâches.

## Exemple 1 : Journée productive complète

```
Aujourd'hui j'ai eu une journée bien remplie. Le matin, j'ai fait 30 minutes de course à pied dans le parc, c'était super rafraîchissant. Ensuite, j'ai travaillé sur mon projet React pendant 2 heures, j'ai réussi à corriger plusieurs bugs.

À midi, j'ai pris un bon déjeuner avec mes collègues au restaurant, on a discuté de nos projets. L'après-midi, j'ai suivi un cours en ligne sur TypeScript pendant 1h30, j'ai appris beaucoup de choses sur les types avancés.

Le soir, j'ai lu un chapitre de mon livre sur l'architecture logicielle pendant 45 minutes. J'ai aussi appelé ma mère pour prendre de ses nouvelles, ça fait du bien de discuter avec elle.

Enfin, j'ai médité pendant 20 minutes avant de me coucher, ça m'aide à mieux dormir.
```

**Résultat attendu** :

- Course à pied (sport, 30 min, done)
- Travail projet React (travail, 2h, done)
- Déjeuner avec collègues (social, done)
- Cours TypeScript (apprentissage, 1h30, done)
- Lecture livre (apprentissage, 45 min, done)
- Appel à la mère (social, done)
- Méditation (santé, 20 min, done)

---

## Exemple 2 : Journée avec activités en cours

```
Ce matin, j'ai commencé à préparer ma présentation pour la réunion de demain, mais je ne l'ai pas encore terminée. J'ai travaillé dessus pendant environ 1h30.

Ensuite, j'ai fait une séance de musculation à la salle de sport pendant 45 minutes. J'ai fait du développé couché et des squats.

L'après-midi, j'ai regardé un documentaire sur l'intelligence artificielle pendant 1 heure, c'était très intéressant.

Je dois encore finir ma présentation ce soir, et j'aimerais aussi aller courir 5km si j'ai le temps.
```

**Résultat attendu** :

- Préparation présentation (travail, 1h30, in_progress)
- Musculation (sport, 45 min, done)
- Documentaire IA (apprentissage, 1h, done)
- Finir présentation (travail, todo)
- Course 5km (sport, todo)

---

## Exemple 3 : Journée simple et relaxante

```
Aujourd'hui c'était dimanche, donc journée plus tranquille. J'ai fait du yoga le matin pendant 30 minutes, puis j'ai préparé un bon petit-déjeuner.

J'ai passé l'après-midi à jouer aux jeux vidéo avec mes amis en ligne, on a joué pendant environ 3 heures. C'était super fun !

Le soir, j'ai cuisiné un bon repas et j'ai regardé un film avec ma copine.
```

**Résultat attendu** :

- Yoga (santé, 30 min, done)
- Petit-déjeuner (autre, done)
- Jeux vidéo avec amis (loisir, 3h, done)
- Cuisine (autre, done)
- Film avec copine (loisir, done)

---

## Exemple 4 : Journée avec détails et notes

```
Journée chargée aujourd'hui !

Réveil à 6h30, j'ai fait ma routine matinale : 20 minutes de méditation suivies de 10 minutes d'étirements. Ensuite, petit-déjeuner équilibré avec fruits et yaourt.

Travail de 9h à 12h sur le développement d'une nouvelle feature pour l'application. J'ai réussi à implémenter l'authentification JWT, c'était complexe mais satisfaisant.

Pause déjeuner de 12h30 à 13h30 avec l'équipe, on a mangé dans un nouveau restaurant italien.

L'après-midi, j'ai eu une réunion importante de 14h à 15h30 sur la roadmap du projet. Puis j'ai continué le développement jusqu'à 17h.

Après le travail, j'ai fait une séance de natation de 18h à 19h, j'ai nagé 1km. Très relaxant après une journée de code.

Le soir, j'ai suivi un tutoriel sur Docker pendant 1 heure, j'ai appris à containeriser une application Node.js. Je dois encore pratiquer pour bien maîtriser.

Enfin, j'ai lu 30 pages de "Clean Code" avant de me coucher.
```

**Résultat attendu** :

- Méditation (santé, 20 min, done)
- Étirements (santé, 10 min, done)
- Petit-déjeuner (autre, done)
- Développement feature (travail, 3h, done)
- Déjeuner équipe (social, 1h, done)
- Réunion roadmap (travail, 1h30, done)
- Développement (travail, 2h, done)
- Natation (sport, 1h, done)
- Tutoriel Docker (apprentissage, 1h, done)
- Lecture Clean Code (apprentissage, 30 min, done)

---

## Exemple 5 : Journée avec habitudes et objectifs

```
Aujourd'hui j'ai bien respecté mes habitudes.

Réveil tôt à 6h, j'ai bu un grand verre d'eau puis j'ai fait 15 minutes de méditation. Ensuite, j'ai écrit dans mon journal pendant 10 minutes.

Petit-déjeuner sain avec avoine et fruits. Puis j'ai fait ma séance de sport : 45 minutes de HIIT à la maison.

Travail de 9h à 17h avec une pause déjeuner d'une heure. J'ai avancé sur plusieurs tâches importantes.

Le soir, j'ai appelé ma grand-mère pour prendre de ses nouvelles, ça fait longtemps qu'on ne s'était pas parlé.

Avant de dormir, j'ai lu 20 pages de mon livre sur la productivité et j'ai planifié ma journée de demain.
```

**Résultat attendu** :

- Eau (santé, done)
- Méditation (santé, 15 min, done)
- Journal (autre, 10 min, done)
- Petit-déjeuner (autre, done)
- HIIT (sport, 45 min, done)
- Travail (travail, 7h, done)
- Appel grand-mère (social, done)
- Lecture productivité (apprentissage, 20 min, done)
- Planification (travail, done)

---

## 💡 Conseils pour de meilleurs résultats

1. **Soyez spécifique** : Mentionnez les durées quand vous les connaissez
2. **Utilisez des verbes d'action** : "j'ai fait", "j'ai terminé", "je dois faire"
3. **Mentionnez les catégories** : sport, travail, santé, etc.
4. **Indiquez le statut** : si c'est fait, en cours, ou à faire
5. **Ajoutez des détails** : lieux, personnes, objectifs

## 🎯 Test rapide

Pour un test rapide, utilisez cet exemple court :

```
Aujourd'hui j'ai couru 5km le matin, travaillé 4 heures sur mon projet, et lu un livre pendant 1 heure le soir.
```

Cela devrait extraire 3 tâches claires !

---

## 📋 Exemples Réels d'Utilisateurs

### Exemple 6 : Journal bien structuré et réaliste

```
Bonjour, voici ma journée du 15 janvier 2025.

MATIN (6h30 - 12h00)
- Réveil à 6h30, douche rapide
- Méditation de 20 minutes dans le salon
- Petit-déjeuner : café, toast, fruits (15 minutes)
- Course à pied dans le parc : 5km en 35 minutes
- Retour à la maison, douche
- Travail sur le projet client : développement de la fonctionnalité de paiement (9h00 - 12h00, 3 heures)

MIDI (12h00 - 14h00)
- Pause déjeuner avec Sarah au restaurant italien (1h30)
- Discussion sur nos projets respectifs

APRÈS-MIDI (14h00 - 18h00)
- Réunion d'équipe en visio : présentation des résultats trimestriels (14h00 - 15h30)
- Suite du développement : correction de bugs identifiés (15h30 - 18h00, 2h30)

SOIR (18h00 - 22h00)
- Séance de musculation à la salle : jambes et dos (18h30 - 19h30, 1h)
- Dîner avec ma copine : cuisine maison (20h00 - 21h00)
- Lecture : "Atomic Habits" - 2 chapitres, environ 40 pages (21h00 - 22h00, 1h)
- Préparation de la journée de demain : planification des tâches (10 minutes)

Bonne journée productive !
```

**Résultat attendu** :

- Méditation (santé, 20 min, done)
- Petit-déjeuner (autre, 15 min, done)
- Course à pied 5km (sport, 35 min, done)
- Développement fonctionnalité paiement (travail, 3h, done)
- Déjeuner avec Sarah (social, 1h30, done)
- Réunion d'équipe (travail, 1h30, done)
- Correction bugs (travail, 2h30, done)
- Musculation (sport, 1h, done)
- Dîner (autre, 1h, done)
- Lecture Atomic Habits (apprentissage, 1h, done)
- Planification (travail, 10 min, done)

---

### Exemple 7 : Journal désorganisé mais informatif

```
ouais alors aujourd'hui c'était chaud 😅

bon réveil vers 7h je crois ou 7h30 je sais plus trop j'étais crevé
j'ai bu mon café vite fait puis j'ai fait un peu de sport genre 30-40 min je dirais ? course dans le quartier
après j'ai bossé sur mon app mobile j'ai codé pendant genre 2-3h je pense j'ai pas regardé l'heure exactement
j'ai mangé un truc vers midi avec thomas on a discuté de son nouveau job c'était cool
l'aprem j'ai regardé une vidéo youtube sur react native ça m'a pris 1h je dirais
puis j'ai continué à coder un peu mais j'ai pas fini la feature que je voulais faire
le soir j'ai appelé ma mère on a parlé 30 min environ
et j'ai lu un peu avant de dormir peut-être 20-25 pages d'un livre sur le développement personnel
voilà c'est tout je pense
```

**Résultat attendu** :

- Café (autre, done)
- Course à pied (sport, 30-40 min, done)
- Développement app mobile (travail, 2-3h, done)
- Déjeuner avec Thomas (social, done)
- Vidéo YouTube React Native (apprentissage, 1h, done)
- Développement feature (travail, in_progress)
- Appel à la mère (social, 30 min, done)
- Lecture développement personnel (apprentissage, 20-25 pages, done)

---

### Exemple 8 : Journal très désorganisé et peu clair

```
ah merde j'ai oublié d'écrire hier bon allez je me souviens un peu

le matin j'ai fait... euh je sais plus exactement mais j'ai couru je crois ou alors c'était hier matin 🤔
non non c'était bien ce matin parce que j'étais en sueur après
après j'ai mangé quelque chose mais je sais plus quoi exactement
j'ai travaillé sur mon truc le projet là celui avec les données j'ai passé du temps dessus plusieurs heures je pense
j'ai vu marie aussi on a bu un café ensemble ou un thé je sais plus
l'après midi j'ai fait du sport à la salle ou alors c'était hier non c'était bien aujourd'hui je me souviens j'avais mal aux jambes après
j'ai aussi regardé des trucs sur internet des tutos je crois sur docker ou kubernetes un truc comme ça
le soir j'ai cuisiné un truc avec des pâtes c'était bon
j'ai lu un peu avant de me coucher mais je me souviens plus combien de pages peut-être 15 ou 20
ah oui et j'ai aussi médité un peu le matin je crois ou le soir ? non le matin je pense
voilà c'est à peu près tout ce dont je me souviens
```

**Résultat attendu** (l'IA doit faire des déductions) :

- Course à pied (sport, done)
- Petit-déjeuner/déjeuner (autre, done)
- Travail sur projet données (travail, plusieurs heures, done)
- Café/thé avec Marie (social, done)
- Sport à la salle (sport, done)
- Tutoriels Docker/Kubernetes (apprentissage, done)
- Cuisine pâtes (autre, done)
- Lecture (apprentissage, 15-20 pages, done)
- Méditation (santé, done)

---

## 🧪 Tests de Robustesse de l'IA

Ces trois exemples permettent de tester la capacité de l'IA à :

1. **Exemple 6 (Structuré)** : Extraire précisément les tâches avec durées et catégories claires
2. **Exemple 7 (Désorganisé)** : Gérer les approximations ("genre 30-40 min", "je pense"), les emojis, et le langage informel
3. **Exemple 8 (Très désorganisé)** : Faire des déductions à partir d'informations floues, gérer les doutes de l'utilisateur, et extraire les tâches malgré le manque de structure

### Points de test spécifiques :

- ✅ Gestion des durées approximatives ("30-40 min", "2-3h")
- ✅ Extraction malgré le langage informel et les emojis
- ✅ Gestion des doutes et incertitudes de l'utilisateur
- ✅ Détection des catégories même sans mention explicite
- ✅ Extraction des durées même quand elles sont approximatives
- ✅ Gestion des tâches mentionnées de manière indirecte
- ✅ Extraction de plusieurs tâches dans un texte désorganisé
