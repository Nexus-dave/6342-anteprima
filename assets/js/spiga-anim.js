(function(){
  var S=document.querySelector('.spiga6'); if(!S) return;
  var Q=function(s,r){return (r||S).querySelector(s)}, QA=function(s,r){return [].slice.call((r||S).querySelectorAll(s))};
  var grow=Q('.sp-grow'), GL=grow.getTotalLength();
  var fade=Q('.sp-fade'), plant=Q('.sp-plant'), band=Q('.sp-band'), shim=Q('.sp-shimmer');
  var PX=125, PY=440, END=7.0;
  var cl=function(x){return x<0?0:x>1?1:x}, eo=function(x){return 1-Math.pow(1-x,3)},
      eio=function(x){return x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2},
      es=function(x){return x*x*(3-2*x)},
      back=function(x){var c=1.9;return 1+(c+1)*Math.pow(x-1,3)+c*Math.pow(x-1,2)};
  // ---- phase 1: the ear grows out of the 6 ----
  var G0=.1, GD=1.55;
  var gp=function(t){var x=cl((t-G0)/GD);return .55*eio(x)+.45*eo(x)};
  function tAt(f){var a=G0,b=G0+GD;for(var i=0;i<30;i++){var m=(a+b)/2;if(gp(m)<f)a=m;else b=m}return a}
  var samp=[];for(var i=0;i<=400;i++){var l=GL*i/400,p=grow.getPointAtLength(l);samp.push([l,p.x,p.y])}
  var ks=QA('.sp-k').map(function(g,i){
    var bx=+g.dataset.bx,by=+g.dataset.by,best=1e9,L=0;
    samp.forEach(function(s){var d=(s[1]-bx)*(s[1]-bx)+(s[2]-by)*(s[2]-by);if(d<best){best=d;L=s[0]}});
    var awn=Q('.sp-awn',g),al=awn.getTotalLength();awn.style.strokeDasharray=al;
    return {g:g,gr:Q('.sp-grain',g),awn:awn,al:al,bx:bx,by:by,side:g.dataset.side,t0:tAt(Math.min(1,(L+14)/GL))+.06,i:i,rel:null};
  });
  for(var j=1;j<ks.length;j++) ks[j].t0=Math.max(ks[j].t0,ks[j-1].t0+.12);
  var awn0=ks[ks.length-1].t0+.3;
  grow.style.strokeDasharray=GL+' '+GL;
  // ---- phase 2: three kernels fall, 3-4-2 sprout ----
  var REL=[2.55,3.4,4.25], FALL=.72, BOUNCE=.34, SPR=1.1, REGROW=6.05;
  var seeds=QA('.sp-seed'), digs=QA('.sp-dig').map(function(g,i){
    var land=g.dataset.land.split(',').map(Number), src=+g.dataset.src, sd=seeds[i];
    var a0=+sd.dataset.a0, cx=+sd.dataset.cx, cy=+sd.dataset.cy, w=+sd.dataset.w;
    var tr=REL[i], tl=tr+FALL, ts=tl+BOUNCE;
    ks[src].rel=tr;
    var win=JSON.parse(g.dataset.sh);
    var shoots=QA('.sp-shoot',g).map(function(p,k){var L=p.getTotalLength();p.style.strokeDasharray=L+' '+L;return {p:p,L:L,a:win[k][0],b:win[k][1]}});
    var mks=QA('.sp-mk',document.getElementById('sp-m'+g.dataset.n)).map(function(p,k){var L=p.getTotalLength();p.style.strokeDasharray=L+' '+L;return {p:p,L:L,a:win[k][0],b:win[k][1]}});
    return {g:g,sd:sd,land:land,a0:a0,cx:cx,cy:cy,w:w,tr:tr,tl:tl,ts:ts,shoots:shoots,mks:mks};
  });
  function seedAt(d,t){
    var sc=.62, lx=d.land[0], ly=d.land[1]-d.w*sc*.42, x,y,r,s,op=1;
    if(t<d.tr) return null;
    if(t<d.tl){ var u=(t-d.tr)/FALL, T=FALL, tau=t-d.tr, vy=-170;
      var g=2*((ly-d.cy)-vy*T)/(T*T);
      x=d.cx+(lx-d.cx)*(.15*u+.85*(1-Math.pow(1-u,1.6)));
      y=d.cy+vy*tau+.5*g*tau*tau;
      r=-d.a0*es(u)-22*Math.sin(Math.PI*u); s=1-(1-sc)*eo(u);
    } else { var v=(t-d.tl);
      x=lx; s=sc;
      var b=v<.22?-17*Math.sin(Math.PI*v/.22):(v<.34?-5*Math.sin(Math.PI*(v-.22)/.12):0);
      y=ly+b; r=-d.a0+(v<.34?6*Math.sin(Math.PI*v/.34)*Math.exp(-v*4):0);
      var q=cl((t-d.ts)/.45); s=sc*(1-.75*eo(q)); op=1-eo(q); y+=10*q;
    }
    return 'translate('+x.toFixed(1)+' '+y.toFixed(1)+') rotate('+r.toFixed(2)+') scale('+s.toFixed(3)+') translate('+(-d.cx)+' '+(-d.cy)+')|'+op.toFixed(3);
  }
  function render(t){
    fade.setAttribute('opacity',eo(cl(t/.45)).toFixed(3));
    var p=gp(t); grow.style.strokeDashoffset=(GL*(1-p)+(p<=0?1:0)).toFixed(1);
    grow.setAttribute('stroke-opacity',p<=0?0:1);
    var a=5.2*Math.pow(1-p,1.5), ts=t-(G0+GD);
    if(ts>0) a+=-1.9*Math.sin(ts*2*Math.PI/1.35)*Math.exp(-ts*1.9);
    REL.forEach(function(tr){var v=t-tr; if(v>0) a+=-1.1*Math.sin(v*2*Math.PI/.9)*Math.exp(-v*3.2)});
    plant.setAttribute('transform','rotate('+a.toFixed(3)+' '+PX+' '+PY+')');
    ks.forEach(function(k){
      var q=cl((t-k.t0)/.5), s=.02+.98*back(q), r=(k.side=='top'?24:k.side=='bot'?-24:0)*(1-eo(q)), op=cl(q*25);
      if(k.rel!==null && t>=k.rel){ // detached: subtle ghost, regrows at the end
        var gq=cl((t-REGROW)/.5); op=.2+.8*eo(gq); s*= (gq>0? .55+.45*back(gq) : 1);
      }
      k.g.setAttribute('opacity',op.toFixed(3)); k.gr.setAttribute('stroke-opacity',cl((q-.45)/.55).toFixed(3));
      k.g.setAttribute('transform','translate('+k.bx+' '+k.by+') rotate('+r.toFixed(2)+') scale('+s.toFixed(4)+') translate('+(-k.bx)+' '+(-k.by)+')');
      var qa=cl((t-awn0-k.i*.045)/.4); k.awn.style.strokeDashoffset=(k.al*(1-eo(qa))).toFixed(2);
      k.awn.setAttribute('stroke-opacity',qa>0?1:0);
    });
    digs.forEach(function(d){
      var st=seedAt(d,t);
      if(st){var pr=st.split('|');d.sd.setAttribute('transform',pr[0]);d.sd.setAttribute('opacity',pr[1])} else d.sd.setAttribute('opacity',0);
      var u=(t-d.ts)/SPR; // sprout window 0..1
      d.shoots.forEach(function(s){var f=eio(cl((u-s.a)/(s.b-s.a)));
        s.p.style.strokeDashoffset=(s.L*(1-f)+(f<=0?1:0)).toFixed(1);
        s.p.style.strokeOpacity=(f>0?1:0)*(1-cl((u-.75)/.25));});
      var wq=eo(cl((u-.12)/.88));
      d.mks.forEach(function(m){var f=eio(cl((u-m.a-.08)/(m.b-m.a)));
        m.p.style.strokeDashoffset=(m.L*(1-f)+(f<=0?1:0)).toFixed(1);
        m.p.setAttribute('stroke-width',(u>=1.05?420:(4+176*wq)).toFixed(1));
        m.p.setAttribute('stroke-opacity',f>0?1:0);});
    });
    var qs=cl((t-6.15)/.85); band.setAttribute('transform','rotate(18 730 455) translate('+(-500+2500*eio(qs)).toFixed(1)+' 0)');
    shim.setAttribute('opacity',qs>0&&qs<1?.6:0);
  }
  window.spigaRender=render; window.spigaEnd=END;
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  var st=null, raf=0, done=null;
  function loop(now){if(st===null)st=now;var t=(now-st)/1000;render(Math.min(t,END));if(t<END)raf=requestAnimationFrame(loop);else if(done)done()}
  window.spigaPlay=function(cb){done=cb||null;cancelAnimationFrame(raf);st=null;render(0);raf=requestAnimationFrame(loop)};
  window.spigaFinish=function(){cancelAnimationFrame(raf);render(END)};
  window.spigaReplay=function(){spigaPlay()};
  if(S.hasAttribute('data-manual')) {render(END);return}
  if(reduce||/[?&]rec=1/.test(location.search)){render(END);return}
  spigaPlay();
})();
