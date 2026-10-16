// Ability data from runescape.wiki (infoboxes + "Combat Style Modernisation" page), fetched 15 Oct 2026.
// Damage values are AVERAGES of the wiki ranges, in % ability damage. cd/lock/delay in game ticks (0.6 s).
// ad: +gain or -cost (cost is also the requirement). hits: [delayTicks, avg%, aoe, kind] kind d=direct, b=bleed/DoT.
// aoe: false | true (all extra targets) | number (max extra targets).
var REVO_DATA = {
 styles: {
  melee: {label:'Melee', weapons:['2h','dw'], basic:'attack'},
  ranged:{label:'Ranged', weapons:['2h','dw'], basic:'ranged'},
  magic: {label:'Magic', weapons:['2h','dw'], basic:'magic'},
  necro: {label:'Necromancy', weapons:['dw'], basic:'necromancy'}
 },
 abilities: {
  // ---------- MELEE ----------
  attack:{n:'Attack',style:'melee',icon:'Attack_(ability).png',cd:0,ad:9,hits:[[1,120,false,'d']],basicAttack:true,bl:1},
  adaptive2h:{n:'Adaptive Strike (2h)',style:'melee',icon:'Adaptive_Strike.png',w:'2h',cd:9,ad:12,hits:[[1,130,8,'d']],bl:1},
  adaptivedw:{n:'Adaptive Strike (DW)',style:'melee',icon:'Adaptive_Strike.png',w:'dw',cd:9,ad:12,hits:[[1,67.5,false,'d'],[1,67.5,false,'d']],bl:1},
  rend:{n:'Rend',style:'melee',icon:'Rend.png',cd:17,ad:9,hits:[[1,150,false,'d']],bl:2},
  fury:{n:'Fury',style:'melee',icon:'Fury.png',group:'fury',cd:25,ad:9,hits:[[1,120,false,'d']],bl:1,critNext:0.25},
  gfury:{n:'Greater Fury',style:'melee',icon:'Greater_Fury.png',group:'fury',cd:25,ad:9,hits:[[1,130,false,'d']],bl:1,critNext:1},
  backhand:{n:'Backhand',style:'melee',icon:'Backhand.png',cd:25,ad:9,hits:[[1,100,false,'d']],bl:1,charges:2},
  punish:{n:'Punish',style:'melee',icon:'Punish.png',cd:40,ad:9,hits:[[1,120,false,'d']],bl:1,punish:true},
  barge:{n:'Barge',style:'melee',icon:'Barge.png',group:'barge',cd:34,ad:9,hits:[[1,85,false,'d']],bl:1},
  gbarge:{n:'Greater Barge',style:'melee',icon:'Greater_Barge.png',group:'barge',cd:34,ad:9,hits:[[1,85,false,'d']],bl:1},
  chaosroar:{n:'Chaos Roar',style:'melee',icon:'Chaos_Roar.png',cd:100,ad:9,hits:[[1,110,false,'d']],bl:1,roar:true},
  assault:{n:'Assault',style:'melee',icon:'Assault.png',cd:10,ad:-25,lock:7,hits:[[1,140,false,'d'],[3,140,false,'d'],[5,140,false,'d'],[7,140,false,'d']],blSpend:'assault'},
  hurricane:{n:'Hurricane',style:'melee',icon:'Hurricane.png',w:'2h',cd:34,ad:-25,hits:[[1,150,false,'d'],[1,170,9,'d']],blSpend:'hurricane',hurricane:true},
  flurry:{n:'Flurry',style:'melee',icon:'Flurry.png',group:'flurry',w:'dw',cd:34,ad:-25,lock:8,hits:[1,2,3,4,5,6,7,8].map(function(d){return [d,65,8,'d']}),blSpend:'flurry'},
  gflurry:{n:'Greater Flurry',style:'melee',icon:'Greater_Flurry.png',group:'flurry',w:'dw',cd:34,ad:-25,lock:8,hits:[1,2,3,4,5,6,7,8].map(function(d){return [d,65,8,'d']}),blSpend:'flurry',zerkExtend:true},
  dismember:{n:'Dismember / Slaughter / Massacre',style:'melee',icon:'Dismember.png',cd:40,ad:0,dismember:true},
  overpower:{n:'Overpower',style:'melee',icon:'Overpower.png',cd:50,ad:-60,ult:true,hits:[[3,545,false,'d']]},
  berserk:{n:'Berserk',style:'melee',icon:'Berserk.png',cd:100,ad:-100,ult:true,hits:[],buff:{id:'zerk',dur:33,mult:1.75}},
  meteor:{n:'Meteor Strike',style:'melee',icon:'Meteor_Strike.png',cd:100,ad:-60,ult:true,hits:[[1,235,8,'d']],meteor:true},
  pulverise:{n:'Pulverise',style:'melee',icon:'Pulverise.png',w:'2h',cd:100,ad:-60,ult:true,hits:[[1,320,false,'d']]},
  // ---------- RANGED ----------
  ranged:{n:'Ranged',style:'ranged',icon:'Ranged_(ability).png',cd:0,ad:9,hits:[[1,100,false,'d']],basicAttack:true},
  piercing:{n:'Piercing Shot',style:'ranged',icon:'Piercing_Shot.png',cd:5,ad:9,hits:[[1,50,false,'d'],[1,50,false,'d']],snipeCdr:4},
  galeshot:{n:'Galeshot',style:'ranged',icon:'Galeshot.png',cd:34,ad:9,hits:[[1,100,false,'d']],searing:10},
  binding:{n:'Binding Shot',style:'ranged',icon:'Binding_Shot.png',cd:25,ad:9,hits:[[1,70,false,'d']],charges:2},
  ricochet:{n:'Ricochet',style:'ranged',icon:'Ricochet.png',group:'rico',cd:17,ad:9,hits:[[1,80,2,'d']],ricochet:{extra:2,bonus:17.5}},
  gricochet:{n:'Greater Ricochet',style:'ranged',icon:'Greater_Ricochet.png',group:'rico',cd:17,ad:9,hits:[[1,80,6,'d']],ricochet:{extra:6,bonus:17.5}},
  snapshot:{n:'Snap Shot',style:'ranged',icon:'Snap_Shot.png',cd:9,ad:-25,hits:[[1,145,false,'d'],[1,145,false,'d']]},
  bombardment:{n:'Bombardment',style:'ranged',icon:'Bombardment.png',cd:9,ad:-25,hits:[[1,240,9,'d']]},
  rapidfire:{n:'Rapid Fire',style:'ranged',icon:'Rapid_Fire.png',cd:34,ad:-25,lock:8,hits:[1,2,3,4,5,6,7,8].map(function(d){return [d,80,false,'d']}),searingExtend:true},
  corruptshot:{n:'Corruption Shot',style:'ranged',icon:'Corruption_Shot.png',cd:25,ad:-20,hits:[[1,100,5,'b'],[3,80,5,'b'],[5,60,5,'b'],[7,40,5,'b'],[9,20,5,'b']]},
  snipe:{n:'Snipe',style:'ranged',icon:'Snipe.png',cd:100,ad:0,enh0:true,hits:[[3,330,false,'d']]},
  shadowtendrils:{n:'Shadow Tendrils',style:'ranged',icon:'Shadow_Tendrils.png',cd:75,ad:0,enh0:true,hits:[[1,220,false,'d']],guaranteedCrit:true,imbueExtend:6},
  imbue:{n:'Imbue: Shadows',style:'ranged',icon:'Imbue-_Shadows.png',cd:100,ad:-40,hits:[],imbue:50},
  deadshot:{n:'Deadshot',style:'ranged',icon:'Deadshot.png',cd:50,ad:-60,ult:true,hits:[[1,115,false,'d'],[1,115,false,'d'],[1,115,false,'d'],[1,115,false,'d']]},
  ds:{n:"Death's Swiftness",style:'ranged',icon:"Death's_Swiftness.png",group:'ds',cd:100,ad:-100,ult:true,hits:[],buff:{id:'ds',dur:50,mult:1.5}},
  gds:{n:"Greater Death's Swiftness",style:'ranged',icon:"Greater_Death's_Swiftness.png",group:'ds',cd:100,ad:-100,ult:true,hits:[],buff:{id:'ds',dur:63,mult:1.5}},
  // ---------- MAGIC ----------
  magic:{n:'Magic',style:'magic',icon:'Magic_(ability).png',cd:0,ad:9,hits:[[1,100,false,'d']],basicAttack:true},
  sonic:{n:'Sonic Wave',style:'magic',icon:'Sonic_Wave.png',group:'sonic',cd:25,ad:9,hits:[[1,100,false,'d']],flow:10},
  gsonic:{n:'Greater Sonic Wave',style:'magic',icon:'Greater_Sonic_Wave.png',group:'sonic',cd:25,ad:9,hits:[[1,125,false,'d']],flow:20},
  dragonbreath:{n:'Dragon Breath',style:'magic',icon:'Dragon_Breath.png',cd:12,ad:9,hits:[[1,120,4,'d']],combustBonus:1.25},
  impact:{n:'Impact',style:'magic',icon:'Impact.png',cd:25,ad:9,hits:[[1,70,false,'d']],charges:2},
  combust:{n:'Combust',style:'magic',icon:'Combust.png',cd:30,ad:9,hits:[3,6,9,12,15,18,21,24,27,30].map(function(d){return [d,30,false,'b']}),combust:30},
  chain:{n:'Chain',style:'magic',icon:'Chain.png',group:'chain',cd:17,ad:9,hits:[[1,80,2,'d']],chain:{extra:2,mult:0.3}},
  gchain:{n:'Greater Chain',style:'magic',icon:'Greater_Chain.png',group:'chain',cd:17,ad:9,hits:[[1,90,6,'d']],chain:{extra:6,mult:0.5}},
  conc:{n:'Concentrated Blast',style:'magic',icon:'Concentrated_Blast.png',group:'conc',cd:9,ad:9,lock:3,hits:[[1,35,false,'d'],[2,35,false,'d'],[3,35,false,'d']],critNext:0.15},
  gconc:{n:'Greater Concentrated Blast',style:'magic',icon:'Greater_Concentrated_Blast.png',group:'conc',cd:9,ad:9,lock:3,hits:[[1,45,false,'d'],[2,45,false,'d'],[3,45,false,'d']],critNext:0.21},
  wildmagic:{n:'Wild Magic',style:'magic',icon:'Wild_Magic.png',cd:9,ad:-25,hits:[[1,140,false,'d'],[1,140,false,'d']],hitCrit:{cc:0.10,cdm:0.20}},
  asphyxiate:{n:'Asphyxiate',style:'magic',icon:'Asphyxiate.png',cd:34,ad:-25,lock:7,hits:[[1,130,false,'d'],[3,130,false,'d'],[5,130,false,'d'],[7,130,false,'d']],channelledMight:10},
  magma:{n:'Magma Tempest',style:'magic',icon:'Magma_Tempest.png',cd:35,ad:-20,hits:[2,4,6,8,10,12,14,16].map(function(d){return [d,40,true,'n']})},
  corruptblast:{n:'Corruption Blast',style:'magic',icon:'Corruption_Blast.png',cd:25,ad:-20,hits:[[1,100,false,'b'],[3,80,true,'b'],[5,60,true,'b'],[7,40,true,'b'],[9,20,true,'b']]},
  smoketendrils:{n:'Smoke Tendrils',style:'magic',icon:'Smoke_Tendrils.png',cd:75,ad:0,enh0:true,lock:7,hits:[[1,60,false,'d'],[3,72.5,false,'d'],[5,85,false,'d'],[7,97.5,false,'d']],guaranteedCrit:true},
  omnipower:{n:'Omnipower',style:'magic',icon:'Omnipower.png',cd:50,ad:-60,ult:true,hits:[[1,460,false,'d']]},
  tsunami:{n:'Tsunami',style:'magic',icon:'Tsunami.png',cd:100,ad:-100,ult:true,hits:[[1,250,8,'d']],tsunami:50},
  sunshine:{n:'Sunshine',style:'magic',icon:'Sunshine.png',group:'sun',cd:100,ad:-100,ult:true,hits:[],buff:{id:'sun',dur:50,mult:1.5},sunDot:true},
  gsunshine:{n:'Greater Sunshine',style:'magic',icon:'Greater_Sunshine.png',group:'sun',cd:100,ad:-100,ult:true,hits:[],buff:{id:'sun',dur:63,mult:1.5},sunDot:true},
  // ---------- NECROMANCY ----------
  necromancy:{n:'Necromancy',style:'necro',icon:'Necromancy_(ability).png',cd:0,ad:9,hits:[[1,100,false,'d']],basicAttack:true},
  touch:{n:'Touch of Death',style:'necro',icon:'Touch_of_Death.png',cd:24,ad:9,hits:[[1,100,false,'d']],necrosis:4},
  soulsap:{n:'Soul Sap',style:'necro',icon:'Soul_Sap.png',cd:9,ad:9,hits:[[1,100,false,'d']],souls:1},
  commandskel:{n:'Command Skeleton Warrior',style:'necro',icon:'Command_Skeleton_Warrior.png',cd:25,ad:0,enh0:true,hits:[[2,70,false,'n'],[4,70,false,'n'],[6,70,false,'n'],[8,70,false,'n'],[10,70,false,'n']]},
  bloat:{n:'Bloat',style:'necro',icon:'Bloat.png',cd:0,ad:-20,hits:[[1,150,false,'d']].concat([4,7,10,13,16,19,22,25,28,31].map(function(d){return [d,37.5,false,'b']})),bloat:true},
  scythe:{n:'Spectral Scythe (3 casts)',style:'necro',icon:'Spectral_Scythe.png',cd:25,ad:-10,scythe:true},
  soulstrike:{n:'Soul Strike',style:'necro',icon:'Soul_Strike.png',cd:0,ad:0,enh0:true,hits:[[1,150,false,'d']],soulStrike:true},
  volley:{n:'Volley of Souls',style:'necro',icon:'Volley_of_Souls.png',cd:0,ad:0,enh0:true,hits:[],volley:true},
  finger:{n:'Finger of Death',style:'necro',icon:'Finger_of_Death.png',cd:0,ad:-60,hits:[[1,300,false,'d']],finger:true},
  siphon:{n:'Blood Siphon',style:'necro',icon:'Blood_Siphon.png',cd:75,ad:0,enh0:true,lock:9,hits:[[2,25,'o','d'],[4,25,'o','d'],[6,25,'o','d'],[8,25,'o','d'],[9,130,false,'d']]},
  skulls:{n:'Death Skulls',style:'necro',icon:'Death_Skulls.png',cd:100,ad:-60,ult:true,hits:[],skulls:true},
  // ---------- SPECIAL ATTACKS (manual only: "Special Attacks cannot be automatically activated by Revolution" - wiki Weapon_Special_Attack) ----------
  spec_ezk:{n:'Igneous Showdown (Ek-ZekKil spec)',style:'melee',icon:'Ek-ZekKil.png',w:'2h',spec:true,mod:'spec_ezk',cd:100,ad:-65,hits:[[1,280,false,'d'],[2,255,false,'d'],[3,255,false,'d'],[4,255,false,'d']],adGainAfter:15},
  spec_leng:{n:'Dark Shard of Leng spec',style:'melee',icon:'Dark_Shard_of_Leng.png',w:'dw',spec:true,mod:'spec_leng',cd:25,ad:-30,hits:[[1,125,false,'d'],[2,190,9,'d']]},
  spec_deathguard:{n:'Death Grasp (Death guard T70+ spec)',style:'necro',icon:'Death_guard_(tier_90).png',spec:true,mod:'spec_deathguard',cd:50,ad:-25,hits:[[1,450,false,'d']],deathGrasp:true},
  livingdeath:{n:'Living Death',style:'necro',icon:'Living_Death.png',cd:150,ad:-100,ult:true,hits:[],buff:{id:'ld',dur:50,mult:1}}
 }
};
if (typeof module !== 'undefined') module.exports = REVO_DATA;
// Gear / relic / perk toggles (values from the wiki pages listed in src).
var REVO_MODS = [
 {id:'spec_ezk',n:'Ek-ZekKil equipped (2h melee): Igneous Showdown spec',type:'bool',style:'melee',d:'65% adrenaline, 60s cd; 260-300% then 3x245-265% vs Flamebound Rival (assumed), +15% adrenaline. Manual modes only.',src:'Ek-ZekKil'},
 {id:'spec_leng',n:'Dark Shard of Leng equipped (DW melee): spec',type:'bool',style:'melee',d:'30% adrenaline, 15s cd; 115-135% then 175-205% AoE (Primordial Ice ignored). Manual modes only.',src:'Dark_Shard_of_Leng'},
 {id:'spec_deathguard',n:'Death guard T70+ equipped: Death Grasp spec',type:'bool',style:'necro',d:'25% adrenaline, 30s cd; 405-495% +40% per Necrosis stack consumed. Manual modes only.',src:'Death_Grasp'},
 {id:'fots',n:'Fury of the Small (relic)',type:'bool',d:'Basic abilities +1% adrenaline',src:'Fury_of_the_Small'},
 {id:'heightened',n:'Heightened Senses (relic)',type:'bool',d:'+10% max adrenaline',src:'Heightened_Senses'},
 {id:'coe',n:'Conservation of Energy (relic)',type:'bool',d:'Refund 10% adrenaline after an ultimate',src:'Conservation_of_Energy'},
 {id:'bfury',n:"Berserker's Fury (relic, assumes max +5.5%)",type:'bool',d:'Up to +5.5% damage at low life points; modelled at the cap (non-bleed)',src:"Berserker's_Fury"},
 {id:'vigour',n:'Ring of vigour',type:'bool',d:'Retain 10% adrenaline after an ultimate (modelled as permanently worn / passive unlocked)',src:'Ring_of_vigour'},
 {id:'reaver',n:"Reaver's ring",type:'bool',d:'+5% crit chance, hit chance x0.95',src:"Reaver's_ring"},
 {id:'grimoire',n:"Erethdor's grimoire",type:'bool',d:'+12% crit chance',src:"Erethdor's_grimoire"},
 {id:'havoc2',n:'Vestments of havoc (2pc)',type:'bool',style:'melee',d:'After a melee ultimate regen 15% over 18s; if active, +20% instantly instead',src:'Vestments_of_havoc_armour'},
 {id:'havoc3',n:'Vestments of havoc (3pc)',type:'bool',style:'melee',d:'Berserk +6s (10 ticks)',src:'Vestments_of_havoc_armour'},
 {id:'havoc4',n:'Vestments of havoc (4pc)',type:'bool',style:'melee',d:'+20% max adrenaline with a melee weapon',src:'Vestments_of_havoc_armour'},
 {id:'igneous',n:'Igneous cape for this style (Kal-Ket/Xil/Mej/Mor)',type:'bool',d:'OP 2x280-340%; Deadshot 8x55-75%; Omnipower 4x120-150%; Death Skulls +2 bounces',src:'Igneous_Kal-Ket'},
 {id:'plantedFeet',n:'Planted Feet (perk)',type:'bool',d:"Sunshine / Death's Swiftness +25% duration (non-Greater only), removes Sunshine DoT",src:'Planted_Feet'},
 {id:'lantern',n:'Soulbound lantern',type:'bool',style:'necro',d:'Residual Soul cap 3 -> 5',src:'Volley_of_Souls'},
 {id:'biting',n:'Biting (perk rank)',type:'rank',max:4,d:'+2% crit chance per rank',src:'Biting'},
 {id:'precise',n:'Precise (perk rank)',type:'rank',max:6,d:'Min hit + 1.5%/rank of max (avg approx. +0.81%/rank)',src:'Precise'},
 {id:'ruthless',n:'Ruthless (perk rank, 5 stacks held)',type:'rank',max:5,d:'+0.5%/rank/stack damage; assumes 5 stacks maintained (needs kills)',src:'Ruthless'},
 {id:'invigorating',n:'Invigorating (perk rank)',type:'rank',max:4,d:'Basic attack adrenaline x(1+5%/rank)',src:'Invigorating'},
 {id:'impatient',n:'Impatient (perk rank)',type:'rank',max:4,d:'9%/rank chance of +3% adrenaline on basics (expected value)',src:'Impatient'}
];
if (typeof module !== 'undefined') module.exports.mods = REVO_MODS;
var REVO_NOTES = '<h3>Assumptions &amp; limits</h3><ul>'+
'<li>Revolution rules (runescape.wiki/w/Revolution, Combat Style Modernisation): main bar only, up to 14 slots, fires the first available ability; basic/enhanced/ultimate firing toggles all on ("Revolution++"). Thresholds no longer exist for melee/ranged/magic: enhanced abilities fire as soon as you have their cost. The basic attack only fires when nothing else on the bar can.</li>'+
'<li>Expected-value damage: average of each wiki range, 100% hit chance, 10% base crit chance, +50% crit damage (90+ stat). Bleeds/DoTs cannot crit and are not boosted by Berserk / Sunshine / Death\'s Swiftness. Overkill is not counted; a new identical target (15,000% AD of HP) spawns instantly so HP-dependent effects (Punish, bloodlust Flurry, Spectral Scythe 3) average over a full kill.</li>'+
'<li>Channelled abilities block the next cast for their channel length; Chaos Roar boosts only the first hit of channels. Greater Fury / Fury / Concentrated Blast crit buffs apply to the next direct hit.</li>'+
'<li>Dismember/Slaughter/Massacre: modelled as one slot that recasts within 40 ticks; its 40-tick cooldown starts after the third cast. Spectral Scythe likewise (25-tick window). Revolution behaviour for these recasts is not documented on the wiki.</li>'+
'<li>Necromancy: conjures (Skeleton/Zombie/Ghost/Army) are assumed pre-cast and maintained manually; their autoattacks are not counted. Command Skeleton Warrior uses the wiki average extra damage (350%) spread over 10 ticks. Residual Souls from Spectral Scythe are an expected value (25%/target). Volley fires as soon as 2 souls exist (Revolution cannot wait for a full stack). Death Skulls on one target: 3 hits assumed (wiki range 250-750%). Incantations (Threads of Fate, Invoke Death, Split Soul, Darkness) are not bar abilities and are not modelled. Bloat re-cast cancels the remaining old bleed.</li>'+
'<li>Magic: Chain copies the next non-AoE ability to extra targets at 0.3x/0.5x. Runic Charge is never fired by Revolution (wiki) and is excluded. Rune/ammo consumption ignored.</li>'+
'<li>Ranged: Bombardment cooldown uses the CSM table value (9 ticks); its infobox lists 1.8 s, a conflict on the wiki. Galeshot Searing Winds adds +20% AD per ranged hit for 10 ticks (Rapid Fire extends it).</li>'+
'<li>Melee: Pulverise is listed as two-handed in its infobox but dual-wield in the CSM table; modelled as two-handed. Greater Barge bonus damage ignored (no idle time in sustained combat).</li>'+
'<li>Modifiers: Precise uses an approximate max-hit of 1.08x average; Ruthless assumes 5 stacks maintained; Berserker\'s Fury assumes the +5.5% cap; Reaver\'s ring hit-chance penalty applied as x0.95. Not modelled: First Necromancer robes (conjure damage/duration only), Deathwarden robes (dodge only), Jaws of the Abyss, Natural Instinct, special attacks, gloves of passage, essence of finality, auras, prayers, potions, Ultimatums, Lunging, Caroming, Flanking.</li></ul>';
if (typeof module !== 'undefined') module.exports.notes = REVO_NOTES;
