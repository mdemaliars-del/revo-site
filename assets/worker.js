importScripts('data.js','engine.js');
onmessage=function(e){ var m=e.data; var r=RevoEngine.optimiseMode(REVO_DATA,m.o,m.locked); postMessage({id:m.id,r:r}); };
