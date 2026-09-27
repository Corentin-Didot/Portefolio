(function(){
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initPageTransitions(){
    var overlay = document.querySelector('.page-transition');
    if(!overlay || reduced) return;

    document.body.classList.add('is-page-entering');
    requestAnimationFrame(function(){
      requestAnimationFrame(function(){ document.body.classList.remove('is-page-entering'); });
    });

    document.addEventListener('click', function(e){
      var link = e.target.closest('a[href]');
      if(!link) return;
      var href = link.getAttribute('href');
      if(!href || href.charAt(0) === '#') return;
      if(href.indexOf('mailto:') === 0 || href.indexOf('tel:') === 0) return;
      if(link.target === '_blank') return;
      if(link.hasAttribute('download')) return;
      var url;
      try{ url = new URL(href, window.location.href); } catch(err){ return; }
      if(url.origin !== window.location.origin) return;
      e.preventDefault();
      overlay.classList.add('is-active');
      setTimeout(function(){ window.location.href = href; }, 350);
    });

    window.addEventListener('pageshow', function(e){
      if(e.persisted){ overlay.classList.remove('is-active'); }
    });
  }

  function initParallax(){
    if(reduced) return;
    var photo = document.querySelector('.photo-frame');
    var bg = document.querySelector('.bg-image');
    var grid = document.querySelector('.grid-bg');
    if(!photo && !bg && !grid) return;
    var ticking = false;
    function apply(){
      var y = window.scrollY;
      if(photo) photo.style.transform = 'translate3d(0,' + (y * 0.08) + 'px,0)';
      if(bg) bg.style.transform = 'translate3d(0,' + (y * 0.03) + 'px,0)';
      if(grid) grid.style.transform = 'translate3d(0,' + (y * 0.05) + 'px,0)';
      ticking = false;
    }
    window.addEventListener('scroll', function(){
      if(!ticking){ requestAnimationFrame(apply); ticking = true; }
    }, { passive: true });
  }

  function initReveal(){
    var els = document.querySelectorAll('[data-reveal]');
    if(!els.length) return;
    if(reduced || !('IntersectionObserver' in window)){
      els.forEach(function(el){ el.classList.add('is-revealed'); });
      return;
    }
    els.forEach(function(el){
      var delay = el.getAttribute('data-reveal-delay');
      if(delay) el.style.transitionDelay = delay + 'ms';
    });
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('is-revealed');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach(function(el){ io.observe(el); });
  }

  initPageTransitions();
  initParallax();
  initReveal();
})();
