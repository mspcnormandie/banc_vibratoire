const questions = [
  // ==========================================
  // NIVEAU 1 — DÉBUTANT / FACILE (10 Questions)
  // Mission : Identifier les composants et connaître les règles de sécurité
  // ==========================================
  {
    "type": "qcm",
    "niveau": 1,
    "image": "images/Q1.webp",
    "question": "Quel est le rôle principal d'une pompe ?",
    "options": [
      "Produire de l'électricité",
      "Faire circuler un liquide",
      "Mesurer les vibrations",
      "Refroidir le moteur"
    ],
    "correct": 1,
    "explication": "La pompe est un récepteur hydraulique qui permet de déplacer et faire circuler un fluide dans un circuit."
  },
  {
    "type": "qcm",
    "niveau": 1,
    "image": "images/Q2.webp",
    "question": "Quelle énergie alimente le moteur électrique ?",
    "options": [
      "Hydraulique",
      "Thermique",
      "Électrique",
      "Pneumatique"
    ],
    "correct": 2,
    "explication": "Le moteur électrique est alimenté en énergie électrique qu'il convertit en énergie mécanique de rotation."
  },
  {
    "type": "vrai_faux",
    "niveau": 1,
    "image": "images/Q3.webp",
    "question": "Le moteur électrique produit un mouvement de rotation.",
    "options": [
      "Vrai",
      "Faux"
    ],
    "correct": true,
    "explication": "Vrai. Le rotor du moteur tourne sous l'effet des forces électromagnétiques et entraîne l'arbre en rotation."
  },
  {
    "type": "qcm",
    "niveau": 1,
    "image": "images/Q4.webp",
    "question": "Quel composant protège contre le contact avec les pièces en rotation ?",
    "options": [
      "Le réservoir",
      "Le carter de protection",
      "Le capteur",
      "Le voyant"
    ],
    "correct": 1,
    "explication": "Le carter (protecteur fixe ou grillagé) empêche tout contact physique accidentel avec les pièces tournantes (arbres, manchons)."
  },
  {
    "type": "qcm",
    "niveau": 1,
    "image": "images/Q5.webp",
    "question": "Quel composant transmet le mouvement entre deux arbres ?",
    "options": [
      "Le voyant",
      "Le réservoir",
      "L'accouplement",
      "Le capteur"
    ],
    "correct": 2,
    "explication": "L'accouplement relie l'arbre moteur à l'arbre récepteur pour leur transmettre le couple et la rotation."
  },
  {
    "type": "vrai_faux",
    "niveau": 1,
    "image": "images/Q6.webp",
    "question": "On peut retirer un carter de protection pendant le fonctionnement.",
    "options": [
      "Vrai",
      "Faux"
    ],
    "correct": false,
    "explication": "Faux. Un carter de protection ne doit jamais être retiré quand la machine tourne (risque d'entraînement et happement)."
  },
  {
    "type": "qcm",
    "niveau": 1,
    "image": "images/Q7.webp",
    "question": "Quel élément contient l'eau du circuit ?",
    "options": [
      "Le réducteur",
      "Le roulement",
      "Le moteur",
      "Le réservoir"
    ],
    "correct": 3,
    "explication": "Le réservoir (ou cuve) stocke le liquide servant à alimenter la boucle hydraulique du banc d'essai."
  },
  {
    "type": "qcm",
    "niveau": 1,
    "image": "images/Q8.webp",
    "question": "Quel est le rôle d'un capteur de vibrations ?",
    "options": [
      "Détecter les vibrations",
      "Faire tourner la pompe",
      "Augmenter le débit",
      "Couper mécaniquement l'arbre"
    ],
    "correct": 0,
    "explication": "L'accéléromètre mesure les mouvements vibratoires de la machine pour en surveiller le comportement cinématique."
  },
  {
    "type": "vrai_faux",
    "niveau": 1,
    "image": "images/Q9.webp",
    "question": "Une machine peut vibrer même si elle fonctionne correctement.",
    "options": [
      "Vrai",
      "Faux"
    ],
    "correct": true,
    "explication": "Vrai. Toute machine tournante génère un niveau vibratoire résiduel normal lié à sa rotation et au flux hydraulique."
  },
  {
    "type": "qcm",
    "niveau": 1,
    "image": "images/Q10.webp",
    "question": "Qui autorise la mise en marche du banc pendant le TP ?",
    "options": [
      "N'importe quel élève",
      "Le binôme seul",
      "Le professeur",
      "Le premier élève arrivé"
    ],
    "correct": 2,
    "explication": "En atelier de maintenance, la mise sous tension et la mise en marche doivent être systématiquement validées par l'enseignant."
  },

  // ==========================================
  // NIVEAU 2 — INTERMÉDIAIRE (10 Questions)
  // Mission : Comprendre le fonctionnement du groupe motopompe et sa surveillance
  // ==========================================
  {
    "type": "qcm",
    "niveau": 2,
    "image": "images/Q11.webp",
    "question": "Quel est l'ordre correct de la chaîne de transmission ?",
    "options": [
      "Pompe → Moteur → Réducteur → Accouplement",
      "Moteur → Réducteur → Accouplement → Pompe",
      "Réducteur → Pompe → Moteur → Accouplement",
      "Moteur → Pompe → Réducteur → Accouplement"
    ],
    "correct": 1,
    "explication": "L'énergie motrice part du moteur, traverse le réducteur, passe par l'accouplement pour animer la pompe."
  },
  {
    "type": "qcm",
    "niveau": 2,
    "image": "images/Q12.webp",
    "question": "À quoi sert le réducteur à engrenages ?",
    "options": [
      "À mesurer la pression",
      "À filtrer l'eau",
      "À adapter la vitesse et le couple",
      "À détecter les fuites"
    ],
    "correct": 2,
    "explication": "Le réducteur réduit la vitesse de rotation tout en augmentant proportionnellement le couple disponible."
  },
  {
    "type": "vrai_faux",
    "niveau": 2,
    "image": "images/Q13.webp",
    "question": "La pompe reçoit une énergie mécanique et transmet de l'énergie au liquide.",
    "options": [
      "Vrai",
      "Faux"
    ],
    "correct": true,
    "explication": "Vrai. La roue/impulseur de la pompe transforme l'énergie mécanique reçue en énergie hydraulique (débit et pression)."
  },
  {
    "type": "qcm",
    "niveau": 2,
    "image": "images/Q14.webp",
    "question": "Que désigne l'aspiration d'une pompe ?",
    "options": [
      "L'entrée du liquide dans la pompe",
      "La sortie du liquide",
      "L'alimentation du moteur",
      "Le retour d'information du capteur"
    ],
    "correct": 0,
    "explication": "L'aspiration correspond à la bride ou tubulure d'entrée par laquelle le fluide pénètre dans le corps de pompe."
  },
  {
    "type": "qcm",
    "niveau": 2,
    "image": "images/Q15.webp",
    "question": "Quel est le rôle du boîtier électronique de surveillance vibratoire ?",
    "options": [
      "Entraîner l'arbre",
      "Traiter le signal du capteur",
      "Remplir le réservoir",
      "Modifier la vitesse du moteur"
    ],
    "correct": 1,
    "explication": "Le boîtier conditionne, amplifie et convertit le signal brut du capteur (vitesse RMS, spectre fréquentiel) pour l'analyse."
  },
  {
    "type": "vrai_faux",
    "niveau": 2,
    "image": "images/Q16.webp",
    "question": "L'absence de vibrations visibles prouve qu'une machine ne vibre pas.",
    "options": [
      "Vrai",
      "Faux"
    ],
    "correct": false,
    "explication": "Faux. Les vibrations mécaniques à haute fréquence ou de faible amplitude sont invisibles à l'œil nu mais destructrices pour les roulements."
  },
  {
    "type": "qcm",
    "niveau": 2,
    "image": "images/Q17.webp",
    "question": "Quel défaut correspond à une masse mal répartie autour de l'axe de rotation ?",
    "options": [
      "Désalignement",
      "Fuite hydraulique",
      "Balourd",
      "Défaut d'étanchéité"
    ],
    "correct": 2,
    "explication": "Le balourd résulte d'une dissymétrie de masse par rapport au centre de rotation, créant une force centrifuge à 1x la fréquence de rotation."
  },
  {
    "type": "qcm",
    "niveau": 2,
    "image": "images/Q18.webp",
    "question": "Quel défaut correspond à des axes d'arbres accouplés mal alignés ?",
    "options": [
      "Balourd",
      "Désalignement",
      "Défaut électrique",
      "Défaut de réservoir"
    ],
    "correct": 1,
    "explication": "Le désalignement (angulaire ou radial) survient lorsque les axes géométriques des deux arbres ne sont pas parfaitement colinéaires."
  },
  {
    "type": "vrai_faux",
    "niveau": 2,
    "image": "images/Q19.webp",
    "question": "Pour comparer des relevés vibratoires, il faut conserver des conditions de mesure similaires.",
    "options": [
      "Vrai",
      "Faux"
    ],
    "correct": true,
    "explication": "Vrai. La comparaison n'est fiable que si la vitesse, la charge, la position du capteur et la température sont équivalentes."
  },
  {
    "type": "qcm",
    "niveau": 2,
    "image": "images/Q20.webp",
    "question": "Quel défaut correspond à la détérioration d'une ou plusieurs dents ?",
    "options": [
      "Défaut d'engrenage",
      "Balourd",
      "Défaut du voyant",
      "Désalignement"
    ],
    "correct": 0,
    "explication": "Une dent ébréchée, usée ou piquée sur un pignon génère des chocs répétés à la fréquence d'engrènement."
  },

  // ==========================================
  // NIVEAU 3 — PROFESSIONNEL (10 Questions)
  // Mission : Analyser une situation, appliquer les procédures et rendre compte
  // ==========================================
  {
    "type": "qcm",
    "niveau": 3,
    "image": "images/Q21.webp",
    "question": "Tu remarques une fuite d'eau près du groupe motopompe. Quelle réaction adoptes-tu ?",
    "options": [
      "Tu continues sans rien dire",
      "Tu touches la fuite pour vérifier",
      "Tu signales immédiatement le constat au professeur",
      "Tu démontes la pompe"
    ],
    "correct": 2,
    "explication": "Tout danger ou anomalie hydraulique/électrique doit être signalé immédiatement au responsable sans toucher aux équipements en marche."
  },
  {
    "type": "vrai_faux",
    "niveau": 3,
    "image": "images/Q22.webp",
    "question": "Une augmentation des vibrations suffit pour décider immédiatement de remplacer un roulement.",
    "options": [
      "Vrai",
      "Faux"
    ],
    "correct": false,
    "explication": "Faux. Une hausse globale nécessite d'abord une analyse spectrale pour confirmer l'origine exacte (balourd, désalignement, cavitation, etc.)."
  },
  {
    "type": "qcm",
    "niveau": 3,
    "image": "images/Q23.webp",
    "question": "Un voyant de surveillance signale une alerte. Que dois-tu faire ?",
    "options": [
      "Ignorer le voyant",
      "Modifier les réglages",
      "Informer le responsable et appliquer les consignes",
      "Débrancher le capteur"
    ],
    "correct": 2,
    "explication": "Une alarme impose d'informer le responsable et d'appliquer scrupuleusement la fiche de procédure opérationnelle."
  },
  {
    "type": "qcm",
    "niveau": 3,
    "image": "images/Q24.webp",
    "question": "Deux relevés vibratoires ont été réalisés à des vitesses différentes. Quelle conclusion est la plus rigoureuse ?",
    "options": [
      "Le roulement est forcément usé",
      "Les résultats sont directement comparables",
      "Le capteur est défectueux",
      "Il faut vérifier la comparabilité des conditions"
    ],
    "correct": 3,
    "explication": "Les amplitudes et fréquences vibratoires dépendent directement de la vitesse de rotation ; ils ne peuvent être comparés bruts."
  },
  {
    "type": "qcm",
    "niveau": 3,
    "image": "images/Q25.webp",
    "question": "Pourquoi réaliser un contrôle croisé avec son binôme ?",
    "options": [
      "Pour éviter de rédiger un rapport",
      "Pour vérifier les informations et limiter les erreurs",
      "Pour accélérer la rotation",
      "Pour supprimer les consignes"
    ],
    "correct": 1,
    "explication": "Pratique issue de la sûreté nucléaire (PFI / contrôle croisé) pour fiabiliser les relevés et sécuriser l'intervention."
  },
  {
    "type": "vrai_faux",
    "niveau": 3,
    "image": "images/Q26.webp",
    "question": "Dans un compte rendu, écrire « le roulement est cassé » sans vérification constitue un fait observé.",
    "options": [
      "Vrai",
      "Faux"
    ],
    "correct": false,
    "explication": "Faux. C'est une hypothèse ou une déduction. Le fait observé est le symptôme mesuré ou entendu (ex. : bruit métallique, élévation vibratoire)."
  },
  {
    "type": "qcm",
    "niveau": 3,
    "image": "images/Q27.webp",
    "question": "Un bruit inhabituel apparaît. Quelle formulation convient le mieux au compte rendu ?",
    "options": [
      "Le roulement est mort",
      "La pompe va casser",
      "Bruit métallique intermittent entendu côté moteur à 10 h 15",
      "La machine est dangereuse sans autre précision"
    ],
    "correct": 2,
    "explication": "Un compte rendu professionnel doit consigner des faits objectifs, précis, datés, localisés et sans interprétation hâtive."
  },
  {
    "type": "qcm",
    "niveau": 3,
    "image": "images/Q28.webp",
    "question": "Avant le démarrage, une différence est constatée entre la notice et le banc. Que fais-tu ?",
    "options": [
      "Tu poursuis normalement",
      "Tu adaptes toi-même le montage",
      "Tu ignores la documentation",
      "Tu arrêtes la préparation et demandes une clarification"
    ],
    "correct": 3,
    "explication": "En cas d'écart entre le schéma/notice et l'installation réelle, on suspend l'opération pour lever le doute auprès du responsable."
  },
  {
    "type": "qcm",
    "niveau": 3,
    "image": "images/Q29.webp",
    "question": "Pourquoi conserver un relevé vibratoire de référence ?",
    "options": [
      "Pour comparer les mesures futures et détecter une évolution",
      "Pour éviter toute maintenance",
      "Pour supprimer le contrôle visuel",
      "Pour garantir qu'aucune panne ne se produira"
    ],
    "correct": 0,
    "explication": "Le relevé initial à l'état sain (point zéro) sert d'étalon comparatif pour suivre l'apparition et l'évolution des dégradations."
  },
  {
    "type": "qcm",
    "niveau": 3,
    "image": "images/Q30.webp",
    "question": "Quel compte rendu respecte le mieux la traçabilité professionnelle ?",
    "options": [
      "« Tout fonctionne »",
      "Un compte rendu sans date ni intervenant",
      "Un relevé indiquant équipement, date, intervenants, observations et anomalies signalées",
      "Un diagnostic oral sans trace"
    ],
    "correct": 2,
    "explication": "La traçabilité de maintenance exige l'identification claire de l'équipement, la date, les noms des intervenants et les relevés détaillés."
  }
];