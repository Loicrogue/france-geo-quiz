# 🗺️ France Géo Quiz ( & Quiz Core Blueprint)

Bienvenue sur **France Géo Quiz**, une application web moderne, fluide et addictive dédiée à l'apprentissage des départements français. 

Ce projet a été conçu avec une **architecture modulaire et hautement réutilisable**. La structure globale (State Management, Autocomplétion, Layouts Responsives, Gestion des Modes) sert de modèle (*Blueprint*) pour générer rapidement d'autres applications de quiz thématiques (Mécanique, Cinéma, Jeux Vidéo, Anatomie...).

---

## 🔗 Lien d'accès

L'application web est accessible depuis [le lien suivant](https://france-geo-quiz.netlify.app/).

---

## 🎮 Modes de Jeu

L'application s'articule autour de deux piliers majeurs de rétention et d'apprentissage :

* **🗓️ Département du Jour (Mode Daily) :** Inspiré des mécaniques à la *Wordle*. Le joueur dispose de 10 essais pour deviner le département secret du jour. 
    * Système de **Série (Streak)** pour fidéliser l'utilisateur.
    * Indices progressifs (Région, Chef-lieu) débloqués automatiquement à la moitié des essais.
* **🎯 Mode Entraînement :** Un mode *Sandbox* infini basé sur une file d'attente dynamique. 
    * Le jeu affiche un code/numéro de département, le joueur doit trouver son nom.
    * Suivi des statistiques (bonnes/mauvaises réponses) en direct sur la session.

---

## 🛠️ Stack Technique

L'application repose sur un écosystème moderne, performant et optimisé pour le responsive :

* **Framework :** [React](https://react.dev/) (Functional Components, Hooks avancés, `useRef` pour le contrôle des cycles d'initialisation).
* **Routing :** [React Router DOM](https://reactrouter.com/) pour une navigation fluide en Single Page Application.
* **State Management :** [Zustand](https://github.com/pmndrs/zustand) (`useGameStore`) pour une gestion globale de l'état, décorrélée de l'affichage UI.
* **Styling :** [Tailwind CSS](https://tailwindcss.com/) avec l'approche *Premium Glass & Glow* (dégradés dynamiques, flous d'arrière-plan `blur-3xl`, et micro-interactions au clic/survol).

---

## 📁 Structure du Projet

La logique est rigoureusement séparée pour faciliter la maintenance et le clonage vers d'autres thématiques :

```text
src/
├── components/
│   ├── map/
│   │   └── FranceMap.tsx          # Composant SVG interactif et dynamique
│   └── DepartmentAutocomplete.tsx # Input intelligent anti-typo
├── data/
│   └── departments.ts             # Base de données source (Code, Nom, Chef-lieu, Région)
├── hooks/
│   └── useResponsive.ts           # Hook maison pour les mode Mobile/Tablettte/PC
├── store/
│   └── gameStore.ts               # Coeur logique gérant les scores, les queues et l'historique
└── pages/
    ├── Home.tsx                   # Page d'accueil avec sélection des modes
    ├── DailyMode.tsx              # Interface du défi quotidien
    ├── TrainingMode.tsx           # Interface de l'entraînement infini
    └── NotFound.tsx               # Écran d'erreur 404 stylisé