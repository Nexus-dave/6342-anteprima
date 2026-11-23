// Apertura: video della spiga a schermo intero + pulsante "salta" visibile da subito.
// Parte ogni volta che si apre la home. Se il video non parte, si usa l'animazione SVG.
(function(){
  var h=document.documentElement, ov=document.getElementById('apertura');
  if(!ov) return;
  var vid=document.getElementById('apertura-video'), btn=document.getElementById('salta');
  var ended=false, mode='video'; // 'video' | 'svg'

  function drop(){ if(ov&&ov.parentNode) ov.parentNode.removeChild(ov); ov=null; }

  if(h.getAttribute('data-intro')!=='play'){ drop(); return; }

  function off(){
    removeEventListener('wheel',onUser);
    removeEventListener('touchmove',onUser);
    removeEventListener('keydown',onUser);
  }
  function finish(){
    if(ended) return; ended=true; off();
    if(vid){ try{ vid.pause(); }catch(e){} }
    if(window.spigaFinish) try{ spigaFinish(); }catch(e){}
    h.setAttribute('data-intro','resolve');
    setTimeout(function(){ h.setAttribute('data-intro','done'); drop(); },1000);
  }
  function onUser(e){
    if(e.type==='keydown' && ['Escape','ArrowDown','PageDown',' ','Enter'].indexOf(e.key)<0) return;
    finish();
  }
  btn&&btn.addEventListener('click',finish);
  addEventListener('wheel',onUser,{passive:true});
  addEventListener('touchmove',onUser,{passive:true});
  addEventListener('keydown',onUser);
  window.__apertura6342={finish:finish,get ended(){return ended},get mode(){return mode}};

  function startSvg(){
    if(ended || mode==='svg') return;
    mode='svg';
    ov.classList.add('is-fallback');
    if(vid){ try{ vid.pause(); }catch(e){} }
    if(typeof window.spigaPlay==='function'){
      spigaPlay(function(){ setTimeout(finish,700); });
    } else {
      setTimeout(finish,7000);
    }
  }

  if(!vid){ startSvg(); return; }

  var started=false;
  function onPlaying(){ started=true; }
  function onEnded(){ if(!ended && mode==='video') setTimeout(finish,400); }
  function onError(){ startSvg(); }

  vid.addEventListener('playing',onPlaying);
  vid.addEventListener('ended',onEnded);
  vid.addEventListener('error',onError);
  vid.muted=true; vid.defaultMuted=true; vid.setAttribute('muted','');
  vid.playsInline=true;
  try{ vid.setAttribute('playsinline',''); }catch(e){}

  var p;
  try{ p=vid.play(); }catch(e){ startSvg(); return; }
  if(p && p.catch) p.catch(function(){ startSvg(); });

  setTimeout(function(){
    if(!ended && !started && mode==='video' && (vid.readyState<2 || vid.paused)) startSvg();
  },2000);
})();
