// Revolution simulator + bar optimiser (expected-value, tick based). Port/extension of /workspace/revo/sim.py.
(function(root){
var GCD=3, CRIT=0.10, CRITDMG=0.50, CAP=100;
var DISM=[[0,[2,4,6,8,10,12,14,16].map(function(d){return [d,30,false,'b']})],
          [-25,[3,6,9,12,15,18].map(function(d){return [d,90,false,'b']})],
          [-25,[[1,120,false,'d']].concat([5,9,13,17,21,25].map(function(d){return [d,100,false,'b']}))]];
var SCY=[[-10,[[1,80,9,'d']],0.25],[-20,[[1,200,25,'d']],0.25],[-30,[[1,250,25,'d']],0]];

function simulate(D, bar, o){
  o=o||{}; var weapon=o.weapon||'2h', T=o.targets||1, HP=o.bossHp||15000, ticks=o.ticks||6000;
  var A=D.abilities, basic=D.styles[o.style].basic;
  var M=o.mods||{}; var CAPX=CAP+(M.heightened?10:0)+(M.havoc4&&o.style==='melee'?20:0);
  var critBase=CRIT+0.02*(M.biting||0)+(M.grimoire?0.12:0)+(M.reaver?0.05:0);
  var dmgMult=(M.reaver?0.95:1)*(1+(M.bfury?0.055:0))*(1+0.025*(M.ruthless||0));
  var soulCap=(M.lantern&&o.style==='necro')?5:3; var havocRegenUntil=-1;
  var P=o.policy||{mode:'revo'}, RU=P.rules||{}, trace=o.trace?[]:null;
  var t=0, adren=o.startAdren||0, bl=0, cd={}, ch={}, chq={}, buffs={}, roar=false, critNext=0;
  var dst=0, dwin=-1, sst=0, swin=-1, hp=HP, dmg=0, casts={}, pend={}, next=0;
  var necrosis=0, souls=0, flow=0, chainP=null, combustUntil=-1, cmUntil=-1, searUntil=-1, imbUntil=-1, tsuUntil=-1, meteorUntil=-1;
  function grp(k){return A[k].group||k;}
  function has(id){return (buffs[id]||-1)>t;}
  function cost(k){var a=A[k]; if(a.finger) return Math.max(0,60-10*Math.min(6,necrosis));
    if(a.dismember) return dst>0&&t<=dwin? -DISM[dst][0]:0;
    if(a.scythe) return sst>0&&t<=swin? -SCY[sst][0]:10;
    var c=a.ad<0?-a.ad:0; if(c>0&&!a.ult&&flow) c=Math.max(0,c-flow); return c;}
  function usable(k){var a=A[k]; if(!a) return false; if(a.w&&a.w!==weapon) return false;
    if(a.dismember){ if(!(dst>0&&t<=dwin) && (cd.dismember||0)>t) return false; }
    else if(a.scythe){ if(!(sst>0&&t<=swin) && (cd.scythe||0)>t) return false; }
    else if(a.charges){ if((ch[k]===undefined?a.charges:ch[k])<=0) return false; }
    else if((cd[grp(k)]||0)>t) return false;
    if(a.soulStrike&&souls<1) return false; if(a.volley&&souls<2) return false;
    return adren>=cost(k);}
  function ruleOK(k){ if(P.mode==='revo') return !A[k].spec; var r=RU[k]; if(!r) return true;
    if(r.buf&&adren<cost(k)+r.buf) return false;
    if(r.wait==='stack'){ if(A[k].style==='melee'&&bl<4) return false; if((A[k].finger||A[k].deathGrasp)&&necrosis<6) return false; if(A[k].volley&&souls<soulCap) return false; }
    if(r.wait==='buff'&&!(roar||critNext>0||has('zerk')||has('ds')||has('sun')||has('ld'))) return false;
    return true; }
  function mult(a,kind){var m=1; if(kind!=='d') return m;
    if(a.style==='melee'&&has('zerk')) m*=1.75; if(a.style==='ranged'&&has('ds')) m*=1.5; if(a.style==='magic'&&has('sun')) m*=1.5; return m;}
  while(t<ticks){
    if(t<havocRegenUntil) adren=Math.min(CAPX,adren+0.5);
    if(t<meteorUntil) adren=Math.min(CAPX,adren+4.5);
    for(var k in chq){ while(chq[k].length&&chq[k][0]<=t){chq[k].shift(); ch[k]++;} }
    if(dst>0&&t>dwin) dst=0; if(sst>0&&t>swin){ sst=0; cd.scythe=t; }
    if(t>=next){
      var c=null; for(var i=0;i<bar.length;i++){ if(usable(bar[i])&&ruleOK(bar[i])){c=bar[i];break;} } if(!c) c=basic;
      if(trace&&trace.length<400) trace.push([t,c,Math.round(adren)]);
      var a=A[c]; casts[c]=(casts[c]||0)+1; var hits=(a.hits||[]).slice();
      if(M.igneous){ if(c==='overpower') hits=[[3,310,false,'d'],[3,310,false,'d']]; if(c==='deadshot') hits=[1,1,1,1,1,1,1,1].map(function(){return [1,65,false,'d'];}); if(c==='omnipower') hits=[1,1,1,1].map(function(){return [1,135,false,'d'];}); }
      var _x=0, lock=a.lock||0, extraM=1, gc=!!a.guaranteedCrit;
      var pay=cost(c), gain=a.ad>0?a.ad:0; if(a.spec&&M.vigour) pay=pay*0.9; if(a.adGainAfter) gain=a.adGainAfter;
      if(a.deathGrasp){ hits=[[1,450+40*necrosis,false,'d']]; necrosis=0; }
      if(a.blSpend&&bl>=4){ bl-=4;
        if(a.blSpend==='assault') hits=hits.map(function(h){return [h[0],180,h[2],h[3]];});
        if(a.blSpend==='hurricane') hits.push([1,85,9,'d']);
        if(a.blSpend==='flurry') extraM=1+Math.min(0.65,1-hp/HP); }
      if(a.punish&&hp<HP/2) extraM*=2.5;
      if(a.dismember){ hits=DISM[dst][1]; dst++; dwin=t+40; if(dst===3){cd.dismember=t+40; dst=0;} }
      if(a.scythe){ var s=SCY[sst]; hits=s[1]; souls=Math.min(soulCap,souls+s[2]*Math.min(T,10)); if(sst===2) extraM*=1+(1-hp/HP);
        sst++; swin=t+25; if(sst===3){cd.scythe=t+25; sst=0;} }
      if(a.finger){ necrosis=Math.max(0,necrosis-6); if(has('ld')) extraM*=1.5; }
      if(a.soulStrike){ souls-=1; hits.push([1,100,9,'o']); }
      if(a.volley){ hits=[[1,150*Math.floor(souls),false,'d']]; souls=0; }
      if(a.skulls){ var nh=T>1?(M.igneous?7:5):(M.igneous?4:3); for(var j=0;j<nh;j++) hits.push([1+j,250,false,'d']); if(T>1){ hits=hits.map(function(h,j){return [h[0],250,false,'d',j%2?'sec':null];}); } }
      if(a.bloat){ for(var tk in pend) pend[tk]=pend[tk].filter(function(p){return p.tag!=='bloat';}); }
      adren-=pay; if(pay>0&&!a.ult) flow=0;
      if(gain){ gain+=(M.fots?1:0)+0.27*(M.impatient||0); if(a.basicAttack) gain*=1+0.05*(M.invigorating||0); if(t<meteorUntil&&!a.basicAttack&&a.style==='melee') gain*=1.5; if(c==='touch'&&has('ld')) gain+=6; adren+=gain; }
      if(a.ult){ adren+=(M.vigour?10:0)+(M.coe?10:0);
        if(M.havoc2&&a.style==='melee'){ if(havocRegenUntil>t){ adren+=20; havocRegenUntil=-1; } else havocRegenUntil=t+30; } }
      adren=Math.max(0,Math.min(CAPX,adren));
      // cooldowns
      if(!a.dismember&&!a.scythe){
        if(a.charges){ if(ch[c]===undefined){ch[c]=a.charges; chq[c]=[];} ch[c]--; chq[c].push(t+a.cd); }
        else { var cc=a.cd; if(c==='overpower'&&has('zerk')) cc=15; if(c==='skulls'&&has('ld')) cc=17; if(a.hurricane) cc=Math.max(0,cc-5*T); cd[grp(c)]=t+cc; } }
      // stacks/buffs
      if(a.style==='melee'&&a.ad>0&&!a.spec){ bl=Math.min(has('zerk')?8:4, bl+(a.bl||1)*(has('zerk')?2:1)); }
      if(a.necrosis) necrosis=Math.min(12,necrosis+a.necrosis);
      if(c==='necromancy'&&has('ld')) necrosis=Math.min(12,necrosis+2);
      if(a.souls) souls=Math.min(soulCap,souls+a.souls);
      if(a.buff){ var bd=a.buff.dur; if(a.buff.id==='zerk'&&M.havoc3) bd+=10; if((c==='ds'||c==='sunshine')&&M.plantedFeet) bd=Math.round(bd*1.25); buffs[a.buff.id]=t+bd; if(a.buff.id==='zerk') bl=Math.min(8,bl+4);
        if(a.buff.id==='ld'){ cd.touch=t; cd.skulls=t; }
        if(a.sunDot&&!(M.plantedFeet&&c==='sunshine')) for(var q=3;q<=bd;q+=3) (pend[t+q]=pend[t+q]||[]).push({p:15,s:0}); if(false) for(var q=3;q<=a.buff.dur;q+=3) (pend[t+q]=pend[t+q]||[]).push({p:15,s:0}); }
      if(a.meteor) meteorUntil=t+50; if(a.imbue) imbUntil=t+a.imbue; if(a.imbueExtend&&imbUntil>t) imbUntil+=a.imbueExtend;
      if(a.tsunami) tsuUntil=t+a.tsunami; if(a.searing) searUntil=t+a.searing; if(a.searingExtend&&searUntil>t) searUntil+=8;
      if(a.combust) combustUntil=t+a.combust; if(a.combustBonus&&combustUntil>t) extraM*=a.combustBonus;
      if(a.snipeCdr&&cd.snipe) cd.snipe-=a.snipeCdr*2;
      if(a.zerkExtend&&has('zerk')) buffs.zerk+=8;
      if(a.ricochet&&T===1) hits.push([1,a.ricochet.bonus*a.ricochet.extra,false,'d']);
      else if(a.ricochet&&T-1<a.ricochet.extra) hits.push([1,a.ricochet.bonus*(a.ricochet.extra-(T-1)),false,'d']);
      // damage
      var boostRoar=roar&&hits.length>0; if(boostRoar) roar=false; var first=true, cmBonus=(cmUntil>t?0.15:0);
      var copy=(chainP&&!a.chain&&hits.length&&T>1)?chainP:null; if(copy&&hits.length) chainP=null;
      hits.forEach(function(h,i){
        var m=h[1]*extraM, kind=h[3];
        if(boostRoar&&(i===0||!lock)) m*=1.75;
        var ee=1, pc=0;
        if(kind==='d'){ var ccx=critBase+(a.hitCrit?a.hitCrit.cc:0); if(first&&critNext){ccx+=critNext;critNext=0;} if(gc) ccx=1;
          var cdm=CRITDMG+cmBonus+(a.hitCrit?a.hitCrit.cdm:0); pc=Math.min(1,ccx); ee=1+pc*cdm; first=false; }
        m=m*ee*mult(a,kind); if(kind==='d') m*=dmgMult*(1+(M.precise||0)*0.015*1.08/2);
        var prim=(h[2]==='o'||h[4]==='sec')?0:m;
        var nsec = h[2]===true||h[2]==='o' ? T-1 : (typeof h[2]==='number'? Math.min(T-1,h[2]) : 0);
        if(h[4]==='sec') nsec=T>1?1:0;
        var sec=m*nsec;
        if(copy&&!h[2]) sec+=m*copy.mult*Math.min(T-1,copy.extra);
        if(searUntil>t&&a.style==='ranged'&&kind==='d') { prim+=20; }
        var p={p:prim,s:sec}; if(a.bloat&&i>0) p.tag='bloat';
        if(imbUntil>t&&a.style==='ranged') adren=Math.min(CAPX,adren+5);
        if(tsuUntil>t&&a.style==='magic') adren=Math.min(CAPX,adren+8*pc);
        (pend[t+h[0]]=pend[t+h[0]]||[]).push(p);
      });
      if(a.roar) roar=true; if(a.critNext) critNext=a.critNext; if(a.flow) flow=a.flow; if(a.chain) chainP=a.chain;
      if(a.channelledMight) cmUntil=t+lock+a.channelledMight;
      next=t+Math.max(GCD,lock);
    }
    (pend[t]||[]).forEach(function(p){ dmg+=Math.min(p.p,hp)+p.s; hp-=p.p; if(hp<=0) hp=HP; }); delete pend[t];
    t++;
  }
  return {dpt:dmg/ticks, casts:casts, trace:trace};
}

function available(D, style, weapon, locked, mods, mode){
  return Object.keys(D.abilities).filter(function(k){var a=D.abilities[k];
    return a.style===style&&!a.basicAttack&&(!a.w||a.w===weapon)&&!(locked&&locked[k])&&(!a.spec||(mods&&mods[a.mod]&&mode!=='revo'));});
}
function optimise(D, o, locked){
  var pool=available(D,o.style,o.weapon,locked,o.mods,'revo'); var opts=Object.assign({ticks:2000},o);
  function sc(order){var b=order.slice(0,order.indexOf('X')); if(b.length>14) return -1; return simulate(D,b,opts).dpt;}
  function climb(order){ var cur=sc(order), improved=true, passes=0;
    while(improved&&passes<6){ improved=false; passes++;
      for(var i=0;i<order.length;i++) for(var j=0;j<order.length;j++){ if(i===j) continue;
        var n=order.slice(); var x=n.splice(i,1)[0]; n.splice(j,0,x); var v=sc(n);
        if(v>cur+1e-9){order=n;cur=v;improved=true;} } }
    return {order:order,v:cur}; }
  function val(k){var a=D.abilities[k]; return (a.hits||[]).reduce(function(s,h){return s+h[1];},0)+(a.ult?1000:0)+(a.ad<=0?500:0);}
  var sorted=pool.slice().sort(function(x,y){return val(y)-val(x);});
  var seeds=[sorted.slice(0,14).concat(['X'],sorted.slice(14)), ['X'].concat(pool)];
  var seed=12345; function rnd(){seed=(seed*1103515245+12345)%2147483648; return seed/2147483648;}
  for(var r=0;r<(o.restarts===undefined?3:o.restarts);r++){ var sh=pool.slice(); for(var q=sh.length-1;q>0;q--){var z=Math.floor(rnd()*(q+1)); var tmp=sh[q]; sh[q]=sh[z]; sh[z]=tmp;}
    var cut=Math.min(14,Math.max(4,Math.floor(rnd()*sh.length))); seeds.push(sh.slice(0,cut).concat(['X'],sh.slice(cut))); }
  (o.seeds||[]).forEach(function(b){ var bb=b.filter(function(k){return pool.indexOf(k)>=0;}); seeds.push(bb.concat(['X'],pool.filter(function(k){return bb.indexOf(k)<0;}))); });
  var best=null; seeds.forEach(function(sd){var r=climb(sd); if(!best||r.v>best.v) best=r;});
  var bar=best.order.slice(0,best.order.indexOf('X'));
  var probe=simulate(D,bar,Object.assign({},o,{ticks:o.evalTicks||12000}));
  bar=bar.filter(function(k){return probe.casts[k];});
  var full=simulate(D,bar,Object.assign({},o,{ticks:o.evalTicks||12000}));
  return {bar:bar, dpt:full.dpt, casts:full.casts};
}

function isBasic(D,k){var a=D.abilities[k]; return a.ad>0&&!a.ult&&!a.spec;}
// Manual / hybrid optimiser: priority list + per-ability hold rules (extra adrenaline buffer, wait-for-stacks, wait-for-buff).
function optimiseManual(D, o, locked){
  var mode=o.mode; var pool=available(D,o.style,o.weapon,locked,o.mods,mode);
  var BUFS=[0,10,20,30,45], WAITS=[null,'stack','buff'];
  var opts=Object.assign({},o,{ticks:o.ticks||2000});
  function canRule(k){ return mode==='manual' || !isBasic(D,k); }
  function sc(order,rules){ var bar=order.slice(0,order.indexOf('X'));
    if(mode==='hybrid'&&bar.filter(function(k){return isBasic(D,k);}).length>14) return -1;
    return simulate(D,bar,Object.assign({},opts,{policy:{mode:mode,rules:rules}})).dpt; }
  var seedBar=(o.seedBar||[]).filter(function(k){return pool.indexOf(k)>=0;});
  var order=seedBar.concat(pool.filter(function(k){return seedBar.indexOf(k)<0&&D.abilities[k].spec;}),['X'],pool.filter(function(k){return seedBar.indexOf(k)<0&&!D.abilities[k].spec;}));
  var rules=Object.assign({},o.seedRules||{}), cur=sc(order,rules), improved=true, passes=0;
  while(improved&&passes<(o.passes||4)){ improved=false; passes++;
    for(var i=0;i<order.length;i++) for(var j=0;j<order.length;j++){ if(i===j) continue;
      var n=order.slice(); var x=n.splice(i,1)[0]; n.splice(j,0,x); var v=sc(n,rules); if(v>cur+1e-9){order=n;cur=v;improved=true;} }
    order.slice(0,order.indexOf('X')).forEach(function(k){ if(!canRule(k)) return;
      BUFS.forEach(function(b){ WAITS.forEach(function(w){ var r2=Object.assign({},rules); r2[k]={buf:b,wait:w};
        var v=sc(order,r2); if(v>cur+1e-9){rules=r2;cur=v;improved=true;} }); }); });
  }
  var bar=order.slice(0,order.indexOf('X'));
  var full=simulate(D,bar,Object.assign({},o,{ticks:o.evalTicks||12000,trace:true,policy:{mode:mode,rules:rules}}));
  bar=bar.filter(function(k){return full.casts[k];});
  Object.keys(rules).forEach(function(k){ if(bar.indexOf(k)<0||(!rules[k].buf&&!rules[k].wait)) delete rules[k]; });
  var seq=full.trace.map(function(x){return x[1];});
  return {bar:bar, rules:rules, dpt:full.dpt, casts:full.casts, trace:full.trace.slice(0,30), loop:findLoop(seq)};
}
function findLoop(seq){ // smallest period p (<=60 GCDs) that repeats exactly at least twice from some start <=150
  for(var p=2;p<=60;p++) for(var s=0;s<=150;s++){ if(s+3*p>seq.length) break; var ok=true;
    for(var i=s;i<s+2*p;i++) if(seq[i]!==seq[i+p]){ok=false;break;}
    if(ok) return {start:s,period:p,seq:seq.slice(s,s+p)}; }
  return null; }
function optimiseMode(D,o,locked){ // full pipeline: revo -> hybrid -> manual (each seeds the next, so manual >= hybrid search start)
  var rv=o.revoResult||optimise(D,Object.assign({},o,{restarts:o.restarts===undefined?1:o.restarts}),locked);
  if(o.mode==='revo') return rv;
  var hy=optimiseManual(D,Object.assign({},o,{mode:'hybrid',seedBar:rv.bar}),locked); hy.revoDpt=rv.dpt;
  if(o.mode==='hybrid') return hy;
  var ma=optimiseManual(D,Object.assign({},o,{mode:'manual',seedBar:hy.bar,seedRules:hy.rules}),locked); ma.revoDpt=rv.dpt; ma.hybridDpt=hy.dpt;
  if(ma.dpt<hy.dpt){ var alt=optimiseManual(D,Object.assign({},o,{mode:'manual',seedBar:hy.bar,seedRules:hy.rules,passes:0}),locked); if(alt.dpt>ma.dpt){alt.revoDpt=rv.dpt; alt.hybridDpt=hy.dpt; ma=alt;} }
  return ma; }
var api={optimiseMode:optimiseMode, simulate:simulate, optimise:optimise, optimiseManual:optimiseManual, available:available, isBasic:isBasic};
if(typeof module!=='undefined') module.exports=api; else root.RevoEngine=api;
})(this);
