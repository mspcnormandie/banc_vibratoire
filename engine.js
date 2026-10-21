let currentLevel = 1;
let currentQuestionIndex = 0;
let score = 0;
let vies = 3;
let consecutiveCorrect = 0;
let questionTimer = 20;
let timerInterval = null;
let currentQuestionsList = [];
let answeredCurrentQuestion = false;
let userErrors = [];
let unlockedLevel = 1;
let bestStars = { 1: 0, 2: 0, 3: 0 };
let isMuted = false;
let isAmbiancePlaying = false;
let isGameRunning = false;

// --- MOTEUR AUDIO ---
const soundUrls = {
  clic: 'musique/clic.mp3',
  ding: 'musique/ding.mp3',
  mauvaise: 'musique/mauvaise.mp3',
  victoire: 'musique/victoire.mp3',
  bonus: 'musique/victoire.mp3',
  defaite: 'musique/defaite.mp3',
  tictac: 'musique/tictac.mp3',
  ambiance: 'musique/bruit_atelier.wav'
};

let audioContext = null;
let masterGainNode = null;
const audioBuffers = {};
const activeSourcesList = { tictac: [] };

let bgMusicAudio = null;

function getBgMusic() {
  if (!bgMusicAudio) {
    bgMusicAudio = new Audio(soundUrls.ambiance);
    bgMusicAudio.loop = true;
    bgMusicAudio.volume = 0.45;
    bgMusicAudio.preload = 'auto';
  }
  return bgMusicAudio;
}

function initAudioEngine() {
  if (!audioContext) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) {
      audioContext = new AudioCtx();
      masterGainNode = audioContext.createGain();
      masterGainNode.gain.setValueAtTime(isMuted ? 0 : 1, audioContext.currentTime);
      masterGainNode.connect(audioContext.destination);

      for (let key in soundUrls) {
        if (key !== 'ambiance') {
          loadSoundBuffer(key, soundUrls[key]);
        }
      }
    }
  }
  if (audioContext && audioContext.state === 'suspended') {
    audioContext.resume().catch(() => {});
  }
}

async function loadSoundBuffer(key, url) {
  if (!audioContext) return;
  try {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    audioBuffers[key] = await audioContext.decodeAudioData(arrayBuffer);
  } catch (e) {}
}

const htmlAudioPool = {};
for (let key in soundUrls) {
  if (key !== 'ambiance') {
    htmlAudioPool[key] = new Audio(soundUrls[key]);
  }
}

function playSound(type) {
  if (isMuted) return;
  initAudioEngine();

  if (type === 'tictac') {
    stopSound('tictac');
  }

  if (audioContext && audioBuffers[type] && masterGainNode) {
    try {
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffers[type];
      source.connect(masterGainNode);
      source.start(0);

      if (type === 'tictac') {
        activeSourcesList.tictac.push(source);
        source.onended = () => {
          const idx = activeSourcesList.tictac.indexOf(source);
          if (idx !== -1) activeSourcesList.tictac.splice(idx, 1);
        };
      }
      return;
    } catch (e) {}
  }

  try {
    const sound = htmlAudioPool[type] || htmlAudioPool['victoire'];
    if (sound && !isMuted) {
      sound.muted = false;
      sound.currentTime = 0;
      sound.play().catch(() => {});
    }
  } catch (e) {}
}

function stopSound(type) {
  if (type === 'tictac') {
    if (activeSourcesList.tictac && activeSourcesList.tictac.length > 0) {
      activeSourcesList.tictac.forEach(src => {
        try {
          src.stop(0);
          src.disconnect();
        } catch (e) {}
      });
      activeSourcesList.tictac = [];
    }
  }
  try {
    const sound = htmlAudioPool[type];
    if (sound) {
      sound.pause();
      sound.currentTime = 0;
    }
  } catch (e) {}
}

function startAmbianceAtelier() {
  if (isMuted || isGameRunning) return;
  initAudioEngine();

  const a = getBgMusic();
  if (a) {
    a.muted = false;
    a.volume = 0.45;
    const playPromise = a.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        if (isMuted || isGameRunning) {
          a.pause();
          isAmbiancePlaying = false;
        } else {
          isAmbiancePlaying = true;
        }
      }).catch(() => {
        isAmbiancePlaying = false;
      });
    }
  }
}

function stopAmbianceAtelier() {
  isAmbiancePlaying = false;
  if (bgMusicAudio) {
    try {
      bgMusicAudio.pause();
      bgMusicAudio.currentTime = 0;
    } catch (e) {}
  }
}

function stopAllAudio() {
  stopAmbianceAtelier();
  stopSound('tictac');
  for (let key in htmlAudioPool) {
    try {
      htmlAudioPool[key].pause();
      htmlAudioPool[key].currentTime = 0;
      htmlAudioPool[key].muted = true;
    } catch (e) {}
  }
  if (bgMusicAudio) {
    try {
      bgMusicAudio.pause();
      bgMusicAudio.currentTime = 0;
      bgMusicAudio.muted = true;
    } catch (e) {}
  }
}

function showToast(message) {
  const toast = document.getElementById('toast-notification');
  if (toast) {
    toast.innerText = message;
    toast.classList.add('show');
    setTimeout(() => { toast.classList.remove('show'); }, 2000);
  }
}

function toggleMute(e) {
  if (e) {
    e.stopPropagation();
    e.preventDefault();
  }
  initAudioEngine();

  if (!isMuted && !isAmbiancePlaying) {
    isMuted = false;
    startAmbianceAtelier();
  } else {
    isMuted = !isMuted;
  }

  try { localStorage.setItem('signalisation_sound_muted', isMuted ? '1' : '0'); } catch (e) {}

  if (masterGainNode && audioContext) {
    masterGainNode.gain.setValueAtTime(isMuted ? 0 : 1, audioContext.currentTime);
  }

  if (bgMusicAudio) {
    bgMusicAudio.muted = isMuted;
  }

  for (let key in htmlAudioPool) {
    htmlAudioPool[key].muted = isMuted;
  }

  updateMuteButtonDisplay();

  if (isMuted) {
    stopAllAudio();
    showToast("🔇 Son désactivé");
  } else {
    showToast("🔊 Son activé");
    playSound('clic');
    if (!isGameRunning) {
      startAmbianceAtelier();
    }
  }
}

function updateMuteButtonDisplay() {
  const btn = document.getElementById('btn-audio-mute');
  const icon = document.getElementById('mute-icon');
  const text = document.getElementById('mute-text');
  if (btn) {
    if (isMuted) {
      if (icon) icon.innerText = '🔇';
      if (text) text.innerText = 'MUET';
      btn.classList.add('muted');
      btn.title = "Son coupé (Cliquer pour activer)";
    } else {
      if (icon) icon.innerText = '🔊';
      if (text) text.innerText = 'SON';
      btn.classList.remove('muted');
      btn.title = "Son activé (Cliquer pour couper)";
    }
  }
}

function toggleFullScreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().then(() => {
      if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock('landscape').catch(() => {});
      }
    }).catch(() => {});
  } else {
    document.exitFullscreen().catch(() => {});
  }
}

async function requestWakeLock() {
  try {
    if ('wakeLock' in navigator) {
      await navigator.wakeLock.request('screen');
    }
  } catch (err) {}
}

function openMenuScreen() {
  const s1 = document.getElementById('start-screen-1');
  const s2 = document.getElementById('start-screen-2');
  if (s1) {
    s1.style.display = 'none';
    s1.style.pointerEvents = 'none';
  }
  if (s2) {
    s2.style.display = 'flex';
    s2.style.pointerEvents = 'auto';
  }

  playSound('clic');
  if (!isMuted && !isGameRunning) {
    startAmbianceAtelier();
  }
}

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function startGame() {
  isGameRunning = true;
  stopAmbianceAtelier();
  stopSound('tictac');
  playSound('clic');

  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  const s1 = document.getElementById('start-screen-1');
  const s2 = document.getElementById('start-screen-2');
  if (s1) {
    s1.style.display = 'none';
    s1.style.pointerEvents = 'none';
  }
  if (s2) {
    s2.style.display = 'none';
    s2.style.pointerEvents = 'none';
  }

  hideEndScreens();

  const filteredQuestions = questions.filter(q => q.niveau === currentLevel);
  currentQuestionsList = shuffleArray(filteredQuestions);
  userErrors = [];

  currentQuestionIndex = 0;
  score = 0;
  vies = 3;
  consecutiveCorrect = 0;
  updateLivesDisplay();

  const scoreElem = document.getElementById('txt-score');
  if (scoreElem) scoreElem.innerText = `🏆 0 pts`;

  loadQuestion();
}

function openRulesModal() {
  playSound('clic');
  const modal = document.getElementById('rules-modal');
  if (modal) modal.style.display = 'flex';
}

function closeRulesModal() {
  playSound('clic');
  const modal = document.getElementById('rules-modal');
  if (modal) modal.style.display = 'none';
}

function preloadNextImage() {
  const nextQ = currentQuestionsList[currentQuestionIndex + 1];
  if (nextQ && nextQ.image) {
    const img = new Image();
    img.src = nextQ.image;
  }
}

function loadProgression() {
  try {
    const savedLevel = localStorage.getItem('signalisation_unlocked_level');
    unlockedLevel = savedLevel ? parseInt(savedLevel, 10) : 1;

    const savedStars = localStorage.getItem('signalisation_best_stars');
    if (savedStars) bestStars = JSON.parse(savedStars);

    const savedMute = localStorage.getItem('signalisation_sound_muted');
    isMuted = savedMute === '1';
  } catch (e) {
    unlockedLevel = 1;
    bestStars = { 1: 0, 2: 0, 3: 0 };
    isMuted = false;
  }
  updateMuteButtonDisplay();
  updateLevelMenuButtons();
}

function saveProgression(lvl, starsEarned) {
  if (lvl > unlockedLevel) {
    unlockedLevel = lvl;
    try { localStorage.setItem('signalisation_unlocked_level', unlockedLevel); } catch (e) {}
  }
  if (starsEarned > (bestStars[currentLevel] || 0)) {
    bestStars[currentLevel] = starsEarned;
    try { localStorage.setItem('signalisation_best_stars', JSON.stringify(bestStars)); } catch (e) {}
  }
  updateLevelMenuButtons();
}

function resetProgress() {
  try {
    localStorage.removeItem('signalisation_unlocked_level');
    localStorage.removeItem('signalisation_best_stars');
    localStorage.removeItem('signalisation_sound_muted');
  } catch (e) {}
  unlockedLevel = 1;
  bestStars = { 1: 0, 2: 0, 3: 0 };
  isMuted = false;
  updateMuteButtonDisplay();
  selectLevel(1);
  updateLevelMenuButtons();
  playSound('clic');
  showToast("🔄 Progression réinitialisée !");
}

function updateLevelMenuButtons() {
  const labels = {
    1: { unlocked: "🟢 Niveau 1 : Débutant", locked: "🔒 Niveau 1 : Débutant" },
    2: { unlocked: "🟠 Niveau 2 : Intermédiaire", locked: "🔒 Niveau 2 : Intermédiaire" },
    3: { unlocked: "🔴 Niveau 3 : Professionnel", locked: "🔒 Niveau 3 : Professionnel" }
  };

  for (let lvl = 1; lvl <= 3; lvl++) {
    const btn = document.getElementById(`lvl-btn-${lvl}`);
    const starsBadge = document.getElementById(`lvl-stars-${lvl}`);
    if (btn) {
      const labelElem = btn.querySelector('.lvl-label');
      if (lvl <= unlockedLevel) {
        btn.classList.remove('locked');
        if (labelElem) labelElem.innerText = labels[lvl].unlocked;
      } else {
        btn.classList.add('locked');
        if (labelElem) labelElem.innerText = labels[lvl].locked;
      }
    }
    if (starsBadge) {
      const count = bestStars[lvl] || 0;
      starsBadge.innerText = count > 0 ? "⭐".repeat(count) : "";
    }
  }
}

function selectLevel(lvl) {
  const targetLvl = parseInt(lvl, 10);
  if (targetLvl > unlockedLevel) {
    playSound('mauvaise');
    showToast(`⚠️ Valide le Niveau ${targetLvl - 1} pour débloquer !`);
    return;
  }

  playSound('clic');
  currentLevel = targetLvl;
  const badge = document.getElementById('current-level-badge');
  const nomsNiveaux = { 1: "Niveau 1 : Débutant", 2: "Niveau 2 : Intermédiaire", 3: "Niveau 3 : Professionnel" };
  if (badge) badge.innerText = nomsNiveaux[currentLevel] || `Niveau ${currentLevel}`;
  document.querySelectorAll('.btn-level').forEach(btn => btn.classList.remove('selected'));
  const selectedBtn = document.getElementById(`lvl-btn-${currentLevel}`);
  if (selectedBtn) selectedBtn.classList.add('selected');
}

function hideEndScreens() {
  const win = document.getElementById('win-screen');
  const lose = document.getElementById('lose-screen');
  if (win) { win.style.display = 'none'; }
  if (lose) { lose.style.display = 'none'; }
  closeErrorsModal();
}

function loadQuestion() {
  stopSound('tictac');
  if (!currentQuestionsList || currentQuestionsList.length === 0 || currentQuestionIndex >= currentQuestionsList.length) {
    const maxScore = currentQuestionsList.length * 10;
    // Seuil de validation conforme au corrigé enseignant : 80% (au moins 8 bonnes réponses sur 10)
    const isSuccess = maxScore > 0 && vies > 0 && score >= (maxScore * 0.8);
    endGame(isSuccess);
    return;
  }

  preloadNextImage();
  answeredCurrentQuestion = false;
  const q = currentQuestionsList[currentQuestionIndex];

  const stepElem = document.getElementById('txt-step');
  if (stepElem) stepElem.innerText = `Question : ${currentQuestionIndex + 1} / ${currentQuestionsList.length}`;

  const questionElem = document.getElementById('question-text');
  if (questionElem) {
    if (q.type === 'multi_selection') {
      questionElem.innerHTML = `${q.question} <span class="multi-hint">(Plusieurs réponses possibles)</span>`;
    } else {
      questionElem.innerText = q.question;
    }
  }

  document.querySelectorAll('.click-marker, .target-highlight').forEach(m => m.remove());

  const imgElement = document.getElementById('img-situation');
  if (imgElement) {
    imgElement.src = q.image;
    imgElement.onclick = null;
    imgElement.style.cursor = "default";
  }

  const optionsContainer = document.getElementById('options-container');
  if (optionsContainer) optionsContainer.innerHTML = '';

  const expBox = document.getElementById('explanation-box');
  if (expBox) expBox.style.display = 'none';

  const btnNext = document.getElementById('btn-next');
  if (btnNext) {
    btnNext.style.display = 'none';
    btnNext.innerText = (currentQuestionIndex === currentQuestionsList.length - 1) ? "VOIR MES RÉSULTATS ➔" : "CONTINUER ➔";
  }

  switch (q.type) {
    case "vrai_faux":
      renderVraiFaux(q, optionsContainer);
      break;
    case "multi_selection":
      renderMultiSelection(q, optionsContainer);
      break;
    case "click_zone":
      renderClickZone(q, imgElement, optionsContainer);
      break;
    case "qcm":
    default:
      renderQCM(q, optionsContainer);
      break;
  }

  startQuestionTimer();
}

function renderQCM(q, container) {
  if (!container) return;
  const letters = ['A', 'B', 'C', 'D'];
  const btnList = [];
  q.options.forEach((opt, index) => {
    const btn = document.createElement('button');
    btn.className = 'btn-option';
    btn.innerHTML = `<span class="prefix">${letters[index]}</span> <span>${opt}</span>`;
    btn.onclick = () => {
      btnList.forEach((b, idx) => {
        b.onclick = null;
        if (idx === q.correct) b.classList.add('correct');
        else if (idx === index) b.classList.add('incorrect');
      });
      validateAnswer(index === q.correct, q.explication, q, btn);
    };
    btnList.push(btn);
    container.appendChild(btn);
  });
}

// VERSION SÉCURISÉE VRAI / FAUX : gère true/false, 0/1 et texte "Vrai"
function renderVraiFaux(q, container) {
  if (!container) return;
  const btnVrai = document.createElement('button');
  btnVrai.className = 'btn-option';
  btnVrai.innerHTML = `<span class="prefix" style="color:#22c55e;">✓</span> <span>VRAI</span>`;

  const btnFaux = document.createElement('button');
  btnFaux.className = 'btn-option';
  btnFaux.innerHTML = `<span class="prefix" style="color:#ef4444;">✕</span> <span>FAUX</span>`;

  // Vérifie si la réponse attendue est Vrai (true, index 0, ou chaîne "Vrai")
  const isVraiCorrect = (q.correct === true || q.correct === 0 || q.correct === 'Vrai' || q.correct === 'true');

  const disableBoth = (userPickedVrai) => {
    btnVrai.onclick = null;
    btnFaux.onclick = null;

    if (isVraiCorrect) {
      btnVrai.classList.add('correct');
      if (!userPickedVrai) btnFaux.classList.add('incorrect');
    } else {
      btnFaux.classList.add('correct');
      if (userPickedVrai) btnVrai.classList.add('incorrect');
    }
  };

  btnVrai.onclick = () => {
    disableBoth(true);
    validateAnswer(isVraiCorrect, q.explication, q, btnVrai);
  };

  btnFaux.onclick = () => {
    disableBoth(false);
    validateAnswer(!isVraiCorrect, q.explication, q, btnFaux);
  };

  container.appendChild(btnVrai);
  container.appendChild(btnFaux);
}

function renderMultiSelection(q, container) {
  if (!container) return;
  const selected = new Set();
  const btnList = [];

  q.options.forEach((opt, index) => {
    const btn = document.createElement('button');
    btn.className = 'btn-option';
    btn.innerHTML = `<span class="prefix">☐</span> <span>${opt}</span>`;
    btn.onclick = () => {
      if (answeredCurrentQuestion) return;
      playSound('clic');
      if (selected.has(index)) {
        selected.delete(index);
        btn.classList.remove('selected');
        btn.querySelector('.prefix').innerText = '☐';
      } else {
        selected.add(index);
        btn.classList.add('selected');
        btn.querySelector('.prefix').innerText = '☑';
      }
    };
    btnList.push(btn);
    container.appendChild(btn);
  });

  const btnValider = document.createElement('button');
  btnValider.className = 'btn-mission-start';
  btnValider.style.background = '#0284c7';
  btnValider.style.marginTop = '6px';
  btnValider.innerText = 'Valider la sélection ➔';
  btnValider.onclick = () => {
    btnList.forEach((b, idx) => {
      b.onclick = null;
      const shouldBeSelected = q.correct.includes(idx);
      const isSelected = selected.has(idx);
      if (shouldBeSelected) b.classList.add('correct');
      else if (isSelected && !shouldBeSelected) b.classList.add('incorrect');
    });
    btnValider.style.display = 'none';

    const isCorrect = Array.isArray(q.correct) && q.correct.length === selected.size && q.correct.every(val => selected.has(val));
    validateAnswer(isCorrect, q.explication, q, btnValider);
  };
  container.appendChild(btnValider);
}

function renderClickZone(q, imgElement, container) {
  if (!imgElement || !container) return;
  imgElement.style.cursor = "crosshair";
  container.innerHTML = '<div style="background:#334155; padding:10px 14px; border-radius:8px; font-size:13.5px; color:#38bdf8; text-align:center; font-weight:bold;">👉 Touche directement l\'élément concerné sur la photo.</div>';

  const tz = q.targetZone || { xMin: 20, yMin: 20, xMax: 80, yMax: 80 };

  const handleTouchZone = (clientX, clientY) => {
    if (answeredCurrentQuestion) return;

    const rect = imgElement.getBoundingClientRect();
    const parentRect = imgElement.parentElement.getBoundingClientRect();

    const naturalRatio = imgElement.naturalWidth / imgElement.naturalHeight;
    const visibleRatio = rect.width / rect.height;

    let renderedWidth = rect.width;
    let renderedHeight = rect.height;
    let offsetX = 0;
    let offsetY = 0;

    if (naturalRatio > visibleRatio) {
      renderedHeight = rect.width / naturalRatio;
      offsetY = (rect.height - renderedHeight) / 2;
    } else {
      renderedWidth = rect.height * naturalRatio;
      offsetX = (rect.width - renderedWidth) / 2;
    }

    const clickXInRendered = clientX - rect.left - offsetX;
    const clickYInRendered = clientY - rect.top - offsetY;

    const xPercent = (clickXInRendered / renderedWidth) * 100;
    const yPercent = (clickYInRendered / renderedHeight) * 100;

    const tolerance = 5;
    const isInside = xPercent >= (tz.xMin - tolerance) && xPercent <= (tz.xMax + tolerance) &&
                     yPercent >= (tz.yMin - tolerance) && yPercent <= (tz.yMax + tolerance);

    const marker = document.createElement('div');
    marker.className = 'click-marker';
    marker.style.left = `${clientX - parentRect.left}px`;
    marker.style.top = `${clientY - parentRect.top}px`;
    marker.style.border = isInside ? '3px solid #22c55e' : '3px solid #ef4444';
    marker.style.backgroundColor = isInside ? 'rgba(34, 197, 94, 0.45)' : 'rgba(239, 68, 68, 0.45)';
    imgElement.parentElement.appendChild(marker);

    if (!isInside) {
      const highlight = document.createElement('div');
      highlight.className = 'target-highlight';
      highlight.style.left = `${(rect.left - parentRect.left) + offsetX + (tz.xMin / 100) * renderedWidth}px`;
      highlight.style.top = `${(rect.top - parentRect.top) + offsetY + (tz.yMin / 100) * renderedHeight}px`;
      highlight.style.width = `${((tz.xMax - tz.xMin) / 100) * renderedWidth}px`;
      highlight.style.height = `${((tz.yMax - tz.yMin) / 100) * renderedHeight}px`;
      imgElement.parentElement.appendChild(highlight);
    }

    imgElement.onclick = null;
    validateAnswer(isInside, q.explication, q, marker);
  };

  imgElement.onclick = (e) => {
    handleTouchZone(e.clientX, e.clientY);
  };
}

function startQuestionTimer() {
  questionTimer = 20;
  const txtTimer = document.getElementById('txt-timer');
  const progressBar = document.getElementById('bar-progression');

  if (txtTimer) {
    txtTimer.innerText = `⏱️ 20s`;
    txtTimer.style.color = '#f8fafc';
    txtTimer.classList.remove('timer-danger');
  }

  if (progressBar) {
    progressBar.style.transform = 'scaleX(1)';
    progressBar.style.backgroundColor = '#22c55e';
    progressBar.classList.remove('timer-danger');
  }

  if (timerInterval) clearInterval(timerInterval);
  timerInterval = null;
  stopSound('tictac');

  timerInterval = setInterval(() => {
    questionTimer--;
    if (txtTimer) txtTimer.innerText = `⏱️ ${questionTimer}s`;
    const scaleRatio = Math.max(0, questionTimer / 20);
    if (progressBar) progressBar.style.transform = `scaleX(${scaleRatio})`;

    if (questionTimer > 10) {
      if (progressBar) progressBar.style.backgroundColor = '#22c55e';
      if (txtTimer) txtTimer.style.color = '#f8fafc';
    } else if (questionTimer > 5) {
      if (progressBar) progressBar.style.backgroundColor = '#38bdf8';
      if (txtTimer) txtTimer.style.color = '#fbbf24';
    } else if (questionTimer > 0) {
      if (progressBar) { progressBar.style.backgroundColor = '#ef4444'; progressBar.classList.add('timer-danger'); }
      if (txtTimer) { txtTimer.style.color = '#ef4444'; txtTimer.classList.add('timer-danger'); }
      playSound('tictac');
    } else {
      stopSound('tictac');
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
      handleTimeout();
    }
  }, 1000);
}

function handleTimeout() {
  if (answeredCurrentQuestion) return;
  stopSound('tictac');
  const q = currentQuestionsList[currentQuestionIndex];

  if (q && q.type === 'click_zone') {
    const imgElement = document.getElementById('img-situation');
    if (imgElement) {
      const rect = imgElement.getBoundingClientRect();
      const parentRect = imgElement.parentElement.getBoundingClientRect();
      const tz = q.targetZone || { xMin: 20, yMin: 20, xMax: 80, yMax: 80 };

      const naturalRatio = imgElement.naturalWidth / imgElement.naturalHeight;
      const visibleRatio = rect.width / rect.height;

      let renderedWidth = rect.width;
      let renderedHeight = rect.height;
      let offsetX = 0;
      let offsetY = 0;

      if (naturalRatio > visibleRatio) {
        renderedHeight = rect.width / naturalRatio;
        offsetY = (rect.height - renderedHeight) / 2;
      } else {
        renderedWidth = rect.height * naturalRatio;
        offsetX = (rect.width - renderedWidth) / 2;
      }

      const highlight = document.createElement('div');
      highlight.className = 'target-highlight';
      highlight.style.left = `${(rect.left - parentRect.left) + offsetX + (tz.xMin / 100) * renderedWidth}px`;
      highlight.style.top = `${(rect.top - parentRect.top) + offsetY + (tz.yMin / 100) * renderedHeight}px`;
      highlight.style.width = `${((tz.xMax - tz.xMin) / 100) * renderedWidth}px`;
      highlight.style.height = `${((tz.yMax - tz.yMin) / 100) * renderedHeight}px`;
      imgElement.parentElement.appendChild(highlight);
    }
  }

  validateAnswer(false, `⏱️ Temps écoulé ! ${q ? q.explication : ''}`, q, null);
}

function showFloatingBanner(text, type, onFinish, topPercent = 50) {
  const isScore = (type === 'score');
  const targetElem = isScore ? document.getElementById('txt-score') : document.getElementById('hud-lives-container');

  const banner = document.createElement('div');
  banner.innerText = text;

  let bgGradient = 'linear-gradient(135deg, #0a2540 0%, #081a2e 50%, #030b14 100%)';
  let borderColor = '#f59e0b';
  let textColor = '#fbbf24';
  let shadowColor = 'rgba(10, 37, 64, 0.95)';

  if (type === 'life') {
    bgGradient = 'linear-gradient(135deg, #450a0a 0%, #290404 50%, #150202 100%)';
    borderColor = '#dc2626';
    textColor = '#ef4444';
    shadowColor = 'rgba(69, 10, 10, 0.95)';
  } else if (type === 'heal') {
    bgGradient = 'linear-gradient(135deg, #064e3b 0%, #022c22 50%, #011710 100%)';
    borderColor = '#22c55e';
    textColor = '#4ade80';
    shadowColor = 'rgba(6, 78, 59, 0.95)';
  }

  Object.assign(banner.style, {
    position: 'fixed',
    zIndex: '2147483647',
    top: `${topPercent}%`,
    left: '50%',
    transform: 'translate(-50%, -50%) scale(1)',
    opacity: '1',
    padding: '16px 36px',
    borderRadius: '14px',
    fontSize: '28px',
    fontWeight: '900',
    letterSpacing: '1.5px',
    textAlign: 'center',
    whiteSpace: 'nowrap',
    pointerEvents: 'none',
    background: bgGradient,
    border: `3px solid ${borderColor}`,
    color: textColor,
    textShadow: `0 0 14px ${textColor}, 0 2px 4px rgba(0,0,0,0.9)`,
    boxShadow: `0 0 35px ${shadowColor}, 0 10px 30px rgba(0,0,0,0.8)`,
    transition: 'transform 0.65s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.65s cubic-bezier(0.2, 0.8, 0.2, 1)'
  });

  document.documentElement.appendChild(banner);

  setTimeout(() => {
    let deltaX = isScore ? 150 : 50;
    let deltaY = -240;

    if (targetElem) {
      const bRect = banner.getBoundingClientRect();
      const tRect = targetElem.getBoundingClientRect();
      deltaX = (tRect.left + tRect.width / 2) - (bRect.left + bRect.width / 2);
      deltaY = (tRect.top + tRect.height / 2) - (bRect.top + bRect.height / 2);
    }

    banner.style.transform = `translate(calc(-50% + ${deltaX}px), calc(-50% + ${deltaY}px)) scale(0.18)`;
    banner.style.opacity = '0';

    setTimeout(() => {
      if (banner.parentNode) banner.parentNode.removeChild(banner);
      if (typeof onFinish === 'function') onFinish();
    }, 650);
  }, 2000);
}

function triggerScoreAnimation(isCombo = false) {
  const topPos = isCombo ? 54 : 50;
  showFloatingBanner('+10 POINTS !', 'score', () => {
    score += 10;
    const scoreElem = document.getElementById('txt-score');
    if (scoreElem) {
      scoreElem.innerText = `🏆 ${score} pts`;
      scoreElem.classList.remove('score-bump');
      void scoreElem.offsetWidth;
      scoreElem.classList.add('score-bump');
      setTimeout(() => { scoreElem.classList.remove('score-bump'); }, 500);
    }
  }, topPos);
}

function triggerLifeHealAnimation() {
  playSound('bonus');
  showFloatingBanner('❤️ +1 VIE (COMBO x2 !)', 'heal', () => {
    vies = Math.min(3, vies + 1);
    updateLivesDisplay();

    const livesContainer = document.getElementById('hud-lives-container');
    if (livesContainer) {
      livesContainer.classList.remove('lives-loss-bump');
      void livesContainer.offsetWidth;
      livesContainer.classList.add('lives-loss-bump');
      setTimeout(() => { livesContainer.classList.remove('lives-loss-bump'); }, 500);
    }
  }, 38);
}

function triggerLifeLossAnimation(isFatal) {
  showFloatingBanner('💔 -1 VIE', 'life', () => {
    vies = Math.max(0, vies - 1);
    updateLivesDisplay();

    const livesContainer = document.getElementById('hud-lives-container');
    if (livesContainer) {
      livesContainer.classList.remove('lives-loss-bump');
      void livesContainer.offsetWidth;
      livesContainer.classList.add('lives-loss-bump');
      setTimeout(() => { livesContainer.classList.remove('lives-loss-bump'); }, 500);
    }

    if (isFatal) {
      setTimeout(() => { endGame(false); }, 300);
    }
  }, 50);
}

function validateAnswer(isSuccess, explication, currentQ, sourceElement) {
  if (answeredCurrentQuestion) return;
  answeredCurrentQuestion = true;

  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  stopSound('tictac');

  if (navigator.vibrate) {
    try { navigator.vibrate(isSuccess ? 50 : [100, 50, 100]); } catch (e) {}
  }

  const txtTimer = document.getElementById('txt-timer');
  const progressBar = document.getElementById('bar-progression');
  if (txtTimer) txtTimer.classList.remove('timer-danger');
  if (progressBar) progressBar.classList.remove('timer-danger');

  if (isSuccess) {
    playSound('ding');
    consecutiveCorrect++;

    const isCombo = (consecutiveCorrect >= 2 && vies < 3);

    if (isCombo) {
      consecutiveCorrect = 0;
      triggerLifeHealAnimation();
    }

    triggerScoreAnimation(isCombo);
  } else {
    playSound('mauvaise');
    consecutiveCorrect = 0;

    if (currentQ && !userErrors.some(err => err.question === currentQ.question)) {
      userErrors.push(currentQ);
    }

    const isFatal = (vies - 1) <= 0;
    triggerLifeLossAnimation(isFatal);
  }

  const expBox = document.getElementById('explanation-box');
  const expText = document.getElementById('explanation-text');
  if (expText) expText.innerText = (isSuccess ? "✅ " : "❌ ") + explication;
  if (expBox) expBox.style.display = 'block';

  const btnNext = document.getElementById('btn-next');
  if (btnNext) btnNext.style.display = 'block';

  const quizPanel = document.querySelector('.quiz-panel');
  if (quizPanel) quizPanel.scrollTop = quizPanel.scrollHeight;
}

function updateLivesDisplay() {
  let hearts = '';
  for (let i = 0; i < 3; i++) hearts += i < vies ? '❤️' : '🖤';
  const livesElement = document.getElementById('txt-lives');
  if (livesElement) livesElement.innerText = `Vies : ${hearts}`;

  const comboBadge = document.getElementById('hud-combo-badge');
  if (comboBadge) {
    comboBadge.style.display = (vies < 3 && consecutiveCorrect === 1) ? 'inline-block' : 'none';
  }
}

function nextQuestion() {
  stopSound('tictac');
  currentQuestionIndex++;
  loadQuestion();
}

function endGame(isWin) {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  stopSound('tictac');

  const maxScore = currentQuestionsList.length * 10;
  const btnWinErr = document.getElementById('btn-win-errors');
  const btnLoseErr = document.getElementById('btn-lose-errors');
  const hasErrors = userErrors.length > 0;

  if (btnWinErr) btnWinErr.style.display = hasErrors ? 'block' : 'none';
  if (btnLoseErr) btnLoseErr.style.display = hasErrors ? 'block' : 'none';

  if (isWin) {
    playSound('victoire');
    const scoreText = document.getElementById('win-score-text');
    if (scoreText) scoreText.innerText = `${score} / ${maxScore} pts (${vies} ❤️ restante${vies > 1 ? 's' : ''})`;

    let starsCount = 1;
    let rankTitle = "Validé";

    if (score === 100 && vies === 3) {
      starsCount = 3;
      rankTitle = "⭐⭐⭐ Expert (Sans faute)";
    } else if (score >= 80) {
      starsCount = 2;
      rankTitle = "⭐⭐ Mission Validée";
    } else {
      starsCount = 1;
      rankTitle = "⭐ À consolider";
    }

    const starsIcons = document.getElementById('win-stars-icons');
    const rankElem = document.getElementById('win-rank-title');
    if (starsIcons) starsIcons.innerText = "⭐".repeat(starsCount) + "☆".repeat(3 - starsCount);
    if (rankElem) rankElem.innerText = rankTitle;

    const unlockBadge = document.getElementById('win-unlock-text');
    const nextLvl = currentLevel + 1;
    if (currentLevel === unlockedLevel && currentLevel < 3) {
      saveProgression(nextLvl, starsCount);
      if (unlockBadge) {
        unlockBadge.innerText = `🔓 Niveau ${nextLvl} débloqué !`;
        unlockBadge.style.display = 'block';
      }
    } else {
      saveProgression(unlockedLevel, starsCount);
      if (unlockBadge) unlockBadge.style.display = 'none';
    }

    const winScreen = document.getElementById('win-screen');
    if (winScreen) winScreen.style.display = 'flex';
  } else {
    playSound('defaite');
    const loseText = document.getElementById('lose-score-text');
    if (loseText) {
      if (vies <= 0) {
        loseText.innerText = `${score} pts (0 vie restante)`;
      } else {
        loseText.innerText = `${score} / ${maxScore} pts (Seuil de 80% non atteint)`;
      }
    }
    const loseScreen = document.getElementById('lose-screen');
    if (loseScreen) loseScreen.style.display = 'flex';
  }
}

function openErrorsModal() {
  const container = document.getElementById('errors-list-container');
  const badge = document.getElementById('errors-count-badge');
  if (!container || !badge) return;
  container.innerHTML = '';

  badge.innerText = `${userErrors.length} erreur${userErrors.length > 1 ? 's' : ''}`;

  userErrors.forEach((err, idx) => {
    const item = document.createElement('div');
    item.className = 'error-item';

    let reponseTexte = '';
    if (err.type === 'qcm') {
      reponseTexte = `Réponse attendue : <strong>${err.options[err.correct]}</strong>`;
    } else if (err.type === 'vrai_faux') {
      const isVrai = (err.correct === true || err.correct === 0 || err.correct === 'Vrai' || err.correct === 'true');
      reponseTexte = `Réponse attendue : <strong>${isVrai ? 'VRAI' : 'FAUX'}</strong>`;
    } else if (err.type === 'multi_selection') {
      const attendus = err.correct.map(cIdx => err.options[cIdx]).join(' + ');
      reponseTexte = `Éléments obligatoires : <strong>${attendus}</strong>`;
    } else if (err.type === 'click_zone') {
      reponseTexte = `Emplacement : <strong>Zone spécifique à repérer sur l'image</strong>`;
    }

    item.innerHTML = `
      <img src="${err.image}" alt="Situation">
      <div class="error-item-content">
        <h4>Question : ${err.question}</h4>
        <p style="margin-bottom:2px;">${reponseTexte}</p>
        <p>💡 <em>${err.explication}</em></p>
      </div>
    `;
    container.appendChild(item);
  });

  const modal = document.getElementById('errors-modal');
  if (modal) modal.style.display = 'flex';
}

function closeErrorsModal() {
  const modal = document.getElementById('errors-modal');
  if (modal) modal.style.display = 'none';
}

// ÉCOUTEURS D'ÉVÉNEMENTS
document.addEventListener('DOMContentLoaded', () => {
  loadProgression();

  const btnMute = document.getElementById('btn-audio-mute');
  if (btnMute) {
    btnMute.addEventListener('click', toggleMute);
  }

  const btnFs = document.getElementById('btn-fullscreen');
  if (btnFs) {
    btnFs.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleFullScreen();
    });
  }

  startAmbianceAtelier();

  const unlockOnFirstTouch = (e) => {
    if (e && e.target && (e.target.id === 'btn-audio-mute' || e.target.closest('#btn-audio-mute') || e.target.id === 'btn-fullscreen' || e.target.closest('#btn-fullscreen'))) {
      return;
    }
    initAudioEngine();
    if (!isMuted && !isGameRunning) {
      startAmbianceAtelier();
    }
  };

  window.addEventListener('click', unlockOnFirstTouch, { once: true, capture: true });
  window.addEventListener('touchstart', unlockOnFirstTouch, { once: true, capture: true });

  const btnEnter = document.getElementById('btn-enter-action');
  if (btnEnter) {
    btnEnter.addEventListener('click', () => {
      initAudioEngine();
      toggleFullScreen();
      requestWakeLock();
      if (!isMuted && !isGameRunning) {
        startAmbianceAtelier();
      }
      openMenuScreen();
    });
  }
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    stopAmbianceAtelier();
    stopSound('tictac');
  } else {
    const s1 = document.getElementById('start-screen-1');
    const s2 = document.getElementById('start-screen-2');
    const isMenuOrIntro = (s1 && s1.style.display !== 'none') || (s2 && s2.style.display === 'flex');
    if (isMenuOrIntro && !isMuted && !isGameRunning) {
      startAmbianceAtelier();
    } else if (!answeredCurrentQuestion && currentQuestionsList.length > 0 && currentQuestionIndex < currentQuestionsList.length) {
      startQuestionTimer();
    }
  }
});