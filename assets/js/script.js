document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.getElementById('navToggle');
  const navlinks = document.getElementById('navlinks');
  if (navToggle && navlinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navlinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    navlinks.querySelectorAll('.links a').forEach(a => {
      a.addEventListener('click', () => {
        navlinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // ---- hero carousel ----
  const slidesWrap = document.querySelector('.hero-slides');
  if (slidesWrap) {
    const slides = Array.from(slidesWrap.querySelectorAll('.hero-slide'));
    const dots = Array.from(document.querySelectorAll('.hero-dot'));
    const hero = document.querySelector('.hero');
    let idx = 0, timer = null;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function go(n) {
      idx = (n + slides.length) % slides.length;
      slides.forEach((s, i) => s.classList.toggle('is-active', i === idx));
      dots.forEach((d, i) => d.classList.toggle('is-active', i === idx));
    }
    function start() { if (reduce || timer) return; timer = setInterval(() => go(idx + 1), 7000); }
    function stop() { clearInterval(timer); timer = null; }
    dots.forEach((d, i) => d.addEventListener('click', () => { go(i); stop(); start(); }));
    document.getElementById('heroPrev').addEventListener('click', () => { go(idx - 1); stop(); start(); });
    document.getElementById('heroNext').addEventListener('click', () => { go(idx + 1); stop(); start(); });
    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    hero.addEventListener('focusin', stop);
    hero.addEventListener('focusout', start);
    let x0 = null;
    hero.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
    hero.addEventListener('touchend', e => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 50) { go(idx + (dx < 0 ? 1 : -1)); stop(); start(); }
      x0 = null;
    });
    document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());
    start();
  }
});


// Footer year updates automatically
(function(){
  var y=document.getElementById('year');
  if(y) y.textContent=new Date().getFullYear();
})();

// Summer of Code per-card carousels
(function(){
  [].forEach.call(document.querySelectorAll('.soc-card'),function(c){
    var t=c.querySelector('.soc-track'), slides=[].slice.call(t.children);
    var prev=c.querySelector('.soc-prev'), next=c.querySelector('.soc-next'), dots=c.querySelector('.soc-dots'), cap=c.querySelector('.pc-cap');
    if(slides.length<2){ prev.hidden=next.hidden=dots.hidden=true; return; }
    slides.forEach(function(){ var d=document.createElement('span'); d.className='soc-dot'; dots.appendChild(d); });
    var ds=[].slice.call(dots.children), cur=-1;
    function update(){
      var i=Math.round(t.scrollLeft/t.clientWidth); i=Math.max(0,Math.min(slides.length-1,i));
      ds.forEach(function(d,k){ d.classList.toggle('is-active',k===i); });
      prev.disabled=i===0; next.disabled=i===slides.length-1;
      if(cap && i!==cur){ cur=i; cap.style.opacity=0; setTimeout(function(){ cap.textContent=slides[i].getAttribute('data-cap')||''; cap.style.opacity=1; },120); }
    }
    prev.addEventListener('click',function(){ t.scrollBy({left:-t.clientWidth,behavior:'smooth'}); });
    next.addEventListener('click',function(){ t.scrollBy({left:t.clientWidth,behavior:'smooth'}); });
    t.addEventListener('scroll',function(){ window.requestAnimationFrame(update); });
    t.addEventListener('keydown',function(e){ if(e.key==='ArrowRight'){ next.click(); e.preventDefault(); } if(e.key==='ArrowLeft'){ prev.click(); e.preventDefault(); } });
    window.addEventListener('resize',update); update();
  });
})();
