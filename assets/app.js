/* Confetti that fires exactly once per achievement.
 * The scarcity is the feature: particles without a reason are wallpaper.
 */
(() => {
  const c = document.getElementById('c');
  const ctx = c.getContext('2d');
  const W = c.width, H = c.height;
  const mP = document.getElementById('m-p');
  const mC = document.getElementById('m-c');
  const mS = document.getElementById('m-s');
  const status = document.getElementById('status');
  const claim = document.getElementById('claim');
  const reset = document.getElementById('reset');

  const KEY = 'poc.confetti-once.claimed';
  let parts = [], claims = 0, claimed = false;

  try { claimed = localStorage.getItem(KEY) === '1'; } catch (e) { claimed = false; }
  const paint = () => {
    mS.textContent = claimed ? 'yes' : 'no';
    status.textContent = claimed ? 'already claimed — that is the point' : 'unclaimed';
    claim.textContent = claimed ? 'Claimed' : 'Complete the thing';
    claim.classList.toggle('on', !claimed);
  };
  paint();

  function burst(n) {
    const cols = ['#ffe066', '#7fd1ff', '#ff7ad9', '#7ee787', '#ffb347'];
    for (let i = 0; i < n; i++) {
      parts.push({
        x: W / 2 + (Math.random() - 0.5) * 60,
        y: H * 0.42,
        vx: (Math.random() - 0.5) * 13,
        vy: -6 - Math.random() * 9,
        w: 5 + Math.random() * 7,
        h: 3 + Math.random() * 5,
        a: Math.random() * 6.28,
        va: (Math.random() - 0.5) * 0.4,
        col: cols[(Math.random() * cols.length) | 0],
        life: 1,
      });
    }
  }

  claim.addEventListener('click', () => {
    if (claimed) { status.textContent = 'you already did this one'; return; }
    claimed = true; claims++;
    burst(180);
    try { localStorage.setItem(KEY, '1'); } catch (e) {}
    paint();
  });

  reset.addEventListener('click', () => {
    claimed = false; parts = []; claims = 0;
    try { localStorage.removeItem(KEY); } catch (e) {}
    paint();
  });

  function frame() {
    ctx.fillStyle = '#08090b';
    ctx.fillRect(0, 0, W, H);

    // a quiet backdrop that makes the confetti the only saturated thing
    ctx.strokeStyle = 'rgba(255,255,255,.04)';
    for (let x = 0; x < W; x += 46) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }

    for (const p of parts) {
      p.vy += 0.36; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.a += p.va;
      p.life -= 0.004;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.a);
      ctx.globalAlpha = Math.max(0, Math.min(1, p.life));
      ctx.fillStyle = p.col;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }
    parts = parts.filter((p) => p.y < H + 40 && p.life > 0);

    ctx.globalAlpha = 1;
    if (claimed && parts.length === 0) {
      ctx.fillStyle = 'rgba(255,224,102,.85)';
      ctx.font = '600 15px ui-monospace, monospace';
      ctx.textAlign = 'center';
      ctx.fillText('DONE — AND NOT COMING BACK', W / 2, H * 0.52);
      ctx.textAlign = 'left';
    }

    mP.textContent = parts.length;
    mC.textContent = claims;
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  document.documentElement.dataset.ready = '1';
})();
