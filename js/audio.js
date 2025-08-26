(() => {
  const audio = document.getElementById('bgm');
  const btn   = document.getElementById('bgm-toggle');
  const TARGET_VOL = 0.25;      // volumen final (0.0 - 1.0)
  const FADE_MS    = 1200;      // duración del fade-in en ms

  // Guarda preferencia del usuario
  const wantMusic = localStorage.getItem('bgm') !== 'off';

  // Intenta reproducir al cargar si el usuario no la desactivó antes
  if (wantMusic) tryPlay();

  // Reproducir con cualquier gesto (click, toque, tecla)
  ['pointerdown','keydown','touchstart'].forEach(evt => {
    window.addEventListener(evt, oncePlay, { once:true, passive:true });
  });

  // Botón fallback
  btn.addEventListener('click', () => {
    tryPlay(true);
  });

  // Si el usuario pausa/desactiva
  audio.addEventListener('pause', () => {
    btn.style.display = 'inline-flex';
    btn.textContent = '🎵 Activar música';
    localStorage.setItem('bgm', 'off');
  });

  function oncePlay() {
    tryPlay();
  }

  function tryPlay(userInitiated = false) {
    // Comienza en silencio para evitar “salto”
    audio.volume = 0;
    const p = audio.play();

    if (p && typeof p.then === 'function') {
      p.then(() => {
        // OK, permitido por el navegador: hacemos fade-in y ocultamos botón
        fadeIn(audio, TARGET_VOL, FADE_MS);
        btn.style.display = 'none';
        localStorage.setItem('bgm', 'on');
      }).catch(() => {
        // Bloqueado: mostramos botón
        if (userInitiated) return; // si vino del botón, no hace falta cambiar nada
        btn.style.display = 'inline-flex';
        btn.textContent = '🎵 Activar música';
      });
    } else {
      // Navegadores antiguos
      fadeIn(audio, TARGET_VOL, FADE_MS);
      btn.style.display = 'none';
      localStorage.setItem('bgm', 'on');
    }
  }

  function fadeIn(aud, target = 0.25, ms = 1000) {
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / ms);
      aud.volume = target * t;
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
})();