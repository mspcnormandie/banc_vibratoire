# Mission MBP011 — Le défi des techniciens

Jeu pédagogique destiné aux élèves de **première Bac Pro MSPC — Maintenance des Systèmes de Production Connectés**.

Cette activité complète un TP de découverte d’un groupe motopompe et de sensibilisation à la surveillance vibratoire.

## Contexte

Vous êtes techniciens de maintenance de l’entreprise fictive **Techni_plus**, intervenant dans le secteur nucléaire.

Une anomalie a été signalée sur le groupe motopompe **MBP011**. Avant de participer à sa surveillance, vous devez vérifier vos connaissances sur ses composants, son fonctionnement et les règles de sécurité.

## Objectifs pédagogiques

- Identifier les composants du groupe motopompe et expliquer leur rôle.
- Comprendre la chaîne de transmission : moteur, réducteur, accouplement et pompe.
- Découvrir le rôle de la surveillance vibratoire.
- Distinguer une observation d’une hypothèse de panne.
- Choisir une conduite adaptée face à une anomalie.
- Comprendre l’intérêt de la rigueur et de la traçabilité en maintenance.

## Déroulement du jeu

Le défi comporte **30 questions**, sous forme de QCM à réponse unique et de Vrai/Faux.

| Niveau | Contenu | Questions |
|---|---|---|
| Débutant | Composants et règles de sécurité | 10 |
| Intermédiaire | Fonctionnement et surveillance | 10 |
| Professionnel | Anomalies, risques et compte rendu | 10 |

Travail conseillé : **en binôme**, avec les documents du TP.

## Règles

- Une seule bonne réponse par question.
- Le temps de réponse est limité à **20 secondes**.
- Chaque bonne réponse rapporte **10 points**.
- Le joueur dispose de **3 vies** au début d’un niveau.
- La réussite d’un niveau nécessite au moins **80 % des points** et une vie restante.
- Des explications accompagnent les réponses pour faciliter l’apprentissage.

## Utilisation

Ouvrir le fichier **index.html** dans un navigateur récent pour lancer le jeu.

Pour une utilisation en classe, le projet peut également être publié sur **GitHub Pages**, puis partagé par un lien ou un QR code.

Les sons peuvent nécessiter une première interaction avec la page pour être autorisés par le navigateur.

## Fichiers du projet

| Fichier ou dossier | Contenu |
|---|---|
| `index.html` | Interface du jeu |
| `data.js` | Questions, réponses et explications |
| `engine.js` | Fonctionnement du jeu, chronomètre et scores |
| `images/` | Illustrations des questions et écrans du jeu |
| `musique/` | Effets sonores et ambiance |
| `intro.mp4` | Vidéo de présentation fournie avec le projet |

Conserver cette organisation et respecter les noms des fichiers, notamment les majuscules des images `Q1.webp` à `Q30.webp`.

## Progression

Le déblocage des niveaux, les meilleurs résultats en étoiles et le réglage du son sont enregistrés localement dans le navigateur.

Ces informations ne sont pas synchronisées entre les appareils. Leur suppression dans le navigateur peut réinitialiser la progression.

## Adaptation du contenu

Les questions peuvent être modifiées dans **data.js**. Chaque question comprend son niveau, son illustration, ses réponses et une explication.

Le chronomètre et les règles de progression sont définis dans **engine.js**.

## Cadre pédagogique

Le contexte nucléaire est une mise en situation pédagogique. Le jeu accompagne la formation et ne remplace ni les consignes du professeur ni les procédures propres aux équipements.

Toute observation du banc en fonctionnement doit être réalisée sous le contrôle du professeur.

## Auteur

**E. SURGET**  
Professeur de maintenance industrielle  
Lycée Louis-Modeste-Leroy — Évreux
