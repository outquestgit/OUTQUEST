/* TAXONOMY DATA — including Life Direction & Outcome Goal */
const TAX_DATA={
  /* CATEGORY — matches frontend page-* IDs and nav links */
  'tax-category':{label:'Category',rows:[
    ['Work Abroad','work-abroad',true],
    ['Move Abroad','relocate-abroad',true],
    ['Get Certified','earn-skill',true],
    ['Start a Side Hustle','side-hustle',true],
    ['Start a Business','start-business',true],
    ['Level Up (Upskill)','level-income',true],
  ]},
  /* COUNTRY */
  'tax-country':{label:'Country',rows:[
    ['Indonesia','indonesia',true],['Japan','japan',true],['Thailand','thailand',true],
    ['Portugal','portugal',true],['France','france',true],['Colombia','colombia',true],
    ['Nepal','nepal',true],['Morocco','morocco',true],['Worldwide','worldwide',true],
  ]},
  /* BUDGET — matches frontend filter values: lean / comfortable / premium */
  'tax-budget':{label:'Budget',rows:[
    ['Lean ($) — under $1,000/mo','lean',true],
    ['Comfortable ($$) — $1,000–$2,500/mo','comfortable',true],
    ['Premium ($$$) — $2,500+/mo','premium',false],
  ]},
  /* DURATION — matches frontend: short / medium / long / ongoing */
  'tax-duration':{label:'Duration',rows:[
    ['Under 2 months','short',true],
    ['2–6 months','medium',true],
    ['Long-term (6+ months)','long',true],
    ['Ongoing / No fixed end','ongoing',true],
  ]},
  /* DIFFICULTY — matches frontend: easy / moderate / hard */
  'tax-difficulty':{label:'Difficulty',rows:[
    ['Easy','easy',true],
    ['Moderate','moderate',true],
    ['Hard','hard',true],
  ]},
  /* DELIVERY MODE — matches frontend: inperson / remotefriendly / online */
  'tax-delivery':{label:'Delivery Mode',rows:[
    ['In person','inperson',true],
    ['Remote-friendly','remotefriendly',true],
    ['Online','online',true],
    ['Hybrid','hybrid',true],
  ]},
  /* LIFE DIRECTION — matches frontend data values: abroad / newlife / upgrade */
  'tax-life-direction':{label:'Life Direction',rows:[
    ['Move Abroad','abroad',true],
    ['Try a New Life','newlife',true],
    ['Level Up / Upgrade','upgrade',true],
  ]},
  /* OUTCOME GOAL — matches frontend filter values exactly */
  'tax-outcome-goal':{label:'Outcome Goal',rows:[
    ['Learn a skill','learn-skill',true],
    ['Gain experience','gain-experience',true],
    ['Meet people','meet-people',true],
    ['Wellness','wellness',true],
    ['Adventure','adventure',true],
    ['Relocate','relocate',true],
    ['Earn income','earn-income',true],
    ['Build a portfolio','build-portfolio',true],
    ['Career change','career-change',true],
    ['Explore a path','explore-path',true],
  ]},
  'tax-journal-cat':{label:'Journal Category',rows:[['Travel Tips','travel-tips',true],['Guides','guides',true],['Budget Travel','budget-travel',true],['Stories','stories',false]]},
};
/* ── TAX_DYNAMIC: taxonomies that auto-generate frontend landing pages ── */
const TAX_DYNAMIC={
  'tax-country':{prefix:'/locations/',hint:'Each country automatically becomes a page at <code>/locations/[slug]</code> that lists every quest tagged with it. No manual page needed.'},
  'tax-outcome-goal':{prefix:'/outcomes/',hint:'Each outcome goal automatically becomes a page at <code>/outcomes/[slug]</code> that lists every quest tagged with it. No manual page needed.'},
};
function buildTaxPage(key){
  const d=TAX_DATA[key];
  const dyn=TAX_DYNAMIC[key];
  const dynBanner=dyn?`<div style="margin-bottom:0;padding:10px 16px;background:rgba(74,108,247,.06);border-bottom:1px solid rgba(74,108,247,.15);display:flex;align-items:flex-start;gap:9px;font-size:12px;color:var(--muted2);line-height:1.5"><span style="font-size:15px;flex-shrink:0">🔗</span><span>💡 <strong style="color:var(--accent3)">Dynamic landing pages</strong> — ${dyn.hint} Tag quests correctly and the pages populate automatically.</span></div>`:'';
  const slugCol=dyn?`<th>Slug</th><th>Landing Page URL</th>`:`<th>Slug</th>`;
  const rows=d.rows.map(r=>{
    const slugCell=dyn
      ?`<td style="color:var(--muted);font-size:12.5px">${r[1]}</td><td><a href="#" style="color:var(--accent3);font-size:12px;text-decoration:none;display:inline-flex;align-items:center;gap:4px" title="Preview">${dyn.prefix}${r[1]}<span style="font-size:10px;opacity:.6">↗</span></a></td>`
      :`<td style="color:var(--muted);font-size:12.5px">${r[1]}</td>`;
    return`<tr><td><strong>${r[0]}</strong></td>${slugCell}<td>${r[2]?'<span class="status-pill pill-published">Active</span>':'<span class="status-pill pill-draft">Inactive</span>'}</td><td><div class="row-actions"><button class="btn btn-ghost btn-sm" onclick="openTaxEdit('${key}','${r[0]}','${r[1]}')">Edit</button><button class="btn btn-danger btn-sm" onclick="deleteTaxRow(this)">Del</button></div></td></tr>`;
  }).join('');
  return`<div class="table-wrap">${dynBanner}<div class="table-toolbar"><input class="search-box" type="text" placeholder="Search ${d.label.toLowerCase()}…" oninput="filterTaxRows(this)"/><div style="margin-left:auto"><button class="btn btn-primary" onclick="openTaxEdit('${key}','','')">＋ Add New</button></div></div><table><thead><tr><th>Name</th>${slugCol}<th>Status</th><th></th></tr></thead><tbody>${rows}</tbody></table></div>
  <div id="tax-edit-modal-${key}" style="display:none;margin-top:14px">
    <div class="section-card">
      <div class="section-card-header" id="tax-edit-modal-${key}-hdr">Add ${d.label}</div>
      <div class="section-card-body">
        <div class="field-row">
          <div class="field"><label>Name</label><input type="text" id="tax-edit-name-${key}" placeholder="e.g. ${d.rows[0]?d.rows[0][0]:'Name'}" oninput="autoTaxSlug('${key}')"/></div>
          <div class="field"><label>Slug</label><div class="slug-wrap"><span class="slug-prefix">${dyn?dyn.prefix:'/'}</span><input type="text" id="tax-edit-slug-${key}" placeholder="${d.rows[0]?d.rows[0][1]:'slug'}"/></div>${dyn?`<div class="field-hint" style="margin-top:4px">Page will be live at <strong>${dyn.prefix}</strong>[slug]</div>`:''}</div>
        </div>
        <div style="display:flex;gap:8px;margin-top:4px">
          <button class="btn btn-primary btn-sm" onclick="saveTaxRow('${key}')">Save</button>
          <button class="btn btn-ghost btn-sm" onclick="closeTaxEdit('${key}')">Cancel</button>
        </div>
      </div>
    </div>
  </div>`;
}
function autoTaxSlug(key){
  const n=document.getElementById('tax-edit-name-'+key);
  const s=document.getElementById('tax-edit-slug-'+key);
  if(n&&s&&!s.dataset.edited)s.value=n.value.toLowerCase().replace(/[^a-z0-9\s-]/g,'').trim().replace(/\s+/g,'-');
}
function openTaxEdit(key,name,slug){
  const m=document.getElementById('tax-edit-modal-'+key);if(!m)return;
  const hdr=document.getElementById('tax-edit-modal-'+key+'-hdr');
  const nEl=document.getElementById('tax-edit-name-'+key);
  const sEl=document.getElementById('tax-edit-slug-'+key);
  if(hdr)hdr.textContent=name?'Edit '+TAX_DATA[key].label:'Add '+TAX_DATA[key].label;
  if(nEl)nEl.value=name||'';
  if(sEl){sEl.value=slug||'';sEl.dataset.edited=slug?'1':'';}
  m.style.display='block';m.scrollIntoView({behavior:'smooth',block:'nearest'});
}
function closeTaxEdit(key){const m=document.getElementById('tax-edit-modal-'+key);if(m)m.style.display='none';}
function saveTaxRow(key){
  const n=document.getElementById('tax-edit-name-'+key);
  const s=document.getElementById('tax-edit-slug-'+key);
  if(!n||!n.value.trim()){alert('Name is required.');return;}
  showToast('"'+n.value.trim()+'" saved.');
  closeTaxEdit(key);
}
function deleteTaxRow(btn){
  const row=btn.closest('tr');
  const name=row.querySelector('td strong');
  if(!confirm('Delete "'+(name?name.textContent:'this item')+'"? Any quests tagged with it will lose this tag.'))return;
  row.remove();
  showToast('Term deleted.');
}
function filterTaxRows(input){
  const val=input.value.toLowerCase();
  input.closest('.table-wrap').querySelectorAll('tbody tr').forEach(tr=>{
    tr.style.display=tr.textContent.toLowerCase().includes(val)?'':'none';
  });
}
Object.keys(TAX_DATA).forEach(k=>{const el=document.getElementById(k+'-inner');if(el)el.innerHTML=buildTaxPage(k);});

/* PAGE META */
const PAGE_META={
  'dashboard':{title:'Dashboard',breadcrumb:'Overview'},
  'quests-list':{title:'Quests',breadcrumb:'Content / Quests',actions:`<button class="btn btn-primary" onclick="nav('quests-edit')">＋ New Quest</button>`},
  'quests-edit':{title:'Edit Quest',breadcrumb:'Content / Quests / Edit',actions:`<button class="btn btn-ghost" onclick="nav('quests-list')">← Back</button>`},
  'deals-list':{title:'Deals',breadcrumb:'Content / Deals',actions:`<button class="btn btn-primary" onclick="nav('deals-edit')">＋ New Deal</button>`},
  'deals-edit':{title:'Edit Deal',breadcrumb:'Content / Deals / Edit',actions:`<button class="btn btn-ghost" onclick="nav('deals-list')">← Back</button>`},
  'journal-list':{title:'Journal',breadcrumb:'Content / Journal',actions:`<button class="btn btn-primary" onclick="nav('journal-edit')">＋ New Post</button>`},
  'journal-edit':{title:'Edit Post',breadcrumb:'Content / Journal / Edit',actions:`<button class="btn btn-ghost" onclick="nav('journal-list')">← Back</button>`},

  'quiz-builder':{title:'Quiz Builder',breadcrumb:'Content / Quiz Builder',actions:`<button class="btn btn-ghost btn-sm">👁 Preview</button>`},
  'pcms-homepage':{title:'Homepage',breadcrumb:'Pages CMS / Homepage',actions:`<button class="btn btn-ghost btn-sm">👁 Preview</button>`},
  'pcms-quests':{title:'Quests / Explore',breadcrumb:'Pages CMS / Quests',actions:`<button class="btn btn-ghost btn-sm">👁 Preview</button>`},
  'pcms-deals':{title:'Deals / Marketplace',breadcrumb:'Pages CMS / Deals',actions:`<button class="btn btn-ghost btn-sm">👁 Preview</button>`},
  'pcms-journal':{title:'Journal',breadcrumb:'Pages CMS / Journal',actions:`<button class="btn btn-ghost btn-sm">👁 Preview</button>`},
  'pcms-about':{title:'About',breadcrumb:'Pages CMS / About',actions:`<button class="btn btn-ghost btn-sm">👁 Preview</button>`},
  'pcms-partners':{title:'Partners',breadcrumb:'Pages CMS / Partners',actions:`<button class="btn btn-ghost btn-sm">👁 Preview</button>`},
  'pcms-faq':{title:'FAQ',breadcrumb:'Pages CMS / FAQ',actions:`<button class="btn btn-ghost btn-sm">👁 Preview</button>`},
  'pcms-privacy':{title:'Privacy',breadcrumb:'Pages CMS / Privacy',actions:`<button class="btn btn-ghost btn-sm">👁 Preview</button>`},
  'pcms-terms':{title:'Terms',breadcrumb:'Pages CMS / Terms',actions:`<button class="btn btn-ghost btn-sm">👁 Preview</button>`},
  'pcms-contact':{title:'Contact',breadcrumb:'Pages CMS / Contact',actions:`<button class="btn btn-ghost btn-sm">👁 Preview</button>`},
  'pcms-cat-pages':{title:'Category Pages',breadcrumb:'Pages CMS / Category Pages'},
  'pcms-cat-work-abroad':{title:'Work Abroad Page',breadcrumb:'Pages CMS / Work Abroad',actions:`<button class="btn btn-ghost btn-sm">👁 Preview</button>`},
  'pcms-cat-move-abroad':{title:'Move Abroad Page',breadcrumb:'Pages CMS / Move Abroad',actions:`<button class="btn btn-ghost btn-sm">👁 Preview</button>`},
  'pcms-cat-get-certified':{title:'Get Certified Page',breadcrumb:'Pages CMS / Get Certified',actions:`<button class="btn btn-ghost btn-sm">👁 Preview</button>`},
  'pcms-cat-side-hustle':{title:'Side Hustle Page',breadcrumb:'Pages CMS / Side Hustle',actions:`<button class="btn btn-ghost btn-sm">👁 Preview</button>`},
  'pcms-cat-business':{title:'Start a Business Page',breadcrumb:'Pages CMS / Start a Business',actions:`<button class="btn btn-ghost btn-sm">👁 Preview</button>`},
  'pcms-cat-level-up':{title:'Level Up Page',breadcrumb:'Pages CMS / Level Up',actions:`<button class="btn btn-ghost btn-sm">👁 Preview</button>`},
  'tax-category':{title:'Category',breadcrumb:'Taxonomies / Category'},
  'tax-country':{title:'Country',breadcrumb:'Taxonomies / Country'},
  'tax-budget':{title:'Budget',breadcrumb:'Taxonomies / Budget'},
  'tax-duration':{title:'Duration',breadcrumb:'Taxonomies / Duration'},
  'tax-difficulty':{title:'Difficulty',breadcrumb:'Taxonomies / Difficulty'},
  'tax-delivery':{title:'Delivery Mode',breadcrumb:'Taxonomies / Delivery Mode'},
  'tax-life-direction':{title:'Life Direction',breadcrumb:'Taxonomies / Life Direction'},
  'tax-outcome-goal':{title:'Outcome Goal',breadcrumb:'Taxonomies / Outcome Goal'},
  'tax-journal-cat':{title:'Journal Category',breadcrumb:'Taxonomies / Journal Category'},
  'leads':{title:'Leads',breadcrumb:'CRM / Leads',actions:`<button class="btn btn-ghost">Export CSV</button>`},
  'settings':{title:'Settings',breadcrumb:'System / Settings'},
  'nav-menu':{title:'Nav Menu',breadcrumb:'Content / Nav Menu'},
  'footer':{title:'Footer',breadcrumb:'Content / Footer'},
  'auth-login':{title:'Auth — Login',breadcrumb:'Auth Pages / Login'},
  'auth-forgot':{title:'Auth — Forgot Password',breadcrumb:'Auth Pages / Forgot Password'},
  'auth-reset':{title:'Auth — Reset Password',breadcrumb:'Auth Pages / Reset Password'},
};

// ── SPA URL sync ──────────────────────────────────────────────────────────
// nav() historically left the address bar untouched, so a refresh reloaded
// "/admin" (the Dashboard) and lost the visitor's place. Mirror the current
// section into `?p=<page>` so a refresh stays put. We use replaceState
// (preserving Next's router state) rather than pushState so we don't add bogus
// Back-button entries or fight the App Router's history. Transient sections —
// the edit forms (need a selected record) and auth screens (need session
// context) — keep the previous URL so a refresh returns to their list/origin.
var _navNoSync={'quests-edit':1,'deals-edit':1,'journal-edit':1,'auth-login':1,'auth-forgot':1,'auth-reset':1};
function _navSyncUrl(page){
  try{
    var url=(!page||page==='dashboard')?location.pathname:location.pathname+'?p='+encodeURIComponent(page);
    if(location.pathname+location.search!==url) history.replaceState(history.state,'',url);
  }catch(e){}
}
function nav(page){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  const t=document.getElementById('page-'+page);if(t)t.classList.add('active');
  if(!_navNoSync[page]) _navSyncUrl(page);
  document.querySelectorAll('.nav-item').forEach(n=>{n.classList.remove('active');const oc=n.getAttribute('onclick')||'';const np=n.getAttribute('data-nav-page');if(np===page||oc.includes("'"+page+"'")||oc.includes('"'+page+'"'))n.classList.add('active');});
  if(page.startsWith('tax-')){document.getElementById('tax-sub').classList.remove('collapsed');document.getElementById('tax-toggle').classList.add('open');}
  if(page.startsWith('pcms-')){document.getElementById('pages-cms-sub').classList.remove('collapsed');document.getElementById('pages-cms-toggle').classList.add('open');}
  const meta=PAGE_META[page]||{title:page,breadcrumb:''};
  document.getElementById('header-title').textContent=meta.title;
  document.getElementById('header-breadcrumb').textContent=meta.breadcrumb;
  const ha=document.getElementById('header-actions');
  ha.innerHTML=(meta.actions||'')+`<button class="btn-icon">🔔</button><button class="btn-icon">🔍</button>`;
  ha.querySelectorAll('button[onclick]').forEach(b=>{const a=b.getAttribute('onclick');b.removeAttribute('onclick');b.addEventListener('click',()=>eval(a));});
}
function toggleTax(){document.getElementById('tax-sub').classList.toggle('collapsed');document.getElementById('tax-toggle').classList.toggle('open');}

function togglePagesCms(){
  document.getElementById('pages-cms-sub').classList.toggle('collapsed');
  document.getElementById('pages-cms-toggle').classList.toggle('open');
}

function deletePcmsSection(btn){
  var card = btn.closest('.pcms-section-card');
  if(!card) return;
  var name = card.querySelector('.pcms-section-name');
  var label = name ? name.textContent.trim() : 'this section';
  if(!confirm('Delete "' + label + '"?\n\nThis removes it from the admin view. The frontend will hide it automatically when show is toggled off — for permanent removal, save and deploy.')) return;
  // Animate out then remove
  card.style.transition = 'opacity .2s, max-height .3s, margin .3s, padding .3s';
  card.style.overflow = 'hidden';
  card.style.opacity = '0';
  card.style.maxHeight = card.offsetHeight + 'px';
  setTimeout(function(){
    card.style.maxHeight = '0';
    card.style.marginBottom = '0';
  }, 200);
  setTimeout(function(){
    card.remove();
  }, 520);
}

// Legal / rich-text editor helpers
function deletePcmsInlineCard(btn, cardId){
  // Walk up from the button to find the surrounding card group
  // The persona/card blocks are separated by pcms-section-divider elements
  // Strategy: hide everything between this divider and the next sibling divider
  var divider = btn.closest('.pcms-section-divider');
  if(!divider) return;
  var name = divider.textContent.replace('× Remove','').trim();
  if(!confirm('Remove "' + name + '" card?\nThis hides it from the section. Frontend will reflow automatically.')) return;
  // Collect all sibling nodes until the next pcms-section-divider
  var parent = divider.parentNode;
  var siblings = Array.from(parent.children);
  var idx = siblings.indexOf(divider);
  var toHide = [divider];
  for(var i = idx + 1; i < siblings.length; i++){
    if(siblings[i].classList && siblings[i].classList.contains('pcms-section-divider')) break;
    toHide.push(siblings[i]);
  }
  toHide.forEach(function(el){
    el.style.transition = 'opacity .2s';
    el.style.opacity = '0';
    setTimeout(function(){ el.style.display = 'none'; }, 220);
  });
}

function legalExec(editorId, cmd){
  var el = document.getElementById(editorId);
  if(!el) return;
  el.focus();
  document.execCommand(cmd, false, null);
}
function legalHeading(editorId, tag){
  var el = document.getElementById(editorId);
  if(!el) return;
  el.focus();
  document.execCommand('formatBlock', false, tag);
}
function legalLink(editorId){
  var url = prompt('Enter URL:','https://');
  if(!url) return;
  var el = document.getElementById(editorId);
  if(!el) return;
  el.focus();
  document.execCommand('createLink', false, url);
}

function togglePcmsSection(header){
  const body = header.closest('.pcms-section-card').querySelector('.pcms-section-body');
  const chev = header.querySelector('.chevron');
  body.classList.toggle('open');
  if(body.classList.contains('open')){chev.style.transform='rotate(90deg)';}else{chev.style.transform='';}
}

function setPcmsStatus(btn, status){
  const wrap = btn.closest('.pcms-status-toggle');
  wrap.querySelectorAll('button').forEach(b=>{b.classList.remove('active-pub','active-dft');});
  btn.classList.add(status==='published'?'active-pub':'active-dft');
  // Update pill in header
  const card = btn.closest('.pcms-section-card');
  const pill = card.querySelector('.pcms-status-pill');
  if(pill){pill.className='pcms-status-pill '+(status==='published'?'published':'draft');pill.textContent=status==='published'?'Published':'Draft';}
}
function togglePw(iId,bId){const i=document.getElementById(iId),b=document.getElementById(bId);i.type=i.type==='password'?'text':'password';b.textContent=i.type==='password'?'👁':'🙈';}
function autoSlug(tId,sId){const t=document.getElementById(tId),s=document.getElementById(sId);if(!t||!s)return;s.value=t.value.toLowerCase().replace(/[^a-z0-9\s-]/g,'').trim().replace(/\s+/g,'-');}
function setStatus(wId,state,btn){const w=document.getElementById(wId);w.querySelectorAll('button').forEach(b=>b.className='');btn.className=state==='draft'?'active-draft':'active-published';}

/* ── CUSTOM DATE PICKER ── */
(function(){
  var pickers={};

  function initPicker(id){
    if(pickers[id]) return;
    var stored=document.getElementById(id+'-date-value');
    var d=stored&&stored.value?new Date(stored.value):new Date();
    if(isNaN(d)) d=new Date();
    pickers[id]={year:d.getFullYear(),month:d.getMonth(),selected:stored&&stored.value?new Date(stored.value):null};
    renderGrid(id);
  }

  function renderGrid(id){
    var p=pickers[id];
    var months=['January','February','March','April','May','June','July','August','September','October','November','December'];
    var lbl=document.getElementById(id+'-dp-label');
    if(lbl) lbl.textContent=months[p.month]+' '+p.year;
    var grid=document.getElementById(id+'-dp-grid');
    if(!grid) return;
    var today=new Date(); today.setHours(0,0,0,0);
    var first=new Date(p.year,p.month,1).getDay();
    var daysInMonth=new Date(p.year,p.month+1,0).getDate();
    var daysInPrev=new Date(p.year,p.month,0).getDate();
    var html='';
    // previous month tail
    for(var i=0;i<first;i++){
      var day=daysInPrev-first+1+i;
      html+='<button class="dp-day other-month" onclick="dpSelect(\''+id+'\','+new Date(p.year,p.month-1,day).getTime()+')">'+day+'</button>';
    }
    // current month
    for(var d2=1;d2<=daysInMonth;d2++){
      var dt=new Date(p.year,p.month,d2);
      var isSel=p.selected&&dt.toDateString()===p.selected.toDateString();
      var isToday=dt.toDateString()===today.toDateString();
      var cls='dp-day'+(isSel?' selected':'')+(isToday&&!isSel?' today':'');
      html+='<button class="'+cls+'" onclick="dpSelect(\''+id+'\','+dt.getTime()+')">'+d2+'</button>';
    }
    // next month fill
    var cells=first+daysInMonth;
    var rem=(7-cells%7)%7;
    for(var n=1;n<=rem;n++){
      html+='<button class="dp-day other-month" onclick="dpSelect(\''+id+'\','+new Date(p.year,p.month+1,n).getTime()+')">'+n+'</button>';
    }
    grid.innerHTML=html;
  }

  window.toggleDatePicker=function(id){
    initPicker(id);
    var wrap=document.getElementById(id+'-date-wrap');
    var isOpen=wrap.classList.contains('open');
    // close all open pickers
    document.querySelectorAll('.date-picker-wrap.open').forEach(function(el){el.classList.remove('open');});
    if(!isOpen) wrap.classList.add('open');
  };

  window.dpShift=function(id,dir){
    initPicker(id);
    var p=pickers[id];
    p.month+=dir;
    if(p.month>11){p.month=0;p.year++;}
    if(p.month<0){p.month=11;p.year--;}
    renderGrid(id);
  };

  window.dpSelect=function(id,ts){
    initPicker(id);
    var p=pickers[id];
    var dt=new Date(ts);
    p.selected=dt;
    p.year=dt.getFullYear();
    p.month=dt.getMonth();
    // update display
    var dd=String(dt.getDate()).padStart(2,'0');
    var mm=String(dt.getMonth()+1).padStart(2,'0');
    var yyyy=dt.getFullYear();
    var textEl=document.getElementById(id+'-date-text');
    if(textEl) textEl.textContent=dd+'/'+mm+'/'+yyyy;
    var valEl=document.getElementById(id+'-date-value');
    if(valEl) valEl.value=yyyy+'-'+mm+'-'+dd;
    renderGrid(id);
    // close
    var wrap=document.getElementById(id+'-date-wrap');
    if(wrap) wrap.classList.remove('open');
  };

  // Close when clicking outside
  document.addEventListener('click',function(e){
    if(!e.target.closest('.date-picker-wrap')){
      document.querySelectorAll('.date-picker-wrap.open').forEach(function(el){el.classList.remove('open');});
    }
  });
})();
function switchTab(tabsId,panelsId,idx){document.getElementById(tabsId).querySelectorAll('.tab').forEach((t,i)=>t.classList.toggle('active',i===idx));document.getElementById(panelsId).querySelectorAll('.tab-panel').forEach((p,i)=>p.classList.toggle('active',i===idx));}

/* ── SCHEDULE POST ── */
function toggleSchedFields(chk){
  const fields=document.getElementById('sched-fields');
  if(fields) fields.classList.toggle('hidden',!chk.checked);
  if(chk.checked){
    // init the schedule date picker to today if not set
    if(typeof toggleDatePicker==='function') setTimeout(()=>{ if(!document.getElementById('sched-date-value').value) dpSelect('sched',Date.now()); },10);
  }
}
function confirmSchedule(){
  const dateVal=document.getElementById('sched-date-value').value;
  const hour=document.getElementById('sched-hour').value;
  const min=document.getElementById('sched-min').value;
  if(!dateVal){showToast('Please pick a date first.');return;}
  const tzSel=document.getElementById('sched-tz');
  const tz=tzSel?((tzSel.options[tzSel.selectedIndex].text.match(/UTC[^\s]*/)||[''])[0]):'';
  const p=dateVal.split('-');
  const months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const label=`${Number(p[2])} ${months[Number(p[1])-1]} ${p[0]} at ${hour}:${min}${tz?' '+tz:''}`;
  const bar=document.getElementById('sched-confirm-bar');
  const sum=document.getElementById('sched-summary');
  if(bar){bar.style.display='flex';sum.textContent=label;}
  showToast('📅 Scheduled for '+label);
}
function fmt(cmd,val){document.execCommand(cmd,false,val||null);}
function removeItem(btn){btn.closest('.repeater-item,.form-field-item').remove();}
function switchAction(val){['affiliate','form','direct'].forEach(t=>{const el=document.getElementById('action-'+t);if(el)el.classList.toggle('visible',t===val);});}
function handleFieldType(sel){const s=sel.closest('.form-field-item').querySelector('.options-sub');if(s)s.style.display=['dropdown','radio','checkbox'].includes(sel.value)?'flex':'none';}

function addWYG(){const r=document.getElementById('wyg-repeater'),n=r.children.length+1,d=document.createElement('div');d.className='repeater-item';d.innerHTML=`<div class="repeater-item-header"><span class="repeater-drag">⠿</span><span class="repeater-item-title">Item ${n}</span><button class="repeater-remove" onclick="removeItem(this)">×</button></div><div class="field"><label>Title</label><input type="text" placeholder="What the guest receives…"/></div><div class="field"><label>Description</label><input type="text" placeholder="Supporting detail…"/></div>`;r.appendChild(d);}
function addUnlock(){const r=document.getElementById('unlocks-repeater'),n=r.children.length+1,d=document.createElement('div');d.className='repeater-item';d.innerHTML=`<div class="repeater-item-header"><span class="repeater-drag">⠿</span><span class="repeater-item-title">Unlock ${n}</span><button class="repeater-remove" onclick="removeItem(this)">×</button></div><div class="field-row"><div class="field" style="flex:0 0 56px;min-width:0"><label>Icon</label><input type="text" placeholder="🌍" style="font-size:18px;text-align:center;padding:6px 4px" maxlength="8"/></div><div class="field" style="flex:1"><label>Unlock Title</label><input type="text" placeholder="e.g. A new professional skill"/></div></div><div class="field"><label>Detail <span class="opt">optional</span></label><input type="text" placeholder="Short supporting line…"/></div>`;r.appendChild(d);}
function addDealItem(btn){const r=btn.previousElementSibling,n=r.children.length+1,d=document.createElement('div');d.className='repeater-item';d.innerHTML=`<div class="repeater-item-header"><span class="repeater-drag">⠿</span><span class="repeater-item-title">Item ${n}</span><button class="repeater-remove" onclick="removeItem(this)">×</button></div><div class="field-row"><div class="field"><label>Title</label><input type="text" placeholder="e.g. Online Course"/></div><div class="field"><label>CTA Text</label><input type="text" placeholder="e.g. Enroll Now"/></div></div><div class="field"><label>Description</label><textarea rows="2" placeholder="Short description…"></textarea></div><div class="field-row"><div class="field"><label>Link</label><input type="text" placeholder="https://…"/></div><div class="field" style="flex:0 0 64px;min-width:0"><label>Icon</label><input type="text" placeholder="🎓" style="font-size:18px;text-align:center;padding:6px 4px" maxlength="4"/></div></div><div class="field"><label>Image <span class="opt">optional</span></label><div class="img-upload" style="padding:10px"><input type="file" accept="image/*"/><div class="img-upload-label" style="font-size:11.5px">Click to upload deal image</div><div class="img-upload-hint">JPG, PNG · max 2MB</div></div></div>`;r.appendChild(d);}
function addStep(){const r=document.getElementById('steps-repeater'),n=r.children.length+1,d=document.createElement('div');d.className='repeater-item';d.innerHTML=`<div class="repeater-item-header"><span class="repeater-drag">⠿</span><span class="repeater-item-title">Step ${n}</span><button class="repeater-remove" onclick="removeItem(this)">×</button></div><div class="field"><label>Step Title</label><input type="text" placeholder="e.g. Pack your bags"/></div><div class="field"><label>Description</label><textarea rows="2" placeholder="What happens…"></textarea></div>`;r.appendChild(d);}
function addFaqQ(repeaterId){
  const r = document.getElementById(repeaterId);
  if(!r) return;
  const n = r.children.length + 1;
  const d = document.createElement('div');
  d.className = 'repeater-item';
  d.innerHTML = '<div class="repeater-item-header"><span class="repeater-drag">⠿</span><span class="repeater-item-title">Q' + n + '</span><button class="repeater-remove" onclick="removeItem(this)">×</button></div><div class="field"><label>Question</label><input type="text" placeholder="Common question…"/></div><div class="field"><label>Answer</label><textarea rows="3" placeholder="Clear, direct answer…"></textarea></div>';
  r.appendChild(d);
}
function addFAQ(){const r=document.getElementById('faq-repeater'),n=r.children.length+1,d=document.createElement('div');d.className='repeater-item';d.innerHTML=`<div class="repeater-item-header"><span class="repeater-drag">⠿</span><span class="repeater-item-title">FAQ ${n}</span><button class="repeater-remove" onclick="removeItem(this)">×</button></div><div class="field"><label>Question</label><input type="text" placeholder="Common question…"/></div><div class="field"><label>Answer</label><textarea rows="3" placeholder="Clear answer…"></textarea></div>`;r.appendChild(d);}
function addIncluded(){const r=document.getElementById('incl-repeater'),n=r.children.length+1,d=document.createElement('div');d.className='repeater-item';d.innerHTML=`<div class="repeater-item-header"><span class="repeater-drag">⠿</span><span class="repeater-item-title">Item ${n}</span><button class="repeater-remove" onclick="removeItem(this)">×</button></div><div class="field"><label>Item</label><input type="text" placeholder="What's included…"/></div>`;r.appendChild(d);}
function addRequirement(){const r=document.getElementById('req-repeater'),n=r.children.length+1,d=document.createElement('div');d.className='repeater-item';d.innerHTML=`<div class="repeater-item-header"><span class="repeater-drag">⠿</span><span class="repeater-item-title">Requirement ${n}</span><button class="repeater-remove" onclick="removeItem(this)">×</button></div><div class="field"><label>Requirement</label><input type="text" placeholder="e.g. Valid passport with 6+ months validity"/></div>`;r.appendChild(d);}
function addFormField(){const r=document.getElementById('form-fields-repeater'),n=r.children.length+1,d=document.createElement('div');d.className='form-field-item';d.innerHTML=`<div class="repeater-item-header"><span class="repeater-drag">⠿</span><span class="repeater-item-title">Field ${n}</span><button class="repeater-remove" onclick="removeItem(this)">×</button></div><div class="field-row"><div class="field"><label>Label</label><input type="text" placeholder="e.g. Phone Number"/></div><div class="field"><label>Type</label><select onchange="handleFieldType(this)"><option value="text">Short text</option><option value="textarea">Long text</option><option value="email">Email</option><option value="phone">Phone</option><option value="dropdown">Dropdown</option><option value="radio">Radio</option><option value="checkbox">Checkbox</option></select></div></div><div class="field-row"><div class="field"><label>Placeholder <span class="opt">opt.</span></label><input type="text" placeholder="Hint text…"/></div><div class="field" style="justify-content:flex-end;padding-top:16px"><div class="toggle-wrap"><label class="toggle"><input type="checkbox" checked/><span class="toggle-slider"></span></label><span class="toggle-label">Required</span></div></div></div><div class="options-sub" style="display:none"><div style="font-size:11px;color:var(--muted);margin-bottom:4px;font-weight:600">Options</div><button class="add-repeater-btn" style="margin-top:2px" onclick="addOption(this)">＋ Add Option</button></div>`;r.appendChild(d);}
function addOption(btn){const sub=btn.closest('.options-sub'),row=document.createElement('div');row.className='option-row';row.innerHTML=`<input type="text" placeholder="Option…"/><button class="btn btn-danger btn-sm" onclick="this.closest('.option-row').remove()">×</button>`;sub.insertBefore(row,btn);}
function addCard(){const r=document.getElementById('cards-repeater'),n=r.children.length+1,d=document.createElement('div');d.className='repeater-item';d.innerHTML=`<div class="repeater-item-header"><span class="repeater-drag">⠿</span><span class="repeater-item-title">Card ${n}</span><button class="repeater-remove" onclick="removeItem(this)">×</button></div><div class="field"><label>Card Title</label><input type="text" placeholder="Card title…"/></div><div class="field"><label>Card Text</label><textarea rows="2" placeholder="Description…"></textarea></div>`;r.appendChild(d);}
function updateSeoCounter(el,counterId,max){
  const c=document.getElementById(counterId);if(!c)return;
  const len=el.value.length;c.textContent=len+' / '+max;
  c.style.color=len>max?'var(--danger)':len>=max*0.85?'var(--accent)':'var(--muted)';
}
function updateQuestSerpTitle(){
  const el=document.getElementById('q-seo-title');
  const t=document.getElementById('serp-title');
  if(t&&el)t.textContent=el.value||'Your SEO title will appear here';
  // score bar
  const bar=document.getElementById('q-seo-bar');
  const barLbl=document.getElementById('q-seo-bar-label');
  if(bar&&barLbl&&el){
    const len=el.value.length;
    if(len===0){bar.style.background='var(--border)';barLbl.textContent='';}
    else if(len<30){bar.style.background='var(--danger)';barLbl.style.color='var(--danger)';barLbl.textContent='Too short ('+len+')';}
    else if(len<=60){bar.style.background='var(--accent2)';barLbl.style.color='var(--accent2)';barLbl.textContent='Good ('+len+')';}
    else{bar.style.background='var(--accent)';barLbl.style.color='var(--accent)';barLbl.textContent='Too long ('+len+')';}
  }
}
function updateQuestSerpDesc(){
  const el=document.getElementById('q-meta-desc');
  const d=document.getElementById('serp-desc');
  if(d&&el)d.textContent=el.value||'Your meta description will appear here — write something compelling that makes people want to click.';
}
// sync slug to SERP preview
document.addEventListener('DOMContentLoaded',function(){
  const s=document.getElementById('q-slug');
  if(s)s.addEventListener('input',function(){
    const el=document.getElementById('serp-slug');if(el)el.textContent=this.value||'your-quest-slug';
    updateQuestSerpTitle();
  });
  // auto-populate quest SEO title from quest title
  const qt=document.getElementById('q-title');
  if(qt){
    qt.addEventListener('input',function(){
      const seoT=document.getElementById('q-seo-title');
      if(seoT&&!seoT.dataset.edited){
        seoT.value=this.value.trim()?(this.value.trim()+' — OutQuest'):'';
        updateSeoCounter(seoT,'q-seo-title-count',60);
        updateQuestSerpTitle();
      }
    });
  }
  const qst=document.getElementById('q-seo-title');
  if(qst)qst.addEventListener('focus',function(){this.dataset.edited='1';});
});
function updateFeaturedState(cb){
  const warn=document.getElementById('featured-warning');
  const badge=document.getElementById('featured-badge');
  if(!warn||!badge)return;
  // Simulate: pretend 5 are already featured (so toggling on is fine, a 6th would cap it)
  if(cb.checked){warn.style.display='none';badge.style.display='flex';}
  else{badge.style.display='none';warn.style.display='none';}
}
function addNavLink(){
  const r=document.getElementById('nav-links-repeater'),n=r.children.length+1,d=document.createElement('div');
  d.className='repeater-item nav-link-item';
  d.innerHTML=`<div class="repeater-item-header"><span class="repeater-drag">⠿</span><span class="repeater-item-title">Link ${n}</span><button class="repeater-remove" onclick="removeItem(this)">×</button></div>`
    +`<div class="field-row"><div class="field"><label>Label</label><input type="text" class="nav-label" placeholder="e.g. Contact"/></div><div class="field"><label>URL</label><input type="text" class="nav-url" placeholder="/contact"/></div></div>`
    +`<div class="field-row"><div class="field"><label>Open in</label><select class="nav-target"><option value="_self">Same tab</option><option value="_blank">New tab</option></select></div><div class="field" style="justify-content:flex-end;padding-top:16px"><div class="toggle-wrap"><label class="toggle"><input type="checkbox" class="nav-has-dd" onchange="toggleNavDropdown(this)"/><span class="toggle-slider"></span></label><span class="toggle-label">Has dropdown</span></div></div></div>`
    +`<div class="nav-dd-block" style="display:none;margin-top:8px;padding:10px 12px;background:var(--surface2);border:1px solid var(--border);border-radius:8px"><div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);margin-bottom:8px">Dropdown Items</div><div class="repeater nav-dd-list"></div><button class="add-repeater-btn" style="margin-top:6px" onclick="addNavDropdownItem(this)">＋ Add Dropdown Item</button></div>`;
  r.appendChild(d);
  return d;
}
function toggleNavDropdown(cb){
  const item=cb.closest('.nav-link-item');if(!item)return;
  const block=item.querySelector('.nav-dd-block');if(!block)return;
  if(cb.checked){
    block.style.display='';
    if(block.querySelector('.nav-dd-list').children.length===0)addNavDropdownItem(block.querySelector('button'));
  }else{
    block.style.display='none';
  }
}
function addNavDropdownItem(btn){
  const list=btn.previousElementSibling,d=document.createElement('div');
  d.className='repeater-item nav-dd-item';d.style.padding='9px 11px';
  d.innerHTML=`<div class="field-row"><div class="field"><label style="font-size:10.5px">Label</label><input type="text" class="nav-dd-label" placeholder="Dropdown label…"/></div><div class="field"><label style="font-size:10.5px">URL</label><input type="text" class="nav-dd-url" placeholder="/path"/></div><button class="repeater-remove" onclick="removeItem(this)" style="margin-top:20px">×</button></div>`;
  list.appendChild(d);
  return d;
}
function addFooterColumn(){
  const r=document.getElementById('footer-cols-repeater'),n=r.children.length+1;
  if(n>4){alert('Maximum 4 columns allowed.');return;}
  const d=document.createElement('div');d.className='repeater-item';
  d.innerHTML=`<div class="repeater-item-header"><span class="repeater-drag">⠿</span><span class="repeater-item-title">Column ${n}</span><button class="repeater-remove" onclick="removeItem(this)">×</button></div><div class="field"><label>Column Heading</label><input type="text" placeholder="e.g. Resources"/></div><div class="repeater" style="margin-top:6px"></div><button class="add-repeater-btn" style="margin-top:6px" onclick="addFooterLink(this)">＋ Add Link</button>`;
  r.appendChild(d);
}
function addFooterLink(btn){
  const col=btn.previousElementSibling,d=document.createElement('div');
  d.className='repeater-item';d.style.padding='9px 11px';
  d.innerHTML=`<div class="field-row"><div class="field"><label style="font-size:10.5px">Label</label><input type="text" placeholder="Link label…"/></div><div class="field"><label style="font-size:10.5px">URL</label><input type="text" placeholder="/path"/></div><button class="repeater-remove" onclick="removeItem(this)" style="margin-top:20px">×</button></div>`;
  col.appendChild(d);
}
function previewBrandAsset(input,imgId,areaId){
  const file=input.files[0];if(!file)return;
  const reader=new FileReader();
  reader.onload=e=>{
    const img=document.getElementById(imgId);
    const area=document.getElementById(areaId);
    img.src=e.target.result;img.style.display='block';
    // hide placeholder text
    const icon=area.querySelector('.img-upload-icon');
    const lbl=area.querySelector('.img-upload-label');
    if(icon)icon.style.display='none';
    if(lbl)lbl.style.display='none';
  };
  reader.readAsDataURL(file);
}
function toggleCmsSection(bar){const c=bar.nextElementSibling;if(c)c.classList.toggle('collapsed');}
function addCmsSection(label,type){const r=document.getElementById('cms-sections'),d=document.createElement('div');d.className='cms-section-item';d.innerHTML=`<div class="cms-section-bar" onclick="toggleCmsSection(this)"><span class="repeater-drag">⠿</span><span class="cms-section-bar-title">${label}</span><span class="section-type-badge">${type}</span><button class="repeater-remove" onclick="event.stopPropagation();this.closest('.cms-section-item').remove()">×</button></div><div class="cms-section-content"><div class="field"><label>Content</label><textarea rows="3" placeholder="Edit ${label} content…"></textarea></div></div>`;r.appendChild(d);}
function openLead(name,email,quest,deal,status,date,answers){
  document.getElementById('lm-name').textContent=name;
  document.getElementById('lm-email').textContent=email;
  document.getElementById('lm-quest').textContent=quest;
  document.getElementById('lm-deal').textContent=deal;
  document.getElementById('lm-date').textContent=date;
  const pm={'New':'pill-new','Contacted':'pill-contacted','Closed':'pill-closed'};
  document.getElementById('lm-status-pill').innerHTML=`<span class="status-pill ${pm[status]||''}">${status}</span>`;
  document.getElementById('lm-answers').innerHTML=answers.map(([q,a])=>`<div class="lead-answer-block"><div style="font-size:11px;color:var(--muted);font-weight:700;margin-bottom:4px;text-transform:uppercase;letter-spacing:.04em">${q}</div><div style="font-size:13px;color:var(--text)">${a}</div></div>`).join('');
  document.getElementById('lead-modal').classList.add('open');
}
function closeLead(){document.getElementById('lead-modal').classList.remove('open');}

/* ── PASSWORD REVEAL ── */
function togglePwField(id,btn){
  const i=document.getElementById(id);if(!i)return;
  i.type=i.type==='password'?'text':'password';
  btn.textContent=i.type==='password'?'👁':'🙈';
}

/* ── SOCIAL DISMISS ── */
function dismissSocial(id){
  const el=document.getElementById(id);if(!el)return;
  el.classList.add('dismissed');
  el.style.display='none';
  document.getElementById('sf-restore-bar').style.display='block';
}
function restoreAllSocial(){
  ['sf-instagram','sf-tiktok','sf-youtube','sf-twitter','sf-facebook','sf-pinterest'].forEach(id=>{
    const el=document.getElementById(id);if(el){el.classList.remove('dismissed');el.style.display='';}
  });
  document.getElementById('sf-restore-bar').style.display='none';
}

/* ── JOURNAL CATEGORIES ── */
function addJournalCategory(){
  const list=document.getElementById('jcat-list'),n=list.children.length+1,d=document.createElement('div');
  d.className='jcat-item';
  const colors=['#e8440a','#4a6cf7','#2a9d6f','#f4a261','#8a8278','#e76f51'];
  const col=colors[n%colors.length];
  d.innerHTML=`<input type="color" class="jcat-color" value="${col}"/><input type="text" placeholder="Category name…" style="background:transparent;border:none;flex:1;padding:0;font-size:13.5px" oninput="updateJcatSlug(this)"/><span style="font-size:11px;color:var(--muted);margin-right:4px" class="jcat-slug">category-slug</span><button class="repeater-remove" onclick="removeItem(this.closest('.jcat-item'))">×</button>`;
  list.appendChild(d);
}
function updateJcatSlug(input){
  const slug=input.nextElementSibling;if(slug)slug.textContent=input.value.toLowerCase().replace(/[^a-z0-9\s-]/g,'').trim().replace(/\s+/g,'-')||'category-slug';
}

/* ── JOURNAL SEO ── */
function updateJournalSeo(input){
  const len=input.value.length;
  const count=document.getElementById('j-seo-title-count');
  const bar=document.getElementById('j-title-bar');
  const hint=document.getElementById('j-title-hint');
  const serpTitle=document.getElementById('j-serp-title');
  if(count) count.textContent=len+' / 60';
  if(serpTitle) serpTitle.textContent=input.value||'Your SEO title will appear here';
  if(bar && hint && count){
    const pct=Math.min(100,(len/60)*100);
    bar.style.width=pct+'%';
    if(len===0){bar.style.background='var(--surface3)';count.style.color='var(--muted)';hint.textContent='Recommended: 50–60 characters';hint.style.color='var(--muted)';}
    else if(len<40){bar.style.background='var(--accent3)';count.style.color='var(--accent3)';hint.textContent='Too short — aim for 50–60 characters';hint.style.color='var(--accent3)';}
    else if(len<=60){bar.style.background='var(--accent2)';count.style.color='var(--accent2)';hint.textContent='✓ Good length';hint.style.color='var(--accent2)';}
    else if(len<=70){bar.style.background='var(--accent)';count.style.color='var(--accent)';hint.textContent='Getting long — Google may truncate';hint.style.color='var(--accent)';}
    else{bar.style.background='var(--danger)';count.style.color='var(--danger)';hint.textContent='Too long — will be cut off in search results';hint.style.color='var(--danger)';}
  }
}
function updateJournalSeoDesc(input){
  const len=input.value.length;
  const count=document.getElementById('j-meta-count');
  const bar=document.getElementById('j-desc-bar');
  const serpDesc=document.getElementById('j-serp-desc');
  if(count) count.textContent=len+' / 160';
  if(serpDesc) serpDesc.textContent=input.value||'Your meta description will appear here — write something that makes people want to read your post.';
  if(bar && count){
    const pct=Math.min(100,(len/160)*100);
    bar.style.width=pct+'%';
    if(len===0){bar.style.background='var(--surface3)';count.style.color='var(--muted)';}
    else if(len<120){bar.style.background='var(--accent3)';count.style.color='var(--accent3)';}
    else if(len<=160){bar.style.background='var(--accent2)';count.style.color='var(--accent2)';}
    else{bar.style.background='var(--danger)';count.style.color='var(--danger)';}
  }
}
function syncJournalSerp(){
  const slug=document.getElementById('j-slug');
  const serpSlug=document.getElementById('j-serp-slug');
  if(slug&&serpSlug) serpSlug.textContent=slug.value||'your-post-slug';
  const title=document.getElementById('j-title');
  const serpTitle=document.getElementById('j-serp-title');
  const seoTitleInput=document.getElementById('j-seo-title');
  if(serpTitle&&title&&(!seoTitleInput||!seoTitleInput.value)){
    serpTitle.textContent=title.value||'Your SEO title will appear here';
  }
}

/* ── RICH TEXT EDITOR ── */
/* The link modal and the image file-picker both move focus out of the
   contenteditable, which throws away the caret. `editor.focus()` afterwards
   puts it back at offset 0 — which is why anything inserted through a dialog
   used to land at the very top of the post. So: snapshot the range *before*
   focus leaves, restore it before inserting. Toolbar buttons additionally
   cancel their mousedown (see JournalEditPage) so they never take focus. */
let _rteEditorId='';
let _rteRange=null;

function _rteEditor(editorId){return document.getElementById(editorId||_rteEditorId);}

/** Snapshot the caret/selection — but only when it really sits inside `editor`. */
function rteSaveSelection(editorId){
  if(editorId) _rteEditorId=editorId;
  _rteRange=null;
  const editor=_rteEditor(editorId);
  const sel=window.getSelection();
  if(!editor||!sel||!sel.rangeCount) return null;
  const r=sel.getRangeAt(0);
  if(!editor.contains(r.commonAncestorContainer)) return null;
  _rteRange=r.cloneRange();
  return _rteRange;
}

/** Put the caret back where it was. With nothing saved, falls back to the end
 *  of the editor — appending beats silently prepending. Returns the live range. */
function rteRestoreSelection(editorId){
  const editor=_rteEditor(editorId);
  if(!editor) return null;
  editor.focus();
  const sel=window.getSelection();
  if(!sel) return null;
  sel.removeAllRanges();
  if(_rteRange&&editor.contains(_rteRange.commonAncestorContainer)){
    sel.addRange(_rteRange);
  }else{
    const end=document.createRange();
    end.selectNodeContents(editor);
    end.collapse(false);
    sel.addRange(end);
  }
  return sel.rangeCount?sel.getRangeAt(0):null;
}

/** Drop `node` at the caret (replacing any selection) and park the caret after it. */
function rteInsertNode(editor,range,node){
  range.deleteContents();
  range.insertNode(node);
  const after=document.createRange();
  after.setStartAfter(node);
  after.collapse(true);
  const sel=window.getSelection();
  if(sel){sel.removeAllRanges();sel.addRange(after);}
  _rteRange=after.cloneRange();
  editor.dispatchEvent(new Event('input',{bubbles:true}));
}

/** Normalizes what the author typed into an href, or '' if it isn't linkable.
 *  Bare hosts get https://; `javascript:` / `data:` and friends are rejected. */
function rteSafeUrl(raw){
  const url=String(raw||'').trim();
  if(!url) return '';
  if(url[0]==='#'||url[0]==='/') return url;
  const scheme=(url.match(/^([a-z][a-z0-9+.-]*):/i)||[])[1];
  if(scheme){
    const s=scheme.toLowerCase();
    if(s==='http'||s==='https'||s==='mailto'||s==='tel') return url;
    // A dot means it's a host with a port ("example.com:8080/x"), not a scheme —
    // fall through and prefix it. Anything else (javascript:, data:, …) is out.
    if(s.indexOf('.')===-1) return '';
  }
  return 'https://'+url;
}

function rteCmd(cmd,val){
  document.execCommand(cmd,false,val||null);
}
function applyBlockFormat(tag,editorId){
  const editor=document.getElementById(editorId);if(!editor)return;
  editor.focus();
  if(tag==='pre'){document.execCommand('formatBlock',false,'pre');}
  else{document.execCommand('formatBlock',false,tag);}
}
function handleRteKeydown(e){
  if(e.key==='Tab'){e.preventDefault();document.execCommand('insertHTML',false,'&nbsp;&nbsp;&nbsp;&nbsp;');}
}
// Link modal
function openLinkModal(editorId){
  rteSaveSelection(editorId);
  const overlay=document.getElementById('link-modal-overlay');
  const textInput=document.getElementById('link-text-input');
  const urlInput=document.getElementById('link-url-input');
  if(textInput) textInput.value=_rteRange?_rteRange.toString():'';
  if(urlInput) urlInput.value='';
  if(overlay) overlay.classList.add('open');
  if(urlInput) setTimeout(()=>urlInput.focus(),0);
}
function closeLinkModal(){
  const overlay=document.getElementById('link-modal-overlay');
  if(overlay) overlay.classList.remove('open');
}
function insertLink(){
  const urlEl=document.getElementById('link-url-input');
  const textEl=document.getElementById('link-text-input');
  const newTabEl=document.getElementById('link-new-tab');
  const url=rteSafeUrl(urlEl?urlEl.value:'');
  const text=(textEl?textEl.value:'').trim();
  const newTab=!!(newTabEl&&newTabEl.checked);
  if(!url){showToast('Enter a valid URL — e.g. https://example.com');return;}
  const editor=_rteEditor();
  if(!editor){closeLinkModal();return;}

  const range=rteRestoreSelection();
  if(!range){closeLinkModal();return;}

  const a=document.createElement('a');
  a.setAttribute('href',url);
  if(newTab){a.target='_blank';a.rel='noopener noreferrer';}

  const selected=range.toString();
  if(selected&&(!text||text===selected)){
    a.appendChild(range.extractContents()); // wrap the selection, keeping its formatting
  }else{
    a.textContent=text||selected||url;
  }
  rteInsertNode(editor,range,a);
  _rteRange=null;
  closeLinkModal();
}
function insertRteImage(editorId){
  rteSaveSelection(editorId);
  const input=document.getElementById('rte-img-input');
  if(input) input.click();
}
/** Uploads to the shared image bucket so the post body stores a URL rather than
 *  a multi-megabyte data: string. Resolves null when the upload fails. */
function rteUploadImage(file){
  const fd=new FormData();
  fd.append('file',file);
  return fetch('/api/admin/quests/upload',{method:'POST',body:fd})
    .then(res=>res.json().catch(()=>({})).then(data=>(res.ok&&data.url)?data.url:null))
    .catch(()=>null);
}
function handleRteImage(input,editorId){
  const file=input.files&&input.files[0];
  input.value='';                       // so picking the same file twice re-fires change
  if(!file) return;
  if(file.size>5*1024*1024){showToast('Image must be 5MB or smaller.');return;}
  const editor=_rteEditor(editorId);
  if(!editor) return;

  const asDataUrl=()=>new Promise(resolve=>{
    const reader=new FileReader();
    reader.onload=e=>resolve(e.target.result);
    reader.onerror=()=>resolve(null);
    reader.readAsDataURL(file);
  });

  showToast('Uploading image…');
  rteUploadImage(file)
    .then(url=>url||asDataUrl())
    .then(src=>{
      if(!src){showToast('Could not add that image.');return;}
      const range=rteRestoreSelection(editorId);
      if(!range) return;
      const img=document.createElement('img');
      img.src=src;
      img.alt='';
      img.setAttribute('style','max-width:100%;height:auto;border-radius:8px;margin:8px 0');
      rteInsertNode(editor,range,img);
      showToast('Image added');
    });
}

/* ── DEAL CATEGORY SELECTOR ── */
const DEAL_CAT_LABELS = {
  programs: 'Programs & Experiences',
  setup: 'Get Set Up',
  tools: 'Tools & Essentials'
};
function setDealCategory(el){
  // deselect all + reset any leftover inline colours (older builds painted the
  // selected row/check inline; clearing the class alone left them stuck on).
  document.querySelectorAll('#d-category-group label').forEach(l=>{
    l.classList.remove('selected');
    l.style.background='var(--surface2)';
    const check=l.querySelector('.deal-cat-check');
    if(check){check.innerHTML='';check.style.background='var(--surface)';check.style.borderColor='var(--border)';}
  });
  // select clicked (the `.selected` CSS repaints it)
  el.classList.add('selected');
  const cat=el.dataset.cat;
  document.getElementById('d-category-value').value=cat;
  // show tag preview
  const preview=document.getElementById('d-category-preview');
  const tag=document.getElementById('d-category-tag');
  if(preview&&tag){
    tag.textContent=DEAL_CAT_LABELS[cat]||cat;
    preview.style.display='flex';
  }
}

/* ── QUEST DATA (source of truth for all quest-related UI) ── */
const QUEST_REGISTRY = [
  {id:'bali',   name:'Bali Surf & Yoga Pack',      location:'Asia',               type:'Try a New Life'},
  {id:'himalaya',name:'Himalayan Trek Base',        location:'Asia',               type:'Try a New Life'},
  {id:'kyoto',  name:'Kyoto Zen Escape',            location:'Asia',               type:'Try a New Life'},
  {id:'morocco',name:'Morocco Desert Immersion',    location:'Middle East & Africa',type:'Try a New Life'},
  {id:'lisbon', name:'Lisbon Digital Nomad Quest',  location:'Europe',             type:'Move Abroad'},
  {id:'tbilisi',name:'Tbilisi City Quest',          location:'Europe',             type:'Move Abroad'},
  {id:'chiang-mai',name:'Chiang Mai Cultural Quest',location:'Asia',               type:'Move Abroad'},
  {id:'medellin',name:'Medellín Startup Sprint',    location:'Americas',           type:'Level Up'},
  {id:'berlin', name:'Berlin Creative Residency',   location:'Europe',             type:'Level Up'},
];

// selected quest ids for the deal editor
let selectedQuestIds = new Set();

function renderQuestSelector() {
  const locFilter = (document.getElementById('dq-filter-location')||{}).value || '';
  const typeFilter = (document.getElementById('dq-filter-type')||{}).value || '';
  const filtered = QUEST_REGISTRY.filter(q =>
    (!locFilter || q.location === locFilter) &&
    (!typeFilter || q.type === typeFilter)
  );
  const group = document.getElementById('d-quests-group');
  const emptyEl = document.getElementById('dq-empty');
  if (!group) return;

  if (filtered.length === 0) {
    group.style.display = 'none';
    if (emptyEl) emptyEl.style.display = 'block';
    return;
  }
  group.style.display = '';
  if (emptyEl) emptyEl.style.display = 'none';

  group.innerHTML = filtered.map((q, i) => {
    const isLast = i === filtered.length - 1;
    const sel = selectedQuestIds.has(q.id);
    return `<label onclick="toggleQuestLink(this)" data-quest="${q.id}" style="display:flex;align-items:center;gap:10px;padding:9px 14px;cursor:pointer;${isLast?'':'border-bottom:1px solid var(--border);'}background:${sel?'#fef2ee':'var(--surface2)'};transition:background .12s${sel?';outline:none':''}" class="${sel?'selected':''}">
      <span style="width:16px;height:16px;border-radius:4px;border:2px solid ${sel?'var(--accent)':'var(--border)'};background:${sel?'var(--accent)':'var(--surface)'};display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:10px;color:#fff;transition:all .13s" class="quest-checkbox">${sel?'✓':''}</span>
      <span style="flex:1;min-width:0">
        <span style="font-size:13px;color:var(--text);display:block">${q.name}</span>
        <span style="font-size:11px;color:var(--muted)">${q.location} · ${q.type}</span>
      </span>
    </label>`;
  }).join('');
}

function filterQuestSelector() {
  renderQuestSelector();
}

function toggleQuestLink(el) {
  const qid = el.dataset.quest;
  if (selectedQuestIds.has(qid)) {
    selectedQuestIds.delete(qid);
  } else {
    selectedQuestIds.add(qid);
  }
  renderQuestSelector();
  renderQuestChips();
  updateQuestsSummary();
}

function selectAllFilteredQuests() {
  const locFilter = (document.getElementById('dq-filter-location')||{}).value || '';
  const typeFilter = (document.getElementById('dq-filter-type')||{}).value || '';
  QUEST_REGISTRY.filter(q =>
    (!locFilter || q.location === locFilter) &&
    (!typeFilter || q.type === typeFilter)
  ).forEach(q => selectedQuestIds.add(q.id));
  renderQuestSelector();
  renderQuestChips();
  updateQuestsSummary();
}

function renderQuestChips() {
  const container = document.getElementById('d-quests-chips');
  if (!container) return;
  container.innerHTML = [...selectedQuestIds].map(id => {
    const q = QUEST_REGISTRY.find(x => x.id === id);
    if (!q) return '';
    return `<span style="display:inline-flex;align-items:center;gap:5px;background:#fef2ee;border:1.5px solid rgba(232,68,10,.3);color:var(--accent);border-radius:20px;font-size:12px;font-weight:600;padding:3px 10px 3px 11px">${q.name}<button onclick="removeQuestChip('${id}')" style="background:none;border:none;cursor:pointer;color:var(--accent);font-size:15px;line-height:1;padding:0 0 0 2px;opacity:.7" title="Remove">×</button></span>`;
  }).join('');
}

function removeQuestChip(id) {
  selectedQuestIds.delete(id);
  renderQuestSelector();
  renderQuestChips();
  updateQuestsSummary();
}

function updateQuestsSummary(){
  const summary=document.getElementById('d-quests-selected');
  if(!summary) return;
  const count = selectedQuestIds.size;
  if(count===0){
    summary.textContent="No quests selected — this deal won't appear on any Quest page.";
    summary.style.color='var(--muted)';
  } else {
    summary.innerHTML=`<strong style="color:var(--accent)">${count} quest${count===1?'':'s'} selected</strong> <span style="color:var(--muted)">(max 6 deals per category shown per quest on frontend)</span>`;
    summary.style.color='var(--muted2)';
  }
}

// Init quest selector when deals-edit is opened
const _origNav = typeof nav === 'function' ? nav : null;

/* ── EMBARK STEPS REPEATER ── */
function renumberEmbarkSteps() {
  const items = document.querySelectorAll('#embark-repeater .repeater-item');
  items.forEach((item, i) => {
    const title = item.querySelector('.repeater-item-title');
    if (title) title.textContent = 'Step ' + (i + 1);
  });
}
function addEmbarkStep() {
  const r = document.getElementById('embark-repeater');
  if (!r) return;
  const n = r.children.length + 1;
  const d = document.createElement('div');
  d.className = 'repeater-item';
  d.style.cssText = 'background:var(--surface);border-color:rgba(232,68,10,.18)';
  d.innerHTML = `<div class="repeater-item-header"><span class="repeater-drag" style="color:var(--accent);opacity:.6">⠿</span><span class="repeater-item-title" style="color:var(--accent)">Step ${n}</span><button class="repeater-remove" onclick="removeEmbarkStep(this)">×</button></div><div class="field"><label>Title</label><input type="text" placeholder="e.g. Research visa requirements"/></div><div class="field"><label>Short Description</label><input type="text" placeholder="One sentence supporting line — what happens or why it matters."/></div>`;
  r.appendChild(d);
}
function removeEmbarkStep(btn) {
  btn.closest('.repeater-item').remove();
  renumberEmbarkSteps();
}

/* ── DELETION HANDLING ── */
// Quest deletion: unlink from all deals in QUEST_REGISTRY + selectedQuestIds
function deleteQuest(questId, questName) {
  if (!confirm(`Delete quest "${questName}"?\n\nThis quest will be removed from all connected Deals. The deals themselves will not be deleted.`)) return;
  // Remove from registry (in a real app this would be a DB call)
  const idx = QUEST_REGISTRY.findIndex(q => q.id === questId);
  if (idx > -1) QUEST_REGISTRY.splice(idx, 1);
  // Unlink from current deal editor selection
  selectedQuestIds.delete(questId);
  renderQuestSelector();
  renderQuestChips();
  updateQuestsSummary();
  // Notify
  showToast(`"${questName}" deleted and unlinked from all deals.`);
}

// Deal deletion: visually removes deal from quest pages
function deleteDeal(dealId, dealName) {
  if (!confirm(`Delete deal "${dealName}"?\n\nThis deal will be removed from all Quest pages it appears on. Quests themselves will not be deleted.`)) return;
  // In a real app: remove deal record and cascade-delete deal→quest links
  showToast(`"${dealName}" deleted and removed from all Quest pages.`);
}

function showToast(msg) {
  let t = document.getElementById('sq-toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'sq-toast';
    t.style.cssText = 'position:fixed;bottom:22px;left:50%;transform:translateX(-50%);background:#1a1814;color:#fff;padding:10px 20px;border-radius:30px;font-size:13px;font-weight:500;z-index:999;opacity:0;transition:opacity .2s;pointer-events:none;white-space:nowrap';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.opacity = '1';
  clearTimeout(t._timer);
  t._timer = setTimeout(() => { t.style.opacity = '0'; }, 3200);
}

/* ── LIVE CTA BUTTON PREVIEWS ── */
function updateDealBtnPreview(input){
  const preview=document.getElementById('d-btn-preview');
  if(!preview)return;
  const val=(input.value||'').trim();
  const label=val||'Claim offer';
  preview.textContent=label;
}

function updateFinalCtaPreview(){
  const headingEl=document.getElementById('d-cta-preview-heading');
  const subtextEl=document.getElementById('d-cta-preview-subtext');
  const btnEl=document.getElementById('d-cta-preview-btn');
  const headingInput=document.getElementById('d-cta-heading');
  const subtextInput=document.getElementById('d-cta-subtext');
  if(!headingEl||!subtextEl)return;
  const heading=(headingInput&&headingInput.value.trim())||'Gear up before the season starts.';
  const subtext=subtextInput&&subtextInput.value.trim();
  headingEl.textContent=heading;
  if(subtext){subtextEl.textContent=subtext;subtextEl.style.display='';}
  else{subtextEl.style.display='none';}
  // Button label: the Final CTA's own button text if set, else the main CTA
  // Button Label, else a default.
  const finalBtnInput=document.getElementById('d-cta-btn-text');
  const btnTextInput=document.getElementById('d-btn-text');
  const label=(finalBtnInput&&finalBtnInput.value.trim())||(btnTextInput&&btnTextInput.value.trim())||'Claim offer';
  if(btnEl){btnEl.textContent=label;}
}

/* ── CTA ACTION TYPE SWITCHER ── */
function switchActionType(val) {
  ['direct','affiliate','leadform','booking'].forEach(type => {
    const el = document.getElementById('cta-panel-' + type);
    if (el) el.style.display = (type === val) ? '' : 'none';
  });
}

/* ── BOOKING (deposit + Step-1 form) ── */
function updateBookingPreview() {
  const payTypeEl = document.getElementById('d-pay-type');
  if (!payTypeEl) return;
  const payType = payTypeEl.value;
  const dep = parseFloat((document.getElementById('d-deposit-amount') || {}).value) || 0;
  const tot = parseFloat((document.getElementById('d-total-price') || {}).value) || 0;
  const policy = (document.getElementById('d-refund-policy') || {}).value || '';
  const isDeposit = payType === 'deposit';
  const set = (id, txt) => { const el = document.getElementById(id); if (el) el.textContent = txt; };

  set('bp-box-label', isDeposit ? 'Deposit to secure your place' : 'Full payment');
  set('bp-amount', isDeposit ? (dep ? '$' + dep + ' deposit' : '$—') : (tot ? '$' + tot : '$—'));
  set('bp-policy', policy || 'Refund policy will appear here');
  set('bp-total', tot ? '$' + tot : '$—');
  set('bp-due-label', isDeposit ? 'Deposit due now' : 'Total due now');
  set('bp-due', isDeposit ? (dep ? '$' + dep : '$—') : (tot ? '$' + tot : '$—'));
  const balRow = document.getElementById('bp-balance-row');
  if (balRow) {
    if (isDeposit) {
      balRow.style.display = 'flex';
      const bal = tot && dep ? tot - dep : 0;
      set('bp-balance', bal > 0 ? '$' + bal : '$—');
    } else {
      balRow.style.display = 'none';
    }
  }
}

function switchBookingPayType(type) {
  const hidden = document.getElementById('d-pay-type');
  if (hidden) hidden.value = type;
  const depCard = document.getElementById('bk-pay-card-deposit');
  const fullCard = document.getElementById('bk-pay-card-full');
  const depFields = document.getElementById('bk-deposit-fields');
  const on = 'flex:1;border:2px solid var(--coral);background:#FEF2EE;border-radius:10px;padding:14px 16px;cursor:pointer;transition:all .18s';
  const off = 'flex:1;border:1.5px solid var(--border);background:var(--white);border-radius:10px;padding:14px 16px;cursor:pointer;transition:all .18s';
  if (type === 'deposit') {
    if (depCard) { depCard.style.cssText = on; depCard.querySelector('div').style.color = 'var(--coral)'; }
    if (fullCard) { fullCard.style.cssText = off; fullCard.querySelector('div').style.color = 'var(--muted2)'; }
    if (depFields) depFields.style.display = '';
  } else {
    if (fullCard) { fullCard.style.cssText = on; fullCard.querySelector('div').style.color = 'var(--coral)'; }
    if (depCard) { depCard.style.cssText = off; depCard.querySelector('div').style.color = 'var(--muted2)'; }
    if (depFields) depFields.style.display = 'none';
  }
  updateBookingPreview();
}

/* ── BOOKING FORM BUILDER (Step 1) ── */
let bkfFieldCount = 0;

function addBKFField() {
  bkfFieldCount++;
  const idx = bkfFieldCount;
  const r = document.getElementById('bkf-repeater');
  if (!r) return;
  const wrap = document.createElement('div');
  wrap.className = 'bkf-field-item';
  wrap.dataset.idx = idx;
  wrap.style.cssText = 'background:var(--surface2);border:1px solid var(--border);border-radius:10px;overflow:hidden';
  wrap.innerHTML =
    '<div style="display:flex;align-items:center;justify-content:space-between;padding:9px 13px;background:var(--surface3);border-bottom:1px solid var(--border)">' +
      '<span style="font-size:11px;font-weight:700;letter-spacing:.09em;text-transform:uppercase;color:var(--muted2)">Field ' + idx + '</span>' +
      '<button onclick="removeBKFField(this)" style="background:none;border:none;cursor:pointer;color:var(--muted);font-size:18px;line-height:1;padding:0 2px;transition:color .13s" onmouseover="this.style.color=\'var(--danger)\'" onmouseout="this.style.color=\'var(--muted)\'">&#215;</button>' +
    '</div>' +
    '<div style="padding:12px;display:flex;flex-direction:column;gap:10px">' +
      '<div class="field-row">' +
        '<div class="field"><label>Label</label><input type="text" placeholder="e.g. Arrival month, Room preference…"/></div>' +
        '<div class="field"><label>Type</label>' +
          '<select onchange="onBKFTypeChange(this)" class="bkf-type-select">' +
            '<option value="dropdown">Dropdown</option>' +
            '<option value="short_text">Short text</option>' +
            '<option value="long_text">Long text</option>' +
            '<option value="date">Date picker</option>' +
            '<option value="number">Number</option>' +
            '<option value="radio">Radio</option>' +
          '</select>' +
        '</div>' +
      '</div>' +
      '<div class="field-row">' +
        '<div class="field"><label>Placeholder <span class="opt">opt.</span></label><input type="text" placeholder="e.g. Select…"/></div>' +
        '<div style="display:flex;align-items:center;gap:9px;padding-top:20px">' +
          '<label class="toggle"><input type="checkbox" checked/><span class="toggle-slider"></span></label>' +
          '<span class="toggle-label">Required</span>' +
        '</div>' +
      '</div>' +
      '<div class="bkf-options-block">' +
        '<label style="margin-bottom:6px;display:block">Options</label>' +
        '<div class="bkf-options-list" style="display:flex;flex-direction:column;gap:6px"></div>' +
        '<button onclick="addBKFOption(this)" style="margin-top:7px;width:100%;padding:8px;background:transparent;border:1.5px dashed var(--border);border-radius:7px;color:var(--muted2);font-family:\'DM Sans\',sans-serif;font-size:12px;font-weight:600;cursor:pointer;transition:all .14s" onmouseover="this.style.borderColor=\'var(--accent)\';this.style.color=\'var(--accent)\'" onmouseout="this.style.borderColor=\'var(--border)\';this.style.color=\'var(--muted2)\'">&#43; Add Option</button>' +
      '</div>' +
    '</div>';
  r.appendChild(wrap);
  wrap.querySelector('.bkf-type-select').dispatchEvent(new Event('change'));
}

function removeBKFField(btn) {
  btn.closest('.bkf-field-item').remove();
  document.querySelectorAll('#bkf-repeater .bkf-field-item').forEach(function(el, i) {
    const title = el.querySelector('span[style*="uppercase"]');
    if (title) title.textContent = 'Field ' + (i + 1);
  });
}

function onBKFTypeChange(sel) {
  const item = sel.closest('.bkf-field-item');
  const block = item.querySelector('.bkf-options-block');
  const needsOptions = ['dropdown','radio'].indexOf(sel.value) > -1;
  block.style.display = needsOptions ? '' : 'none';
  if (needsOptions && block.querySelector('.bkf-options-list').children.length === 0) {
    addBKFOption(block.querySelector('button'));
  }
}

function addBKFOption(btn) {
  const list = btn.previousElementSibling;
  const row = document.createElement('div');
  row.style.cssText = 'display:flex;gap:6px;align-items:center';
  row.innerHTML =
    '<input type="text" placeholder="Option…" style="flex:1"/>' +
    '<button onclick="this.closest(\'div\').remove()" style="width:28px;height:28px;background:rgba(217,48,37,.1);border:1px solid rgba(217,48,37,.25);border-radius:6px;color:var(--danger);font-size:15px;cursor:pointer;flex-shrink:0;display:flex;align-items:center;justify-content:center;padding:0;line-height:1;transition:all .13s" onmouseover="this.style.background=\'var(--danger)\';this.style.color=\'#fff\'" onmouseout="this.style.background=\'rgba(217,48,37,.1)\';this.style.color=\'var(--danger)\'">&#215;</button>';
  list.appendChild(row);
  row.querySelector('input').focus();
}

/* ── LEAD CAPTURE FORM BUILDER ── */
let lcfFieldCount = 0;

function addLCFField() {
  lcfFieldCount++;
  const idx = lcfFieldCount;
  const r = document.getElementById('lcf-repeater');
  if (!r) return;
  const wrap = document.createElement('div');
  wrap.className = 'lcf-field-item';
  wrap.dataset.idx = idx;
  wrap.style.cssText = 'background:var(--surface2);border:1px solid var(--border);border-radius:10px;overflow:hidden';
  wrap.innerHTML =
    '<div style="display:flex;align-items:center;justify-content:space-between;padding:9px 13px;background:var(--surface3);border-bottom:1px solid var(--border)">' +
      '<span style="font-size:11px;font-weight:700;letter-spacing:.09em;text-transform:uppercase;color:var(--muted2)">Field ' + idx + '</span>' +
      '<button onclick="removeLCFField(this)" style="background:none;border:none;cursor:pointer;color:var(--muted);font-size:18px;line-height:1;padding:0 2px;transition:color .13s" onmouseover="this.style.color=\'var(--danger)\'" onmouseout="this.style.color=\'var(--muted)\'">&#215;</button>' +
    '</div>' +
    '<div style="padding:12px;display:flex;flex-direction:column;gap:10px">' +
      '<div class="field-row">' +
        '<div class="field"><label>Label</label><input type="text" placeholder="e.g. Full Name"/></div>' +
        '<div class="field"><label>Type</label>' +
          '<select onchange="onLCFTypeChange(this)" class="lcf-type-select">' +
            '<option value="short_text">Short text</option>' +
            '<option value="long_text">Long text</option>' +
            '<option value="email">Email</option>' +
            '<option value="phone">Phone</option>' +
            '<option value="dropdown">Dropdown</option>' +
            '<option value="radio">Radio</option>' +
            '<option value="checkbox">Checkbox</option>' +
          '</select>' +
        '</div>' +
      '</div>' +
      '<div class="field-row">' +
        '<div class="field"><label>Placeholder <span class="opt">opt.</span></label><input type="text" placeholder="e.g. Enter your name\u2026"/></div>' +
        '<div style="display:flex;align-items:center;gap:9px;padding-top:20px">' +
          '<label class="toggle"><input type="checkbox" checked/><span class="toggle-slider"></span></label>' +
          '<span class="toggle-label">Required</span>' +
        '</div>' +
      '</div>' +
      '<div class="lcf-options-block" style="display:none">' +
        '<label style="margin-bottom:6px;display:block">Options</label>' +
        '<div class="lcf-options-list" style="display:flex;flex-direction:column;gap:6px"></div>' +
        '<button onclick="addLCFOption(this)" style="margin-top:7px;width:100%;padding:8px;background:transparent;border:1.5px dashed var(--border);border-radius:7px;color:var(--muted2);font-family:\'DM Sans\',sans-serif;font-size:12px;font-weight:600;cursor:pointer;transition:all .14s" onmouseover="this.style.borderColor=\'var(--accent)\';this.style.color=\'var(--accent)\'" onmouseout="this.style.borderColor=\'var(--border)\';this.style.color=\'var(--muted2)\'">&#43; Add Option</button>' +
      '</div>' +
    '</div>';
  r.appendChild(wrap);
  wrap.querySelector('.lcf-type-select').dispatchEvent(new Event('change'));
}

function removeLCFField(btn) {
  btn.closest('.lcf-field-item').remove();
  document.querySelectorAll('#lcf-repeater .lcf-field-item').forEach(function(el, i) {
    const title = el.querySelector('span[style*="uppercase"]');
    if (title) title.textContent = 'Field ' + (i + 1);
  });
}

function onLCFTypeChange(sel) {
  const item = sel.closest('.lcf-field-item');
  const block = item.querySelector('.lcf-options-block');
  const needsOptions = ['dropdown','radio','checkbox'].indexOf(sel.value) > -1;
  block.style.display = needsOptions ? '' : 'none';
  if (needsOptions && block.querySelector('.lcf-options-list').children.length === 0) {
    addLCFOption(block.querySelector('button'));
  }
}

function addLCFOption(btn) {
  const list = btn.previousElementSibling;
  const row = document.createElement('div');
  row.style.cssText = 'display:flex;gap:6px;align-items:center';
  row.innerHTML =
    '<input type="text" placeholder="Option\u2026" style="flex:1"/>' +
    '<button onclick="this.closest(\'div\').remove()" style="width:28px;height:28px;background:rgba(217,48,37,.1);border:1px solid rgba(217,48,37,.25);border-radius:6px;color:var(--danger);font-size:15px;cursor:pointer;flex-shrink:0;display:flex;align-items:center;justify-content:center;padding:0;line-height:1;transition:all .13s" onmouseover="this.style.background=\'var(--danger)\';this.style.color=\'#fff\'" onmouseout="this.style.background=\'rgba(217,48,37,.1)\';this.style.color=\'var(--danger)\'">&#215;</button>';
  list.appendChild(row);
  row.querySelector('input').focus();
}

setTimeout(function() {
  var sel = document.getElementById('d-action-type');
  if (sel) switchActionType(sel.value);
}, 80);
/* ── DEAL SEO — dynamic SERP preview + auto-population ── */
function syncDealSerp() {
  // Slug
  const slugEl = document.getElementById('d-slug');
  const slug = (slugEl && slugEl.value.trim()) ? slugEl.value.trim() : 'your-deal-slug';
  const serpSlug = document.getElementById('d-serp-slug');
  if (serpSlug) serpSlug.textContent = slug;

  // Title tag — show live value; if blank fall back to "Title — OutQuest"
  const titleEl = document.getElementById('d-seo-title');
  const serpTitle = document.getElementById('d-serp-title');
  if (titleEl && serpTitle) {
    const t = titleEl.value.trim();
    serpTitle.textContent = t || 'Deal Title — OutQuest';
    // Colour score
    const len = t.length;
    const bar = document.getElementById('d-seo-bar');
    const barLabel = document.getElementById('d-seo-bar-label');
    if (bar && barLabel) {
      if (len === 0) {
        bar.style.background = 'var(--border)';
        barLabel.textContent = '';
      } else if (len < 30) {
        bar.style.background = 'var(--danger)';
        barLabel.style.color = 'var(--danger)';
        barLabel.textContent = 'Too short (' + len + ')';
      } else if (len <= 60) {
        bar.style.background = 'var(--accent2)';
        barLabel.style.color = 'var(--accent2)';
        barLabel.textContent = 'Good (' + len + ')';
      } else {
        bar.style.background = 'var(--accent)';
        barLabel.style.color = 'var(--accent)';
        barLabel.textContent = 'Too long (' + len + ')';
      }
    }
  }

  // Meta description
  const descEl = document.getElementById('d-meta-desc');
  const serpDesc = document.getElementById('d-serp-desc');
  if (descEl && serpDesc) {
    const d = descEl.value.trim();
    serpDesc.textContent = d || 'Your meta description will appear here — write something compelling that makes people want to click.';
    serpDesc.style.color = d ? '#4d5156' : '#b0aaa2';
  }
}

function syncDealIndexBadge() {
  const tog = document.getElementById('d-index-toggle');
  const yes = document.getElementById('d-index-badge');
  const no  = document.getElementById('d-noindex-badge');
  if (!tog || !yes || !no) return;
  if (tog.checked) {
    yes.style.display = 'flex';
    no.style.display  = 'none';
  } else {
    yes.style.display = 'none';
    no.style.display  = 'flex';
  }
}

// Auto-populate SEO title from deal title + brand when title changes
(function patchDealTitle() {
  var orig = document.getElementById('d-title');
  if (!orig) return;
  var origInput = orig.oninput;
  orig.addEventListener('input', function() {
    var seoTitle = document.getElementById('d-seo-title');
    if (seoTitle && !seoTitle.dataset.edited) {
      var val = orig.value.trim();
      seoTitle.value = val ? val + ' — OutQuest' : '';
      updateSeoCounter(seoTitle, 'd-seo-title-count', 60);
      syncDealSerp();
    }
    // also keep slug serp in sync
    syncDealSerp();
  });
  // Mark as manually edited once user touches the seo title field
  document.addEventListener('input', function(e) {
    if (e.target && e.target.id === 'd-seo-title') {
      e.target.dataset.edited = '1';
      syncDealSerp();
    }
    if (e.target && e.target.id === 'd-slug') syncDealSerp();
  });
})();

// Also auto-populate meta desc from short description textarea
(function watchShortDesc() {
  // The short description textarea doesn't have an id, so we watch via
  // a MutationObserver on the Details section-card-body. Simpler: we
  // rely on the admin manually typing in d-meta-desc, but we can also
  // mirror changes from the short description field.
  // For the prototype, we wire a delegate listener on the Details card.
  document.addEventListener('input', function(e) {
    var t = e.target;
    if (!t || t.tagName !== 'TEXTAREA') return;
    if (t.id === 'd-meta-desc') return; // already handled above
    // Heuristic: if this textarea is in the Details section (placeholder matches)
    if (t.placeholder && t.placeholder.indexOf('2–3 sentences') > -1) {
      var metaEl = document.getElementById('d-meta-desc');
      if (metaEl && !metaEl.dataset.edited) {
        metaEl.value = t.value;
        updateSeoCounter(metaEl, 'd-meta-count', 160);
        syncDealSerp();
      }
    }
    if (t.id === 'd-meta-desc') t.dataset.edited = '1';
  });
})();

setTimeout(function() { syncDealSerp(); syncDealIndexBadge(); }, 120);



// Boot straight to the section named in `?p=` (deep-link / post-save redirect),
// else the dashboard. Doing it here — not after load — avoids a dashboard flash.
(function(){
  var _p = new URLSearchParams(location.search).get('p');
  nav(_p && /^[a-z0-9-]+$/i.test(_p) && document.getElementById('page-'+_p) ? _p : 'dashboard');
})();

// Init quest selector on load and whenever deals-edit is navigated to
(function patchNav(){
  const _orig = nav;
  window.nav = function(page) {
    _orig(page);
    if (page === 'deals-edit') {
      setTimeout(() => { renderQuestSelector(); renderQuestChips(); updateQuestsSummary(); }, 0);
    }
  };
})();
// Also init immediately in case deals-edit is ever the first page
setTimeout(() => { renderQuestSelector(); renderQuestChips(); updateQuestsSummary(); }, 50);

// Wire delete buttons in quests-list table to deleteQuest()
document.querySelectorAll('#page-quests-list tbody tr').forEach(tr => {
  const nameEl = tr.querySelector('td strong');
  const delBtn = tr.querySelector('.btn-danger');
  if (delBtn && nameEl) {
    const name = nameEl.textContent;
    const id = name.toLowerCase().replace(/[^a-z0-9]+/g,'-');
    delBtn.onclick = (e) => { e.stopPropagation(); deleteQuest(id, name); tr.remove(); };
  }
});
// Wire delete buttons in deals-list table to deleteDeal()
document.querySelectorAll('#page-deals-list tbody tr').forEach(tr => {
  const nameEl = tr.querySelector('td strong');
  const delBtn = tr.querySelector('.btn-danger');
  if (delBtn && nameEl) {
    const name = nameEl.textContent;
    delBtn.onclick = (e) => { e.stopPropagation(); deleteDeal(name, name); tr.remove(); };
  }
});

/* ════════════════════════════════════════════════
   FLOATING RTE TOOLBAR — viewport-fixed, shared
   ════════════════════════════════════════════════ */
(function(){
  const HEADER_H = 58;   // matches --header-h CSS var
  const OFFSET   = 10;   // gap below header

  let activeArea  = null;  // the contenteditable currently focused
  let savedRange  = null;  // saved selection so clicks on toolbar don't steal focus
  let rafId       = null;
  let hideTimer   = null;

  const bar = document.getElementById('rte-floating-bar');
  if (!bar) return;

  /* ── label map: rte-area data-placeholder → short name ── */
  function labelFor(area) {
    const p = (area.getAttribute('data-placeholder') || '').slice(0, 28);
    return p || 'Editor';
  }

  /* ── Position the bar below the header, aligned to the editor's left edge ── */
  function positionBar() {
    if (!activeArea || !bar.classList.contains('visible')) return;
    const rect = activeArea.getBoundingClientRect();
    const contentEl = document.getElementById('content');
    const contentRect = contentEl ? contentEl.getBoundingClientRect() : { left: 0 };

    // Top: just below the fixed header + offset
    const top = HEADER_H + OFFSET;

    // Left: align to editor left, but never overflow the viewport
    let left = rect.left;
    const barW = bar.offsetWidth || 600;
    const vpW  = window.innerWidth;
    if (left + barW > vpW - 8) left = vpW - barW - 8;
    if (left < contentRect.left) left = contentRect.left;

    bar.style.top  = top + 'px';
    bar.style.left = left + 'px';
    // Width matches the editor column, capped so it doesn't overflow
    bar.style.maxWidth = Math.min(rect.width, vpW - left - 8) + 'px';

    rafId = null;
  }

  function schedulePosition() {
    if (rafId) return;
    rafId = requestAnimationFrame(positionBar);
  }

  /* ── Show bar ── */
  function showBar(area) {
    clearTimeout(hideTimer);
    activeArea = area;
    bar.setAttribute('data-label', labelFor(area));
    bar.classList.add('visible');
    schedulePosition();
  }

  /* ── Hide bar with a short delay so toolbar clicks don't cause flicker ── */
  function scheduleHide() {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(function() {
      if (document.activeElement === bar || bar.contains(document.activeElement)) return;
      bar.classList.remove('visible');
      activeArea = null;
    }, 180);
  }

  /* ── Save selection before toolbar mousedown steals focus ── */
  bar.addEventListener('mousedown', function(e) {
    e.preventDefault();           // prevents contenteditable losing focus/selection
    const sel = window.getSelection();
    if (sel && sel.rangeCount) savedRange = sel.getRangeAt(0).cloneRange();
  });

  /* ── Restore selection after toolbar click so execCommand works ── */
  function restoreSelection() {
    if (!activeArea) return;
    activeArea.focus();
    if (savedRange) {
      const sel = window.getSelection();
      if (sel) { sel.removeAllRanges(); sel.addRange(savedRange); }
    }
  }

  /* ── Keep bar alive while mouse is over it ── */
  bar.addEventListener('mouseenter', function() { clearTimeout(hideTimer); });
  bar.addEventListener('mouseleave', scheduleHide);

  /* ── Wire every .rte-area on the page (and future ones via delegation) ── */
  function wireArea(area) {
    if (area._rteFloatWired) return;
    area._rteFloatWired = true;

    area.addEventListener('focus', function()  { showBar(area); });
    area.addEventListener('blur',  function()  { scheduleHide(); });
    area.addEventListener('keyup', function()  { schedulePosition(); updateActiveStates(); });
    area.addEventListener('mouseup', function(){ schedulePosition(); updateActiveStates(); });
  }

  // Wire existing areas
  document.querySelectorAll('.rte-area').forEach(wireArea);

  // Wire areas that get added dynamically (e.g. CMS section builder)
  const mo = new MutationObserver(function(mutations) {
    mutations.forEach(function(m) {
      m.addedNodes.forEach(function(n) {
        if (n.nodeType !== 1) return;
        if (n.classList && n.classList.contains('rte-area')) wireArea(n);
        n.querySelectorAll && n.querySelectorAll('.rte-area').forEach(wireArea);
      });
    });
  });
  mo.observe(document.body, { childList: true, subtree: true });

  /* ── Reposition on scroll/resize ── */
  const contentEl = document.getElementById('content');
  if (contentEl) contentEl.addEventListener('scroll', schedulePosition, { passive: true });
  window.addEventListener('resize', schedulePosition, { passive: true });

  /* ── Active state (bold/italic/etc. toggles) ── */
  function updateActiveStates() {
    ['bold','italic','underline','strikeThrough',
     'insertUnorderedList','insertOrderedList'].forEach(function(cmd) {
      try {
        const on = document.queryCommandState(cmd);
        const id = {
          'bold':'rfb-b','italic':'rfb-i','underline':'rfb-u',
          'strikeThrough':'rfb-s','insertUnorderedList':'rfb-ul',
          'insertOrderedList':'rfb-ol'
        }[cmd];
        const btn = id && document.getElementById(id);
        if (btn) btn.classList.toggle('active', on);
      } catch(e){}
    });
  }

  /* ── Public command dispatcher ── */
  window.rteFloatCmd = function(cmd, val) {
    restoreSelection();
    document.execCommand(cmd, false, val || null);
    updateActiveStates();
    if (activeArea) activeArea.focus();
  };

  window.rteFloatLink = function() {
    restoreSelection();
    // reuse the existing link modal if present, otherwise prompt
    if (typeof openLinkModal === 'function' && activeArea) {
      openLinkModal(activeArea.id || null);
    } else {
      const url = prompt('Enter URL:');
      if (url) document.execCommand('createLink', false, url);
    }
  };

  window.rteFloatImage = function() {
    restoreSelection();
    if (typeof insertRteImage === 'function' && activeArea) {
      insertRteImage(activeArea.id);
    } else {
      const url = prompt('Image URL:');
      if (url) document.execCommand('insertImage', false, url);
    }
  };

})();



/* ══════════ QUIZ BUILDER ══════════ */

const QB = {
  questions: [],
  results: [],
  nextQId: 1,
  nextRId: 1,
  previewMode: 'intro',
  previewQIdx: 0,
};

/* ── SEED DATA / LOAD FROM SAVED ── */
// Saved quiz config + page-generating taxonomy terms, injected as JSON
// <script id="quiz-builder-data"> by the Quiz Builder page.
function _qbReadData(){
  try{
    var el=document.getElementById('quiz-builder-data');
    if(el){var d=JSON.parse(el.textContent||'{}');if(d&&typeof d==='object')return d;}
  }catch(e){}
  return {quiz:null,taxonomy:[]};
}
function qbInit(){
  var injected=_qbReadData();
  window.__QUIZ_TAX=Array.isArray(injected.taxonomy)?injected.taxonomy:[];
  var data=injected.quiz;

  if(data && Array.isArray(data.questions) && data.questions.length){
    (data.questions||[]).forEach(function(q){
      qbAddQuestion({text:q.text, show:q.show, opts:(q.options||[]).map(function(o){return {icon:o.icon,label:o.label,subtext:o.subtext,categorySlug:o.categorySlug,budgetSlug:o.budgetSlug,filterKind:o.filterKind,filterSlug:o.filterSlug};})});
    });
    qbApplyIntro(data.intro);
    qbApplySettings(data.settings);
    qbUpdatePreview();
    return;
  }

  // ── Fallback seed (default questions, used until an admin saves) ──
  const seedQs = [
    {text:'What best describes where you are right now?', opts:[
      {icon:'🔥',label:'Burnt out and need a reset'},
      {icon:'🚀',label:'Ready for a new challenge'},
      {icon:'🤔',label:'Searching for direction'},
      {icon:'💼',label:'Looking to pivot my career'},
    ]},
    {text:'How long do you see yourself away?', opts:[
      {icon:'⚡',label:'A few weeks'},
      {icon:'🌙',label:'1–3 months'},
      {icon:'🌍',label:'6+ months'},
      {icon:'♾',label:'Indefinitely — open to staying'},
    ]},
    {text:'What matters most to you?', opts:[
      {icon:'🌿',label:'Nature & slow living'},
      {icon:'🧠',label:'Learning & skills'},
      {icon:'🤝',label:'Community & belonging'},
      {icon:'⛰',label:'Physical challenge'},
    ]},
  ];
  seedQs.forEach(q=>qbAddQuestion(q));
  qbUpdatePreview();
}

/* ── ADD QUESTION ── */
function qbAddQuestion(data){
  const id = QB.nextQId++;
  const q = { id, text: data?.text||'', opts: data?.opts||[] };
  QB.questions.push(q);
  const idx = QB.questions.length;

  const card = document.createElement('div');
  card.className = 'qb-q-card';
  card.id = `qb-q-${id}`;
  card.dataset.qid = id;

  card.innerHTML = `
    <div class="qb-q-header" onclick="qbToggleQ(${id})">
      <span class="qb-drag-handle" title="Drag to reorder">⠿</span>
      <div class="qb-q-num">${idx}</div>
      <div class="qb-q-title-text" id="qb-q-preview-${id}">${q.text||'New question'}</div>
      <span class="qb-q-meta" id="qb-q-optcount-${id}">${q.opts.length} options</span>
      <span class="qb-q-chevron">▶</span>
      <button class="qb-opt-del" onclick="event.stopPropagation();qbDeleteQ(${id})" title="Delete question" style="margin-left:4px">×</button>
    </div>
    <div class="qb-q-body" id="qb-q-body-${id}">
      <div class="field" style="margin-bottom:12px">
        <label>Question text</label>
        <input type="text" placeholder="e.g. What best describes you right now?" value="${(q.text||'').replace(/"/g,'&quot;')}"
          oninput="qbQTextChange(${id},this.value)" id="qb-q-text-${id}"/>
      </div>
      <div class="field" style="margin-bottom:4px"><label>Answer options</label></div>
      <div class="qb-options-wrap" id="qb-opts-${id}"></div>
      <button class="qb-add-opt-btn" onclick="qbAddOpt(${id})">＋ Add option</button>
      <div style="display:flex;align-items:center;gap:10px;margin-top:14px;padding-top:12px;border-top:1px solid var(--border)">
        <div class="toggle-wrap" style="margin:0"><label class="toggle"><input type="checkbox" checked/><span class="toggle-slider"></span></label><span class="toggle-label" style="font-size:12px">Show question</span></div>
        <div style="margin-left:auto;display:flex;gap:7px">
          <button class="btn btn-ghost btn-sm" onclick="qbMoveQ(${id},-1)">↑</button>
          <button class="btn btn-ghost btn-sm" onclick="qbMoveQ(${id},1)">↓</button>
        </div>
      </div>
    </div>`;

  document.getElementById('qb-questions').appendChild(card);

  // add seed options if any
  (q.opts||[]).forEach(o=>qbAddOpt(id,o));

  // honour saved "show" flag
  if(data && data.show===false){
    var qShow=card.querySelector('.qb-q-body input[type="checkbox"]');
    if(qShow) qShow.checked=false;
  }

  qbUpdateMeta();
  qbUpdatePreview();

  // auto-open first question
  if(QB.questions.length===1) qbToggleQ(id);
}

/* ── ADD OPTION ── */
// <option> list of terms for a filter kind (category/budget/duration), from the
// live taxonomy (window.__QUIZ_TAX); `sel` pre-selects a slug if still present.
function _qbTermOptions(kind, sel){
  if(!kind) return '<option value="">— select type —</option>';
  var terms=(window.__QUIZ_TAX||[]).filter(function(t){return t.kind===kind;});
  return '<option value="">— any '+kind+' —</option>'+terms.map(function(t){
    return '<option value="'+t.slug+'"'+(t.slug===sel?' selected':'')+'>'+t.name+'</option>';
  }).join('');
}
// When the filter-type dropdown changes, repopulate its sibling term dropdown.
function qbOnFilterKind(kindSel){
  var row=kindSel.closest('.qb-option-row');
  var termSel=row&&row.querySelector('.qb-opt-fterm');
  if(termSel) termSel.innerHTML=_qbTermOptions(kindSel.value,'');
  qbUpdatePreview();
}
function qbAddOpt(qid, data){
  const wrap = document.getElementById(`qb-opts-${qid}`);
  const row = document.createElement('div');
  row.className = 'qb-option-row';
  const icon = data?.icon||'';
  const label = (data?.label||'').replace(/"/g,'&quot;');
  const sub = (data?.subtext||'').replace(/"/g,'&quot;');
  // A single result filter: a taxonomy kind (Category / Budget / Duration) + a
  // term. Migrate the legacy two-filter fields (categorySlug/budgetSlug).
  const fkind=data?.filterKind||(data?.categorySlug?'category':(data?.budgetSlug?'budget':''))||'';
  const fslug=data?.filterSlug||data?.categorySlug||data?.budgetSlug||'';
  const KIND_LABELS={'':'— no filter —',category:'Category',budget:'Budget',duration:'Duration'};
  const kindOpts=['','category','budget','duration'].map(function(k){
    return `<option value="${k}"${k===fkind?' selected':''}>${KIND_LABELS[k]}</option>`;
  }).join('');
  row.innerHTML = `
    <span class="qb-opt-drag">⠿</span>
    <input class="qb-opt-icon-input" type="text" maxlength="4" value="${icon}" placeholder="🌿" title="Icon / Emoji" oninput="qbUpdatePreview()"/>
    <input class="qb-opt-label" type="text" placeholder="Option label…" value="${label}" oninput="qbUpdatePreview()"/>
    <select class="qb-opt-fkind" title="Filter quest results by which taxonomy" onchange="qbOnFilterKind(this)">${kindOpts}</select>
    <select class="qb-opt-fterm" title="Filter quest results by this term" onchange="qbUpdatePreview()">${_qbTermOptions(fkind,fslug)}</select>
    <button class="qb-opt-del" onclick="this.closest('.qb-option-row').remove();qbUpdateOptCount(${qid});qbUpdatePreview()" title="Remove">×</button>
    <input class="qb-opt-sub" type="text" value="${sub}" placeholder="Optional subtext shown under the answer…" oninput="qbUpdatePreview()"/>`;
  wrap.appendChild(row);
  qbUpdateOptCount(qid);
}

/* ── ADD RESULT ── */
function qbAddResult(data){
  const id = QB.nextRId++;
  const r = {id, icon:data?.icon||'🌟', name:data?.name||'New Path', slug:data?.slug||`path-${id}`, headline:data?.headline||'', subcopy:data?.subcopy||'', cta:data?.cta||'Explore Quests', ctaLink:data?.ctaLink||'/quests'};
  QB.results.push(r);

  const card = document.createElement('div');
  card.className = 'qb-result-card';
  card.id = `qb-r-${id}`;
  card.dataset.rid = id;

  // Taxonomy link options (Category / Life Direction page-generating terms).
  const _taxKind=data?.taxKind||'', _taxSlug=data?.taxSlug||'';
  const taxOpts='<option value="">— none —</option>'+(window.__QUIZ_TAX||[]).filter(function(t){
    return t.kind==='category'||t.kind==='life_direction';
  }).map(function(t){
    const val=t.kind+':'+t.slug;
    const sel=(t.kind===_taxKind&&t.slug===_taxSlug)?' selected':'';
    return `<option value="${val}"${sel}>${t.name} (${t.kind})</option>`;
  }).join('');

  card.innerHTML = `
    <div class="qb-result-hd" onclick="qbToggleR(${id})">
      <span class="qb-result-icon">${r.icon}</span>
      <span class="qb-result-name" id="qb-r-name-${id}">${r.name}</span>
      <span class="qb-result-pill" id="qb-r-slug-disp-${id}">${r.slug}</span>
      <div style="display:flex;align-items:center;gap:8px;margin-left:8px">
        <div class="toggle-wrap" style="margin:0" onclick="event.stopPropagation()"><label class="toggle"><input type="checkbox" checked/><span class="toggle-slider"></span></label></div>
        <button class="qb-opt-del" onclick="event.stopPropagation();qbDeleteR(${id})" title="Delete">×</button>
        <span class="qb-result-chevron">▶</span>
      </div>
    </div>
    <div class="qb-result-body" id="qb-r-body-${id}">
      <div class="qb-field-row2" style="margin-bottom:10px">
        <div class="field" style="margin:0"><label>Path name</label><input type="text" value="${r.name.replace(/"/g,'&quot;')}" placeholder="e.g. Lifestyle Reset" oninput="qbRChange(${id},'name',this.value)"/></div>
        <div class="field" style="margin:0"><label>Slug / key</label><input type="text" value="${r.slug}" placeholder="e.g. lifestyle" oninput="qbRChange(${id},'slug',this.value)"/></div>
      </div>
      <div class="qb-field-row2" style="margin-bottom:10px">
        <div class="field" style="margin:0"><label>Icon / Emoji</label><input type="text" maxlength="4" value="${r.icon}" placeholder="🌿" oninput="qbRChange(${id},'icon',this.value)"/></div>
        <div class="field" style="margin:0"><label>Result headline</label><input type="text" value="${r.headline.replace(/"/g,'&quot;')}" placeholder="Bold result headline" oninput="qbRChange(${id},'headline',this.value)"/></div>
      </div>
      <div class="field" style="margin-bottom:10px"><label>Subcopy</label><textarea rows="2" placeholder="Supporting sentence for this result…" oninput="qbRChange(${id},'subcopy',this.value)">${r.subcopy}</textarea></div>
      <div class="qb-field-row2" style="margin-bottom:10px">
        <div class="field" style="margin:0"><label>CTA label</label><input type="text" value="${r.cta.replace(/"/g,'&quot;')}" placeholder="e.g. See Quests" oninput="qbRChange(${id},'cta',this.value)"/></div>
        <div class="field" style="margin:0"><label>CTA link</label><input type="url" value="${r.ctaLink}" placeholder="/quests?path=…" oninput="qbRChange(${id},'ctaLink',this.value)"/></div>
      </div>
      <div class="field" style="margin-bottom:10px"><label>Connect to page (taxonomy)</label><select class="qb-r-tax" style="width:100%;padding:7px 10px;border:1px solid var(--border);border-radius:7px;font-size:13px;background:var(--surface);font-family:'DM Sans',sans-serif;color:var(--text)">${taxOpts}</select></div>
      <div style="display:flex;align-items:center;gap:8px;padding-top:10px;border-top:1px solid var(--border)">
        <div class="status-toggle" style="flex:none">
          <button class="active-published" onclick="setStatus(this.closest('.status-toggle'),'published',this)">Published</button>
          <button onclick="setStatus(this.closest('.status-toggle'),'draft',this)">Draft</button>
        </div>
        <div style="margin-left:auto;display:flex;gap:7px">
          <button class="btn btn-ghost btn-sm" onclick="qbMoveR(${id},-1)">↑</button>
          <button class="btn btn-ghost btn-sm" onclick="qbMoveR(${id},1)">↓</button>
        </div>
      </div>
    </div>`;

  document.getElementById('qb-results').appendChild(card);
  if(data && data.show===false){
    var rShow=card.querySelector('.qb-result-hd input[type="checkbox"]');
    if(rShow) rShow.checked=false;
  }
  qbUpdateMeta();
  qbUpdatePreview();
  qbRefreshAllPathSelects();
}

/* ── TOGGLE OPEN/CLOSE ── */
function qbToggleQ(id){
  const card = document.getElementById(`qb-q-${id}`);
  const body = document.getElementById(`qb-q-body-${id}`);
  const wasOpen = card.classList.contains('qb-open');
  // close all
  document.querySelectorAll('.qb-q-card').forEach(c=>{c.classList.remove('qb-open');c.querySelector('.qb-q-body').classList.remove('open');});
  if(!wasOpen){card.classList.add('qb-open');body.classList.add('open');}
  // update preview to show this question
  const idx = QB.questions.findIndex(q=>q.id===id);
  if(idx>=0){QB.previewQIdx=idx;qbPreviewNav('q');}
}
function qbToggleR(id){
  const card = document.getElementById(`qb-r-${id}`);
  const body = document.getElementById(`qb-r-body-${id}`);
  const wasOpen = card.classList.contains('qb-ropen');
  document.querySelectorAll('.qb-result-card').forEach(c=>{c.classList.remove('qb-ropen');c.querySelector('.qb-result-body').classList.remove('open');});
  if(!wasOpen){card.classList.add('qb-ropen');body.classList.add('open');qbPreviewNav('result',id);}
}

/* ── DELETE ── */
function qbDeleteQ(id){
  if(!confirm('Delete this question?')) return;
  QB.questions = QB.questions.filter(q=>q.id!==id);
  document.getElementById(`qb-q-${id}`)?.remove();
  qbUpdateMeta();qbUpdatePreview();qbRenumberQs();
}
function qbDeleteR(id){
  if(!confirm('Delete this result path?')) return;
  QB.results = QB.results.filter(r=>r.id!==id);
  document.getElementById(`qb-r-${id}`)?.remove();
  qbUpdateMeta();qbUpdatePreview();qbRefreshAllPathSelects();
}

/* ── MOVE ── */
function qbMoveQ(id,dir){
  const idx=QB.questions.findIndex(q=>q.id===id);
  const newIdx=idx+dir;
  if(newIdx<0||newIdx>=QB.questions.length) return;
  [QB.questions[idx],QB.questions[newIdx]]=[QB.questions[newIdx],QB.questions[idx]];
  const wrap=document.getElementById('qb-questions');
  const cards=[...wrap.children];
  const a=document.getElementById(`qb-q-${QB.questions[idx].id}`);
  const b=document.getElementById(`qb-q-${QB.questions[newIdx].id}`);
  if(dir>0){wrap.insertBefore(b,a);}else{wrap.insertBefore(a,b);}
  qbRenumberQs();
}
function qbMoveR(id,dir){
  const idx=QB.results.findIndex(r=>r.id===id);
  const newIdx=idx+dir;
  if(newIdx<0||newIdx>=QB.results.length) return;
  [QB.results[idx],QB.results[newIdx]]=[QB.results[newIdx],QB.results[idx]];
  const wrap=document.getElementById('qb-results');
  const a=document.getElementById(`qb-r-${QB.results[idx].id}`);
  const b=document.getElementById(`qb-r-${QB.results[newIdx].id}`);
  if(dir>0){wrap.insertBefore(b,a);}else{wrap.insertBefore(a,b);}
}

/* ── UPDATE HELPERS ── */
function qbQTextChange(id,val){
  const q=QB.questions.find(q=>q.id===id);if(q)q.text=val;
  const prev=document.getElementById(`qb-q-preview-${id}`);
  if(prev)prev.textContent=val||'New question';
  qbUpdatePreview();
}
function qbRChange(id,field,val){
  const r=QB.results.find(r=>r.id===id);if(!r)return;
  r[field]=val;
  if(field==='name'){const el=document.getElementById(`qb-r-name-${id}`);if(el)el.textContent=val;}
  if(field==='slug'){const el=document.getElementById(`qb-r-slug-disp-${id}`);if(el)el.textContent=val;qbRefreshAllPathSelects();}
  qbUpdatePreview();
}
function qbUpdateOptCount(qid){
  const wrap=document.getElementById(`qb-opts-${qid}`);
  const el=document.getElementById(`qb-q-optcount-${qid}`);
  if(el&&wrap)el.textContent=`${wrap.children.length} options`;
}
function qbUpdateMeta(){
  const qel=document.getElementById('qb-meta-qcount');
  const rel=document.getElementById('qb-meta-rcount');
  if(qel)qel.textContent=QB.questions.length;
  if(rel)rel.textContent=QB.results.length;
}
function qbRenumberQs(){
  QB.questions.forEach((q,i)=>{const el=document.querySelector(`#qb-q-${q.id} .qb-q-num`);if(el)el.textContent=i+1;});
}
function qbRefreshAllPathSelects(){
  document.querySelectorAll('.qb-opt-path').forEach(sel=>{
    const cur=sel.value;
    sel.innerHTML=`<option value="">— path —</option>`+QB.results.map(r=>`<option value="${r.slug}"${r.slug===cur?' selected':''}>${r.name}</option>`).join('');
  });
}

/* ── LIVE PREVIEW ── */
let _qbPreviewResultId = null;
function qbPreviewNav(mode,rid){
  QB.previewMode=mode;
  if(rid!==undefined)_qbPreviewResultId=rid;
  qbUpdatePreview();
}
function qbUpdatePreview(){
  const area=document.getElementById('qb-preview-area');if(!area)return;
  const mode=QB.previewMode;
  const headline=document.getElementById('qb-headline')?.value||'Find Your Quest';
  const subline=document.getElementById('qb-subline')?.value||'';
  const startCta=document.getElementById('qb-start-cta')?.value||'Begin';

  if(mode==='intro'){
    area.innerHTML=`
      <div class="qb-preview-intro">
        <div class="qb-preview-intro-title">${headline}</div>
        <div class="qb-preview-intro-sub">${subline}</div>
        <button class="qb-preview-result-cta" onclick="qbPreviewNav('q')">${startCta} →</button>
      </div>`;
  } else if(mode==='q'){
    const q=QB.questions[QB.previewQIdx];
    const total=QB.questions.length;
    const dots=Array.from({length:total},(_, i)=>`<div class="qb-preview-dot${i===QB.previewQIdx?' active':''}"></div>`).join('');
    // read live options from DOM
    let optsHtml='<div style="font-size:12px;color:var(--muted);text-align:center;padding:12px">No options yet — add some below</div>';
    if(q){
      const wrap=document.getElementById(`qb-opts-${q.id}`);
      const rows=wrap?[...wrap.children]:[];
      if(rows.length){
        optsHtml=`<div class="qb-preview-options">${rows.map(row=>{
          const ic=row.querySelector('.qb-opt-icon-input')?.value||'';
          const lb=row.querySelector('.qb-opt-label')?.value||'Option';
          const sb=row.querySelector('.qb-opt-sub')?.value||'';
          return `<div class="qb-preview-opt"><span class="qb-preview-opt-icon">${ic}</span><span>${lb}${sb?`<br><span style="font-size:11px;color:var(--muted);font-weight:400">${sb}</span>`:''}</span></div>`;
        }).join('')}</div>`;
      }
    }
    area.innerHTML=`
      ${total>1?`<div class="qb-preview-step-dots">${dots}</div>`:''}
      <div class="qb-preview-q-text">${q?q.text||'Your question text':'No questions yet'}</div>
      ${optsHtml}
      <div class="qb-preview-nav">
        ${QB.previewQIdx>0?`<button class="qb-preview-btn ghost" onclick="QB.previewQIdx=Math.max(0,QB.previewQIdx-1);qbUpdatePreview()">← Back</button>`:''}
        <button class="qb-preview-btn primary" onclick="QB.previewQIdx=Math.min(QB.questions.length-1,QB.previewQIdx+1);if(QB.previewQIdx===QB.questions.length-1)qbPreviewNav('result');else qbUpdatePreview()">${QB.previewQIdx<QB.questions.length-1?'Next →':'See Result →'}</button>
      </div>`;
  } else if(mode==='result'){
    // Results are now the matched programs (Deals) chosen by the answers' filters,
    // resolved live on the front end — so the builder just explains what shows.
    area.innerHTML=`
      <div class="qb-preview-result">
        <div class="qb-preview-result-icon">🎯</div>
        <div class="qb-preview-result-title">Your matched programs</div>
        <div class="qb-preview-result-sub">Matching quests are shown based on the Budget / Duration / Category filters set on the answers above.</div>
      </div>
      <div style="margin-top:16px;text-align:center">
        <button class="qb-preview-btn ghost" onclick="QB.previewQIdx=0;qbPreviewNav('q')" style="font-size:11.5px">← Retake</button>
      </div>`;
  }
}

/* ── APPLY SAVED INTRO / SETTINGS ── */
function qbApplyIntro(intro){
  if(!intro) return;
  var h=document.getElementById('qb-headline'); if(h&&intro.headline!=null) h.value=intro.headline;
  var s=document.getElementById('qb-subline'); if(s&&intro.subline!=null) s.value=intro.subline;
  var c=document.getElementById('qb-start-cta'); if(c&&intro.startCta!=null) c.value=intro.startCta;
  var v=document.getElementById('qb-intro-visible'); if(v) v.checked=intro.show!==false;
  var slug=document.querySelector('#page-quiz-builder .slug-wrap input'); if(slug&&intro.slug!=null) slug.value=intro.slug;
}
function qbApplySettings(st){
  if(!st) return;
  var card=document.querySelector('#page-quiz-builder .qb-status-card'); if(!card) return;
  var pub=st.status!=='draft';
  var btns=document.querySelectorAll('#qb-pub-status button');
  if(btns[0]) btns[0].className=pub?'':'active-draft';
  if(btns[1]) btns[1].className=pub?'active-published':'';
  var toggles=card.querySelectorAll('.toggle-wrap input[type="checkbox"]');
  if(toggles[0]) toggles[0].checked=st.showOnHomepage!==false;
  if(toggles[1]) toggles[1].checked=st.showOnQuests!==false;
  var sels=card.querySelectorAll('select');
  var progOrder=['one','all','snap'], rdOrder=['top','top3','all'];
  if(sels[0]) sels[0].selectedIndex=Math.max(0,progOrder.indexOf(st.progression||'one'));
  if(sels[1]) sels[1].selectedIndex=Math.max(0,rdOrder.indexOf(st.resultsDisplay||'top'));
}

/* ── COLLECT CURRENT STATE ── */
function qbCollect(){
  var val=function(el){return el?el.value:'';};
  var slugEl=document.querySelector('#page-quiz-builder .slug-wrap input');
  var introVis=document.getElementById('qb-intro-visible');
  var intro={
    show: introVis?introVis.checked:true,
    headline: val(document.getElementById('qb-headline')),
    subline: val(document.getElementById('qb-subline')),
    startCta: val(document.getElementById('qb-start-cta')),
    slug: val(slugEl)||'quiz'
  };
  // Questions in DOM order.
  var questions=[];
  document.querySelectorAll('#qb-questions .qb-q-card').forEach(function(qcard){
    var qid=qcard.dataset.qid;
    var text=val(document.getElementById('qb-q-text-'+qid));
    var showT=qcard.querySelector('.qb-q-body input[type="checkbox"]');
    var opts=[];
    qcard.querySelectorAll('.qb-option-row').forEach(function(row){
      opts.push({
        icon: val(row.querySelector('.qb-opt-icon-input')),
        label: val(row.querySelector('.qb-opt-label')),
        subtext: val(row.querySelector('.qb-opt-sub')),
        filterKind: val(row.querySelector('.qb-opt-fkind')),
        filterSlug: val(row.querySelector('.qb-opt-fterm'))
      });
    });
    questions.push({text:text, show:showT?showT.checked:true, options:opts});
  });
  // Result paths in DOM order (text fields come from QB state, kept in sync).
  var results=[];
  document.querySelectorAll('#qb-results .qb-result-card').forEach(function(rcard){
    var rid=rcard.dataset.rid;
    var r=QB.results.find(function(x){return String(x.id)===String(rid);})||{};
    var taxVal=val(rcard.querySelector('.qb-r-tax'));
    var parts=taxVal.split(':');
    var showT=rcard.querySelector('.qb-result-hd input[type="checkbox"]');
    results.push({
      icon:r.icon||'', name:r.name||'', slug:r.slug||'',
      headline:r.headline||'', subcopy:r.subcopy||'',
      cta:r.cta||'', ctaLink:r.ctaLink||'',
      taxKind:parts[0]||'', taxSlug:parts[1]||'',
      show: showT?showT.checked:true
    });
  });
  // Settings.
  var card=document.querySelector('#page-quiz-builder .qb-status-card');
  var pub=!!document.querySelector('#qb-pub-status button.active-published');
  var toggles=card?card.querySelectorAll('.toggle-wrap input[type="checkbox"]'):[];
  var sels=card?card.querySelectorAll('select'):[];
  var progOrder=['one','all','snap'], rdOrder=['top','top3','all'];
  var settings={
    status: pub?'published':'draft',
    showOnHomepage: toggles[0]?toggles[0].checked:true,
    showOnQuests: toggles[1]?toggles[1].checked:true,
    progression: progOrder[sels[0]?sels[0].selectedIndex:0]||'one',
    resultsDisplay: rdOrder[sels[1]?sels[1].selectedIndex:0]||'top'
  };
  return {intro:intro, questions:questions, results:results, settings:settings};
}

/* ── SAVE / RESET ── */
function qbSave(status){
  var quiz=qbCollect();
  if(status){ quiz.settings.status=status; qbApplySettings(quiz.settings); }
  fetch('/api/admin/site-settings',{
    method:'PUT',
    headers:{'Content-Type':'application/json'},
    credentials:'same-origin',
    body:JSON.stringify({quiz:quiz})
  }).then(function(res){
    if(res.ok){
      showToast(status==='draft'?'Draft saved.':'Quiz saved & published!');
      var rows=document.querySelectorAll('#page-quiz-builder .qb-status-card .qb-meta-row strong');
      if(rows.length){ rows[rows.length-1].textContent=new Date().toLocaleString(); }
    } else {
      res.json().then(function(d){ showToast((d&&d.error)||'Could not save the quiz.'); })
        .catch(function(){ showToast('Could not save the quiz.'); });
    }
  }).catch(function(){ showToast('Network error — please try again.'); });
}
function qbReset(){
  if(!confirm('Reset the quiz to the last saved version?')) return;
  var q=document.getElementById('qb-questions'); if(q) q.innerHTML='';
  var r=document.getElementById('qb-results'); if(r) r.innerHTML='';
  QB.questions=[]; QB.results=[]; QB.nextQId=1; QB.nextRId=1; QB.previewQIdx=0; QB.previewMode='intro';
  qbInit();
}

/* Rebuild every answer-option term <select> from the current taxonomy
 * (window.__QUIZ_TAX) for its chosen filter kind, preserving the selection if
 * the term still exists. Lets taxonomy edits in the Taxonomies section appear in
 * the Quiz Builder filters instantly, without a full page reload. */
function qbRebuildFilterSelects(){
  document.querySelectorAll('#qb-questions .qb-option-row').forEach(function(row){
    var kindSel=row.querySelector('.qb-opt-fkind');
    var termSel=row.querySelector('.qb-opt-fterm');
    if(!kindSel||!termSel) return;
    termSel.innerHTML=_qbTermOptions(kindSel.value, termSel.value);
  });
}

/* ── BOOT ── */
(function(){
  if(document.getElementById('qb-questions')) qbInit();
  // Mirror live taxonomy edits (add / rename / remove / reorder) into the Quiz
  // Builder's answer-filter dropdowns — the TaxonomyBridge broadcasts the flat
  // term list (incl. slug) on every change.
  window.addEventListener('admin:taxonomy-changed', function(e){
    if(!document.getElementById('qb-questions')) return;
    if(Array.isArray(e.detail)) window.__QUIZ_TAX=e.detail;
    qbRebuildFilterSelects();
  });
})();



/* ══════════ QUEST/DEAL EDITOR EXTENSIONS ══════════ */

function extSwitchTab(tabsId, panelsId, idx){
  const tabs = document.getElementById(tabsId).querySelectorAll('.ext-tab');
  const panels = document.getElementById(panelsId).querySelectorAll('.ext-tab-panel');
  tabs.forEach((t,i)=>t.classList.toggle('active',i===idx));
  panels.forEach((p,i)=>p.classList.toggle('active',i===idx));
}

function extPreviewCardImg(input, mockId){
  if(!input.files||!input.files[0]) return;
  const reader = new FileReader();
  reader.onload = e=>{
    const el = document.getElementById(mockId);
    if(!el) return;
    el.style.backgroundImage = `url(${e.target.result})`;
    el.style.backgroundSize = 'cover';
    el.style.backgroundPosition = 'center';
    const iconEl = el.querySelector('span');
    if(iconEl) iconEl.style.display='none';
  };
  reader.readAsDataURL(input.files[0]);
}

function extUpdateCardIcon(input, iconId){
  const el = document.getElementById(iconId);
  if(el) el.textContent = input.value || '🌍';
}

function extUpdateCardBg(colorInput, mockId){
  const el = document.getElementById(mockId);
  if(el) el.style.backgroundColor = colorInput.value;
}

function extSyncColorInput(textInput, colorId, mockId){
  const val = textInput.value.trim();
  if(/^#[0-9a-fA-F]{3,6}$/.test(val)){
    const c = document.getElementById(colorId);
    if(c) c.value = val;
    const m = document.getElementById(mockId);
    if(m) m.style.backgroundColor = val;
  }
}

function extToggleHideBadge(checkbox, badgeId){
  const badge = document.getElementById(badgeId);
  if(badge) badge.style.display = checkbox.checked ? 'block' : 'none';
}

function extToggleFeaturedBadge(checkbox, badgeId){
  const badge = document.getElementById(badgeId);
  if(badge) badge.style.display = checkbox.checked ? 'block' : 'none';
}

function extToggleRel(row, chipsId){
  const cb = row.querySelector('input[type=checkbox]');
  cb.checked = !cb.checked;
  const name = row.querySelector('.ext-rel-name').textContent;
  const chipsWrap = document.getElementById(chipsId);
  if(!chipsWrap) return;
  if(cb.checked){
    // add chip
    const exists = [...chipsWrap.querySelectorAll('.ext-rel-chip')].find(c=>c.dataset.name===name);
    if(!exists){
      const chip = document.createElement('div');
      chip.className = 'ext-rel-chip';
      chip.dataset.name = name;
      chip.innerHTML = `<span>${name}</span><button onclick="extRemoveRelChip(this,'${chipsId}',event)">×</button>`;
      chipsWrap.appendChild(chip);
    }
  } else {
    // remove chip
    const chips = chipsWrap.querySelectorAll('.ext-rel-chip');
    chips.forEach(c=>{ if(c.dataset.name===name) c.remove(); });
  }
}

function extRemoveRelChip(btn, chipsId, e){
  e.stopPropagation();
  const chip = btn.closest('.ext-rel-chip');
  const name = chip.dataset.name;
  chip.remove();
  // uncheck in list
  const listId = chipsId.replace('-chips','-list');
  const list = document.getElementById(listId);
  if(list){
    list.querySelectorAll('.ext-rel-row').forEach(row=>{
      if(row.querySelector('.ext-rel-name')?.textContent===name){
        const cb = row.querySelector('input[type=checkbox]');
        if(cb) cb.checked = false;
      }
    });
  }
}

function extFilterList(input, listId, rowClass){
  const q = input.value.toLowerCase();
  const list = document.getElementById(listId);
  if(!list) return;
  list.querySelectorAll('.'+rowClass).forEach(row=>{
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(q) ? '' : 'none';
  });
}



function switchActionTypeCard(card, val) {
  document.querySelectorAll('#d-action-type-cards .book-type-card').forEach(c => c.classList.remove('selected'));
  card.classList.add('selected');
  document.getElementById('d-action-type').value = val;
  switchActionType(val);
  // Match the CTA button label to the chosen action — but only while it's still
  // an auto default, so a custom label the admin typed is never clobbered. This
  // stops a Direct Link deal defaulting to the booking word "Book Now".
  const btn = document.getElementById('d-btn-text');
  if (btn && ['', 'Book Now', 'Claim offer'].indexOf(btn.value.trim()) !== -1) {
    btn.value = (val === 'booking') ? 'Book Now' : 'Claim offer';
    updateDealBtnPreview(btn);
    updateFinalCtaPreview();
  }
}



function addPathStep(){
  const r=document.getElementById('path-repeater');if(!r)return;
  const n=r.querySelectorAll('.repeater-item').length+1;
  const d=document.createElement('div');d.className='repeater-item';d.style.cssText='background:var(--surface);border-color:rgba(74,108,247,.2)';
  d.innerHTML=`<div class="repeater-item-header"><span class="repeater-drag" style="color:var(--accent3);opacity:.6">⠿</span><span class="repeater-item-title" style="color:var(--accent3)">Step ${n}</span><button class="repeater-remove" onclick="removeItem(this)">×</button></div><div class="field"><label>Step Title</label><input type="text" placeholder="e.g. Sort your visa route"/></div><div class="field"><label>Full Description</label><textarea rows="3" placeholder="Detailed context for this step…"></textarea></div>`;
  r.appendChild(d);
}
function addPrepCard(){
  const r=document.getElementById('prep-repeater');if(!r)return;
  const n=r.querySelectorAll('.repeater-item').length+1;
  const d=document.createElement('div');d.className='repeater-item';d.style.cssText='background:var(--surface);border-color:rgba(245,200,66,.35)';
  d.innerHTML=`<div class="repeater-item-header"><span class="repeater-drag">⠿</span><span class="repeater-item-title">Prep Card ${n}</span><button class="repeater-remove" onclick="removeItem(this)">×</button></div><div class="grid-2"><div class="field-group"><label class="field-label">Icon / Emoji</label><input type="text" maxlength="4" placeholder="🎒" style="font-size:22px;text-align:center"/></div><div class="field-group"><label class="field-label">Deal Slug</label><input type="text" placeholder="e.g. power-bank"/></div></div><div class="grid-2"><div class="field-group"><label class="field-label">Card Title</label><input type="text" placeholder="e.g. Lightweight daypack"/></div><div class="field-group"><label class="field-label">Button Label</label><input type="text" placeholder="e.g. Shop Deal"/></div></div><div class="field-group"><label class="field-label">Card Background (CSS gradient)</label><input type="text" placeholder="linear-gradient(135deg,#1A1A3A,#3A3A6A)"/></div>`;
  r.appendChild(d);
}

