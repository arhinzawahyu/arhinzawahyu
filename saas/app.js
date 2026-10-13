// ponytail: localStorage ceiling is 5MB per origin. Upgrade: swap load/save to Supabase/Firebase when adding auth.
const KEY = "bukukas.v1";
const $ = (s, r=document) => r.querySelector(s);

const els = {
  saldoAngka: $("#saldoAngka"), saldoMeta: $("#saldoMeta"), saldoBar: $("#saldoBar"),
  tabOut: $("#tabOut"), tabIn: $("#tabIn"), form: $("#form"),
  fTitle: $("#fTitle"), fAmount: $("#fAmount"), fCat: $("#fCat"), fDate: $("#fDate"),
  btnSubmit: $("#btnSubmit"), formMsg: $("#formMsg"),
  eTitle: $("#eTitle"), eAmount: $("#eAmount"),
  q: $("#q"), filterCat: $("#filterCat"), list: $("#list"), totalRow: $("#totalRow"),
  sLoading: $("#stateLoading"), sEmpty: $("#stateEmpty"), sError: $("#stateError"),
  btnRetry: $("#btnRetry"), btnExport: $("#btnExport"),
  dlg: $("#dlgSaldo"), fSaldoAwal: $("#fSaldoAwal"), btnEditSaldo: $("#btnEditSaldo"),
  btnInstall: $("#btnInstall"),
};

let type = "out";
let deferredPrompt = null;
let db = load();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { saldoAwal: 0, items: [] };
    const j = JSON.parse(raw);
    return { saldoAwal: Number(j.saldoAwal)||0, items: Array.isArray(j.items)?j.items:[] };
  } catch { showError(); return { saldoAwal: 0, items: [] }; }
}
function save() { localStorage.setItem(KEY, JSON.stringify(db)); }
function fmt(n){ return new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(n); }
function parseAmount(s){ return Number(String(s).replace(/[^\d]/g,""))||0; }

function saldoNow(){
  let s = db.saldoAwal;
  for(const it of db.items) s += it.type==="in" ? it.amount : -it.amount;
  return s;
}

function render(){
  const s = saldoNow();
  els.saldoAngka.textContent = fmt(s);
  els.saldoAngka.style.color = s < 0 ? "var(--danger)" : "var(--accent)";
  const pct = db.saldoAwal ? Math.max(4, Math.min(100, (s/db.saldoAwal)*100)) : (s>0?60:8);
  els.saldoBar.style.width = pct+"%";
  els.saldoBar.style.background = s < 0 ? "var(--danger)" : "var(--accent)";
  els.saldoMeta.textContent = `Saldo awal ${fmt(db.saldoAwal)} \u00B7 ${db.items.length} transaksi \u00B7 sisa ${fmt(s)}`;

  const q = els.q.value.trim().toLowerCase();
  const cat = els.filterCat.value;
  let filtered = db.items.slice().sort((a,b)=> b.date.localeCompare(a.date));
  if(q) filtered = filtered.filter(x=> (x.title+" "+x.cat).toLowerCase().includes(q));
  if(cat) filtered = filtered.filter(x=> x.cat===cat);

  els.list.innerHTML = "";
  if(!filtered.length){
    els.sEmpty.hidden = db.items.length ? true : false;
    els.sLoading.hidden = true;
    els.sError.hidden = true;
    if(db.items.length) {
      els.list.innerHTML = `<li class="state">Tidak ada hasil untuk filter ini.</li>`;
      els.sEmpty.hidden = true;
    }
  } else {
    els.sEmpty.hidden = true; els.sLoading.hidden = true; els.sError.hidden = true;
    for(const it of filtered){
      const li = document.createElement("li");
      li.className = "row";
      li.innerHTML = `
        <div class="row-main">
          <p class="row-title">${esc(it.title)}</p>
          <p class="row-meta">${esc(it.cat)} \u00B7 ${esc(it.date)}</p>
        </div>
        <div style="display:flex;align-items:center;gap:8px">
          <span class="row-amount ${it.type}">${it.type==="in"?"+":"\u2212"}${fmt(it.amount)}</span>
          <div class="row-actions">
            <button class="icon-btn" aria-label="Hapus ${esc(it.title)}" data-del="${it.id}">\u00D7</button>
          </div>
        </div>`;
      els.list.appendChild(li);
    }
  }
  const sumIn = filtered.filter(x=>x.type==="in").reduce((a,b)=>a+b.amount,0);
  const sumOut = filtered.filter(x=>x.type==="out").reduce((a,b)=>a+b.amount,0);
  els.totalRow.textContent = filtered.length ? `Masuk ${fmt(sumIn)} \u00B7 Keluar ${fmt(sumOut)}` : "";
}

function esc(s){ return String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c])); }
function showError(){ els.sError.hidden=false; els.sLoading.hidden=true; }

function setType(t){
  type=t;
  const out = t==="out";
  els.tabOut.classList.toggle("active", out); els.tabOut.setAttribute("aria-selected", String(out));
  els.tabIn.classList.toggle("active", !out); els.tabIn.setAttribute("aria-selected", String(!out));
  els.btnSubmit.textContent = out ? "Catat pengeluaran" : "Catat pemasukan";
  // default kategori ikut tipe
  if(out && ["Gaji","Hadiah"].includes(els.fCat.value)) els.fCat.value="Lainnya";
  if(!out && !["Gaji","Hadiah","Lainnya"].includes(els.fCat.value)) els.fCat.value="Gaji";
}

els.tabOut.addEventListener("click", ()=>setType("out"));
els.tabIn.addEventListener("click", ()=>setType("in"));

els.fAmount.addEventListener("input", e=>{
  const n = parseAmount(e.target.value);
  e.target.value = n ? new Intl.NumberFormat("id-ID").format(n) : "";
});
els.fSaldoAwal.addEventListener("input", e=>{
  const n = parseAmount(e.target.value);
  e.target.value = n ? new Intl.NumberFormat("id-ID").format(n) : "";
});

els.form.addEventListener("submit", e=>{
  e.preventDefault();
  els.eTitle.textContent=""; els.eAmount.textContent=""; els.formMsg.textContent=""; els.formMsg.className="form-msg";
  const title = els.fTitle.value.trim();
  const amount = parseAmount(els.fAmount.value);
  const cat = els.fCat.value;
  const date = els.fDate.value;
  let ok=true;
  if(!title){ els.eTitle.textContent="Isi nama barang atau sumber."; ok=false; }
  if(!amount){ els.eAmount.textContent="Isi jumlah dengan angka."; ok=false; }
  if(!date){ els.formMsg.textContent="Pilih tanggal."; els.formMsg.classList.add("error"); ok=false; }
  if(!ok) return;
  db.items.push({ id: String(Date.now()), title, amount, cat, date, type });
  save(); render();
  els.form.reset();
  // keep date today
  els.fDate.valueAsDate = new Date();
  setType(type);
  els.formMsg.textContent = type==="out" ? "Pengeluaran tercatat." : "Pemasukan tercatat.";
  els.fTitle.focus();
});

els.list.addEventListener("click", e=>{
  const b = e.target.closest("[data-del]");
  if(!b) return;
  const id=b.getAttribute("data-del");
  db.items = db.items.filter(x=>x.id!==id);
  save(); render();
});

els.q.addEventListener("input", render);
els.filterCat.addEventListener("change", render);
els.btnRetry.addEventListener("click", ()=>{ db=load(); render(); });
els.btnExport.addEventListener("click", ()=>{
  const blob=new Blob([JSON.stringify(db,null,2)],{type:"application/json"});
  const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download="bukukas.json"; a.click();
  URL.revokeObjectURL(a.href);
});

els.btnEditSaldo.addEventListener("click", ()=>{
  els.fSaldoAwal.value = db.saldoAwal ? new Intl.NumberFormat("id-ID").format(db.saldoAwal) : "";
  if(typeof els.dlg.showModal==="function") els.dlg.showModal(); else els.dlg.setAttribute("open","");
});
els.dlg.addEventListener("close", ()=>{
  if(els.dlg.returnValue!=="save") return;
  db.saldoAwal = parseAmount(els.fSaldoAwal.value);
  save(); render();
});
els.dlg.addEventListener("click", e=>{
  const r=els.dlg.getBoundingClientRect();
  if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom) els.dlg.close("cancel");
});
document.addEventListener("keydown", e=>{ if(e.key==="Escape" && els.dlg.open) els.dlg.close("cancel"); });

// PWA install
window.addEventListener("beforeinstallprompt", e=>{ e.preventDefault(); deferredPrompt=e; els.btnInstall.hidden=false; });
els.btnInstall.addEventListener("click", async()=>{
  if(!deferredPrompt) return;
  deferredPrompt.prompt(); await deferredPrompt.userChoice; deferredPrompt=null; els.btnInstall.hidden=true;
});
if("serviceWorker" in navigator) navigator.serviceWorker.register("./sw.js").catch(()=>{});

// init
els.fDate.valueAsDate = new Date();
setType("out");
render();

// minimal self-check (no framework): saldo math
console.assert(saldoNow() === (db.saldoAwal + db.items.reduce((a,b)=>a+(b.type==="in"?b.amount:-b.amount),0)), "saldo math broken");
