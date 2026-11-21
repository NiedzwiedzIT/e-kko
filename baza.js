// Połączenie z wspólną bazą (arkusz Google kierownika).
// Adres i klucz nie są w kodzie strony: każdy telefon dostaje je raz przez link „#polacz=…” od kierownika
// i trzyma tylko u siebie (localStorage).
(function(){
  const LS="ekko-baza";
  function read(){ try{ return JSON.parse(localStorage.getItem(LS)||"null"); }catch(e){ return null; } }
  function write(c){ try{ if(c) localStorage.setItem(LS, JSON.stringify(c)); else localStorage.removeItem(LS); }catch(e){} }
  // link zaproszenia: #polacz=<base64url({"u":"…","k":"…"})>
  const m=location.hash.match(/polacz=([A-Za-z0-9_-]+)/);
  if(m){ try{ const j=JSON.parse(decodeURIComponent(escape(atob(m[1].replace(/-/g,"+").replace(/_/g,"/"))))); if(j.u && j.k){ write({u:j.u,k:j.k}); window.__ekkoJustConnected=true; } }catch(e){}
    history.replaceState(null,"",location.pathname+location.search); }
  const cfg=read();
  async function get(){ const r=await fetch(cfg.u+"?k="+encodeURIComponent(cfg.k)+"&t="+Date.now()); const j=await r.json(); if(!j.ok) throw new Error(j.blad||"blad"); return j.stan; }
  async function post(a,data){ const r=await fetch(cfg.u,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(Object.assign({},data,{a,k:cfg.k}))}); const j=await r.json(); if(!j.ok) throw new Error(j.blad||"blad"); return j.stan; }
  function inviteLink(){ if(!cfg) return ""; const b=btoa(unescape(encodeURIComponent(JSON.stringify({u:cfg.u,k:cfg.k})))).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,""); return location.origin+location.pathname.replace(/[^/]*$/,"")+"#polacz="+b; }
  window.EKKO_BAZA = { on: !!cfg, get, post, inviteLink, disconnect(){ write(null); location.reload(); }, justConnected: !!window.__ekkoJustConnected };
})();
