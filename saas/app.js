// ponytail: API_URL points to NestJS. Without API, falls back to localStorage (offline PWA).
const API = (localStorage.getItem('bukukas.api') || 'http://localhost:3000/api').replace(/\/$/,'');
const KEY = 'bukukas.v1';
const $ = (s, r=document) => r.querySelector(s);

const els = {
  saldoAngka: $('#saldoAngka'), saldoMeta: $('#saldoMeta'), saldoBar: $('#saldoBar'),
  tabOut: $('#tabOut'), tabIn: $('#tabIn'), form: $('#form'),
  fTitle: $('#fTitle'), fAmount: $('#fAmount'), fCat: $('#fCat'), fDate: $('#fDate'),
  btnSubmit: $('#btnSubmit'), formMsg: $('#formMsg'),
  eTitle: $('#eTitle'), eAmount: $('#eAmount'),
  q: $('#q'), filterCat: $('#filterCat'), list: $('#list'), totalRow: $('#totalRow'),
  sLoading: $('#stateLoading'), sEmpty: $('#stateEmpty'), sError: $('#stateError'),
  btnRetry: $('#btnRetry'), btnExport: $('#btnExport'),
  dlg: $('#dlgSaldo'), fSaldoAwal: $('#fSaldoAwal'), btnEditSaldo: $('#btnEditSaldo'),
  btnInstall: $('#btnInstall'),
};

let type = 'out';
let deferredPrompt = null;
let useApi = true;
let db = { saldoAwal: 0, items: [] };

function loadLocal(){
  try{ const raw=localStorage.getItem(KEY); if(!raw) return {saldoAwal:0,items:[]}; const j=JSON.parse(raw); return {saldoAwal:Number(j.saldoAwal)||0, items:Array.isArray(j.items)?j.items:[]}; }catch{ return {saldoAwal:0,items:[]}; }
}
function saveLocal(){ localStorage.setItem(KEY, JSON.stringify(db)); }
function fmt(n){ return new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(n); }
function parseAmount(s){ return Number(String(s).replace(/[^\d]/g,''))||0; }
function esc(s){ return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
function saldoNow(){ let s=db.saldoAwal; for(const it of db.items) s+= it.type==='in'?it.amount:-it.amount; return s; }
function showError(msg){ els.sError.hidden=false; els.sLoading.hidden=true; if(msg) els.sError.querySelector('p').textContent=msg; }

async function api(path, opts={}){
  const r = await fetch(`${API}${path}`, { headers:{'Content-Type':'application/json'}, ...opts });
  if(!r.ok) throw new Error(await r.text());
  return r.json();
}

async function refresh(){
  els.sLoading.hidden=false; els.sEmpty.hidden=true; els.sError.hidden=true;
  if(!useApi){ render(); return; }
  try{
    const [summary, items] = await Promise.all([ api('/setting/summary'), api('/tx') ]);
    db = { saldoAwal: summary.saldoAwal, items: items.map(x=>({ id:String(x.id), title:x.title, amount:x.amount, cat:x.cat, date:x.date, type:x.type })) };
    saveLocal();
    render();
  }catch(e){
    // fallback offline: use local
    db = loadLocal();
    render();
    els.formMsg.textContent = 'Offline: pakai data HP, akan sinkron saat API hidup.';
  } finally { els.sLoading.hidden=true; }
}

function render(){
  const s = saldoNow();
  els.saldoAngka.textContent = fmt(s);
  els.saldoAngka.style.color = s < 0 ? 'var(--danger)' : 'var(--accent)';
  const pct = db.saldoAwal ? Math.max(4, Math.min(100, (s/db.saldoAwal)*100)) : (s>0?60:8);
  els.saldoBar.style.width = pct+'%';
  els.saldoBar.style.background = s < 0 ? 'var(--danger)' : 'var(--accent)';
  els.saldoMeta.textContent = `Saldo awal ${fmt(db.saldoAwal)} \u00B7 ${db.items.length} transaksi \u00B7 sisa ${fmt(s)}${useApi?' \u00B7 NestJS':' \u00B7 offline'}`;

  const q = els.q.value.trim().toLowerCase();
  const cat = els.filterCat.value;
  let filtered = db.items.slice().sort((a,b)=> b.date.localeCompare(a.date));
  if(q) filtered = filtered.filter(x=> (x.title+' '+x.cat).toLowerCase().includes(q));
  if(cat) filtered = filtered.filter(x=> x.cat===cat);

  els.list.innerHTML='';
  if(!filtered.length){
    els.sEmpty.hidden = db.items.length ? true : false;
    if(db.items.length){ els.list.innerHTML='<li class="state">Tidak ada hasil untuk filter ini.</li>'; els.sEmpty.hidden=true; }
  } else {
    els.sEmpty.hidden=true; els.sError.hidden=true;
    for(const it of filtered){
      const li=document.createElement('li'); li.className='row';
      li.innerHTML=`<div class="row-main"><p class="row-title">${esc(it.title)}</p><p class="row-meta">${esc(it.cat)} \u00B7 ${esc(it.date)}</p></div><div style="display:flex;align-items:center;gap:8px"><span class="row-amount ${it.type}">${it.type==='in'?'+':'\u2212'}${fmt(it.amount)}</span><div class="row-actions"><button class="icon-btn" aria-label="Hapus ${esc(it.title)}" data-del="${it.id}">\u00D7</button></div></div>`;
      els.list.appendChild(li);
    }
  }
  const sumIn=filtered.filter(x=>x.type==='in').reduce((a,b)=>a+b.amount,0);
  const sumOut=filtered.filter(x=>x.type==='out').reduce((a,b)=>a+b.amount,0);
  els.totalRow.textContent = filtered.length ? `Masuk ${fmt(sumIn)} \u00B7 Keluar ${fmt(sumOut)}` : '';
}

function setType(t){
  type=t;
  const out=t==='out';
  els.tabOut.classList.toggle('active', out); els.tabOut.setAttribute('aria-selected', String(out));
  els.tabIn.classList.toggle('active', !out); els.tabIn.setAttribute('aria-selected', String(!out));
  els.btnSubmit.textContent = out ? 'Catat pengeluaran' : 'Catat pemasukan';
  if(out && ['Gaji','Hadiah'].includes(els.fCat.value)) els.fCat.value='Lainnya';
  if(!out && !['Gaji','Hadiah','Lainnya'].includes(els.fCat.value)) els.fCat.value='Gaji';
}
els.tabOut.addEventListener('click', ()=>setType('out'));
els.tabIn.addEventListener('click', ()=>setType('in'));
els.fAmount.addEventListener('input', e=>{ const n=parseAmount(e.target.value); e.target.value=n?new Intl.NumberFormat('id-ID').format(n):''; });
els.fSaldoAwal.addEventListener('input', e=>{ const n=parseAmount(e.target.value); e.target.value=n?new Intl.NumberFormat('id-ID').format(n):''; });

els.form.addEventListener('submit', async e=>{
  e.preventDefault();
  els.eTitle.textContent=''; els.eAmount.textContent=''; els.formMsg.textContent=''; els.formMsg.className='form-msg';
  const title=els.fTitle.value.trim(); const amount=parseAmount(els.fAmount.value); const cat=els.fCat.value; const date=els.fDate.value;
  let ok=true; if(!title){els.eTitle.textContent='Isi nama barang atau sumber.'; ok=false;} if(!amount){els.eAmount.textContent='Isi jumlah.'; ok=false;} if(!date){els.formMsg.textContent='Pilih tanggal.'; els.formMsg.classList.add('error'); ok=false;} if(!ok) return;
  els.btnSubmit.disabled=true;
  try{
    if(useApi){ await api('/tx', { method:'POST', body: JSON.stringify({ title, amount, cat, date, type }) }); await refresh(); }
    else { db.items.push({ id:String(Date.now()), title, amount, cat, date, type }); saveLocal(); render(); }
    els.form.reset(); els.fDate.valueAsDate=new Date(); setType(type);
    els.formMsg.textContent = type==='out' ? 'Pengeluaran tercatat.' : 'Pemasukan tercatat.';
  }catch(err){ els.formMsg.textContent='Gagal simpan: '+(err.message||err); els.formMsg.classList.add('error'); }
  finally{ els.btnSubmit.disabled=false; els.fTitle.focus(); }
});

els.list.addEventListener('click', async e=>{
  const b=e.target.closest('[data-del]'); if(!b) return;
  const id=b.getAttribute('data-del');
  try{ if(useApi) await api('/tx/'+id,{method:'DELETE'}); else { db.items=db.items.filter(x=>x.id!==id); saveLocal(); } await refresh(); }catch(err){ showError(String(err)); }
});
els.q.addEventListener('input', render);
els.filterCat.addEventListener('change', render);
els.btnRetry.addEventListener('click', refresh);
els.btnExport.addEventListener('click', ()=>{ const blob=new Blob([JSON.stringify(db,null,2)],{type:'application/json'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='bukukas.json'; a.click(); URL.revokeObjectURL(a.href); });
els.btnEditSaldo.addEventListener('click', ()=>{ els.fSaldoAwal.value=db.saldoAwal?new Intl.NumberFormat('id-ID').format(db.saldoAwal):''; if(typeof els.dlg.showModal==='function') els.dlg.showModal(); else els.dlg.setAttribute('open',''); });
els.dlg.addEventListener('close', async ()=>{
  if(els.dlg.returnValue!=='save') return;
  const v=parseAmount(els.fSaldoAwal.value);
  try{ if(useApi) await api('/setting/saldo-awal', {method:'POST', body:JSON.stringify({saldoAwal:v})}); else { db.saldoAwal=v; saveLocal(); } await refresh(); }catch(err){ showError(String(err)); }
});
els.dlg.addEventListener('click', e=>{ const r=els.dlg.getBoundingClientRect(); if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom) els.dlg.close('cancel'); });
document.addEventListener('keydown', e=>{ if(e.key==='Escape' && els.dlg.open) els.dlg.close('cancel'); });
window.addEventListener('beforeinstallprompt', e=>{ e.preventDefault(); deferredPrompt=e; els.btnInstall.hidden=false; });
els.btnInstall.addEventListener('click', async()=>{ if(!deferredPrompt) return; deferredPrompt.prompt(); await deferredPrompt.userChoice; deferredPrompt=null; els.btnInstall.hidden=true; });
if('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(()=>{});

// probe API once
fetch(`${API}/health`).then(r=>r.ok).then(ok=>{ useApi=!!ok; refresh(); }).catch(()=>{ useApi=false; db=loadLocal(); render(); });

els.fDate.valueAsDate=new Date();
setType('out');
refresh();
console.assert(fmt(1000).includes('1.000'), 'fmt broken');
