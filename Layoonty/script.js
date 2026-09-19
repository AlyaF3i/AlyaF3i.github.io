(() => {
  'use strict';

  // The explicit offset keeps midnight in the UAE, whatever the visitor's timezone.
  const TARGET = Date.parse('2026-11-28T00:00:00+04:00');
  const JOURNEY_START = Date.parse('2026-07-16T00:00:00+04:00');
  const UAE_OFFSET = 4 * 60 * 60 * 1000;
  const DAY = 86400000;
  const $ = (id) => document.getElementById(id);
  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const pad = (value) => String(value).padStart(2, '0');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let motionPaused = reducedMotion.matches;
  let arrived = false;
  let previousSecond = -1;
  let toastTimeout;

  const storage = {
    get(key, fallback) { try { return localStorage.getItem(`layoonty-${key}`) ?? fallback; } catch { return fallback; } },
    set(key, value) { try { localStorage.setItem(`layoonty-${key}`, value); } catch { /* The page also works with storage disabled. */ } }
  };

  function toast(message) {
    $('toast').textContent = message;
    $('toast').classList.add('visible');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => $('toast').classList.remove('visible'), 3200);
  }

  const petals = [];
  for (let i = 0; i < 60; i++) {
    const petal = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
    petal.setAttribute('cx', '110');
    petal.setAttribute('cy', '48');
    petal.setAttribute('rx', '2.4');
    petal.setAttribute('ry', i % 5 === 0 ? '26' : '21');
    petal.setAttribute('transform', `rotate(${i * 6} 110 110)`);
    petal.setAttribute('class', 'petal');
    $('bloom-petals').append(petal);
    petals.push(petal);
  }

  function updateNumber(id, value) {
    const node = $(id);
    const next = pad(value);
    if (node.textContent === next) return;
    node.textContent = next;
    node.classList.remove('changed');
    if (!motionPaused) {
      // Restart only when this particular digit changes, not on every animation frame.
      void node.offsetWidth;
      node.classList.add('changed');
    }
  }

  function celebrateArrival() {
    arrived = true;
    document.body.classList.add('arrived');
    $('hero-title').innerHTML = 'وصل يومنا…<br>وبدأت <em>الفرحة!</em>';
    $('countdown-heading').textContent = '28 نوفمبر 2026… لحظتنا صارت هنا!';
    $('countdown-caption').textContent = 'كل ثانية قرّبتنا لهاللحظة. يا هلا بليلتنا الحلوة!';
    $('arrival-announcement').textContent = 'اكتمل العد التنازلي. وصلت لحظتنا الحلوة!';
    $('wish-title').innerHTML = 'أمنية صغيرة…<br>وبداية <em>حلوة.</em>';
    burst(window.innerWidth / 2, window.innerHeight * .4, 90);
    if (soundOn) playChime();
  }

  function updateTime(now = Date.now()) {
    const remaining = Math.max(0, Math.ceil((TARGET - now) / 1000));
    const days = Math.floor(remaining / 86400);
    const hours = Math.floor(remaining % 86400 / 3600);
    const minutes = Math.floor(remaining % 3600 / 60);
    const seconds = remaining % 60;
    updateNumber('days', days);
    updateNumber('hours', hours);
    updateNumber('minutes', minutes);
    updateNumber('seconds', seconds);
    $('days-track').style.width = `${clamp((TARGET - now) / (TARGET - JOURNEY_START)) * 100}%`;
    $('hours-track').style.width = `${hours / 24 * 100}%`;
    $('minutes-track').style.width = `${minutes / 60 * 100}%`;
    $('seconds-track').style.width = `${seconds / 60 * 100}%`;

    const uae = new Date(now + UAE_OFFSET);
    const h = uae.getUTCHours();
    const m = uae.getUTCMinutes();
    const s = uae.getUTCSeconds();
    $('uae-clock').textContent = `${pad(h)}:${pad(m)}:${pad(s)}`;
    $('uae-clock').dateTime = new Date(now).toISOString();

    const hourFraction = (m * 60 + s) / 3600;
    const dayFraction = (h * 3600 + m * 60 + s) / 86400;
    $('bloom-value').innerHTML = `${pad(s)}<span>/ 60</span>`;
    petals.forEach((petal, i) => {
      petal.classList.toggle('lit', i < s);
      petal.classList.toggle('current', i === s);
    });
    $('bloom-caption').textContent = `${String(s)} ثانية من هذه الدقيقة`;
    $('top-sand').setAttribute('y', 32 + hourFraction * 76);
    const sandTop = 191 - hourFraction * 64;
    $('bottom-sand').setAttribute('d', `M40 195 L40 ${sandTop + 13} Q65 ${sandTop + 13} 90 ${sandTop} Q115 ${sandTop + 13} 140 ${sandTop + 13} L140 195Z`);
    $('hour-progress').style.width = `${hourFraction * 100}%`;
    $('hour-caption').textContent = `${String(Math.floor(hourFraction * 100))}% من هذه الساعة`;
    const angle = Math.PI * (1 - dayFraction);
    $('day-sun').setAttribute('transform', `translate(${150 + 124 * Math.cos(angle)} ${148 - 112 * Math.sin(angle)})`);
    $('day-caption').textContent = `${h < 5 ? 'ليل هادئ' : h < 12 ? 'صباح مليان أمل' : h < 17 ? 'نهار من ذهب' : h < 21 ? 'مساء جميل' : 'ليل هادئ'} في الإمارات`;

    const journey = clamp((now - JOURNEY_START) / (TARGET - JOURNEY_START)) * 100;
    $('journey-percent').innerHTML = `${String(journey.toFixed(1))}<small>%</small>`;
    $('journey-fill').style.width = `${journey}%`;
    document.querySelector('.journey-track').setAttribute('aria-valuenow', journey.toFixed(1));
    if (now >= TARGET && !arrived) celebrateArrival();
    if (arrived) $('journey-note').textContent = 'كل اللحظات جابتنا لهنا';
  }

  function updateOrbits(now) {
    if (motionPaused) return;
    const uae = now + UAE_OFFSET;
    $('second-orbit').style.transform = `rotate(${(uae % 60000) / 60000 * 360}deg)`;
    $('minute-orbit').style.transform = `rotate(${(uae % 3600000) / 3600000 * 360}deg)`;
    $('hour-orbit').style.transform = `rotate(${(uae % DAY) / DAY * 360}deg)`;
  }

  function setTheme(golden) {
    document.body.dataset.theme = golden ? 'golden' : 'night';
    $('theme-toggle').setAttribute('aria-pressed', String(golden));
    $('theme-toggle').setAttribute('aria-label', golden ? 'غيّر الأجواء إلى ضوء القمر' : 'غيّر الأجواء إلى ألوان الفرح');
    document.querySelector('meta[name="theme-color"]').content = golden ? '#fff6e8' : '#111d24';
    storage.set('theme', golden ? 'golden' : 'night');
  }
  setTheme(storage.get('theme', 'golden') === 'golden');
  $('theme-toggle').addEventListener('click', () => {
    const golden = document.body.dataset.theme !== 'golden';
    setTheme(golden);
    toast(golden ? 'شويّة شمس، وشويّة فرح!' : 'نورت نجومنا… يا حلو هالليل.');
  });

  function setMotion(paused) {
    motionPaused = paused;
    document.body.classList.toggle('motion-paused', paused);
    document.body.classList.toggle('motion-enabled', !paused);
    $('motion-toggle').setAttribute('aria-pressed', String(paused));
    $('motion-toggle').innerHTML = paused ? 'تشغيل الحركة <span aria-hidden="true">&#9655;</span>' : 'إيقاف الحركة <span aria-hidden="true">&#8545;</span>';
    if (paused) particles.length = 0;
    drawStars(performance.now());
  }
  $('motion-toggle').addEventListener('click', () => setMotion(!motionPaused));
  reducedMotion.addEventListener('change', (event) => setMotion(event.matches));

  // Only short, optional interaction sounds. There is no background audio loop.
  let audioContext;
  let audioGain;
  let soundOn = false;
  let audioBusy = false;
  let lastChime = -Infinity;
  const activeChimes = new Set();

  function stopChimes() {
    activeChimes.forEach((oscillator) => oscillator.stop());
    activeChimes.clear();
  }

  function playChime() {
    if (!audioContext || !soundOn || document.hidden) return;
    if (audioContext.currentTime - lastChime < .8) return;
    lastChime = audioContext.currentTime;
    [523.25, 659.25, 783.99].forEach((frequency, i) => {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      const start = audioContext.currentTime + i * .08;
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(.025, start + .025);
      gain.gain.exponentialRampToValueAtTime(.001, start + .4);
      oscillator.connect(gain).connect(audioGain);
      activeChimes.add(oscillator);
      oscillator.start(start);
      oscillator.stop(start + .45);
      oscillator.onended = () => {
        activeChimes.delete(oscillator);
        oscillator.disconnect();
        gain.disconnect();
      };
    });
  }

  $('sound-toggle').addEventListener('click', async () => {
    if (audioBusy) return;
    audioBusy = true;
    try {
      if (!audioContext) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) throw new Error('Audio unavailable');
        audioContext = new AudioContext();
        audioGain = audioContext.createGain();
        audioGain.gain.value = .5;
        audioGain.connect(audioContext.destination);
      }
      await audioContext.resume();
      soundOn = !soundOn;
      if (soundOn) playChime();
      else stopChimes();
      $('sound-toggle').setAttribute('aria-pressed', String(soundOn));
      $('sound-toggle').setAttribute('aria-label', soundOn ? 'كتم نغمات التفاعل' : 'تشغيل نغمات التفاعل');
      toast(soundOn ? 'نغمة خفيفة عند التفاعل فقط، بدون صوت مستمر.' : 'تم كتم كل الأصوات.');
    } catch {
      toast('الصوت غير متاح في هذا المتصفح، لكن النجوم كلّها لك.');
    } finally { audioBusy = false; }
  });

  const canvas = $('stardust');
  const context = canvas.getContext('2d');
  let stars = [];
  const particles = [];
  let viewWidth = window.innerWidth;
  let viewHeight = window.innerHeight;

  function resizeCanvas() {
    viewWidth = window.innerWidth;
    viewHeight = window.innerHeight;
    const scale = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = viewWidth * scale;
    canvas.height = viewHeight * scale;
    if (!context) return;
    context.setTransform(scale, 0, 0, scale, 0, 0);
    stars = Array.from({ length: Math.min(85, Math.floor(viewWidth / 12)) }, () => ({ x: Math.random() * viewWidth, y: Math.random() * viewHeight, radius: .4 + Math.random() * .9, phase: Math.random() * Math.PI * 2 }));
    drawStars(performance.now());
  }

  function burst(x, y, count = 28) {
    if (motionPaused) return;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = .6 + Math.random() * 2.2;
      particles.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 1, size: 2 + Math.random() * 4, color: ['#df806b', '#e6b64c', '#69b3a0', '#e2a0b3'][i % 4] });
    }
    if (particles.length > 180) particles.splice(0, particles.length - 180);
  }

  function drawStars(timestamp, delta = 1) {
    if (!context) return;
    context.clearRect(0, 0, viewWidth, viewHeight);
    const golden = document.body.dataset.theme === 'golden';
    context.fillStyle = golden ? '#cf6d52' : '#eacbb0';
    stars.forEach((star) => {
      context.globalAlpha = motionPaused ? .2 : .15 + (Math.sin(timestamp / 2300 + star.phase) + 1) * .16;
      context.beginPath();
      context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      context.fill();
    });
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx * delta;
      p.y += p.vy * delta;
      p.vy += .012 * delta;
      p.life -= .012 * delta;
      if (p.life <= 0) { particles.splice(i, 1); continue; }
      context.globalAlpha = p.life;
      context.fillStyle = p.color;
      context.save();
      context.translate(p.x, p.y);
      context.rotate(p.life * 6);
      context.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * .6);
      context.restore();
    }
    context.globalAlpha = 1;
  }
  window.addEventListener('resize', resizeCanvas);
  document.addEventListener('pointerdown', (event) => {
    if (event.target.closest('button, a')) return;
    burst(event.clientX, event.clientY, 14);
  }, { passive: true });

  $('celebrate-button').addEventListener('click', () => {
    const bounds = $('celebrate-button').getBoundingClientRect();
    burst(bounds.x + bounds.width / 2, bounds.y, 90);
    toast(['قربت الفرحة… وقربت أحلى ليلة!', 'هذي رشّة فرح، والباقي جاي!', 'كل هالنجوم تبتسم لك اليوم.'][Math.floor(Math.random() * 3)]);
    playChime();
  });

  const storedWishes = Number(storage.get('wishes', '0'));
  let wishes = Number.isFinite(storedWishes) ? clamp(Math.floor(storedWishes), 0, 999999) : 0;
  let holdStart = null;
  let holdTimer;
  const HOLD_DURATION = 1300;
  const wishButton = $('wish-button');
  const wishMessages = [
    ['فرح', 'يا رب تكون الفرحة الجاية أكبر من كل الانتظار.'],
    ['قرب', 'كل ثانية تمر، تقرّبنا من لحظة نحبها.'],
    ['ضحكة', 'يا رب تضحك الدنيا لك مثل ما تضحك بوجودك.'],
    ['نور', 'في ناس تنوّر المكان، وأنت من هالناس.'],
    ['أمل', 'يمكن أحلى أيامنا للحين ما بدأت.'],
    ['طمأنينة', 'يا رب يهدأ بالك، وتجيك الأيام على هواك.'],
    ['حكاية', 'من 16 يوليو، وحكايتنا تجمع لحظات حلوة.'],
    ['شوق', 'بعض المواعيد نعدّ لها الثواني من كثر ما نحبها.'],
    ['بهجة', 'وجودك سبب كافي إن اليوم يصير أحلى.'],
    ['أمنية', 'يا رب كل أمنية ساكنة قلبك تلقى طريقها للنور.'],
    ['ورد', 'لك من كل يوم وردة، ومن كل لحظة ابتسامة.'],
    ['دفا', 'بعض الناس يشبهون دفء الشمس بعد يوم بارد.'],
    ['بداية', 'كل صباح فرصة لشي جميل ما توقعناه.'],
    ['حظ', 'يا حظ الأيام اللي فيها صوتك وضحكتك.'],
    ['سكينة', 'تستاهل راحة بال ما يعكّرها شيء.'],
    ['نجمة', 'هذي نجمة لك، والباقي لعيونك.'],
    ['لقاء', 'يا زين اللحظة اللي يصير فيها الانتظار ذكرى.'],
    ['حلم', 'خل أحلامك كبيرة، السماء تسعها كلها.'],
    ['حنان', 'يا رب تلقى في كل خطوة قلبًا يحنّ عليك.'],
    ['غلا', 'في ناس غلاهم ما ينقاس، بس ينحس.'],
    ['مفاجأة', 'يمكن بكرة مخبّي لك شي يفرح قلبك.'],
    ['جمال', 'الأشياء البسيطة تصير أجمل لما نشاركها معك.'],
    ['راحة', 'خذ نفس، أنت تستاهل لحظة هادية وحلوة.'],
    ['امتنان', 'الحمد لله على كل صدفة جابت لنا شخصًا عزيزًا.'],
    ['وعد', 'خلّنا نوعد أيامنا إننا نلقى فيها سبب نبتسم.'],
    ['قمر', 'حتى القمر اليوم كأنه مبتسم لك.'],
    ['سعادة', 'يا رب سعادة تجيك من حيث ما تحتسب.'],
    ['ذكرى', 'اللحظة العادية اليوم، يمكن تصير أغلى ذكرى بكرة.'],
    ['نسمة', 'يا رب أيامك تمر خفيفة مثل نسمة بحر.'],
    ['ضحكات', 'نبي أيام مليانة ضحك، لين ننسى نحسب الوقت.'],
    ['حياة', 'وجود الأشخاص اللي نحبهم يعطي الحياة لونًا ثاني.'],
    ['لهفة', 'كل يوم يروح يقول لنا: موعدكم صار أقرب.'],
    ['بشارة', 'يا رب خبر حلو يغيّر مزاج يومك كله.'],
    ['رِفق', 'هوّن على قلبك، الأشياء الحلوة جاية في وقتها.'],
    ['صدفة', 'بعض الصدف أحلى من ألف موعد مرتب.'],
    ['سماء', 'لو للأمنيات أجنحة، كانت سماءك مليانة فرح.'],
    ['عيد', 'مو لازم مناسبة، بعض الوجوه لحالها عيد.'],
    ['تفاصيل', 'أحب اللحظات اللي حلاوتها في أبسط تفاصيلها.'],
    ['درب', 'يا رب كل درب تمشيه يودّيك لشي تحبه.'],
    ['نوفمبر', 'لنوفمبر هالسنة طعم ثاني، وموعد يستاهل.'],
    ['ابتسامة', 'هذي رسالتك اليوم: لا تنسى تبتسم، تليق بك.'],
    ['مودة', 'يا رب تبقى بيننا سوالف حلوة ما تخلص.'],
    ['لحظة', 'قف شوي واستمتع، هاللحظة ما تتكرر.'],
    ['حب', 'كل شي نسويه بمحبة، يوصل للقلب بطريقة مختلفة.'],
    ['إشراقة', 'يا رب يكون بكرة أفتح وألطف من كل توقعاتك.'],
    ['بركة', 'يا رب وقت مليان بركة، وقلب مليان رضا.'],
    ['احتفال', 'نحتفل بالأيام الجاية، وبكل يوم قرّبنا لها.'],
    ['لعيونك', 'كل هالنجوم، وكل هالفرح، وكل هالانتظار… لعيونك.']
  ];

  function showWishMessage() {
    if (!wishes) return;
    // Complete the whole collection before repeating; the saved count keeps our place.
    const [word, message] = wishMessages[(wishes - 1) % wishMessages.length];
    $('wish-word').textContent = word;
    $('wish-message').textContent = message;
    $('wish-message-card').hidden = false;
    $('wish-message-card').classList.remove('revealed');
    if (!motionPaused) {
      void $('wish-message-card').offsetWidth;
      $('wish-message-card').classList.add('revealed');
    }
  }

  function addWishStar(index) {
    const star = document.createElement('span');
    star.className = 'wish-star';
    star.textContent = index % 3 === 0 ? '+' : '\u2726';
    // Keep stars in the margins so they never obscure the message or controls.
    const left = index % 2 === 0 ? 4 + (index * 7.3 % 17) : 79 + (index * 5.7 % 17);
    star.style.left = `${left}%`;
    star.style.top = `${8 + (index * 19.3 % 79)}%`;
    star.style.fontSize = `${9 + (index * 3 % 15)}px`;
    $('wish-constellation').append(star);
    if ($('wish-constellation').children.length > 32) $('wish-constellation').firstElementChild.remove();
  }

  function updateWishStatus() {
    $('wish-status').textContent = wishes ? `${String(wishes)} ${wishes > 1 && wishes <= 10 ? 'أمنيات' : 'أمنية'} تزيّن سماءك.` : 'السماء فيها مكان لكل أمنياتك.';
  }
  for (let i = 0; i < Math.min(wishes, 32); i++) addWishStar(i);
  updateWishStatus();
  showWishMessage();

  function cancelHold() {
    clearTimeout(holdTimer);
    holdStart = null;
    wishButton.classList.remove('holding');
    wishButton.querySelector('circle').style.strokeDashoffset = 289;
    $('wish-instruction').textContent = 'اضغط مطوّلاً وتمنّ';
  }

  function makeWish() {
    cancelHold();
    wishes = Math.min(wishes + 1, 999999);
    storage.set('wishes', String(wishes));
    addWishStar(wishes - 1);
    updateWishStatus();
    showWishMessage();
    const bounds = wishButton.getBoundingClientRect();
    burst(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2, 48);
    $('wish-instruction').textContent = 'يا رب تصير حقيقة!';
    playChime();
  }

  wishButton.addEventListener('pointerdown', (event) => {
    if (event.button !== 0 || holdStart !== null) return;
    wishButton.setPointerCapture(event.pointerId);
    holdStart = performance.now();
    wishButton.classList.add('holding');
    $('wish-instruction').textContent = 'كمّل الضغط… وفكّر بشي حلو.';
    holdTimer = setTimeout(makeWish, HOLD_DURATION);
  });
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((name) => wishButton.addEventListener(name, () => { if (holdStart !== null) cancelHold(); }));
  wishButton.addEventListener('contextmenu', (event) => event.preventDefault());
  wishButton.addEventListener('click', (event) => { if (event.detail === 0) makeWish(); });
  window.addEventListener('blur', cancelHold);

  $('note-trigger').addEventListener('click', () => {
    const expanded = $('note-trigger').getAttribute('aria-expanded') !== 'true';
    $('note-trigger').setAttribute('aria-expanded', String(expanded));
    $('little-note').hidden = !expanded;
  });

  let animationFrame;
  let lastFrame = 0;
  function animate(timestamp) {
    const now = Date.now();
    const second = Math.floor(now / 1000);
    if (previousSecond !== second) { updateTime(now); previousSecond = second; }
    // Cap decorative drawing at 30fps, and stop it altogether in hidden tabs.
    if (timestamp - lastFrame >= 1000 / 30) {
      const delta = Math.min((timestamp - lastFrame) / (1000 / 60), 3);
      if (!motionPaused) { updateOrbits(now); drawStars(timestamp, delta); }
      if (holdStart !== null) wishButton.querySelector('circle').style.strokeDashoffset = 289 * (1 - clamp((timestamp - holdStart) / HOLD_DURATION));
      lastFrame = timestamp;
    }
    animationFrame = requestAnimationFrame(animate);
  }

  document.addEventListener('visibilitychange', () => {
    cancelAnimationFrame(animationFrame);
    cancelHold();
    if (document.hidden) {
      stopChimes();
      if (audioContext?.state === 'running') audioContext.suspend().catch(() => {});
    } else {
      updateTime();
      lastFrame = performance.now();
      animationFrame = requestAnimationFrame(animate);
      if (soundOn) audioContext?.resume().catch(() => {});
    }
  });

  resizeCanvas();
  updateOrbits(Date.now());
  setMotion(motionPaused);
  updateTime();
  animationFrame = requestAnimationFrame(animate);
})();
