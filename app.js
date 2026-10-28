(function(){
'use strict';
/* =========================================================
   Yakir fit — אפליקציית אימונים אישיים
   עובד מול Firebase (התחברות + Firestore). בלי הגדרות Firebase
   האפליקציה עולה במצב הדגמה ששומר הכול רק במכשיר.
   ========================================================= */
const CFG=window.YF_CONFIG||{};
const DEMO=!(CFG.firebase&&CFG.firebase.apiKey&&!/PASTE|YOUR_/i.test(CFG.firebase.apiKey))||typeof window.firebase==='undefined';
const COACH_EMAILS=(DEMO?['yakir@demo.com']:(CFG.coachEmails||[])).map(e=>String(e).trim().toLowerCase());

/* ---------- icons ---------- */
const I={
  bolt:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2 4 14h7l-1 8 9-12h-7z"/></svg>',
  cal:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="5" width="18" height="16" rx="4"/><path d="M8 3v4M16 3v4M3 10h18"/></svg>',
  users:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="9" cy="8" r="4"/><path d="M2 21c0-4 3-6 7-6s7 2 7 6M16 4a4 4 0 0 1 0 8M22 21c0-3-2-5-4-5.5"/></svg>',
  dumb:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 7v10M3 9v6M18 7v10M21 9v6M6 12h12"/></svg>',
  chart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 20h18M5 16l4-5 4 3 6-8"/></svg>',
  more:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/><circle cx="12" cy="12" r="3"/></svg>',
  biz:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="7" width="18" height="13" rx="3"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/></svg>',
  plus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  trash:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></svg>',
  edit:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4L19 9l-4-4L4 16z"/></svg>',
  back:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>',
  prev:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>',
  next:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg>',
  bell:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 16V11a6 6 0 1 1 12 0v5l2 2H4zM10 21h4"/></svg>',
  drop:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2s7 7.6 7 12.5A7 7 0 0 1 5 14.5C5 9.6 12 2 12 2z"/></svg>',
  log:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  trophy:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H4a3 3 0 0 0 4 4M16 6h4a3 3 0 0 1-4 4M12 13v4M8 21h8M9 17h6"/></svg>',
  x:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10"/></svg>',
  wa:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.8-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2s.2-1.1.1-1.2l-.5-.3z"/></svg>',
  vid:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="13" height="12" rx="3"/><path d="M16 10.5 21 7v10l-5-3.5z"/></svg>',
  down:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>',
  note:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h5"/></svg>',
  dots:'<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>',
  share:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v13M7 8l5-5 5 5M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5"/></svg>',
  download:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v13M7 11l5 5 5-5M5 21h14"/></svg>',
  copy:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>',
  timer:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5M9 2h6"/></svg>',
  cam:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>',
  play:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13a1 1 0 0 0 1.5.9l10-6.5a1 1 0 0 0 0-1.7l-10-6.5A1 1 0 0 0 8 5.5z"/></svg>',
  medal:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3h10l-3 6h-4zM12 9v0"/><circle cx="12" cy="15" r="6"/><path d="M12 12.5l.8 1.6 1.7.2-1.2 1.2.3 1.7-1.6-.8-1.6.8.3-1.7-1.2-1.2 1.7-.2z" fill="currentColor"/></svg>',
  flame:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c1 3.5 5 6 5 11a5 5 0 0 1-10 0c0-2.2 1-3.6 2-4.6.2 1.6 1 2.6 2 3 0-3.4-.6-6.4 1-9.4z"/></svg>',
  out:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4M9 8l-4 4 4 4M5 12h10"/></svg>',
  swap:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4 3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7"/></svg>',
  google:'<svg viewBox="0 0 24 24"><path fill="#4285F4" d="M22.5 12.3c0-.8-.1-1.5-.2-2.3H12v4.3h5.9a5 5 0 0 1-2.2 3.3v2.7h3.6c2-1.9 3.2-4.7 3.2-8z"/><path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.6-2.7c-1 .7-2.2 1.1-3.7 1.1-2.9 0-5.3-1.9-6.2-4.5H2.1v2.8A11 11 0 0 0 12 23z"/><path fill="#FBBC05" d="M5.8 14.2a6.6 6.6 0 0 1 0-4.3V7.1H2.1a11 11 0 0 0 0 9.9z"/><path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.2-3.2A11 11 0 0 0 2.1 7.1l3.7 2.8C6.7 7.3 9.1 5.4 12 5.4z"/></svg>'
};
const AV=['#ff8a4c','#ffc145','#4fb3ff','#3dd68c','#c79bff','#ff7aa8','#7ee0d6'];

/* ---------- utils ---------- */
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pad=n=>String(n).padStart(2,'0');
const iso=d=>d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());
const today=()=>iso(new Date());
const parse=s=>{const[a,b,c]=s.split('-').map(Number);return new Date(a,b-1,c)};
const addDays=(s,n)=>{const d=parse(s);d.setDate(d.getDate()+n);return iso(d)};
const DAYS=['ראשון','שני','שלישי','רביעי','חמישי','שישי','שבת'];
const DS=['א׳','ב׳','ג׳','ד׳','ה׳','ו׳','ש׳'];
const fmt=s=>{const d=parse(s);return 'יום '+DAYS[d.getDay()]+', '+d.getDate()+'.'+(d.getMonth()+1)};
const fmtShort=s=>{const d=parse(s);return d.getDate()+'.'+(d.getMonth()+1)};
const weekStart=s=>{const d=parse(s);d.setDate(d.getDate()-d.getDay());return iso(d)};
const uid=()=>Math.random().toString(36).slice(2,9)+Date.now().toString(36).slice(-4);
const nowHM=()=>{const d=new Date();return pad(d.getHours())+':'+pad(d.getMinutes())};
const ls={get(k,d){try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}},del(k){try{localStorage.removeItem(k)}catch(e){}}};
const clone=o=>o==null?o:JSON.parse(JSON.stringify(o));
const isObj=o=>o&&typeof o==='object'&&!Array.isArray(o);
function deepMerge(a,b){const o=Object.assign({},a);Object.keys(b).forEach(k=>{o[k]=isObj(b[k])&&isObj(o[k])?deepMerge(o[k],b[k]):b[k]});return o}
const cleanName=n=>String(n||'').replace(/^דוגמה\s*·\s*/,'').trim();
const initials=n=>cleanName(n).slice(0,1)||'?';
const firstName=t=>cleanName(t.name).split(/\s+/)[0]||'';
const waPhone=p=>{let n=String(p||'').replace(/\D/g,'');if(!n)return '';if(n.startsWith('0'))n='972'+n.slice(1);return n};
const waLink=(p,msg)=>'https://wa.me/'+waPhone(p)+'?text='+encodeURIComponent(msg);
const mini=(svg,s=16)=>svg.replace('<svg','<svg width="'+s+'" height="'+s+'"');

/* =========================================================
   BACKEND — Firebase או הדגמה מקומית, באותו ממשק
   ========================================================= */
let api, authApi;
function errMsg(e){
  const c=(e&&e.code)||'';
  if(/invalid-credential|wrong-password|user-not-found|invalid-login/.test(c))return 'המייל או הסיסמה לא נכונים';
  if(/email-already-in-use/.test(c))return 'כבר יש חשבון עם המייל הזה. נסו להתחבר';
  if(/weak-password/.test(c))return 'הסיסמה צריכה לכלול לפחות 6 תווים';
  if(/invalid-email/.test(c))return 'כתובת המייל לא תקינה';
  if(/too-many-requests/.test(c))return 'יותר מדי ניסיונות. נסו שוב בעוד כמה דקות';
  if(/network/.test(c))return 'אין חיבור לאינטרנט';
  if(/permission-denied/.test(c))return 'אין הרשאה לפעולה הזו';
  if(/operation-not-allowed/.test(c))return 'שיטת הכניסה הזו לא הופעלה ב-Firebase';
  if(/unauthorized-domain/.test(c))return 'צריך להוסיף את כתובת האתר ל-Authorized domains ב-Firebase';
  if(/popup-closed|cancelled-popup/.test(c))return '';
  return 'משהו השתבש, נסו שוב';
}
if(!DEMO){
  firebase.initializeApp(CFG.firebase);
  const fs=firebase.firestore(), au=firebase.auth();
  try{fs.enablePersistence({synchronizeTabs:true}).catch(()=>{})}catch(e){}
  const onErr=e=>{console.error(e);const m=errMsg(e);if(m)toast(m)};
  api={
    doc:(c,id,fn)=>fs.collection(c).doc(id).onSnapshot(s=>fn(s.exists?s.data():null),onErr),
    col:(c,fn)=>fs.collection(c).onSnapshot(s=>{const o={};s.forEach(d=>{o[d.id]=d.data()});fn(o)},onErr),
    photos:(owner,fn)=>fs.collection('photos').where('owner','==',owner).onSnapshot(s=>{const a=[];s.forEach(d=>a.push(Object.assign({id:d.id},d.data())));fn(a)},onErr),
    set:(c,id,data)=>fs.collection(c).doc(id).set(data,{merge:true}).catch(onErr),
    replace:(c,id,data)=>fs.collection(c).doc(id).set(data).catch(onErr),
    del:(c,id)=>fs.collection(c).doc(id).delete().catch(onErr),
    addPhoto:(owner,d,data)=>fs.collection('photos').add({owner,d,data}).catch(onErr),
    newId:()=>fs.collection('members').doc().id,
    gsign:(from,fn)=>fs.collection('gsign').where('d','>=',from).onSnapshot(s=>{const a=[];s.forEach(d=>a.push(Object.assign({id:d.id},d.data())));fn(a)},e=>{console.error(e);if(isCoach&&!gsErr){gsErr=1;toast('להרשמה לשיעורים צריך לעדכן את כללי האבטחה ב-Firebase')}})
  };
  authApi={
    onChange:fn=>au.onAuthStateChanged(u=>fn(u?{uid:u.uid,email:(u.email||'').toLowerCase(),name:u.displayName||''}:null)),
    signIn:(e,p)=>au.signInWithEmailAndPassword(e,p),
    signUp:async(e,p,n)=>{const c=await au.createUserWithEmailAndPassword(e,p);if(n){try{await c.user.updateProfile({displayName:n})}catch(x){}}return c},
    google:()=>au.signInWithPopup(new firebase.auth.GoogleAuthProvider()),
    reset:e=>au.sendPasswordResetEmail(e),
    signOut:()=>au.signOut()
  };
}else{
  /* ---- demo backend: כל הנתונים נשמרים בדפדפן הזה בלבד ---- */
  let store=ls.get('yf-demo',null);
  if(!store||!store.v13)store=seedDemo();
  const L=new Set();
  const emit=()=>{ls.set('yf-demo',store);L.forEach(f=>f())};
  const listen=f=>{L.add(f);setTimeout(f,0);return ()=>L.delete(f)};
  api={
    doc:(c,id,fn)=>listen(()=>fn(clone((store[c]||{})[id]||null))),
    col:(c,fn)=>listen(()=>fn(clone(store[c]||{}))),
    photos:(owner,fn)=>listen(()=>fn(Object.entries(store.photos||{}).filter(([,v])=>v.owner===owner).map(([k,v])=>Object.assign({id:k},v)))),
    set:(c,id,data)=>{store[c]=store[c]||{};store[c][id]=deepMerge(store[c][id]||{},clone(data));emit();return Promise.resolve()},
    replace:(c,id,data)=>{store[c]=store[c]||{};store[c][id]=clone(data);emit();return Promise.resolve()},
    del:(c,id)=>{if(store[c])delete store[c][id];emit();return Promise.resolve()},
    addPhoto:(owner,d,data)=>{store.photos=store.photos||{};store.photos[uid()]={owner,d,data};emit();return Promise.resolve()},
    newId:uid,
    gsign:(from,fn)=>listen(()=>fn(Object.entries(store.gsign||{}).filter(([,v])=>v.d>=from).map(([k,v])=>Object.assign({id:k},v))))
  };
  let cb=null;
  const cur=()=>{const u=ls.get('yf-demo-user',null);return u?{uid:u.uid,email:u.email,name:u.name}:null};
  const fail=c=>{const e=new Error(c);e.code=c;throw e};
  authApi={
    onChange:fn=>{cb=fn;setTimeout(()=>fn(cur()),0)},
    signIn:async(e,p)=>{const u=(store.users||[]).find(x=>x.email===String(e).toLowerCase());if(!u||(u.pw&&u.pw!==p))fail('auth/invalid-credential');ls.set('yf-demo-user',u);cb&&cb(cur())},
    signUp:async(e,p,n)=>{e=String(e).toLowerCase();if(!/@/.test(e))fail('auth/invalid-email');if(String(p).length<6)fail('auth/weak-password');if((store.users||[]).some(x=>x.email===e))fail('auth/email-already-in-use');const u={uid:uid(),email:e,name:n||'',pw:p};store.users.push(u);emit();ls.set('yf-demo-user',u);cb&&cb(cur())},
    google:async()=>{toast('במצב הדגמה אין כניסה עם Google');},
    reset:async()=>{},
    signOut:async()=>{ls.del('yf-demo-user');cb&&cb(null)},
    demo:async who=>{const u=store.users.find(x=>x.uid===who);ls.set('yf-demo-user',u);cb&&cb(cur())},
    resetDemo:()=>{store=seedDemo();emit();ls.del('yf-demo-user');cb&&cb(null)}
  };
}
function seedDemo(){
  const t0=today(), s={v13:true,users:[{uid:'coach',email:'yakir@demo.com',name:'יקיר',pw:''},{uid:'dani',email:'dani@demo.com',name:'דני כהן',pw:''},{uid:'maya',email:'maya@demo.com',name:'מאיה רון',pw:''},{uid:'yoni',email:'yoni@demo.com',name:'יוני אורן',pw:''}],
    pub:{main:{days:[0,1,2,3,4,5],from:'06:00',to:'22:00',off:[],phone:'050-1234567'}},members:{},coach:{},photos:{}};
  const mk=(id,name,phone,goal,color,offset,offline)=>{
    const m=newMember(name,phone,goal);m.features={log:true,water:true,food:true};
    m.food=[{id:uid(),meal:'בוקר',text:'2 ביצים, פרוסת לחם מלא, ירקות'},{id:uid(),meal:'צהריים',text:'חזה עוף 150 גרם, אורז, סלט'},{id:uid(),meal:'ערב',text:'יוגורט חלבון ופרי'}];
    [[40,10],[42.5,10],[42.5,8],[45,8],[45,10],[47.5,8],[50,6]].forEach((b,i)=>{const d=addDays(t0,-(7-i)*5-offset);m.logs.push({d,ex:'לחיצת חזה',kg:b[0],reps:b[1],sets:4});m.logs.push({d,ex:'סקוואט',kg:b[0]+20+i*2.5,reps:10,sets:4});m.logs.push({d,ex:'דדליפט רומני',kg:b[0]+10,reps:10,sets:3})});
    [[82,92],[81.2,90],[80.1,88.5],[79.4,87]].forEach((b,i)=>m.body.push({d:addDays(t0,-(4-i)*10-offset),kg:b[0],waist:b[1]}));
    const c=newCoach(10,1500,true,color);c.card.start=addDays(t0,-20-offset);c.card.paidDate=c.card.start;if(offline)c.offline=true;
    s.members[id]=m;s.coach[id]=c;return {m,c};
  };
  const d=mk('dani','דני כהן','050-0000001','חיטוב וחיזוק',0,0,false);
  [-12,-9,-5,-2,1,3].forEach((o,i)=>d.c.sessions.push({id:uid(),date:addDays(t0,o),time:['07:00','18:00'][i%2],st:o<0?'came':undefined}));
  d.c.plan[0].ex[0].video='https://www.youtube.com/results?search_query=bench+press+technique';d.c.plan[1].ex[0].video='https://www.youtube.com/results?search_query=squat+technique';
  d.c.plan[0].ex[0].kg=50;d.c.plan[0].ex[1].kg=35;d.c.plan[1].ex[0].kg=70;d.c.plan[0].ex[0].note='ירידה איטית, 3 שניות למטה';
  d.c.plan.push({id:uid(),title:'C · ישבן ורגליים',ex:[['היפ תראסט',4,'10',80],['לאנג׳ בולגרי',3,'10 לכל רגל',12],['דדליפט רומני ברגל אחת',3,'10',14],['מקרבי ירך במכונה',3,'15',40],['פתיחת ירך במכונה',3,'15',45],['חתירה במכונה תומך חזה',4,'12',35]].map(([name,sets,reps,kg])=>({id:uid(),name,sets,reps,kg,note:''}))});
  const woC={id:'wo1',d:addDays(t0,-2),title:'C · ישבן ורגליים',start:Date.now()-2*864e5-52*6e4,end:Date.now()-2*864e5,extra:['abs'],by:'me',
    ex:[['היפ תראסט',80,10,4],['לאנג׳ בולגרי',12,10,3],['דדליפט רומני ברגל אחת',14,10,3],['מקרבי ירך במכונה',40,15,3],['פתיחת ירך במכונה',45,15,3]].map(([name,kg,reps,n],i)=>({id:'we'+i,name,sets:[...Array(n)].map((_,k)=>({kg,reps:i===0&&k===n-1?8:reps,done:true}))}))};
  woC.ex[0].cnote='לדחוף דרך העקבים ולהחזיק שנייה למעלה';woC.ex[0].note='הרגשתי את הישבן עובד מעולה';
  Object.assign(woC.ex[0].sets[3],{note:'נגמר לי הכוח בחזרה 8',fail:true});woC.ex[1].sets[1].cnote='לרדת עמוק יותר בברך האחורית';
  const fakePh=c=>{try{const cv=document.createElement('canvas');cv.width=120;cv.height=160;const g=cv.getContext('2d');g.fillStyle=c;g.fillRect(0,0,120,160);g.fillStyle='rgba(255,255,255,.85)';g.beginPath();g.arc(60,34,18,0,7);g.fill();g.fillRect(38,56,44,70);return cv.toDataURL('image/jpeg',.7)}catch(e){return ''}};
  s.photos.p1={owner:'dani',d:addDays(t0,-60),data:fakePh('#4a3b33')};s.photos.p2={owner:'dani',d:addDays(t0,-2),data:fakePh('#8a5d45')};
  d.c.plan[2].ex[4].ss=true;d.m.chJoin='ch1';
  s.pub.main.ch={id:'ch1',title:'אתגר החודש: 12 אימונים',goal:12,from:addDays(t0,-10),to:addDays(t0,20),board:[]};
  d.m.wos=[woC];woC.ex.forEach(e=>e.sets.forEach(x=>d.m.logs.push(Object.assign({d:woC.d,ex:e.name,kg:x.kg,reps:x.reps,sets:1,wo:woC.id},x.fail?{fail:true,failNote:x.note}:{}))));
  d.m.exNotes={'לחיצת חזה':'ספסל 3, אחיזה ברוחב הכתפיים'};
  [['לחיצת חזה',52.5,6,4,1],['חתירה בכבל',35,12,4],['לחיצת כתפיים',20,10,3]].forEach(([ex,kg,reps,sets,f])=>d.m.logs.push(Object.assign({d:t0,ex,kg,reps,sets},f?{fail:true,failNote:'בסט האחרון, אחרי 6 חזרות'}:{})));
  d.m.requests.push({id:uid(),date:addDays(t0,5),time:'19:00',note:'אם אפשר אחרי העבודה',status:'pending'});
  const n=mk('noa','נועה לוי','052-0000002','כוח',2,2,true);n.c.card.paid=false;
  const hist=(o,price)=>({size:10,start:addDays(t0,o),price,paid:true,paidDate:addDays(t0,o),used:10});
  d.c.cardHistory=[hist(-140,1400),hist(-110,1400),hist(-80,1500),hist(-50,1500)];n.c.cardHistory=[hist(-125,1200),hist(-95,1200),hist(-62,1200),hist(-33,1200)];
  [-25,-20,-16,-12,-8,-6,-3,-1,0,2].forEach((o,i)=>n.c.sessions.push({id:uid(),date:addDays(t0,o),time:['19:00','08:00'][i%2],st:o<0?(o===-12?'missed':'came'):undefined}));
  s.coach.settings={prices:{single:180,cards:[{size:10,price:1500},{size:20,price:2800}],plan:350,online:300},templates:[{id:'tp1',name:'מתחילים · 2 ימים',plan:newCoach().plan,at:t0}]};
  const ymBack=n=>{const x=new Date();x.setDate(1);x.setMonth(x.getMonth()-n);return x.getFullYear()+'-'+pad(x.getMonth()+1)};
  const y=mk('yoni','יוני אורן','053-0000004','עלייה במסה',4,3,false);Object.assign(y.c,{bill:'online',card:{size:10,start:t0,price:0,paid:true,paidDate:''},sessions:[],subStart:ymBack(2),subPays:[{m:ymBack(2),paidDate:addDays(t0,-55),price:300},{m:ymBack(1),paidDate:addDays(t0,-24),price:300}]});
  const clip='https://res.cloudinary.com/demo/video/upload/dog.mp4';
  y.m.vids=[{id:'v0',ex:'דדליפט רומני',url:clip,kind:'cld',d:addDays(t0,-80),at:Date.now()-80*864e5,note:''},{id:'v1',ex:'סקוואט',url:clip,kind:'cld',d:addDays(t0,-6),at:Date.now()-6*864e5,note:'הרגשתי שהברכיים נכנסות פנימה'},{id:'v2',ex:'לחיצת חזה',url:clip,kind:'cld',d:addDays(t0,-1),at:Date.now()-864e5,note:''}];
  const wk0=weekStart(t0);y.m.checkins=[{wk:wk0,d:t0,sleep:4,energy:3,food:4,kg:78,note:'שבוע עמוס בעבודה, אבל הספקתי 3 אימונים'}];y.m.chJoin='ch1';
  y.c.fb={v0:{score:6,text:'לשמור על גב ניטרלי',at:Date.now()-79*864e5,d:addDays(t0,-79)},v1:{score:7,text:'עומק מצוין! לשמור על הברכיים בקו של האצבעות ולדחוף דרך העקבים.',at:Date.now()-5*864e5,d:addDays(t0,-5)}};
  const o=mk('ori','אורי שמש','054-0000005','כושר כללי',5,1,true);Object.assign(o.c,{bill:'single',card:{size:10,start:t0,price:0,paid:true,paidDate:''},cardHistory:[],sessions:[-20,-16,-13,-9,-6,-2,2].map(k=>Object.assign({id:uid(),date:addDays(t0,k),time:'17:00'},k<0?{st:'came'}:{},k<-10?{paid:true,paidDate:addDays(t0,k),price:180}:{}))});
  const dw=k=>parse(addDays(t0,k)).getDay();
  s.pub.main.grp={on:true,list:[{id:'g1',title:'קבוצת בוקר',dow:dw(1),time:'07:00',cap:6},{id:'g2',title:'פונקציונלי',dow:dw(3),time:'19:00',cap:8}],skip:[]};
  s.gsign={};['noa','ori'].forEach(o=>{const k=addDays(t0,1)+'_g1';s.gsign[k+'_'+o]={o,k,d:addDays(t0,1),at:Date.now()}});
  d.m.bday='1992-'+t0.slice(5);n.m.bday='1995-'+addDays(t0,3).slice(5);y.m.joinedAt=addDays(t0,-90);y.m.logs.forEach(l=>{l.d=addDays(l.d,-10)});
  d.m.cancels=[{sid:d.c.sessions[5].id,at:Date.now()-3*36e5,ask:true}];
  s.members.maya=Object.assign(newMember('מאיה רון','054-0000003','ירידה במשקל'),{email:'maya@demo.com'});
  return s;
}
function newMember(name,phone,goal){
  return {name,phone:phone||'',goal:goal||'',avatar:'',features:{log:false,water:false,food:false},water:{every:2,from:'08:00',to:'22:00'},
    logs:[],body:[],food:[],exNotes:{},live:null,wos:[],requests:[],renewReq:false,joinedAt:today()};
}
function newCoach(size,price,paid,color){
  return {approved:true,color:color??Math.floor(Math.random()*AV.length),card:{size:+size||10,start:today(),price:+price||0,paid:!!paid,paidDate:paid?today():''},cardHistory:[],sessions:[],
    plan:[
      {id:uid(),title:'A · פלג גוף עליון',ex:[{id:uid(),name:'לחיצת חזה',sets:4,reps:'10',note:''},{id:uid(),name:'חתירה בכבל',sets:4,reps:'12',note:''},{id:uid(),name:'לחיצת כתפיים',sets:3,reps:'10',note:''}]},
      {id:uid(),title:'B · פלג גוף תחתון',ex:[{id:uid(),name:'סקוואט',sets:4,reps:'8-10',note:''},{id:uid(),name:'דדליפט רומני',sets:3,reps:'10',note:''},{id:uid(),name:'לאנג׳ים',sets:3,reps:'12 לכל רגל',note:''}]}
    ]};
}

/* =========================================================
   STATE
   ========================================================= */
const MK=['name','phone','goal','email','wants','avatar','features','water','logs','body','food','exNotes','vids','live','wos','checkins','chJoin','payRep','health','cancels','eat','habits','review','ref','bday','requests','renewReq','joinedAt'];
const CK=['approved','card','cardHistory','plan','sessions','color','offline','bill','rate','subStart','subPays','fb','ckfb','self','fmt','freq','disc','hpaper','fixed','fixedSkip','macro','cycle','refGiven'];
const DB={pub:null,members:{},coach:{},photos:{},myM:undefined,myC:undefined,allLoaded:{m:false,c:false}};
let user=null,isCoach=false,subs=[],photoSubs={},authReady=false,roleStarted={};
const ui={role:null,tab:null,sel:null,day:today(),planIdx:0,progEx:null,bookDay:today(),wk:today(),authMode:'in',busy:false};

const DEF_PUB={days:[0,1,2,3,4,5],from:'06:00',to:'22:00',off:[],phone:''};
const DEF_POL={cancel:false,hours:24,charge:true,fixed:false,weeks:4,wait:false},DEF_GROW={ref:false,gift:'אימון מתנה',rev:false,after:10};
const POL=()=>Object.assign({},DEF_POL,PUB().policy||{}),GROW=()=>Object.assign({},DEF_GROW,PUB().growth||{}),PAY=()=>Object.assign({paybox:'',bit:''},PUB().pay||{});
const PUB=()=>Object.assign({},DEF_PUB,DB.pub||{});
function slotsFor(d){
  const s=PUB();if(!(s.days||[]).includes(parse(d).getDay())||(s.off||[]).includes(d))return [];
  const a=+s.from.slice(0,2),b=+s.to.slice(0,2),out=[];for(let h=a;h<b;h++)out.push(pad(h)+':00');return out;
}
function norm(id){
  const m=DB.members[id]||{},c=DB.coach[id]||{};
  const t=Object.assign({id},clone(m),clone(c));
  t.features=Object.assign({log:false,water:false,food:false,rm:false,cmp:false,report:false,nutri:false,habits:false},t.features||{});
  t.water=Object.assign({every:2,from:'08:00',to:'22:00'},t.water||{});
  t.exNotes=Object.assign({},t.exNotes||{});
  ['logs','body','food','requests','sessions','plan','cardHistory','vids','subPays','wos','checkins','cancels','fixed','fixedSkip','eat'].forEach(k=>{if(!Array.isArray(t[k]))t[k]=[]});
  t.fb=Object.assign({},t.fb||{});t.ckfb=Object.assign({},t.ckfb||{});
  t.card=Object.assign({size:10,start:today(),price:0,paid:false,paidDate:''},t.card||{});
  t.name=t.name||'מתאמן';t.color=t.color??0;
  t.hasM=!!DB.members[id];t.hasC=!!DB.coach[id];
  return t;
}
const T=id=>(id&&(DB.members[id]||DB.coach[id]))?norm(id):null;
function save(t,...keys){
  const m={},c={};keys.forEach(k=>{if(MK.includes(k))m[k]=t[k]??null;else if(CK.includes(k))c[k]=t[k]??null});
  if(Object.keys(m).length){DB.members[t.id]=deepMerge(DB.members[t.id]||{},clone(m));api.set('members',t.id,m)}
  if(Object.keys(c).length){DB.coach[t.id]=deepMerge(DB.coach[t.id]||{},clone(c));api.set('coach',t.id,c)}
  render();
}
const tList=()=>Object.keys(DB.coach).filter(id=>DB.coach[id]&&DB.coach[id].approved).map(norm).sort((a,b)=>cleanName(a.name).localeCompare(cleanName(b.name),'he'));
const joinReqs=()=>Object.keys(DB.members).filter(id=>!DB.coach[id]).map(norm);
const allSessions=()=>tList().flatMap(t=>t.sessions.map(s=>Object.assign({tid:t.id},s)));
const daySess=d=>allSessions().filter(s=>s.date===d).sort((a,b)=>a.time.localeCompare(b.time));
const sessOf=t=>t.sessions.filter(x=>x.st!=='late'&&!(t.cancels||[]).some(c=>c.sid===x.id&&!c.ask)).slice().sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));
const pendingReqs=()=>tList().flatMap(t=>t.requests.filter(r=>r.status==='pending').map(r=>Object.assign({tid:t.id},r))).sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));
/* תזכורת שבועית: מחמישי בצהריים ועד סוף שבת, למי שעוד לא קבע לשבוע הבא */
const PLAN_DAY=4,PLAN_FROM='12:00';
const nextWeek=()=>{const a=addDays(weekStart(today()),7);return [...Array(7)].map((_,i)=>addDays(a,i))};
const isPlanTime=()=>{const d=new Date().getDay();return d>PLAN_DAY||(d===PLAN_DAY&&nowHM()>=PLAN_FROM)};
const bookedNext=t=>{const w=nextWeek();return [...t.sessions,...t.requests.filter(r=>r.status==='pending')].some(x=>w.includes(x.date))};
const needsPlan=t=>billOf(t)!=='online'&&isPlanTime()&&cardInfo(t).left>0&&!bookedNext(t)&&nextWeek().some(d=>slotsFor(d).length);
/* =========================================================
   BILLING — מחירון (coach/settings, רק יקיר רואה) וסוג תשלום לכל מתאמן:
   card = כרטיסייה, single = לפי אימון (כל אימון שסומן ״הגיע״), online = מנוי חודשי
   ========================================================= */
const FMTS=[['solo','אישי'],['pair','זוגי'],['trio','שלישייה'],['group','קבוצה']],FMTN=Object.fromEntries(FMTS);
/* מחירון: לכל סוג אימון (אישי/זוגי/שלישייה/קבוצה) מחיר לאימון בודד, כרטיסיות ומנוי חודשי לפי מספר אימונים בשבוע. מחירים לזוגי ומעלה = למשתתף */
function PRICES(){
  const raw=((DB.coach.settings||{}).prices)||{},P={plan:+raw.plan||0,online:+raw.online||0,fmt:{}};
  FMTS.forEach(([k])=>{const f=(raw.fmt||{})[k]||(k==='solo'?{single:raw.single,cards:raw.cards}:{});
    P.fmt[k]={single:+f.single||0,cards:(f.cards||[]).filter(c=>+c.size>0).map(c=>({size:+c.size,price:+c.price||0})).sort((a,b)=>a.size-b.size),monthly:[1,2,3,4,5].reduce((o,n)=>(o[n]=+((f.monthly||{})[n])||0,o),{})}});
  if(!P.fmt.solo.cards.length)P.fmt.solo.cards=[{size:10,price:0}];
  P.single=P.fmt.solo.single;P.cards=P.fmt.solo.cards;return P;
}
const BILLS=['card','single','monthly','online'];
const billOf=t=>t&&BILLS.includes(t.bill)?t.bill:'card';
const BILL_NAME={card:'כרטיסייה',single:'לפי אימון',monthly:'מנוי חודשי',online:'אונליין'};
const fmtOf=t=>t&&FMTN[t.fmt]?t.fmt:'solo';
const isSub=t=>['monthly','online'].includes(billOf(t));
const discOf=(t,v)=>Math.round((+v||0)*(1-Math.min(100,+(t&&t.disc)||0)/100));
function listRate(t){const P=PRICES(),b=billOf(t),f=P.fmt[fmtOf(t)];return b==='online'?P.online:b==='monthly'?f.monthly[+t.freq||2]:b==='single'?f.single:0}
const rateOf=t=>+t.rate||discOf(t,listRate(t));
const cardPriceFor=(t,size)=>{if(+t.rate)return +t.rate;const c=PRICES().fmt[fmtOf(t)].cards.find(x=>x.size===+size);return c&&c.price?discOf(t,c.price):0};
function dealText(t){const b=billOf(t),f=FMTN[fmtOf(t)];return (b==='card'?`כרטיסייה ${t.card.size} · ${f}`:b==='single'?`לפי אימון · ${f}`:b==='monthly'?`מנוי ${+t.freq||2} בשבוע · ${f}`:'אונליין')+(+t.rate?' · מחיר מיוחד':+t.disc?` · הנחה ${t.disc}%`:'')}
const ymOf=d=>d.slice(0,7), ymNext=ym=>{const [y,m]=ym.split('-').map(Number);return m===12?(y+1)+'-01':y+'-'+pad(m+1)};
function subDue(t){const cur=ymOf(today()),paid=new Set(t.subPays.map(x=>x.m)),out=[];let m=t.subStart||cur;for(let i=0;i<60&&m<=cur;i++){if(!paid.has(m))out.push(m);m=ymNext(m)}return out}
function owed(t){
  const b=billOf(t);
  if(b==='single'){const it=t.sessions.filter(s=>(s.st==='came'||s.st==='late')&&!s.paid).sort((a,c)=>a.date.localeCompare(c.date));return {n:it.length,amount:it.reduce((a,s)=>a+(+s.price||rateOf(t)),0),items:it}}
  if(isSub(t)){const ms=subDue(t);return {n:ms.length,amount:ms.length*rateOf(t),items:ms}}
  return t.card.paid?{n:0,amount:0,items:[]}:{n:1,amount:+t.card.price||0,items:[]};
}
function billChip(t){
  const b=billOf(t);if(b==='card'){const ci=cardInfo(t);return `<span class="chip ${ci.low?'bad':'good'} num">${ci.left}/${ci.size}</span>`}
  const o=owed(t);return `<span class="chip ${o.n?'warn':'cool'} num">${BILL_NAME[b]}${o.n?' · חוב':''}</span>`;
}
function cardInfo(t){if(billOf(t)!=='card')return {used:t.sessions.filter(s=>s.st==='came').length,size:0,left:99,low:false,none:true};const used=t.sessions.filter(s=>s.date>=t.card.start).length;const size=t.card.size||10,left=Math.max(0,size-used);return {used,size,left,low:left<=2}}
function attendance(t){const c=t.sessions.filter(s=>s.st==='came').length,m=t.sessions.filter(s=>s.st==='missed'||s.st==='late').length;return {c,m,pct:c+m?Math.round(c/(c+m)*100):null}}
function achievements(t){
  const now=today()+nowHM();
  const done=t.sessions.filter(s=>(s.date+s.time)<=now&&s.st!=='missed');
  const weeks=new Set(done.map(s=>weekStart(s.date)));
  let cur=weekStart(today());if(!weeks.has(cur))cur=addDays(cur,-7);
  let streak=0;while(weeks.has(cur)){streak++;cur=addDays(cur,-7)}
  let best=0,run=0,prev=null;[...weeks].sort().forEach(w=>{run=(prev&&addDays(prev,7)===w)?run+1:1;best=Math.max(best,run);prev=w});
  const recs=records(t), prs=recs.filter(r=>r.type==='kg').length, vprs=recs.filter(r=>r.type==='vol').length, maxVol=Math.max(0,...workouts(t).map(w=>w.vol));
  const att=attendance(t), n=done.length, ph=(DB.photos[t.id]||[]).length;
  const B=(id,title,sub,val,goal)=>({id,title,sub,earned:val>=goal,val:Math.min(val,goal),goal});
  const list=[
    B('s1','אימון ראשון','הצעד הכי חשוב',n,1),
    B('s10','10 אימונים','מתחילים לראות תוצאות',n,10),
    B('s25','25 אימונים','זה כבר הרגל',n,25),
    B('s50','50 אימונים','חצי מאה',n,50),
    B('s100','100 אימונים','מועדון המאה',n,100),
    B('w4','רצף חודש','4 שבועות ברצף',best,4),
    B('w12','רצף 3 חודשים','12 שבועות ברצף',best,12),
    B('pr1','שיא ראשון','הרמת יותר מאי פעם',prs,1),
    B('pr5','5 שיאי משקל','שוברים את התקרה',prs,5),
    B('pr10','10 שיאים','כוח שלא מפסיק לעלות',prs,10),
    B('vpr1','שיא נפח','האימון הכי כבד שלך',vprs,1),
    B('vpr5','5 שיאי נפח','כל פעם קצת יותר',vprs,5),
    B('car','הרמת רכב','1,300 ק״ג באימון אחד',maxVol>=1300?1:0,1),
    B('ele','הרמת פיל','6,000 ק״ג באימון אחד',maxVol>=6000?1:0,1),
    B('att','מתמיד','90% הגעה, לפחות 10 אימונים',(att.c+att.m>=10&&att.pct>=90)?1:0,1),
    B('body','מדידה ראשונה','יודעים מאיפה מתחילים',t.body.length,1),
    B('photo','תמונה ראשונה','לפני שרואים את האחרי',ph,1)
  ];
  return {streak,best,done:n,prs,list,earned:list.filter(b=>b.earned)};
}
function achievementsBlock(t){
  const a=achievements(t);
  const next=a.list.filter(b=>!b.earned).sort((x,y)=>(y.val/y.goal)-(x.val/x.goal))[0];
  return `<div class="h-sec"><span>הישגים · ${a.earned.length}/${a.list.length}</span></div>
  <div class="streak card"><span class="flame ${a.streak?'on':''}">${mini(I.flame,30)}</span><div class="grow"><div class="num" style="font-family:var(--display);font-weight:800;font-size:32px;line-height:1">${a.streak} <span style="font-size:22px">${a.streak===1?'שבוע':'שבועות'}</span></div><div class="small muted">${a.streak?'רצף אימונים נוכחי. אימון אחד בשבוע שומר עליו':'אימון השבוע מתחיל רצף חדש'}${a.best>a.streak?' · שיא: '+a.best:''}</div></div></div>
  ${next?`<div class="item" style="margin-top:8px"><div class="grow"><div class="small muted">ההישג הבא</div><b>${next.title}</b><div class="bar" style="margin-top:6px"><i style="width:${next.val/next.goal*100}%"></i></div></div><span class="num small muted">${next.val}/${next.goal}</span></div>`:''}
  <div class="badges" style="margin-top:10px">${a.list.map(b=>`<div class="badge ${b.earned?'on':''}" title="${esc(b.sub)}"><span class="badge-ic">${b.earned?mini(I.medal,24):`<span class="num">${b.goal>1?b.val+'/'+b.goal:'?'}</span>`}</span><b>${b.title}</b><span>${b.sub}</span></div>`).join('')}</div>`;
}
function checkNewBadges(t){
  const k='yf-badges-'+t.id, seen=ls.get(k,null), ids=achievements(t).earned.map(b=>b.id);
  if(seen===null){ls.set(k,ids);return}
  const fresh=achievements(t).earned.filter(b=>!seen.includes(b.id));
  if(fresh.length){ls.set(k,ids);setTimeout(()=>toast(mini(I.medal,18)+' הישג חדש: '+fresh.map(b=>b.title).join(', '),'badge'),300)}
}
/* =========================================================
   WORKOUTS — נפח, שרירים, שיאים
   אימון = כל הרישומים של אותו תאריך. נפח = משקל × חזרות × סטים.
   ========================================================= */
const MUS=[['chest','חזה'],['shoulders','כתפיים'],['biceps','יד קדמית'],['triceps','יד אחורית'],['forearms','אמות'],['abs','בטן'],['traps','טרפז'],['lats','גב רחב'],['lowback','גב תחתון'],['glutes','ישבן'],['glutemed','ישבן צידי'],['adductors','מפשעות'],['quads','ארבע ראשי'],['hams','המסטרינג'],['calves','תאומים']];
const MUSN=Object.fromEntries(MUS);
// זיהוי אוטומטי לפי שם התרגיל: [ביטוי, שרירים עיקריים, משניים]. הראשון שמתאים קובע.
const MUS_RULES=[
  [/מקרב|adduct|ירך פנימית|מפשע/i,['adductors'],[]],
  [/פתיחת ירך|מרחיק|abduct|ישבן צידי/i,['glutemed'],[]],
  [/(רומני|rdl|romanian|דדליפט).*(רגל אחת|חד.?רגלי)|(רגל אחת|חד.?רגלי|single.?leg).*(רומני|rdl|romanian|דדליפט)/i,['glutes','hams'],[]],
  [/בולגרי|bulgarian/i,['glutes','quads'],[]],
  [/חתירה.*(תומך|תמיכת) ?חזה|chest.?supported/i,['lats'],['shoulders','biceps']],
  [/היפ ?ט?ת?ראסט|היפטרסט|hip ?thrust/i,['glutes'],[]],
  [/רומני|rdl|romanian|גוד מורנינג|good ?morning/i,['hams','glutes'],['lowback']],
  [/דדליפט|deadlift/i,['glutes','hams','lowback'],['quads','traps','forearms']],
  [/גשר|glute|קיק ?בק|kickback/i,['glutes'],['hams']],
  [/כפיפת ברכיים|leg ?curl|המסטרינג|hamstring/i,['hams'],[]],
  [/פשיטת ברכיים|leg ?ext/i,['quads'],[]],
  [/סקוואט|squat|לאנג|lunge|מכרע|לחיצת רגליים|leg ?press|בולגרי|סטפ|step ?up/i,['quads','glutes'],['hams']],
  [/תאומים|calf|calves|בהונות/i,['calves'],[]],
  [/הרחק|lateral|פרפר הפוך|rear ?delt|face ?pull|פייס/i,['shoulders'],['traps']],
  [/לחיצת כתפיים|כתפיים|shoulder|overhead|ohp|military|ארנולד/i,['shoulders'],['triceps']],
  [/שראג|shrug|טרפז/i,['traps'],[]],
  [/חזה|bench|פרפר|fly|מקבילים|dips?\b|שכיבות סמיכה|push ?up|קרוס|crossover/i,['chest'],['triceps','shoulders']],
  [/מתח|pull ?up|chin|פולי|pull ?down/i,['lats'],['biceps']],
  [/חתירה|row|משיכ/i,['lats','traps'],['biceps','shoulders']],
  [/פשיטת מרפקים|טרייספס|triceps|יד אחורית|פרנץ|french|skull|push ?down/i,['triceps'],[]],
  [/כפיפת מרפקים|בייספס|biceps|curl|יד קדמית|פטיש|hammer/i,['biceps'],['forearms']],
  [/בטן|\babs\b|crunch|כפיפות|פלאנק|plank|קראנץ|הרמות רגליים|רוסי|russian/i,['abs'],[]],
  [/היפר|hyper|back ?ext|גב תחתון|סופרמן/i,['lowback'],['glutes']],
  [/אמות|forearm|wrist|פרק כף/i,['forearms'],[]]
];
const BW_EX=/מתח|מקבילים|שכיבות|pull ?up|chin|dips?\b|push ?up/i; // תרגילי משקל גוף: בלי משקל נוסף נחשב משקל הגוף
const EX_LIB=['לחיצת חזה','לחיצת חזה בשיפוע','פרפר במכונה','מקבילים','שכיבות סמיכה','לחיצת כתפיים','הרחקת כתפיים','פרפר הפוך','פייס פול','מתח','פולי עליון','חתירה בכבל','חתירה במכונה תומך חזה','חתירה עם משקולת','שראגס','כפיפת מרפקים','פטיש','פשיטת מרפקים בפולי','פרנץ׳ פרס','סקוואט','לחיצת רגליים','לאנג׳ים','לאנג׳ בולגרי','פשיטת ברכיים','כפיפת ברכיים','דדליפט','דדליפט רומני','דדליפט רומני ברגל אחת','היפ תראסט','גשר עכוז','קיק בק בכבל','מקרבי ירך במכונה','פתיחת ירך במכונה','תאומים בעמידה','כפיפות בטן','פלאנק','הרמות רגליים','היפר אקסטנשן'];
function guessMus(name){const r=MUS_RULES.find(([re])=>re.test(name||''));return r?{p:r[1].slice(),s:r[2].slice()}:{p:[],s:[]}}
const planEx=(t,name)=>t.plan.flatMap(d=>d.ex).find(x=>x.name===name);
function exMus(t,name){const e=planEx(t,name);return e&&e.mus&&(e.mus.p||[]).length?e.mus:guessMus(name)}
function shares(m){const o={};(m.s||[]).forEach(k=>o[k]=.4);(m.p||[]).forEach(k=>o[k]=1);const sum=Object.values(o).reduce((a,b)=>a+b,0);Object.keys(o).forEach(k=>o[k]/=sum);return o}
function bodyKg(t){const b=t.body.filter(x=>+x.kg).sort((a,c)=>a.d.localeCompare(c.d)).pop();return b?+b.kg:0}
const logSets=(t,l)=>+l.sets||+(planEx(t,l.ex)||{}).sets||1;
const logVol=(t,l)=>(+l.kg||(BW_EX.test(l.ex)?bodyKg(t):0))*(+l.reps||0)*logSets(t,l);
/* נפח ואחוז לכל שריר מתוך רישומים. extra = שרירים שיקיר סימן ידנית (כל אחד מקבל 12% מהבסיס) */
function musFrom(t,logs,extra){
  const mv={},ms={};let vol=0;
  logs.forEach(l=>{const v=logVol(t,l),n=logSets(t,l);vol+=v;Object.entries(shares(exMus(t,l.ex))).forEach(([k,f])=>{mv[k]=(mv[k]||0)+v*f;ms[k]=(ms[k]||0)+n*f})});
  const src=vol>0?mv:ms,base=Object.values(src).reduce((a,b)=>a+b,0)||1;
  (extra||[]).forEach(k=>{if(MUSN[k])src[k]=(src[k]||0)+base*.12});
  const tot=Object.values(src).reduce((a,b)=>a+b,0)||1;
  return {vol:Math.round(vol),mus:Object.entries(src).map(([k,v])=>[k,Math.round(v/tot*100)]).filter(x=>x[1]>0).sort((a,b)=>b[1]-a[1])};
}
function workouts(t){
  const by={};t.logs.forEach(l=>{(by[l.d]=by[l.d]||[]).push(l)});
  return Object.keys(by).sort().map(d=>{
    const logs=by[d],extra=[...new Set(t.wos.filter(x=>x.d===d).flatMap(x=>x.extra||[]))],r=musFrom(t,logs,extra);
    return {d,logs,vol:r.vol,mus:r.mus,extra};
  });
}
function records(t){
  const out=[],max={};let best=0;
  workouts(t).forEach(w=>{
    w.logs.forEach(l=>{const kg=+l.kg;if(max[l.ex]!=null&&kg>max[l.ex])out.push({d:w.d,type:'kg',ex:l.ex,val:kg,prev:max[l.ex]});max[l.ex]=Math.max(max[l.ex]??-1,kg)});
    if(best>0&&w.vol>best)out.push({d:w.d,type:'vol',val:w.vol,prev:best});best=Math.max(best,w.vol);
  });
  return out;
}
const HEAVY=[[5,'חתול','חתולים','🐈'],[30,'כלב גדול','כלבים גדולים','🐕'],[80,'אדם','אנשים','🧍'],[150,'מקרר','מקררים','🧊'],[300,'פסנתר','פסנתרים','🎹'],[500,'סוס','סוסים','🐎'],[1300,'רכב פרטי','רכבים פרטיים','🚗'],[2500,'טנדר','טנדרים','🛻'],[6000,'פיל','פילים','🐘'],[12000,'אוטובוס','אוטובוסים','🚌'],[40000,'מטוס נוסעים','מטוסי נוסעים','✈️']];
function heavyLike(v){const h=HEAVY.slice().reverse().find(([w])=>v>=w);if(!h)return null;const n=Math.round(v/h[0]);return {emo:h[3],text:n<2?`כמו להרים ${h[1]}`:`כמו להרים ${n} ${h[2]}`}}
const kgf=n=>(+n||0).toLocaleString('he-IL',{maximumFractionDigits:1});
/* מפת גוף: מלפנים ומאחור. כל שריר נצבע לפי חלקו בנפח */
const SIL='<circle cx="50" cy="14" r="10"/><rect x="45" y="22" width="10" height="10" rx="3"/><path d="M29 33Q50 28 71 33Q78 36 77 46L70 108Q50 114 30 108L23 46Q22 36 29 33Z"/><rect x="15" y="37" width="12" height="88" rx="6"/><rect x="73" y="37" width="12" height="88" rx="6"/><circle cx="21" cy="130" r="5"/><circle cx="79" cy="130" r="5"/><rect x="33" y="102" width="16" height="112" rx="8"/><rect x="51" y="102" width="16" height="112" rx="8"/>';
const SH={sh:'<ellipse cx="27" cy="43" rx="7" ry="8"/><ellipse cx="73" cy="43" rx="7" ry="8"/>',arm:'<ellipse cx="21" cy="63" rx="4.6" ry="11"/><ellipse cx="79" cy="63" rx="4.6" ry="11"/>',fa:'<ellipse cx="21" cy="94" rx="4.2" ry="13"/><ellipse cx="79" cy="94" rx="4.2" ry="13"/>'};
const BODY_F=[['shoulders',SH.sh],['chest','<path d="M35 40Q42 37 49 40L49 58Q41 61 35 56Z"/><path d="M65 40Q58 37 51 40L51 58Q59 61 65 56Z"/>'],['biceps',SH.arm],['forearms',SH.fa],['abs','<rect x="42" y="62" width="16" height="42" rx="6"/>'],['quads','<path d="M35 116Q41 112 48 116L47 166Q41 170 36 165Z"/><path d="M65 116Q59 112 52 116L53 166Q59 170 64 165Z"/>'],['calves','<ellipse cx="41" cy="190" rx="4.5" ry="13"/><ellipse cx="59" cy="190" rx="4.5" ry="13"/>'],['adductors','<path d="M49 117Q44 124 45 140Q46 147 49 149Z"/><path d="M51 117Q56 124 55 140Q54 147 51 149Z"/>']];
const BODY_B=[['traps','<path d="M50 26L37 38L50 62L63 38Z"/>'],['shoulders',SH.sh],['lats','<path d="M36 44L47 62L47 92Q40 90 37 80Q33 62 36 44Z"/><path d="M64 44L53 62L53 92Q60 90 63 80Q67 62 64 44Z"/>'],['triceps',SH.arm],['forearms',SH.fa],['lowback','<rect x="43" y="88" width="14" height="20" rx="5"/>'],['glutes','<ellipse cx="42" cy="121" rx="8.5" ry="10"/><ellipse cx="58" cy="121" rx="8.5" ry="10"/>'],['hams','<ellipse cx="41" cy="152" rx="6.5" ry="17"/><ellipse cx="59" cy="152" rx="6.5" ry="17"/>'],['calves','<ellipse cx="41" cy="188" rx="5.5" ry="14"/><ellipse cx="59" cy="188" rx="5.5" ry="14"/>'],['glutemed','<ellipse cx="36.5" cy="110" rx="4.5" ry="6"/><ellipse cx="63.5" cy="110" rx="4.5" ry="6"/>'],['adductors','<path d="M49 132Q46 140 47 150L49.5 151Z"/><path d="M51 132Q54 140 53 150L50.5 151Z"/>']];
function bodyMap(pct,exp){
  const mx=Math.max(1,...Object.values(pct)),c=exp?{sil:'#2a2a2f',off:'#3d3d44'}:{sil:'var(--surface2)',off:'var(--line)'};
  const fig=(parts,dx,cap)=>`<g transform="translate(${dx} 0)"><g style="fill:${c.sil}">${SIL}</g>${parts.map(([k,s])=>{const p=pct[k]||0;return `<g style="fill:${p?`rgba(255,106,43,${(.3+.7*p/mx).toFixed(2)})`:c.off}">${exp?'':`<title>${MUSN[k]}${p?' · '+p+'%':''}</title>`}${s}</g>`}).join('')}${exp?'':`<text x="50" y="230" text-anchor="middle" font-size="10" style="fill:var(--muted)">${cap}</text>`}</g>`;
  return exp?`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 210 220" width="840" height="880">${fig(BODY_B,0)}${fig(BODY_F,110)}</svg>`
    :`<svg class="bodymap" viewBox="0 0 210 236" role="img" aria-label="מפת השרירים שעבדו באימון">${fig(BODY_B,0,'מאחור')}${fig(BODY_F,110,'מלפנים')}</svg>`;
}
function workoutCard(t,w,opts={}){
  const recs=records(t).filter(r=>r.d===w.d), h=heavyLike(w.vol), sets=w.logs.reduce((a,l)=>a+logSets(t,l),0);
  return `<div class="card">
    <div class="row"><div class="grow"><div class="small muted">נפח כולל באימון</div><div class="wo-vol num">${kgf(w.vol)} <span>ק״ג</span></div></div>${h?`<div class="wo-like"><span class="wo-emo">${h.emo}</span><span class="small">${h.text}</span></div>`:''}</div>
    <div class="row wrap-ok" style="gap:6px;margin-top:10px"><span class="chip num">${new Set(w.logs.map(l=>l.ex)).size} תרגילים</span><span class="chip num">${sets} סטים</span>${recs.map(r=>`<span class="chip warn">${mini(I.medal,12)} ${r.type==='vol'?'שיא נפח':'שיא · '+esc(r.ex)}</span>`).join('')}</div>
    ${w.mus.length?`<div class="small muted" style="margin-top:16px">השרירים שעבדו · אחוז מהנפח</div>${bodyMap(Object.fromEntries(w.mus))}<div class="wo-mus">${w.mus.map(([k,p])=>`<div class="mrow"><span>${MUSN[k]}</span><span class="bar"><i style="width:${p/w.mus[0][1]*100}%"></i></span><b class="num">${p}%</b></div>`).join('')}</div>`:''}
    ${opts.logs?woDetail(t,w,opts):''}
  </div>`;
}
const noteWho=t=>isCoach?cleanName(firstName(t))||'המתאמן':'אני';
function notesHTML(t,o){return (o.cnote?`<div class="aw-note coach"><b>יקיר:</b> ${esc(o.cnote)}</div>`:'')+(o.note?`<div class="aw-note"><b>${esc(noteWho(t))}:</b> ${esc(o.note)}</div>`:'')}
function woDetail(t,w,opts){
  const wos=t.wos.filter(x=>x.d===w.d),info=n=>{for(const o of wos){const i=o.ex.findIndex(x=>x.name===n);if(i>-1)return {o,i,e:o.ex[i]}}return null};
  const names=[...new Set([...w.logs.map(l=>l.ex),...wos.flatMap(o=>o.ex.map(e=>e.name))])];
  return `<div class="stack" style="gap:12px;margin-top:14px;border-top:1px solid var(--line);padding-top:12px">${names.map(n=>{const ls=w.logs.filter(l=>l.ex===n),f=info(n);
    const chips=f?f.e.sets.map((x,si)=>`<button class="wo-set num" data-act="woSet" data-id="${f.o.id}|${f.i}|${si}" aria-label="${setLabel(f.e,si)}: הוספת הערה">${x.warm?'חימום · ':''}${+x.kg?kgf(x.kg)+' ק״ג':'משקל גוף'} × ${esc(x.reps)}${x.rpe?' · RPE '+x.rpe:''}${x.note||x.cnote?'<i></i>':''}</button>`).join('')
      :ls.map(l=>`<span class="wo-set num">${+l.sets>1?l.sets+' סטים · ':''}${+l.kg?kgf(l.kg)+' ק״ג':'משקל גוף'} × ${esc(l.reps)}${opts.del&&!l.wo?`<button data-act="delLog" data-v="${t.logs.indexOf(l)}" aria-label="מחיקת רישום">${I.x}</button>`:''}</span>`).join('');
    return `<div>
    <div class="row small"><b class="grow" style="min-width:0">${esc(n)}</b>${(f?f.e.sets.some(x=>x.fail):ls.some(l=>l.fail))?'<span class="chip bad">כשל</span>':''}</div>
    <div class="wo-sets">${chips}</div>
    ${f?notesHTML(t,f.e)+f.e.sets.map((x,si)=>x.note||x.cnote?`<div class="small" style="margin-top:4px"><span class="muted">${setLabel(f.e,si)}:</span>${notesHTML(t,x)}</div>`:'').join(''):''}
    ${ls.filter(l=>!l.wo&&l.fail&&l.failNote).map(l=>`<div class="small muted">כשל: ${esc(l.failNote)}</div>`).join('')}
  </div>`}).join('')}
  ${wos.length?'<div class="aw-hint" style="margin-top:0">לחיצה על סט: הערה, כשל ורמת מאמץ</div>':''}
  ${isCoach&&wos.length?`<div><div class="small muted" style="margin-bottom:6px">יקיר: שרירים נוספים שעבדנו עליהם באימון הזה</div><div class="mus-pick">${MUS.map(([k,nm])=>`<button type="button" class="mchip ${(wos[0].extra||[]).includes(k)?'p':''}" data-act="woMus" data-id="${wos[0].id}" data-v="${k}">${nm}</button>`).join('')}</div></div>`:''}
  <div class="row wrap-ok" style="gap:8px"><button class="btn btn-primary btn-sm" data-act="sumOpen" data-v="${wos.length?wos[0].id:w.d}">${mini(I.share,14)} שיתוף האימון</button>${opts.del&&wos.length?`<button class="btn btn-ghost btn-sm" data-act="delWo" data-v="${wos[0].id}">מחיקת האימון</button>`:''}</div>
  </div>`;
}
function weekStripBlock(t,coach){
  const ws=weekStart(ui.wmWeek||today()),days=[...Array(7)].map((_,i)=>addDays(ws,i)),W=Object.fromEntries(workouts(t).map(w=>[w.d,w])),td=today();
  if(!ui.wmDay||!days.includes(ui.wmDay))ui.wmDay=days.slice().reverse().find(d=>W[d])||(days.includes(td)?td:days[0]);
  const sel=W[ui.wmDay],n7=[...Array(7)].map((_,i)=>addDays(td,-i)).filter(d=>W[d]).length;
  return `<div class="h-sec"><span>${coach?'השבוע של '+esc(firstName(t)):'השבוע שלי'} · שרירים</span><span class="row" style="gap:6px"><button class="icon-btn sm" data-act="wmWeek" data-v="-7" aria-label="שבוע קודם">${I.prev}</button><button class="icon-btn sm" data-act="wmWeek" data-v="7" aria-label="שבוע הבא">${I.next}</button></span></div>
  <div class="card">
    <div class="wk-strip">${days.map(d=>`<button class="wk-day ${d===ui.wmDay?'on':''} ${W[d]?'has':''} ${d===td?'today':''}" data-act="wmDay" data-v="${d}" aria-label="${fmt(d)}${W[d]?' · היה אימון':''}" aria-pressed="${d===ui.wmDay}"><span>${DS[parse(d).getDay()]}</span><i class="num">${W[d]?I.check:parse(d).getDate()}</i></button>`).join('')}</div>
    <div class="small muted" style="text-align:center;margin-top:10px">${coach?esc(firstName(t))+' התאמן/ה':'התאמנת'} <b style="color:var(--fg)">${n7}</b> ${n7===1?'פעם':'פעמים'} ב-7 הימים האחרונים</div>
    ${sel?`<div style="margin-top:6px">${bodyMap(Object.fromEntries(sel.mus))}</div><div class="row wrap-ok" style="justify-content:center;gap:6px">${sel.mus.slice(0,6).map(([k,p])=>`<span class="chip">${MUSN[k]} ${p}%</span>`).join('')}</div><button class="btn btn-ghost btn-sm btn-block" style="margin-top:12px" data-act="woOpen" data-v="${sel.d}">פירוט האימון של ${fmt(sel.d)}</button>`
      :`<div class="small muted" style="text-align:center;padding:22px 0 8px">${ui.wmDay>td?'היום הזה עוד לא הגיע.':'לא נרשם אימון ב'+fmt(ui.wmDay)+'.'}</div>`}
  </div>`;
}
function workoutsBlock(t,coach){
  const ws=workouts(t);
  if(!ws.length)return `<div class="h-sec"><span>${coach?'אימונים, נפח ושרירים':'האימונים שלי · נפח'}</span></div><div class="empty"><b>עוד אין רישומי משקלים</b>${coach?'לחצו על + הכתום ליד תרגיל בתוכנית למעלה כדי לרשום משקל, חזרות וסטים. אחרי הרישום יופיעו כאן הנפח, מפת השרירים והמדליות. גם המתאמן יכול לרשום בעצמו.':'בזמן האימון לחצו על + ליד תרגיל ורשמו כמה הרמתם. כאן יופיעו הנפח של כל אימון, מפת השרירים והמדליות.'}</div>`;
  const recs=records(t);
  return `<div class="h-sec"><span>${coach?'אימונים, נפח ושרירים':'האימונים שלי · נפח'}</span></div>
  ${ws.length>1?`<div class="card">${chart(ws.slice(-12).map(w=>({d:w.d,kg:w.vol})))}</div>`:''}
  <div class="stack" style="margin-top:8px">${ws.slice(-6).reverse().map(w=>{const h=heavyLike(w.vol);return `<button class="item tap" data-act="woOpen" data-v="${w.d}"><span class="grow" style="min-width:0"><b style="display:block">${fmt(w.d)}</b><span class="small muted">${h?h.emo+' '+h.text:''}</span></span>${recs.some(r=>r.d===w.d)?`<span class="chip warn">${mini(I.medal,12)} שיא</span>`:''}<b class="num" style="white-space:nowrap">${kgf(w.vol)} ק״ג</b></button>`}).join('')}</div>
  ${recs.length?`<div class="h-sec"><span>המדליות שלי · ${recs.length} שיאים</span></div><div class="stack">${recs.slice(-8).reverse().map(r=>`<div class="item"><span class="medal-ic">${mini(I.medal,22)}</span><div class="grow" style="min-width:0"><b>${r.type==='vol'?'שיא נפח באימון':esc(r.ex)}</b><div class="small muted">${fmt(r.d)}</div></div><div class="num" style="text-align:end;white-space:nowrap"><b>${kgf(r.val)} ק״ג</b><div class="small" style="color:var(--good)">+${kgf(r.val-r.prev)}</div></div></div>`).join('')}</div>`:''}`;
}
/* סרטון הדגמה בתוך האפליקציה (יוטיוב, טיקטוק, אינסטגרם). [כתובת, אנכי?] */
function embedUrl(u){
  try{const x=new URL(u),h=x.hostname.replace(/^(www|m)\./,'');let m;
    if(h==='youtu.be')return ['https://www.youtube.com/embed/'+x.pathname.slice(1).split('/')[0],false];
    if(/(^|\.)youtube\.com$/.test(h)){if(x.searchParams.get('v'))return ['https://www.youtube.com/embed/'+x.searchParams.get('v'),false];if((m=x.pathname.match(/^\/(shorts|embed|live)\/([\w-]+)/)))return ['https://www.youtube.com/embed/'+m[2],m[1]==='shorts']}
    if(/(^|\.)tiktok\.com$/.test(h)&&(m=x.pathname.match(/\/video\/(\d+)/)))return ['https://www.tiktok.com/embed/v2/'+m[1],true];
    if(h==='drive.google.com'&&(m=x.pathname.match(/\/file\/d\/([\w-]+)/)))return ['https://drive.google.com/file/d/'+m[1]+'/preview',false];
    if(/(^|\.)instagram\.com$/.test(h)&&(m=x.pathname.match(/^\/(reels?|p|tv)\/([\w-]+)/)))return ['https://www.instagram.com/'+(m[1]==='p'?'p':'reel')+'/'+m[2]+'/embed',true];
  }catch(e){}
  return null;
}
function videoSheet(name,url){
  const em=embedUrl(url);
  sheet(esc(name),`<div class="vid-frame ${em[1]?'tall':''}"><iframe src="${esc(em[0])}" title="סרטון הדגמה" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div><a class="btn btn-ghost btn-block" style="margin-top:10px" href="${esc(url)}" target="_blank" rel="noopener">לא נטען? פתיחה באפליקציה</a>`,()=>{},'סגירה');
}
/* =========================================================
   PDF — כל עמוד מצויר בעצמנו על canvas (עברית, RTL) ונכנס ל-PDF דרך jsPDF.
   עמוד צר ונוח לגלילה בטלפון (יחס 1:1.6), טקסט גדול, כרטיס לכל תרגיל.
   ========================================================= */
let pdfLib=null,pdfFile=null,pdfPages=[];
function loadPdfLib(){return pdfLib||(pdfLib=new Promise((res,rej)=>{const s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';s.onload=()=>window.jspdf?res(window.jspdf.jsPDF):rej(new Error('pdf'));s.onerror=()=>{pdfLib=null;s.remove();rej(new Error('pdf'))};document.head.appendChild(s)}))}
const loadImg=src=>new Promise(r=>{const im=new Image();im.onload=()=>r(im);im.onerror=()=>r(null);im.src=src});
async function renderPlanPages(t,useLogos){
  const PW=600,PH=960,M=34,S=2,FOOT=46;
  const C={ink:'#15181d',sub:'#5b6370',faint:'#9aa1ac',line:'#e6e8ec',card:'#ffffff',bg:'#f4f5f7',acc:'#ff6a2b',acc2:'#ffb03a',tint:'#fff3ec',blue:'#1d5fa0',dark:'#0c0f13'};
  const F=(w,px,fam)=>`${w} ${px}px ${fam||'Heebo'},Arial,sans-serif`;
  try{await Promise.all(['400 16px Heebo','500 16px Heebo','700 16px Heebo','800 16px Heebo','700 40px Karantina'].map(f=>document.fonts.load(f)))}catch(e){}
  const [lgDark,lgPrint]=useLogos?await Promise.all([loadImg('logo-dark.png'),loadImg('logo-print.png')]):[null,null];
  const XTRA=150,cv=document.createElement('canvas');cv.width=PW*S;cv.height=(PH+XTRA)*S;const g=cv.getContext('2d'); // מקום נוסף: העמוד האחרון יכול להיות קצת ארוך יותר
  const pages=[],links=[];let y=0,pageNo=0;
  const rr=(x,yy,w,h,r)=>{g.beginPath();g.moveTo(x+r,yy);g.arcTo(x+w,yy,x+w,yy+h,r);g.arcTo(x+w,yy+h,x,yy+h,r);g.arcTo(x,yy+h,x,yy,r);g.arcTo(x,yy,x+w,yy,r);g.closePath()};
  const txt=(s,x,yy,font,color,align)=>{g.font=font;g.fillStyle=color;g.textAlign=align||'right';g.direction='rtl';g.textBaseline='alphabetic';g.fillText(s,x,yy)};
  const wrap=(s,font,maxW)=>{g.font=font;g.direction='rtl';const out=[];String(s||'').split('\n').forEach(par=>{let line='';par.split(/\s+/).filter(Boolean).forEach(w=>{const t2=line?line+' '+w:w;if(g.measureText(t2).width>maxW&&line){out.push(line);line=w}else line=t2});if(line)out.push(line)});return out};
  const fit=(s,w0,px,fam,maxW,min)=>{let p=px;g.font=F(w0,p,fam);while(p>min&&g.measureText(s).width>maxW){p-=1;g.font=F(w0,p,fam)}return F(w0,p,fam)};
  const ph=PUB().phone;
  const footer=hh=>{g.strokeStyle=C.line;g.lineWidth=1;g.beginPath();g.moveTo(M,hh-FOOT+8);g.lineTo(PW-M,hh-FOOT+8);g.stroke();
    txt('יקיר לוי · אימון אישי',PW-M,hh-20,F(500,12),C.faint);txt(String(pageNo),M,hh-20,F(700,12),C.faint,'left')};
  const startPage=()=>{pageNo++;g.setTransform(S,0,0,S,0,0);g.fillStyle=C.bg;g.fillRect(0,0,PW,PH+XTRA);
    if(pageNo>1){if(lgPrint){const w=120,h=w*lgPrint.height/lgPrint.width;g.drawImage(lgPrint,(PW-w)/2,22,w,h);y=22+h+22}else{txt('YAKIR LEVI',PW/2,40,F(800,16),C.ink,'center');y=62}}};
  // העמוד האחרון נחתך לגובה התוכן, בלי שטח ריק בסוף
  const endPage=(hh=PH)=>{footer(hh);const src=document.createElement('canvas');src.width=PW*S;src.height=hh*S;src.getContext('2d').drawImage(cv,0,0);pages.push({src:src.toDataURL('image/jpeg',.9),h:hh})};
  const ensure=h=>{if(y+h>PH-FOOT-6){endPage();startPage()}};
  /* ---- עמוד ראשון: פס כהה עם הלוגו ---- */
  startPage();
  const BAND=230;g.fillStyle=C.dark;g.fillRect(0,0,PW,BAND);
  const glow=g.createRadialGradient(PW/2,BAND*.55,0,PW/2,BAND*.55,PW*.55);glow.addColorStop(0,'rgba(255,106,43,.30)');glow.addColorStop(1,'rgba(255,106,43,0)');g.fillStyle=glow;g.fillRect(0,0,PW,BAND);
  if(lgDark){const w=360,h=w*lgDark.height/lgDark.width;g.drawImage(lgDark,(PW-w)/2,(BAND-h)/2,w,h)}else txt('YAKIR LEVI',PW/2,BAND/2+14,F(800,44),'#fff','center');
  const ac=g.createLinearGradient(0,0,PW,0);ac.addColorStop(0,C.acc2);ac.addColorStop(1,C.acc);g.fillStyle=ac;g.fillRect(0,BAND,PW,5);
  y=BAND+44;
  txt('תוכנית אימונים אישית',PW-M,y,F(700,15),C.acc);y+=38;
  txt(cleanName(t.name),PW-M,y,fit(cleanName(t.name),800,34,'Heebo',PW-2*M,20),C.ink);y+=28;
  const days=t.plan.filter(d=>d.ex.length), nEx=days.reduce((a,d)=>a+d.ex.length,0);
  const meta=[t.goal?'מטרה: '+t.goal:'',parse(today()).toLocaleDateString('he-IL')].filter(Boolean).join('   ·   ');
  txt(meta,PW-M,y,F(400,15),C.sub);y+=20;
  const chips=[`${days.length} ${days.length===1?'יום אימון':'ימי אימון'}`,`${nEx} תרגילים`];let cx=PW-M;
  chips.forEach(c=>{g.font=F(700,13);const w=g.measureText(c).width+26;rr(cx-w,y,w,30,15);g.fillStyle=C.tint;g.fill();txt(c,cx-13,y+20,F(700,13),C.acc);cx-=w+8});
  y+=58;
  /* ---- ימי האימון ---- */
  const split=(title,i)=>{const m=String(title||'').match(/^\s*([A-Za-z])\s*(?:[·\-–:|.]\s*(.*))?$/);return m?[m[1].toUpperCase(),(m[2]||'').trim()]:[String.fromCharCode(65+i),String(title||'').trim()]};
  const CW=PW-2*M,PAD=18,inner=CW-2*PAD;
  const hasVid=e=>e.video&&/^https?:\/\//i.test(e.video);
  const cardH=e=>{let h=PAD+26+(wrap(e.name,F(700,19),inner-44).length-1)*24+10+64;
    if(e.note)h+=10+wrap(e.note,F(400,14),inner-12).length*20;const my=(t.exNotes||{})[e.name];if(my)h+=8+wrap('הערה אישית: '+my,F(500,14),inner).length*20;
    if(hasVid(e))h+=34;return h+PAD};
  days.forEach(day=>{
    const [L,sub]=split(day.title,t.plan.indexOf(day));
    ensure(84+cardH(day.ex[0])+12);
    rr(M,y,CW,70,20);g.fillStyle=C.dark;g.fill();
    const cg=g.createLinearGradient(PW-M-60,y,PW-M-10,y+70);cg.addColorStop(0,C.acc2);cg.addColorStop(1,C.acc);
    g.beginPath();g.arc(PW-M-38,y+35,23,0,Math.PI*2);g.fillStyle=cg;g.fill();txt(L,PW-M-38,y+44,F(800,24),C.dark,'center');
    txt('אימון '+L,PW-M-74,sub?y+36:y+46,F(700,34,'Karantina'),'#fff');if(sub)txt(sub,PW-M-74,y+57,F(500,14),'#aab2be');
    txt(`${day.ex.length} תרגילים`,M+18,y+41,F(500,13),'#aab2be','left');
    y+=84;
    day.ex.forEach((e,k)=>{
      const h=cardH(e);ensure(h+12);
      g.save();g.shadowColor='rgba(16,24,40,.07)';g.shadowBlur=12;g.shadowOffsetY=3;rr(M,y,CW,h,18);g.fillStyle=C.card;g.fill();g.restore();
      rr(M+.5,y+.5,CW-1,h-1,18);g.strokeStyle=C.line;g.lineWidth=1;g.stroke();
      const R=PW-M-PAD;let yy=y+PAD;
      g.beginPath();g.arc(R-15,yy+12,15,0,Math.PI*2);g.fillStyle=C.tint;g.fill();txt(String(k+1),R-15,yy+18,F(800,15),C.acc,'center');
      const nl=wrap(e.name,F(700,19),inner-44);nl.forEach((ln,i)=>txt(ln,R-40,yy+19+i*24,F(700,19),C.ink));yy+=26+(nl.length-1)*24+10;
      const bw=(inner-16)/3,boxes=[['סטים',String(e.sets),''],['חזרות',String(e.reps),''],['משקל',hasKg(e)?kgf(e.kg):'—',hasKg(e)?'ק״ג':'']];
      boxes.forEach(([lab,val,unit],bi)=>{const bx=R-(bi+1)*bw-bi*8;rr(bx,yy,bw,64,14);g.fillStyle=bi===2&&hasKg(e)?C.tint:'#f4f5f7';g.fill();
        txt(lab,bx+bw/2,yy+21,F(500,12),C.sub,'center');const vf=fit(val+(unit?'  '+unit:''),800,24,'Heebo',bw-14,12);
        if(unit){g.font=vf;const vw=g.measureText(val).width;g.font=F(500,13);const uw=g.measureText(unit).width;const tot=vw+5+uw,x0=bx+(bw+tot)/2;txt(val,x0,yy+51,vf,C.ink);txt(unit,x0-vw-5,yy+51,F(500,13),C.sub)}
        else txt(val,bx+bw/2,yy+51,vf,val==='—'?C.faint:C.ink,'center')});
      yy+=64;
      if(e.note){yy+=10;const ls=wrap(e.note,F(400,14),inner-12);rr(R-3,yy+3,3,ls.length*20-4,1.5);g.fillStyle=C.acc;g.fill();ls.forEach((ln,i)=>txt(ln,R-12,yy+15+i*20,F(400,14),'#374151'));yy+=ls.length*20}
      const my=(t.exNotes||{})[e.name];if(my){yy+=8;const ls=wrap('הערה אישית: '+my,F(500,14),inner);ls.forEach((ln,i)=>txt(ln,R,yy+15+i*20,F(500,14),C.blue));yy+=ls.length*20}
      if(hasVid(e)){yy+=8;const lab='▶  צפייה בסרטון הדגמה';g.font=F(700,14);const w=g.measureText(lab).width+26;rr(R-w,yy,w,28,14);g.fillStyle=C.tint;g.fill();txt(lab,R-13,yy+19,F(700,14),C.acc);links.push({p:pageNo,x:R-w,y:yy,w,h:28,url:e.video})}
      y+=h+12;
    });
    y+=14;
  });
  /* ---- סיום ---- */
  const EH=ph?92:70;if(y+EH+FOOT+18>PH+XTRA)ensure(PH);
  rr(M,y,CW,EH,20);const eg=g.createLinearGradient(M,y,M+CW,y+EH);eg.addColorStop(0,C.acc);eg.addColorStop(1,C.acc2);g.fillStyle=eg;g.fill();
  txt('בהצלחה!',PW/2,y+38,F(700,32,'Karantina'),C.dark,'center');
  txt(ph?'שאלות על התוכנית? יקיר זמין בוואטסאפ · '+ph:'שאלות על התוכנית? דברו עם יקיר',PW/2,y+62,F(500,14),C.dark,'center');
  if(ph){txt('לחצו כאן לשליחת הודעה',PW/2,y+81,F(700,12),'#5a2a10','center');links.push({p:pageNo,x:M,y,w:CW,h:EH,url:waLink(ph,'היי יקיר, שאלה לגבי תוכנית האימונים שלי: ')})}
  y+=EH;
  endPage(Math.max(pageNo===1?PH:360,y+FOOT+18));
  return {pages,links,PW,PH};
}
async function buildPlanPdf(t){
  const JsPDF=await loadPdfLib();
  let r;try{r=await renderPlanPages(t,true)}catch(e){if(e&&e.name==='SecurityError')r=await renderPlanPages(t,false);else throw e} // לוגו שלא נטען לא יפיל את ה-PDF
  const W=420,k=W/r.PW,doc=new JsPDF({unit:'pt',format:[W,r.pages[0].h*k],orientation:'portrait',compress:true});
  r.pages.forEach((pg,i)=>{const h=pg.h*k;if(i)doc.addPage([W,h],'portrait');doc.addImage(pg.src,'JPEG',0,0,W,h,undefined,'FAST');r.links.filter(l=>l.p===i+1).forEach(l=>doc.link(l.x*k,l.y*k,l.w*k,l.h*k,{url:l.url}))});
  doc.setProperties({title:'תוכנית אימונים - '+cleanName(t.name),author:'Yakir Levi'});
  return {blob:doc.output('blob'),pages:r.pages.map(pg=>pg.src)};
}
async function exportPlan(t){
  if(!t||!t.plan.some(d=>d.ex.length)){toast('אין עדיין תרגילים בתוכנית');return}
  toast('מכין PDF…');
  try{
    const {blob,pages}=await buildPlanPdf(t), name='תוכנית אימונים - '+cleanName(t.name)+'.pdf';
    pdfFile=new File([blob],name,{type:'application/pdf'});pdfPages=pages;
    const share=!!(navigator.canShare&&navigator.canShare({files:[pdfFile]})), url=URL.createObjectURL(blob);
    sheet('ה-PDF מוכן ✅',`<p class="muted" style="margin-top:0">${pages.length} ${pages.length===1?'עמוד':'עמודים'}. ${isCoach?`אפשר לשלוח אותו ל${esc(firstName(t))} בוואטסאפ או לשמור במכשיר.`:'אפשר לשמור אותו בטלפון או לשלוח לעצמך.'}</p>
      <div class="stack">${share?`<button type="button" class="btn btn-primary btn-block" data-act="pdfShare">${isCoach?'שליחה (וואטסאפ, מייל…)':'שמירה / שיתוף'}</button>`:`<a class="btn btn-primary btn-block" href="${url}" download="${esc(name)}">הורדת הקובץ</a>`}
      <button type="button" class="btn btn-ghost btn-block" data-act="pdfView">תצוגה מקדימה</button></div>
      ${share?'<p class="small muted" style="margin-bottom:0">בחלון שייפתח: ״שמירה בקבצים״ שומר בטלפון, או בחרו וואטסאפ כדי לשלוח.</p>':''}`,()=>{},'סגירה');
  }catch(e){console.error(e);toast('לא הצלחנו ליצור PDF. בדקו שיש אינטרנט ונסו שוב')}
}
function pdfPreviewSheet(){
  if(!pdfPages.length)return;
  sheet('תצוגה מקדימה',`<div class="pdf-prev">${pdfPages.map((src,i)=>`<img src="${src}" alt="עמוד ${i+1}">`).join('')}</div>${pdfFile&&navigator.canShare&&navigator.canShare({files:[pdfFile]})?'<button type="button" class="btn btn-primary btn-block" style="margin-top:12px" data-act="pdfShare">שליחה / שמירה</button>':''}`,()=>{},'סגירה');
}
/* הודעות בתוך האפליקציה על דברים שקרו מאז הפעם הקודמת (נזכר במכשיר, כמו ההישגים) */
function sysNotify(msg){try{if('Notification' in window&&Notification.permission==='granted'&&navigator.serviceWorker)navigator.serviceWorker.ready.then(r=>r.showNotification('Yakir fit',{body:msg,icon:'icon-192.png'})).catch(()=>{})}catch(e){}}
function notify(msg){setTimeout(()=>toast(esc(msg),'badge'),300);sysNotify(msg)}
function freshSince(k,ids){const seen=ls.get(k,null);ls.set(k,ids);return seen===null?[]:ids.filter(x=>!seen.includes(x))}
function checkTraineeNews(t){
  const fresh=freshSince('yf-sessseen-'+t.id,t.sessions.map(s=>s.id));
  const ns=sessOf(t).filter(x=>fresh.includes(x.id)&&x.date>=today()), s=ns[0];
  if(ns.length>1)notify(`יקיר קבע לך ${ns.length} אימונים חדשים. הראשון ב${fmt(s.date)} בשעה ${s.time} 💪`);
  else if(s)notify(s.by==='trainee'?`יקיר אישר את האימון שלך ב${fmt(s.date)} בשעה ${s.time} ✅`:`יקיר קבע לך אימון ב${fmt(s.date)} בשעה ${s.time} 💪`);
  const ff=freshSince('yf-fbseen-'+t.id,Object.keys(t.fb)),fv=ff.length&&t.vids.find(v=>v.id===ff[0]);
  if(fv){const f=t.fb[fv.id];notify(`יקיר צפה בסרטון של ${fv.ex}${f.score?': ציון '+f.score+'/10':''}`)}
  const fk=freshSince('yf-ckfb-'+t.id,Object.keys(t.ckfb));if(fk.length)notify('יקיר הגיב לצ׳ק-אין השבועי שלך');
  const mg=MSG();if(mg&&freshSince('yf-msgseen',[mg.id]).length)notify('הודעה מיקיר: '+mg.text);
  const k='yf-plan-'+t.id;if(needsPlan(t)&&ls.get(k,'')!==nextWeek()[0]){ls.set(k,nextWeek()[0]);sysNotify('עוד לא קבעת אימונים לשבוע הבא. כדאי לשריין שעה 💪')}
}
function checkCoachNews(){
  const reqs=pendingReqs(),joins=joinReqs();
  const fresh=freshSince('yf-newseen',[...reqs.map(r=>'r'+r.id),...joins.map(t=>'j'+t.id)]);
  const fr=reqs.filter(r=>fresh.includes('r'+r.id)),fj=joins.filter(t=>fresh.includes('j'+t.id));
  if(fr.length===1)notify(`בקשה חדשה לאימון: ${cleanName(T(fr[0].tid).name)}, ${fmt(fr[0].date)} ב-${fr[0].time}`);
  else if(fr.length)notify(`${fr.length} בקשות חדשות לאימון`);
  const vids=tList().filter(t=>billOf(t)==='online').flatMap(t=>t.vids.filter(v=>!t.fb[v.id]).map(v=>({t,v})));
  const fv=freshSince('yf-vidseen',vids.map(x=>x.v.id));
  if(fv.length===1){const x=vids.find(y=>y.v.id===fv[0]);notify(`סרטון חדש מ${cleanName(x.t.name)}: ${x.v.ex}`)}else if(fv.length)notify(`${fv.length} סרטונים חדשים מחכים לציון`);
  const cks=tList().flatMap(t=>t.checkins.map(c=>({t,c}))),fc=freshSince('yf-ckseen',cks.map(x=>x.t.id+x.c.wk+x.c.d));
  if(fc.length===1){const x=cks.find(y=>y.t.id+y.c.wk+y.c.d===fc[0]);notify(`צ׳ק-אין חדש מ${cleanName(x.t.name)}`)}else if(fc.length)notify(`${fc.length} צ׳ק-אינים חדשים`);
  const hs=[...tList(),...joinReqs()].filter(t=>t.health),fh=freshSince('yf-hseen',hs.map(t=>t.id+t.health.d));if(fh.length){const x=hs.find(t=>t.id+t.health.d===fh[0]);notify(fh.length===1?`${cleanName(x.name)} מילא/ה הצהרת בריאות${healthFlag(x)?' · ⚠ יש הערות רפואיות':''}`:`${fh.length} הצהרות בריאות חדשות`)}
  const rv=tList().filter(t=>t.review),frv=freshSince('yf-revseen',rv.map(t=>t.id+t.review.d));if(frv.length){const x=rv.find(t=>t.id+t.review.d===frv[0]);notify(`${cleanName(x.name)} כתב/ה עליך המלצה ⭐`)}
  const fpr=freshSince('yf-payseen',tList().filter(t=>t.payRep).map(t=>t.id+t.payRep.at));if(fpr.length){const x=tList().find(t=>t.payRep&&t.id+t.payRep.at===fpr[0]);notify(fpr.length===1?`${cleanName(x.name)} דיווח/ה על תשלום של ${ils(x.payRep.amount)}`:`${fpr.length} דיווחי תשלום חדשים`)}
  const ca=cxAsks(),fca=freshSince('yf-cxseen',ca.map(x=>x.c.sid));if(fca.length){const x=ca.find(y=>y.c.sid===fca[0]);notify(fca.length===1?`${cleanName(x.t.name)} מבקש/ת לבטל את האימון ב${fmt(x.s.date)} ${x.s.time}`:`${fca.length} בקשות ביטול חדשות`)}
  if(DB.gs){const gs=DB.gs.filter(y=>y.d>=today()),fg=freshSince('yf-gsseen',gs.map(y=>y.id));if(fg.length){const y=gs.find(z=>z.id===fg[0]),t=T(y.o),g=grpOf(y.k);notify(fg.length===1&&t?`${cleanName(t.name)} נרשם/ה ל${g?g.g.title:'שיעור'} ב${fmt(y.d)}`:`${fg.length} הרשמות חדשות לשיעורים`)}}
  if(fj.length)notify(fj.length===1?`${cleanName(fj[0].name)} נרשם/ה${fj[0].wants==='online'?' לליווי אונליין':''} ומחכה לאישור`:`${fj.length} מתאמנים חדשים מחכים לאישור`);
}
/* חלון שפותח וואטסאפ עם הודעה מוכנה, אחרי פעולה */
function waNext(title,text,phone,msg,label){
  if(!waPhone(phone))return;
  setTimeout(()=>sheet(title,`<p class="muted" style="margin-top:0">${text}</p><a class="btn btn-wa btn-block" data-act="waSent" href="${waLink(phone,msg)}" target="_blank" rel="noopener">${mini(I.wa)} ${label}</a><div class="small muted" style="margin-top:10px">״${esc(msg)}״</div>`,()=>{},'לא עכשיו'),0);
}
const hasKg=e=>e&&e.kg!==''&&e.kg!=null&&!isNaN(+e.kg);
function lastLog(t,ex){const l=t.logs.filter(x=>x.ex===ex).sort((a,b)=>a.d.localeCompare(b.d));return l[l.length-1]}
const avColor=t=>AV[(t.color||0)%AV.length];
const avatar=(t,size=42)=>t.avatar?`<span class="avatar" style="width:${size}px;height:${size}px;background:url('${esc(t.avatar)}') center/cover"></span>`:`<span class="avatar" style="width:${size}px;height:${size}px;font-size:${Math.round(size*.4)}px;background:${avColor(t)}">${esc(initials(t.name))}</span>`;

/* =========================================================
   AUTH FLOW
   ========================================================= */
function unsubAll(){subs.forEach(u=>{try{u()}catch(e){}});subs=[];Object.values(photoSubs).forEach(u=>{try{u()}catch(e){}});photoSubs={}}
authApi.onChange(u=>{
  authReady=true;roleStarted={};
  unsubAll();
  user=u;isCoach=!!(u&&COACH_EMAILS.includes(u.email));
  Object.assign(DB,{pub:null,members:{},coach:{},photos:{},myM:undefined,myC:undefined,allLoaded:{m:false,c:false}});
  ui.sel=null;ui.tab=null;
  if(!u){ui.role=null;render();return}
  subs.push(api.doc('pub','main',d=>{DB.pub=d;render()}));
  ui.role=isCoach?'trainer':'trainee';
  startRole();
});
function startRole(){
  if(!user||!ui.role){render();return}
  if(ui.role==='trainer'&&!roleStarted.trainer){
    roleStarted.trainer=true;
    subs.push(api.col('members',o=>{DB.members=o;DB.allLoaded.m=true;render()}));
    subs.push(api.col('coach',o=>{DB.coach=o;DB.allLoaded.c=true;render()}));
  }
  if(ui.role==='trainee'&&!roleStarted.trainee){
    roleStarted.trainee=true;
    subs.push(api.doc('members',user.uid,d=>{DB.myM=d;if(d)DB.members[user.uid]=d;else delete DB.members[user.uid];render()}));
    subs.push(api.doc('coach',user.uid,d=>{DB.myC=d;if(d)DB.coach[user.uid]=d;else delete DB.coach[user.uid];render()}));
    watchPhotos(user.uid);
  }
  if(!ui.tab)ui.tab=ui.role==='trainer'?'sched':'plan';
  render();
}
function watchPhotos(id){if(photoSubs[id])return;photoSubs[id]=api.photos(id,a=>{DB.photos[id]=a.sort((x,y)=>x.d.localeCompare(y.d));render()})}
function setRole(r){ui.role=r;ui.tab=null;ui.sel=null;if(user)ls.set('yf-role-'+user.uid,r);startRole()}
function logout(){roleStarted={};authApi.signOut()}

/* =========================================================
   RENDER
   ========================================================= */
function render(){
  if(user===null&&authReady){renderAuth();return}
  if(!authReady){$('#app').innerHTML='<div class="loading">טוען…</div>';return}
  if(!ui.role){renderRolePicker();return}
  if(ui.role==='trainer'){
    if(!(DB.allLoaded.m&&DB.allLoaded.c)){shell('<div class="loading">טוען נתונים…</div>');return}
    renderTrainer();
  }else{
    if(DB.myM===undefined||DB.myC===undefined){shell('<div class="loading">טוען…</div>');return}
    if(!DB.myM){renderJoin();return}
    if(!DB.myC||!DB.myC.approved){renderPending();return}
    renderTrainee();
  }
}

function header(html){$('#top').innerHTML=html;$('#top').hidden=false}
function shell(body,tabs){$('#app').innerHTML=body;if(tabs!==undefined)$('#tabs').innerHTML=tabs}
function logoHTML(){return `<div class="logo"><img class="logo-img" src="logo-mark.png" alt="Yakir Levi"></div>`}

/* ----- auth screens ----- */
function renderAuth(){
  $('#top').hidden=true;$('#tabs').innerHTML='';
  const up=ui.authMode==='up';
  $('#app').innerHTML=`<div class="auth">
    <div class="auth-hero">
      <img class="auth-logo" src="logo-dark.png" alt="Yakir Levi · בואו ליצור לעצמכם אורח חיים בריא וחזק">
      <p class="muted">האימונים, הלו״ז וההתקדמות שלך עם יקיר. הכול במקום אחד.</p>
    </div>
    ${DEMO?`<div class="card demo-card"><div class="row" style="align-items:flex-start"><span class="chip warn">מצב הדגמה</span><div class="grow small muted">Firebase עוד לא מחובר, אז הכול נשמר רק בדפדפן הזה. אפשר להיכנס כמשתמשי דוגמה:</div></div>
      <div class="row wrap-ok" style="margin-top:12px;gap:8px"><button class="btn btn-primary btn-sm" data-act="demoLogin" data-v="coach">כניסה כיקיר (מאמן)</button><button class="btn btn-ghost btn-sm" data-act="demoLogin" data-v="dani">כניסה כדני (מתאמן)</button><button class="btn btn-ghost btn-sm" data-act="demoLogin" data-v="maya">כניסה כמאיה (ממתינה לאישור)</button><button class="btn btn-ghost btn-sm" data-act="demoLogin" data-v="yoni">כניסה כיוני (אונליין)</button></div></div>`:''}
    <div class="card auth-card">
      <div class="seg auth-seg"><button data-act="authMode" data-v="in" class="${!up?'on':''}">כניסה</button><button data-act="authMode" data-v="up" class="${up?'on':''}">הרשמה</button></div>
      <form id="authForm" novalidate>
        ${up?`<div class="field"><label for="a-name">שם מלא</label><input id="a-name" name="name" autocomplete="name" required></div>`:''}
        <div class="field"><label for="a-email">מייל</label><input id="a-email" name="email" type="email" inputmode="email" autocomplete="email" dir="ltr" required></div>
        <div class="field"><label for="a-pw">סיסמה</label><input id="a-pw" name="pw" type="password" autocomplete="${up?'new-password':'current-password'}" dir="ltr" minlength="6" required>${up?'<span class="small muted">לפחות 6 תווים</span>':''}</div>
        <div class="auth-err" id="authErr" role="alert"></div>
        <button class="btn btn-primary btn-block" type="submit" ${ui.busy?'disabled':''}>${ui.busy?'רגע…':up?'יצירת חשבון':'כניסה'}</button>
      </form>
      ${!up?'<button class="linkish" data-act="forgot">שכחתי סיסמה</button>':''}
      <div class="or"><span>או</span></div>
      <button class="btn btn-ghost btn-block" data-act="google">${mini(I.google,18)} המשך עם Google</button>
    </div>
    <p class="small muted" style="text-align:center">כל מתאמן רואה רק את המידע שלו.</p>
  </div>`;
}
function renderRolePicker(){
  header(`${logoHTML()}<button class="icon-btn" data-act="logout" aria-label="יציאה">${I.out}</button>`);$('#tabs').innerHTML='';
  $('#app').innerHTML=`<h1 class="h-display" style="margin-top:10px">היי ${esc(cleanName(user.name)||'יקיר')}</h1><p class="muted">איך נכנסים היום?</p>
  <div class="stack" style="margin-top:14px">
    <button class="role-card" data-act="setRole" data-v="trainer"><span class="role-ic">${mini(I.users,26)}</span><span class="grow"><b>מאמן</b><span class="small muted">לו״ז, מתאמנים, בקשות ותשלומים</span></span>${mini(I.next,20)}</button>
    <button class="role-card" data-act="setRole" data-v="trainee"><span class="role-ic">${mini(I.dumb,26)}</span><span class="grow"><b>מתאמן</b><span class="small muted">התוכנית והאימונים שלך</span></span>${mini(I.next,20)}</button>
  </div>`;
}
function renderJoin(){
  header(`${logoHTML()}<button class="icon-btn" data-act="logout" aria-label="יציאה">${I.out}</button>`);$('#tabs').innerHTML='';
  $('#app').innerHTML=`<h1 class="h-display" style="margin-top:10px">ברוכים הבאים</h1><p class="muted">עוד כמה פרטים, ויקיר יאשר אותך.</p>
  <form id="joinForm" class="card" style="margin-top:14px" novalidate>
    <div class="field"><label for="j-name">שם מלא</label><input id="j-name" name="name" value="${esc(user.name)}" required></div>
    <div class="field"><label for="j-phone">טלפון</label><input id="j-phone" name="phone" type="tel" inputmode="tel" dir="ltr" required></div>
    <div class="field"><label for="j-goal">מה המטרה שלך?</label><input id="j-goal" name="goal" placeholder="למשל ירידה במשקל, כוח, חיטוב"></div>
    <div class="field"><label for="j-bday">תאריך לידה (לא חובה)</label><input id="j-bday" name="bday" type="date" max="${today()}"></div>
    <fieldset class="field choice"><legend>איך תרצו להתאמן?</legend>
      <label class="choice-opt"><input type="radio" name="wants" value="personal" checked><span><b>אימונים אישיים</b><span class="small muted">מתאמנים עם יקיר וקובעים אימונים באפליקציה</span></span></label>
      <label class="choice-opt"><input type="radio" name="wants" value="online"><span><b>ליווי אונליין</b><span class="small muted">מתאמנים לבד לפי התוכנית, שולחים סרטונים ומקבלים ציון והערות</span></span></label>
    </fieldset>
    <button class="btn btn-primary btn-block" type="submit">שליחה ליקיר</button>
  </form>`;
}
function renderPending(){
  header(`${logoHTML()}<button class="icon-btn" data-act="logout" aria-label="יציאה">${I.out}</button>`);$('#tabs').innerHTML='';
  const p=PUB();
  $('#app').innerHTML=`<div class="card hero" style="margin-top:10px;text-align:center;padding-block:30px">
    <div class="logo-mark big" style="margin:0 auto 14px">${I.check}</div>
    <h1 class="h-display">הבקשה נשלחה</h1>
    <p class="muted">ברגע שיקיר יאשר, התוכנית והלו״ז שלך יופיעו כאן.</p>
    ${DB.myM.health?'<p class="small" style="margin:10px 0 14px">✓ הצהרת הבריאות נשלחה</p>':`<button class="btn btn-primary btn-block" style="margin:6px 0 12px" data-act="hFill">שלב אחרון: הצהרת בריאות</button>`}
    ${p.phone?`<a class="btn btn-wa" target="_blank" rel="noopener" href="${waLink(p.phone,'היי יקיר, נרשמתי לאפליקציית Yakir fit'+(DB.myM.wants==='online'?' לליווי אונליין':'')+'. אשמח שתאשר אותי 🙏 '+cleanName(DB.myM.name))}">${mini(I.wa)} עדכון ליקיר בוואטסאפ</a>`:''}
  </div>`;
}

/* ----- tabs ----- */
function tabsHTML(tabs){return '<div class="in">'+tabs.map(([k,l,ic])=>`<button data-act="tab" data-v="${k}" class="${ui.tab===k?'on':''}" aria-label="${l}">${ic}<span class="t">${l}</span></button>`).join('')+'</div>'}

/* =========================================================
   TRAINER
   ========================================================= */
function renderTrainer(){
  if(ui.sum&&T(ui.sum.tid)){renderSummary(T(ui.sum.tid));return}
  if(ui.aw){const at=T(ui.awFor);if(at&&at.live){renderLive(at);return}ui.aw=false}
  if(!['sched','my','people','online','plans','biz'].includes(ui.tab))ui.tab='sched';
  header(`${logoHTML()}<button class="icon-btn" data-act="logout" aria-label="יציאה">${I.out}</button>`);
  $('#tabs').innerHTML=tabsHTML([['sched','לו״ז',I.cal],['my','שלי',I.flame],['people','מתאמנים',I.users],['online','אונליין',I.vid],['plans','תוכניות',I.dumb],['biz','עסק',I.biz]]);
  ensureGs();checkCoachNews();setTimeout(()=>{syncChallenge();processCancels();syncFixed();syncBusy()},0);
  if(ui.tab==='my'){ensureSelf();ui.sel=user.uid;watchPhotos(user.uid);$('#app').innerHTML=trainerSelf(T(user.uid));return}
  if(ui.tab==='people'&&ui.sel&&T(ui.sel)){watchPhotos(ui.sel);$('#app').innerHTML=traineeEditor(T(ui.sel));return}
  if(ui.tab==='plans'&&ui.sel&&T(ui.sel)){$('#app').innerHTML=planClientView(T(ui.sel));return}
  $('#app').innerHTML=ui.tab==='sched'?trainerSched():ui.tab==='biz'?trainerBiz():ui.tab==='plans'?trainerPlans():ui.tab==='online'?trainerOnline():trainerPeople();
}
function attBtns(t,s){
  if(s.st==='late')return '<span class="chip bad">ביטול מאוחר</span>';
  if(s.date>today())return `<span class="small muted">${s.by==='fixed'?'קבוע · ':''}טרם התקיים</span>`;
  return `<button class="att ${s.st==='came'?'on good':''}" data-act="att" data-id="${t.id}|${s.id}" data-v="came">${I.check}הגיע</button><button class="att ${s.st==='missed'?'on bad':''}" data-act="att" data-id="${t.id}|${s.id}" data-v="missed">${I.x}לא הגיע</button>`;
}
function trainerSched(){
  const ws=weekStart(ui.day), td=today();
  const weekDays=[...Array(7)].map((_,i)=>addDays(ws,i));
  const weekCount=allSessions().filter(s=>s.date>=ws&&s.date<=addDays(ws,6)).length;
  const low=tList().filter(t=>cardInfo(t).low||t.renewReq);
  const reqs=pendingReqs(), joins=joinReqs();
  const list=daySess(ui.day).filter(s=>!s.gk);
  const d0=parse(ws),d6=parse(addDays(ws,6));
  const remind=tList().filter(t=>t.phone&&needsPlan(t)), sentK='yf-remind-'+nextWeek()[0], sent=ls.get(sentK,[]);
  const remindMsg=t=>`היי ${firstName(t)}, מתחילים לתכנן את השבוע הבא 💪 ${t.offline?'מתי נוח לך להתאמן?':'אפשר כבר לקבוע אימונים באפליקציית Yakir fit.'} יקיר`;
  return `
  <div class="card hero">
    <div class="muted small">${fmt(td)}</div>
    <div class="h-display" style="margin-top:4px">הלו״ז של יקיר</div>
    <div class="stats" style="margin-top:14px">
      <div class="stat"><b class="num">${daySess(td).length}</b><span>אימונים היום</span></div>
      <div class="stat"><b class="num">${weekCount}</b><span>השבוע</span></div>
      <div class="stat"><b class="num" style="color:${reqs.length?'var(--accent2)':'var(--fg)'}">${reqs.length}</b><span>בקשות</span></div>
    </div>
  </div>
  ${joins.length?`<button class="banner" style="width:100%;text-align:start;cursor:pointer" data-act="tab" data-v="people">${I.users}<div class="grow small"><b>${joins.length} ${joins.length===1?'מתאמן חדש מחכה':'מתאמנים חדשים מחכים'} לאישור</b> · ${joins.map(t=>esc(t.name)).join(', ')}</div></button>`:''}
  ${bcastBlock()}
  ${cxAskBlock()}
  ${dashBlock()}
  ${attnBlock()}
  ${lowBlock(low)}
  ${bdayCoachBlock()}
  ${(()=>{const w=tList().flatMap(t=>t.requests.filter(r=>r.status==='wait').map(r=>Object.assign({tid:t.id},r))).sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));return w.length?`<div class="h-sec"><span>רשימת המתנה · ${w.length}</span></div><div class="stack">${w.map(r=>{const t=T(r.tid),free=!daySess(r.date).some(x=>x.time===r.time&&x.st!=='late');return `<div class="item">${avatar(t,34)}<div class="grow" style="min-width:0"><b>${esc(t.name)}</b><div class="small muted num">${fmt(r.date)} · ${r.time}${free?' · <span style="color:var(--good)">התפנה!</span>':''}</div></div><button class="btn ${free?'btn-primary':'btn-ghost'} btn-sm" data-act="reqOk" data-id="${t.id}|${r.id}">אישור</button><button class="icon-btn sm" data-act="reqNo" data-id="${t.id}|${r.id}" aria-label="הסרה מההמתנה">${I.x}</button></div>`}).join('')}</div>`:''})()}
  ${reqs.length?`<div class="h-sec"><span>בקשות לאימון</span></div><div class="stack">${reqs.map(r=>{const t=T(r.tid);const clash=daySess(r.date).some(s=>s.time===r.time);return `<div class="sess"><div class="row">${avatar(t,38)}<div class="grow"><b>${esc(t.name)}</b><div class="small muted num">${fmt(r.date)} · ${r.time}${clash?' · <span style="color:var(--bad)">השעה תפוסה</span>':''}</div>${r.note?`<div class="small">״${esc(r.note)}״</div>`:''}</div></div><div class="row sess-actions"><button class="btn btn-primary btn-sm" data-act="reqOk" data-id="${t.id}|${r.id}">${mini(I.check,14)} אישור</button><button class="btn btn-ghost btn-sm" data-act="reqNo" data-id="${t.id}|${r.id}">דחייה</button><span class="grow"></span>${t.phone?`<a class="icon-btn sm wa" href="${waLink(t.phone,`היי ${firstName(t)}, לגבי הבקשה לאימון ב${fmt(r.date)} ב-${r.time}: `)}" target="_blank" rel="noopener" aria-label="וואטסאפ">${I.wa}</a>`:''}</div></div>`}).join('')}</div>`:''}
  ${remind.length?`<div class="h-sec"><span>תזכורת לשבוע הבא · ${remind.length}</span></div><div class="card"><div class="small muted" style="margin-bottom:10px">עוד לא קבעו אימון לשבוע הבא. לחיצה על וואטסאפ פותחת הודעה מוכנה.</div><div class="stack" style="gap:8px">${remind.map(t=>`<div class="row">${avatar(t,32)}<b class="grow">${esc(t.name)}</b>${sent.includes(t.id)?'<span class="chip good">נשלח</span>':''}<a class="icon-btn sm wa" data-act="remindSent" data-id="${t.id}" href="${waLink(t.phone,remindMsg(t))}" target="_blank" rel="noopener" aria-label="תזכורת בוואטסאפ ל${esc(t.name)}">${I.wa}</a></div>`).join('')}</div></div>`:''}
  <div class="h-sec"><span>שבוע ${d0.getDate()}.${d0.getMonth()+1} – ${d6.getDate()}.${d6.getMonth()+1}</span>
    <span class="row"><button class="icon-btn sm" data-act="week" data-v="-7" aria-label="שבוע קודם">${I.prev}</button><button class="btn btn-ghost btn-sm" data-act="goToday">היום</button><button class="icon-btn sm" data-act="week" data-v="7" aria-label="שבוע הבא">${I.next}</button></span></div>
  <div class="pills">${weekDays.map(d=>{const n=daySess(d).length;return `<button class="daypill ${d===ui.day?'on':''} ${d===td?'today':''}" style="${slotsFor(d).length?'':'opacity:.5'}" data-act="day" data-v="${d}"><span class="small">${DS[parse(d).getDay()]}</span><b>${parse(d).getDate()}</b><i class="dot ${n?'has':''}"></i></button>`}).join('')}</div>
  <div class="h-sec"><span>${fmt(ui.day)} · ${list.length} אימונים</span><button class="btn btn-primary btn-sm" data-act="addSession">${mini(I.plus)} אימון</button></div>
  <div class="stack">${list.length?list.map(s=>{const t=T(s.tid);const ci=cardInfo(t);return `
    <div class="sess"><div class="row"><div class="time num">${s.time}</div>
      <button class="grow row" data-act="openT" data-id="${t.id}" style="background:none;border:0;padding:0;cursor:pointer;text-align:start;min-width:0">${avatar(t)}<span class="grow" style="min-width:0"><span style="font-weight:700;display:block">${esc(t.name)}</span><span class="small muted">${esc(t.goal||'')}</span></span></button>
      ${(t.cancels||[]).some(c=>c.ask&&c.sid===s.id)?'<span class="chip warn">ביקש/ה ביטול</span>':''}${billChip(t)}</div>
      <div class="row sess-actions">${attBtns(t,s)}<span class="grow"></span>${t.phone?`<a class="icon-btn sm wa" href="${waLink(t.phone,`היי ${firstName(t)}, תזכורת לאימון ${s.date===td?'היום':s.date===addDays(td,1)?'מחר':fmt(s.date)} בשעה ${s.time} 💪 יקיר`)}" target="_blank" rel="noopener" aria-label="תזכורת בוואטסאפ">${I.wa}</a>`:''}<button class="icon-btn sm" data-act="delSession" data-id="${t.id}|${s.id}" aria-label="ביטול אימון">${I.trash}</button></div></div>`}).join(''):`<div class="empty"><b>${slotsFor(ui.day).length?'יום פנוי':'יום לא פעיל'}</b>${slotsFor(ui.day).length?'אין אימונים ביום הזה. לחצו על ״אימון״ כדי לקבוע.':'היום הזה מסומן כחופש או מחוץ לימי העבודה.'}</div>`}</div>${grpDayCoach(ui.day)}`;
}
function trainerPeople(){
  const ts=tList(), joins=joinReqs();
  return `<div class="row" style="justify-content:space-between;margin-top:6px;flex-wrap:wrap"><h1 class="h-display">המתאמנים</h1><span class="row" style="gap:8px;flex-wrap:wrap"><button class="btn btn-wa" data-act="invite">${mini(I.wa,18)} הזמנת מתאמן</button><button class="btn btn-primary" data-act="addTrainee">${mini(I.plus,18)} מתאמן בלי אפליקציה</button></span></div>
  ${chCoachBlock()}
  ${joins.length?`<div class="h-sec"><span>מחכים לאישור</span></div><div class="stack">${joins.map(t=>`<div class="sess"><div class="row">${avatar(t)}<div class="grow"><b>${esc(t.name)}</b>${t.wants==='online'?` <span class="chip cool">${mini(I.vid,12)} ליווי אונליין</span>`:''} ${t.ref&&T(t.ref)?`<span class="chip cool">הגיע/ה דרך ${esc(firstName(T(t.ref)))}</span>`:''} ${t.health?(healthFlag(t)?'<span class="chip bad">⚠ הערות רפואיות</span>':'<span class="chip good">הצהרת בריאות ✓</span>'):'<span class="chip warn">אין הצהרת בריאות</span>'}<div class="small muted"><span class="num" dir="ltr">${esc(t.phone)}</span>${t.goal?' · '+esc(t.goal):''}</div>${t.email?`<div class="small muted" dir="ltr" style="text-align:end">${esc(t.email)}</div>`:''}</div></div><div class="row sess-actions"><button class="btn btn-primary btn-sm" data-act="joinOk" data-id="${t.id}">${mini(I.check,14)} אישור והגדרת תשלום</button><button class="btn btn-ghost btn-sm" data-act="joinNo" data-id="${t.id}">דחייה</button></div></div>`).join('')}</div>`:''}
  <div class="h-sec"><span>כל המתאמנים · ${ts.length}</span></div>
  <div class="stack">${ts.length?ts.map(t=>{const ci=cardInfo(t);const nx=sessOf(t).find(s=>s.date+s.time>=today()+nowHM());return `
    <button class="item tap" data-act="openT" data-id="${t.id}">${avatar(t)}
      <span class="grow" style="display:flex;flex-direction:column;gap:6px;min-width:0">
        <span class="row"><b class="grow">${esc(t.name)}</b>${t.offline?'<span class="chip">בלי אפליקציה</span>':''}${t.renewReq?'<span class="chip warn">ביקש חידוש</span>':''}${owed(t).n?'<span class="chip bad">לא שולם</span>':''}</span>
        ${ci.none?'':`<span class="bar ${ci.low?'low':''}"><i style="width:${ci.left/ci.size*100}%"></i></span>`}
        <span class="small muted num">${ci.none?BILL_NAME[billOf(t)]+(owed(t).n?' · חוב '+ils(owed(t).amount):''):`נשארו ${ci.left} מתוך ${ci.size}`}${nx?' · הבא: '+fmtShort(nx.date)+' '+nx.time:''}</span>
      </span></button>`}).join(''):`<div class="empty"><b>עוד אין מתאמנים</b>שלחו למתאמנים את הקישור לאפליקציה. אחרי שיירשמו הם יופיעו כאן לאישור.<div style="margin-top:12px"><button class="btn btn-wa" data-act="invite">${mini(I.wa,18)} הזמנת מתאמן בוואטסאפ</button></div></div>`}</div>`;
}
/* =========================================================
   INCOME — הכנסות לפי חודש. תשלום = כרטיסייה/תוכנית שסומנה כשולמה (price + paidDate)
   ========================================================= */
const ymAdd=(ym,n)=>{const [y,m]=ym.split('-').map(Number),d=new Date(y,m-1+n,1);return d.getFullYear()+'-'+pad(d.getMonth()+1)};
const ymName=(ym,o)=>{const [y,m]=ym.split('-').map(Number);return new Date(y,m-1,1).toLocaleDateString('he-IL',o||{month:'long',year:'numeric'})};
const ils=n=>'₪'+Math.round(+n||0).toLocaleString('he-IL');
function payments(){
  const out=[];
  tList().forEach(t=>{
    [...t.cardHistory,...(billOf(t)==='card'?[t.card]:[])].forEach(c=>{if(c.paid&&c.paidDate&&+c.price)out.push({d:c.paidDate,amount:+c.price,kind:'card',what:`כרטיסייה של ${c.size||''} אימונים`,t})});
    t.sessions.forEach(x=>{if(x.paid&&x.paidDate)out.push({d:x.paidDate,amount:+x.price||rateOf(t),kind:'single',what:`אימון ב-${fmtShort(x.date)}`,t})});
    t.subPays.forEach(x=>{if(x.paidDate)out.push({d:x.paidDate,amount:+x.price||rateOf(t),kind:billOf(t)==='monthly'?'monthly':'online',what:`${billOf(t)==='monthly'?'מנוי חודשי':'מנוי אונליין'} · ${ymName(x.m,{month:'long'})}`,t})});
  });
  planClients().forEach(t=>{if(t.paid&&t.paidDate&&+t.price)out.push({d:t.paidDate,amount:+t.price,kind:'plan',what:'תוכנית אימונים',t})});
  return out.sort((a,b)=>b.d.localeCompare(a.d));
}
function incomeBlock(){
  const cur=today().slice(0,7);if(!ui.incM||ui.incM>cur)ui.incM=cur;const sel=ui.incM;
  const pays=payments(),sum=ym=>pays.filter(x=>x.d.slice(0,7)===ym).reduce((a,x)=>a+x.amount,0);
  const mine=pays.filter(x=>x.d.slice(0,7)===sel),tot=sum(sel),prev=sum(ymAdd(sel,-1));
  const end=ymAdd(cur,-5)>sel?ymAdd(sel,5):cur,months=[...Array(6)].map((_,i)=>ymAdd(end,i-5)),vals=months.map(sum),mx=Math.max(1,...vals);
  const yr=pays.filter(x=>x.d.slice(0,4)===sel.slice(0,4)&&x.d.slice(0,7)<=sel).reduce((a,x)=>a+x.amount,0);
  const open=tList().reduce((a,t)=>a+owed(t).amount,0)+planClients().filter(t=>!t.paid).reduce((a,t)=>a+(+t.price||0),0);
  const part=k=>{const l=mine.filter(x=>x.kind===k);return [l.reduce((a,x)=>a+x.amount,0),l.length]};
  const KN=[['card','כרטיסיות'],['single','אימונים בודדים'],['monthly','מנויים'],['online','אונליין'],['plan','תוכניות']];
  const delta=prev?Math.round((tot-prev)/prev*100):null;
  return `<div class="card hero" style="margin-top:14px">
    <div class="row"><button class="icon-btn sm" data-act="incM" data-v="${ymAdd(sel,-1)}" aria-label="חודש קודם">${I.prev}</button><div class="grow" style="text-align:center"><div class="small muted">ההכנסות ב</div><b style="font-size:17px">${ymName(sel)}</b></div><button class="icon-btn sm" data-act="incM" data-v="${ymAdd(sel,1)}" aria-label="חודש הבא" ${sel>=cur?'disabled style="opacity:.3"':''}>${I.next}</button></div>
    <div style="text-align:center;margin-top:10px"><div class="wo-vol num" style="font-size:48px">${ils(tot)}</div>
      <div style="margin-top:6px">${delta==null?`<span class="chip">${tot?'אין נתונים לחודש הקודם':'עוד אין תשלומים בחודש הזה'}</span>`:`<span class="chip ${delta>=0?'good':'bad'} num">${delta>=0?'▲':'▼'} ${Math.abs(delta)}% מ${ymName(ymAdd(sel,-1),{month:'long'})} (${ils(prev)})</span>`}</div></div>
    <div class="inc-bars" role="group" aria-label="הכנסות ב-6 חודשים">${months.map((m,i)=>`<button class="inc-bar ${m===sel?'on':''}" data-act="incM" data-v="${m}" title="${ymName(m)}: ${ils(vals[i])}" aria-label="${ymName(m)}: ${ils(vals[i])}"><span class="inc-val num">${vals[i]&&(m===sel||vals[i]===mx)?ils(vals[i]):''}</span><span class="inc-col"><i style="height:${Math.max(2,vals[i]/mx*100)}%"></i></span><span class="inc-m">${ymName(m,{month:'short'})}</span></button>`).join('')}</div>
    <div class="two" style="margin-top:14px">${KN.map(([k,n])=>{const [a,c]=part(k);return `<div class="stat"><b class="num">${ils(a)}</b><span>${n} · ${c}</span></div>`}).join('')}</div>
    <div class="row small" style="margin-top:12px;justify-content:space-between;flex-wrap:wrap;gap:6px"><span class="muted">מתחילת ${sel.slice(0,4)}: <b class="num" style="color:var(--fg)">${ils(yr)}</b></span><span class="muted">ממתין לתשלום: <b class="num" style="color:${open?'var(--warn)':'var(--fg)'}">${ils(open)}</b></span></div>
  </div>
  <div class="h-sec"><span>תשלומים ב${ymName(sel,{month:'long'})} · ${mine.length}</span></div>
  <div class="stack">${mine.length?mine.map(x=>`<button class="item tap" data-act="${x.kind==='plan'?'openP':'openT'}" data-id="${x.t.id}">${avatar(x.t,36)}<span class="grow" style="min-width:0"><b style="display:block">${esc(x.t.name)}</b><span class="small muted">${esc(x.what)} · שולם ${fmtShort(x.d)}</span></span><b class="num">${ils(x.amount)}</b></button>`).join(''):'<div class="empty">אין תשלומים שסומנו כשולמו בחודש הזה. סימון ״שולם״ בכרטיסייה או בתוכנית מכניס את הסכום לכאן.</div>'}</div>`;
}
function trainerBiz(){
  if(!['sum','price','set'].includes(ui.bizTab))ui.bizTab='sum';
  return `<h1 class="h-display" style="margin-top:6px">העסק</h1>
  <div class="seg biz-seg" style="margin-top:12px">${[['sum','סיכום כספי'],['price','מחירון'],['set','הגדרות']].map(([k,n])=>`<button data-act="bizTab" data-v="${k}" class="${ui.bizTab===k?'on':''}">${n}</button>`).join('')}</div>
  ${ui.bizTab==='price'?bizPrices():ui.bizTab==='set'?bizSettings():bizSummary()}`;
}
const payMsg=(t,a)=>{const P=PAY();return `היי ${firstName(t)}, תזכורת קטנה לגבי התשלום (${ils(a)}).${/^https?:/i.test(P.paybox)?' אפשר לשלם כאן: '+P.paybox:''}${P.bit?' · בביט: '+P.bit:''} תודה! יקיר`};
/* שורה לכל מתאמן: כמה צריך לשלם על החודש ומה שולם */
function financeRows(ym){
  const rows=[],cur=ymOf(today());
  tList().forEach(t=>{const b=billOf(t);
    if(b==='card')[...t.cardHistory,t.card].forEach(c=>{if((c.start||'').slice(0,7)===ym&&+c.price)rows.push({t,what:`כרטיסייה של ${c.size}`,due:+c.price,paid:c.paid?+c.price:0,act:c===t.card?'markPaid':'',id:t.id})});
    else if(b==='single'){const ss=t.sessions.filter(x=>(x.st==='came'||x.st==='late')&&x.date.slice(0,7)===ym);if(ss.length){const v=x=>+x.price||rateOf(t);rows.push({t,what:`${ss.length} אימונים`,due:ss.reduce((a,x)=>a+v(x),0),paid:ss.filter(x=>x.paid).reduce((a,x)=>a+v(x),0),act:'sesPayAll',id:t.id})}}
    else if(ym>=(t.subStart||cur)&&ym<=cur){const p=t.subPays.find(x=>x.m===ym),v=p&&+p.price||rateOf(t);rows.push({t,what:b==='online'?'מנוי אונליין':`מנוי ${+t.freq||2} בשבוע`,due:v,paid:p?v:0,act:'subPaid',id:t.id,v:ym})}
  });
  planClients().forEach(t=>{if((t.createdAt||'').slice(0,7)===ym&&+t.price)rows.push({t,what:'תוכנית אימונים',due:+t.price,paid:t.paid?+t.price:0,act:'pcPaidX',id:t.id,plan:1})});
  return rows.filter(r=>r.due>0);
}
function financeBlock(){
  const ym=ui.incM||today().slice(0,7),rows=financeRows(ym),due=rows.reduce((a,r)=>a+r.due,0),pd=rows.reduce((a,r)=>a+Math.min(r.paid,r.due),0),f=ui.finF||'all';
  const show=rows.filter(r=>f==='all'||(f==='paid'?r.paid>=r.due:r.paid<r.due)).sort((a,b)=>(a.paid>=a.due)-(b.paid>=b.due));
  const st=r=>r.paid>=r.due?'<span class="chip good">שולם</span>':r.paid>0?`<span class="chip warn num">חלקי · ${ils(r.paid)}</span>`:'<span class="chip bad">לא שולם</span>';
  return `<div class="h-sec"><span>לפי מתאמנים · ${ymName(ym,{month:'long'})}</span></div>
  <div class="stats"><div class="stat"><b class="num">${ils(due)}</b><span>צפוי החודש</span></div><div class="stat"><b class="num" style="color:var(--good)">${ils(pd)}</b><span>שולם</span></div><div class="stat"><b class="num" style="color:${due-pd?'var(--bad)':'var(--fg)'}">${ils(due-pd)}</b><span>פתוח</span></div></div>
  <div class="pills" style="margin-top:10px">${[['all','הכול'],['open','לא שולם'],['paid','שולם']].map(([k,n])=>`<button class="pill ${f===k?'on':''}" data-act="finF" data-v="${k}">${n}</button>`).join('')}</div>
  <div class="stack" style="margin-top:10px">${show.length?show.map(r=>`<div class="item fin-row">${avatar(r.t,36)}<button class="grow" data-act="${r.plan?'openP':'openT'}" data-id="${r.t.id}" style="min-width:0;background:none;border:0;padding:0;color:inherit;text-align:start;cursor:pointer"><b style="display:block">${esc(r.t.name)}</b><span class="small muted">${esc(r.plan?r.what:(billOf(r.t)==='single'?r.what+' · ':'')+dealText(r.t))}</span></button><div class="fin-amt"><b class="num">${ils(r.due)}</b>${st(r)}</div>${r.paid<r.due?`<div class="fin-acts">${r.t.phone?`<a class="icon-btn sm wa" href="${waLink(r.t.phone,payMsg(r.t,r.due-r.paid))}" target="_blank" rel="noopener" aria-label="תזכורת תשלום בוואטסאפ">${I.wa}</a>`:''}${r.act?`<button class="btn btn-ghost btn-sm" data-act="${r.act}" data-id="${r.id}"${r.v?` data-v="${r.v}"`:''}>שולם</button>`:''}</div>`:''}</div>`).join(''):'<div class="empty">אין תשלומים לחודש הזה.</div>'}</div>`;
}
function payRepBlock(){
  const rs=tList().filter(t=>t.payRep);if(!rs.length)return '';
  return `<div class="h-sec"><span>דיווחי תשלום · ${rs.length}</span></div><div class="stack">${rs.map(t=>`<div class="sess"><div class="row">${avatar(t,38)}<div class="grow" style="min-width:0"><b>${esc(t.name)}</b><div class="small muted num">דיווח/ה על תשלום של ${ils(t.payRep.amount)} · ${fmtShort(t.payRep.d)}</div></div></div><div class="row sess-actions"><button class="btn btn-primary btn-sm" data-act="payOk" data-id="${t.id}">${mini(I.check,14)} התקבל</button><button class="btn btn-ghost btn-sm" data-act="payNo" data-id="${t.id}">לא התקבל</button></div></div>`).join('')}</div>`;
}
function bizSummary(){
  const ts=tList(),unpaid=ts.filter(t=>billOf(t)==='card'&&!t.card.paid&&+t.card.price),owers=ts.filter(t=>billOf(t)!=='card'&&owed(t).amount);
  return `${payRepBlock()}
  ${incomeBlock()}
  ${financeBlock()}
  <div class="h-sec"><span>כל החובות הפתוחים · ${unpaid.length+owers.length}</span></div>
  <div class="stack">${unpaid.length+owers.length?owers.map(t=>{const o=owed(t),b=billOf(t);return `<div class="item">${avatar(t)}<div class="grow" style="min-width:0"><b>${esc(t.name)}</b><div class="small muted num">${isSub(t)?`מנוי: ${o.items.map(m=>ymName(m,{month:'long'})).join(', ')}`:`${o.n} אימונים`} · ${ils(o.amount)}</div></div>${t.phone?`<a class="icon-btn sm wa" href="${waLink(t.phone,payMsg(t,o.amount))}" target="_blank" rel="noopener" aria-label="תזכורת תשלום בוואטסאפ">${I.wa}</a>`:''}<button class="btn btn-ghost btn-sm" data-act="${isSub(t)?'subPayAll':'sesPayAll'}" data-id="${t.id}">שולם</button></div>`}).join('')+unpaid.map(t=>`<div class="item">${avatar(t)}<div class="grow" style="min-width:0"><b>${esc(t.name)}</b><div class="small muted num">כרטיסייה של ${t.card.size} · ${ils(t.card.price)} · מ-${fmtShort(t.card.start)}</div></div>${t.phone?`<a class="icon-btn sm wa" href="${waLink(t.phone,payMsg(t,t.card.price))}" target="_blank" rel="noopener" aria-label="תזכורת תשלום בוואטסאפ">${I.wa}</a>`:''}<button class="btn btn-ghost btn-sm" data-act="markPaid" data-id="${t.id}">שולם</button></div>`).join(''):'<div class="empty">אין תשלומים פתוחים.</div>'}</div>
  <div class="h-sec"><span>התמדה</span></div>
  <div class="stack">${ts.length?ts.map(t=>{const a=attendance(t);return `<button class="item tap" data-act="openT" data-id="${t.id}"><b class="grow">${esc(t.name)}</b><span class="small muted num">${a.c} הגיע · ${a.m} לא הגיע</span><span class="chip ${a.pct==null?'':a.pct>=80?'good':a.pct>=60?'warn':'bad'} num">${a.pct==null?'אין נתונים':a.pct+'%'}</span></button>`}).join(''):'<div class="empty">אין מתאמנים עדיין.</div>'}</div>`;
}
function bizPrices(){
  const P=PRICES(),fk=FMTN[ui.fmtP]?ui.fmtP:'solo',F=P.fmt[fk],inp=(path,label,val)=>`<div class="field" style="margin:0"><label for="pp-${path}">${label}</label><input id="pp-${path}" type="number" min="0" inputmode="numeric" value="${val||''}" data-act="priceSet" data-v="${path}"></div>`;
  return `<p class="small muted" style="margin-top:14px">לפי המחירון ממולאים המחירים כשמאשרים מתאמן או מחדשים כרטיסייה, ומחושבים ההכנסות והחובות. לכל מתאמן אפשר לתת מחיר מיוחד או הנחה (בכרטיס שלו ← עסקה).</p>
  <div class="pills" style="margin-top:6px">${FMTS.map(([k,n])=>`<button class="pill ${k===fk?'on':''}" data-act="fmtP" data-v="${k}">${n}</button>`).join('')}</div>
  <div class="card" style="margin-top:12px">
    <b>אימון ${FMTN[fk]}</b>${fk==='solo'?'':'<span class="small muted"> · מחיר למשתתף</span>'}
    <div style="margin-top:10px">${inp(`fmt.${fk}.single`,'אימון בודד (₪)',F.single)}</div>
    <div class="small muted" style="margin:14px 0 8px">כרטיסיות</div>
    <div class="stack" style="gap:8px">${F.cards.map((c,k)=>{const per=c.price&&c.size?c.price/c.size:0,sv=per&&F.single?Math.round((1-per/F.single)*100):0;return `<div class="price-row">${inp(`fmt.${fk}.cards.${k}.size`,'אימונים',c.size)}${inp(`fmt.${fk}.cards.${k}.price`,'מחיר (₪)',c.price)}<button class="icon-btn sm" data-act="delCardPrice" data-v="${k}" aria-label="מחיקת כרטיסייה">${I.trash}</button></div>${per?`<div class="small muted num" style="margin-top:-2px">${ils(per)} לאימון${sv>0?` · חיסכון ${sv}% מאימון בודד`:''}</div>`:''}`}).join('')}</div>
    <button class="btn btn-ghost btn-sm" style="margin-top:10px" data-act="addCardPrice">+ כרטיסייה</button>
    <div class="small muted" style="margin:16px 0 8px">מנוי חודשי לפי מספר אימונים בשבוע</div>
    <div class="mon-grid">${[1,2,3,4,5].map(n=>inp(`fmt.${fk}.monthly.${n}`,`${n} בשבוע`,F.monthly[n])).join('')}</div>
  </div>
  <div class="card" style="margin-top:12px"><b>מחירים כלליים</b><div class="two" style="margin-top:10px">${inp('online','אונליין לחודש (₪)',P.online)}${inp('plan','תוכנית בלבד (₪)',P.plan)}</div></div>`;
}
const swPub=(path,title,sub,on)=>`<div class="item"><label class="grow" for="sw-${path.replace('.','-')}"><b>${title}</b><div class="small muted">${sub}</div></label><label class="switch"><input type="checkbox" id="sw-${path.replace('.','-')}" data-act="pubSet" data-v="${path}" ${on?'checked':''}><span></span></label></div>`;
function bizSettings(){
  const s=PUB(),cld=s.cld||{},pol=POL(),gr=GROW(),pay=PAY(),offs=(s.off||[]).filter(d=>d>=today()).sort();
  const pf=(path,label,attrs,val)=>`<div class="field"><label for="pf-${path.replace('.','-')}">${label}</label><input id="pf-${path.replace('.','-')}" ${attrs} value="${esc(val??'')}" data-act="pubSet" data-v="${path}"></div>`;
  return `<div class="h-sec"><span>תשלום אונליין</span></div>
  <div class="card"><div class="small muted" style="margin-bottom:10px">המתאמנים יראו כפתור תשלום כשיש להם חוב, ואחרי התשלום ילחצו ״שילמתי״. תקבל/י הודעה, תאשר/י, ותשלח/י קבלה בוואטסאפ.</div>
    ${pf('pay.paybox','קישור לתשלום בפייבוקס','type="url" dir="ltr" inputmode="url" placeholder="https://payboxapp.page.link/…"',pay.paybox)}
    ${pf('pay.bit','ביט: מספר טלפון או קישור','dir="ltr" placeholder="050-0000000"',pay.bit)}</div>
  <div class="h-sec"><span>ביטולים ותורים</span></div>
  <div class="stack">
    ${swPub('policy.cancel','מדיניות ביטול','מתאמנים מבטלים אימון מהאפליקציה. ביטול מאוחר נספר כאימון',pol.cancel)}
    ${pol.cancel?`<div class="card"><div class="two">${pf('policy.hours','כמה שעות לפני מותר לבטל','type="number" min="1" max="72" inputmode="numeric"',pol.hours)}<div></div></div>${swPub('policy.charge','ביטול מאוחר נספר','כרטיסייה: יורד אימון. לפי אימון: מחויב',pol.charge)}</div>`:''}
    ${swPub('policy.fixed','אימונים קבועים','לכל מתאמן קובעים יום ושעה קבועים, והאימונים נקבעים לבד מראש',pol.fixed)}
    ${pol.fixed?`<div class="card">${pf('policy.weeks','כמה שבועות קדימה לקבוע','type="number" min="1" max="12" inputmode="numeric"',pol.weeks)}<div class="small muted">את הזמנים הקבועים מגדירים בכרטיס של כל מתאמן.</div></div>`:''}
    ${swPub('policy.wait','רשימת המתנה','שעות תפוסות מסומנות אצל המתאמנים (בלי שמות), ואפשר להירשם להמתנה',pol.wait)}
  </div>
  ${grpSettings()}
  ${hqBlock()}
  <div class="h-sec"><span>צמיחה של העסק</span></div>
  <div class="stack">
    ${swPub('growth.ref','חבר מביא חבר','לכל מתאמן קישור הזמנה אישי, ומי שמביא חבר מקבל מתנה',gr.ref)}
    ${gr.ref?`<div class="card">${pf('growth.gift','מה מקבלים על חבר שהצטרף','placeholder="אימון מתנה"',gr.gift)}</div>`:''}
    ${swPub('growth.rev','בקשת המלצות','אחרי כמה אימונים המתאמן מתבקש לכתוב משפט עליך',gr.rev)}
    ${gr.rev?`<div class="card">${pf('growth.after','אחרי כמה אימונים לבקש','type="number" min="1" inputmode="numeric"',gr.after)}</div>`:''}
    ${typeof growthLists==='function'?growthLists():''}
  </div>
  <div class="h-sec"><span>הוואטסאפ שלי</span></div>
  <div class="card"><div class="field" style="margin:0"><label for="p-phone">המספר שאליו מתאמנים שולחים הודעות</label><input id="p-phone" type="tel" dir="ltr" inputmode="tel" value="${esc(s.phone)}" data-act="pubField" data-v="phone" placeholder="050-0000000"></div></div>
  <div class="h-sec"><span>שעות עבודה</span></div>
  <div class="card">
    <div class="small muted" style="margin-bottom:8px">ימי עבודה</div>
    <div class="weekdays">${DS.map((d,i)=>`<button class="wd ${s.days.includes(i)?'on':''}" data-act="wd" data-v="${i}" aria-pressed="${s.days.includes(i)}">${d}</button>`).join('')}</div>
    <div class="two" style="margin-top:14px"><div class="field"><label for="h-from">משעה</label><input id="h-from" type="time" step="3600" value="${s.from}" data-act="pubField" data-v="from"></div><div class="field"><label for="h-to">עד שעה</label><input id="h-to" type="time" step="3600" value="${s.to}" data-act="pubField" data-v="to"></div></div>
    <div class="small muted">מתאמנים יוכלו לבקש אימון רק בימים ובשעות האלה.</div>
  </div>
  <div class="h-sec"><span>ימי חופש</span><button class="btn btn-ghost btn-sm" data-act="addOff">+ יום חופש</button></div>
  <div class="stack">${offs.length?offs.map(d=>`<div class="item"><div class="grow">${fmt(d)}</div><button class="icon-btn sm" data-act="delOff" data-v="${d}" aria-label="הסרה">${I.trash}</button></div>`).join(''):'<div class="empty">לא סומנו ימי חופש.</div>'}</div>
  <div class="h-sec"><span>העלאת סרטונים (אונליין)</span></div>
  <div class="card">
    <div class="small muted" style="margin-bottom:10px">${cldOn()?'✅ מחובר: מתאמני אונליין יכולים להעלות סרטון ישר מהטלפון.':'כרגע מתאמנים שולחים קישור ליוטיוב או לדרייב. כדי לאפשר העלאה ישירה מהטלפון (בחינם), פותחים חשבון ב-Cloudinary וממלאים כאן שני פרטים.'}</div>
    ${cldOn()?`<div class="small muted" style="margin:-4px 0 10px">סרטונים שקיבלו ציון לפני יותר מחודשיים יורדים מהרשימות באפליקציה. הקבצים נשארים ב-Cloudinary עד שמוחקים אותם שם.</div>${cleanupBanner()}`:''}
    <div class="two">${fld('cld-cloud','Cloud name','dir="ltr" autocomplete="off" data-act="cldField" data-v="cloud"',cld.cloud||'')}${fld('cld-preset','Upload preset','dir="ltr" autocomplete="off" data-act="cldField" data-v="preset"',cld.preset||'')}</div>
  </div>
  <div class="h-sec"><span>ייצוא וגיבוי</span></div>
  <div class="card"><div class="small muted" style="margin-bottom:10px">קבצים שנפתחים באקסל, לגיבוי או לרואה החשבון.</div>
    <div class="row wrap-ok" style="gap:8px"><button class="btn btn-ghost btn-sm" data-act="exp" data-v="t">מתאמנים</button><button class="btn btn-ghost btn-sm" data-act="exp" data-v="p">תשלומים</button><button class="btn btn-ghost btn-sm" data-act="exp" data-v="w">אימונים ומשקלים</button><button class="btn btn-ghost btn-sm" data-act="exp" data-v="j">גיבוי מלא</button></div></div>`;
}
function csvFile(name,rows){const q=v=>{const x=String(v??'');return /[",\n\r]/.test(x)?'"'+x.replace(/"/g,'""')+'"':x};return new File(['﻿'+rows.map(r=>r.map(q).join(',')).join('\r\n')],name,{type:'text/csv;charset=utf-8'})}
function giveFile(f){if(navigator.canShare&&navigator.canShare({files:[f]}))navigator.share({files:[f],title:f.name}).catch(()=>{});else saveFile(f)}
function exportData(k){
  const d=today();
  if(k==='t')return giveFile(csvFile(`מתאמנים-${d}.csv`,[['שם','טלפון','מייל','עסקה','סוג אימון','מחיר','נשארו בכרטיסייה','חוב פתוח','הצטרף']].concat(tList().map(t=>{const ci=cardInfo(t);return [t.name,t.phone,t.email||'',BILL_NAME[billOf(t)],FMTN[fmtOf(t)],billOf(t)==='card'?t.card.price:rateOf(t),ci.none?'':ci.left,owed(t).amount,t.joinedAt||'']}))));
  if(k==='p')return giveFile(csvFile(`תשלומים-${d}.csv`,[['תאריך תשלום','שם','פירוט','סוג','סכום']].concat(payments().map(x=>[x.d,x.t.name,x.what,x.kind,x.amount]))));
  if(k==='w')return giveFile(csvFile(`אימונים-${d}.csv`,[['שם','תאריך','תרגיל','ק״ג','חזרות','סטים','RPE','כשל']].concat([...tList(),...(user&&DB.coach[user.uid]?[T(user.uid)]:[])].flatMap(t=>t.logs.map(l=>[t.name,l.d,l.ex,l.kg,l.reps,l.sets||1,l.rpe||'',l.fail?'כן':''])))));
  giveFile(new File([JSON.stringify({at:new Date().toISOString(),members:DB.members,coach:DB.coach,pub:DB.pub},null,1)],`גיבוי-yakirfit-${d}.json`,{type:'application/json'}));
}
/* מתאמן: כרטיס תשלום פתוח + "שילמתי" */
function payCard(t){
  const o=owed(t);if(!o.n||!o.amount)return '';
  if(t.payRep)return `<div class="banner">${I.check}<div class="grow small"><b>דיווחת על תשלום של ${ils(t.payRep.amount)}</b> · ממתין לאישור של יקיר</div></div>`;
  const P=PAY(),what=billOf(t)==='card'?`כרטיסייה של ${t.card.size} אימונים`:isSub(t)?'מנוי: '+o.items.map(m=>ymName(m,{month:'long'})).join(', '):`${o.n} אימונים`;
  return `<div class="card pay-card" style="margin-top:12px"><div class="small muted">תשלום פתוח</div><b class="num" style="font-family:var(--display);font-size:26px">${ils(o.amount)}</b><div class="small muted">${esc(what)}</div>
    <div class="row wrap-ok" style="gap:8px;margin-top:12px">${/^https?:/i.test(P.paybox)?`<a class="btn btn-primary btn-sm" href="${esc(P.paybox)}" target="_blank" rel="noopener">תשלום בפייבוקס</a>`:''}${P.bit?(/^https?:/i.test(P.bit)?`<a class="btn btn-ghost btn-sm" href="${esc(P.bit)}" target="_blank" rel="noopener">תשלום בביט</a>`:`<span class="chip">ביט: <span dir="ltr" style="user-select:all">${esc(P.bit)}</span></span>`):''}<button class="btn btn-ghost btn-sm" data-act="payRep">שילמתי ✓</button></div></div>`;
}
function billBlock(t){
  const b=billOf(t),ci=cardInfo(t),P=PRICES();
  if(b==='card'){
    const sg=P.fmt[fmtOf(t)].single,per=t.card.price&&t.card.size?t.card.price/t.card.size:0,save=per&&sg?Math.round((1-per/sg)*100):0;
    return `  <div class="h-sec"><span>כרטיסייה · ${FMTN[fmtOf(t)]}</span><button class="btn btn-ghost btn-sm" data-act="editTrainee">עסקה</button></div>
  <div class="card"><div class="row"><div class="grow"><div class="num" style="font-family:var(--display);font-weight:800;font-size:30px;line-height:1">${ci.left} <span class="muted" style="font-size:22px">/ ${ci.size}</span></div><div class="small muted">אימונים שנשארו · התחילה ב-${fmtShort(t.card.start)}</div></div><button class="btn btn-primary btn-sm" data-act="renew">חידוש כרטיסייה</button></div>
    <div class="bar ${ci.low?'low':''}" style="margin-top:12px"><i style="width:${ci.left/ci.size*100}%"></i></div>
    <div class="row" style="margin-top:12px;border-top:1px solid var(--line);padding-top:12px"><div class="grow small">תשלום: <b class="${t.card.paid?'paid':'unpaid'}">${t.card.paid?'שולם'+(t.card.paidDate?' ב-'+fmtShort(t.card.paidDate):''):'לא שולם'}</b>${t.card.price?' · <span class="num">₪'+t.card.price+'</span>':''}</div>${t.card.paid?`<button class="btn btn-ghost btn-sm" data-act="markUnpaid" data-id="${t.id}">ביטול סימון</button>`:`<button class="btn btn-ghost btn-sm" data-act="markPaid" data-id="${t.id}">סימון כשולם</button>`}</div>
    ${t.renewReq?'<div class="banner" style="margin-top:12px">'+I.bell+'<div class="small">המתאמן ביקש לחדש כרטיסייה.</div></div>':''}
    ${t.cardHistory.length?`<details style="margin-top:10px"><summary class="small muted" style="cursor:pointer">כרטיסיות קודמות (${t.cardHistory.length})</summary><div class="stack" style="margin-top:8px;gap:4px">${t.cardHistory.slice().reverse().map(c=>`<div class="row small"><span class="grow muted num">${fmtShort(c.start)} · ${c.size} אימונים</span><span class="num">${c.price?'₪'+c.price:''}</span><b class="${c.paid?'paid':'unpaid'}">${c.paid?'שולם':'לא שולם'}</b></div>`).join('')}</div></details>`:''}
  </div>
`.replace('<div class="small muted">אימונים שנשארו · התחילה ב-','<div class="small muted">'+(per?`${ils(per)} לאימון${save>0?` (חיסכון ${save}%)`:''} · `:'')+'אימונים שנשארו · התחילה ב-');
  }
  const o=owed(t);
  if(b==='single'){
    const paid=t.sessions.filter(s=>s.paid).sort((a,c)=>c.date.localeCompare(a.date)).slice(0,6);
    return `<div class="h-sec"><span>תשלום לפי אימון · ${FMTN[fmtOf(t)]}</span><button class="btn btn-ghost btn-sm" data-act="editTrainee">שינוי</button></div>
    <div class="card"><div class="row"><div class="grow"><div class="num" style="font-family:var(--display);font-weight:800;font-size:30px;line-height:1;color:${o.n?'var(--warn)':'var(--fg)'}">${ils(o.amount)}</div><div class="small muted">${o.n?`${o.n} אימונים שהתקיימו ועוד לא שולמו`:'אין חוב פתוח'} · ${ils(rateOf(t))} לאימון</div></div>${o.n?`<button class="btn btn-primary btn-sm" data-act="sesPayAll" data-id="${t.id}">הכול שולם</button>`:''}</div>
      ${o.n?`<div class="stack" style="margin-top:12px;gap:8px">${o.items.map(s=>`<div class="row small"><span class="grow">${fmt(s.date)} · <span class="num">${s.time}</span></span><b class="num">${ils(+s.price||rateOf(t))}</b><button class="btn btn-ghost btn-sm" data-act="sesPaid" data-id="${t.id}|${s.id}">שולם</button></div>`).join('')}</div>`:''}
      <div class="small muted" style="margin-top:10px">כל אימון שמסומן ״הגיע״ נכנס לחשבון.</div>
      ${paid.length?`<details style="margin-top:10px"><summary class="small muted" style="cursor:pointer">אימונים ששולמו</summary><div class="stack" style="margin-top:8px;gap:6px">${paid.map(s=>`<div class="row small"><span class="grow muted">${fmt(s.date)}</span><span class="num">${ils(+s.price||rateOf(t))}</span><span class="paid">שולם ${fmtShort(s.paidDate||s.date)}</span><button class="btn btn-ghost btn-sm" data-act="sesUnpaid" data-id="${t.id}|${s.id}">ביטול</button></div>`).join('')}</div></details>`:''}
    </div>`;
  }
  const cur=ymOf(today()),months=[];let m=t.subStart||cur;for(let k=0;k<60&&m<=cur;k++){months.push(m);m=ymNext(m)}
  const paidM=Object.fromEntries(t.subPays.map(x=>[x.m,x]));
  return `<div class="h-sec"><span>${billOf(t)==='online'?'מנוי אונליין':`מנוי חודשי · ${+t.freq||2} בשבוע · ${FMTN[fmtOf(t)]}`}</span><button class="btn btn-ghost btn-sm" data-act="editTrainee">שינוי</button></div>
  <div class="card"><div class="row"><div class="grow"><div class="num" style="font-family:var(--display);font-weight:800;font-size:30px;line-height:1">${ils(rateOf(t))} <span class="muted" style="font-size:20px">לחודש</span></div><div class="small muted">${o.n?`חוב: ${ils(o.amount)} (${o.n} ${o.n===1?'חודש':'חודשים'})`:'הכול שולם'} · מנוי מ${ymName(t.subStart||cur,{month:'long',year:'numeric'})}</div></div>${o.n>1?`<button class="btn btn-primary btn-sm" data-act="subPayAll" data-id="${t.id}">הכול שולם</button>`:''}</div>
    <div class="stack" style="margin-top:12px;gap:8px">${months.slice(-6).reverse().map(mm=>{const pd=paidM[mm];return `<div class="row small"><span class="grow">${ymName(mm)}</span>${pd?`<span class="paid">שולם ${fmtShort(pd.paidDate)}</span><button class="btn btn-ghost btn-sm" data-act="subUnpaid" data-id="${t.id}" data-v="${mm}">ביטול</button>`:`<span class="unpaid">לא שולם</span><button class="btn btn-ghost btn-sm" data-act="subPaid" data-id="${t.id}" data-v="${mm}">שולם</button>`}</div>`}).join('')}</div>
  </div>`;
}
function traineeEditor(t){
  const ci=cardInfo(t), ss=sessOf(t), up=ss.filter(s=>s.date>=today()).slice(0,4), a=attendance(t);
  const past=ss.filter(s=>s.date<=today()).slice(-4).reverse();
  const myReqs=t.requests.filter(r=>r.status==='pending');
  return `
  <div class="row" style="margin-top:4px"><button class="icon-btn" data-act="back" aria-label="חזרה">${I.back}</button><span class="muted small">חזרה למתאמנים</span></div>
  <div class="card hero" style="margin-top:12px">
    <div class="row">${avatar(t,58)}
      <div class="grow" style="min-width:0"><h1 class="h-display" style="font-size:28px">${esc(t.name)}</h1><div class="small muted">${esc(t.goal||'')}${t.phone?' · <span class="num" dir="ltr">'+esc(t.phone)+'</span>':''}</div></div>
      <button class="icon-btn" data-act="editTrainee" aria-label="עריכת פרטים">${I.edit}</button></div>
    ${t.phone?`<div class="row" style="margin-top:12px"><button class="btn btn-wa btn-sm" data-act="wa">${I.wa} הודעה בוואטסאפ</button></div>`:''}
    <div class="row wrap-ok" style="margin-top:12px;gap:6px">${(()=>{const h=achievements(t);return (h.streak?`<span class="chip warn num">${mini(I.flame,12)} רצף ${h.streak}</span>`:'')+`<span class="chip num">${mini(I.medal,12)} ${h.earned.length} הישגים</span>`})()}${a.pct==null?'':`<span class="chip ${a.pct>=80?'good':a.pct>=60?'warn':'bad'} num">התמדה ${a.pct}%</span>`}${t.offline?'<span class="chip">בלי אפליקציה</span>':''}${t.features.log?'<span class="chip cool">מעקב משקלים</span>':''}${t.features.water?'<span class="chip cool">תזכורת מים</span>':''}${t.features.food?'<span class="chip cool">תפריט</span>':''}</div>
  </div>
  ${billBlock(t)}
  ${fixedBlock(t)}
  ${healthBlock(t)}
  ${billOf(t)==='online'?vidsCoachBlock(t)+ckTraineeBlock(t,true):''}
  ${myReqs.length?`<div class="h-sec"><span>בקשות ממתינות</span></div><div class="stack">${myReqs.map(r=>`<div class="item"><div class="grow small">${fmt(r.date)} · <span class="num">${r.time}</span>${r.note?'<div class="muted">״'+esc(r.note)+'״</div>':''}</div><button class="btn btn-primary btn-sm" data-act="reqOk" data-id="${t.id}|${r.id}">אישור</button><button class="btn btn-ghost btn-sm" data-act="reqNo" data-id="${t.id}|${r.id}">דחייה</button></div>`).join('')}</div>`:''}
  <div class="h-sec"><span>אימונים קרובים</span><button class="btn btn-ghost btn-sm" data-act="addSession" data-id="${t.id}">קביעת אימון</button></div>
  <div class="stack">${up.length?up.map(s=>`<div class="item"><div class="time num" style="font-size:24px;min-width:52px">${s.time}</div><div class="grow">${fmt(s.date)}</div><button class="icon-btn sm" data-act="delSession" data-id="${t.id}|${s.id}" aria-label="ביטול">${I.trash}</button></div>`).join(''):'<div class="empty">אין אימונים קבועים.</div>'}</div>
  ${past.length?`<div class="h-sec"><span>נוכחות אחרונה</span></div><div class="stack">${past.map(s=>`<div class="item" style="flex-wrap:wrap"><div class="grow small">${fmt(s.date)} · <span class="num">${s.time}</span></div><div class="row" style="gap:6px">${attBtns(t,s)}</div></div>`).join('')}</div>`:''}
  <div class="h-sec"><span>תוכנית אימונים</span><button class="btn btn-ghost btn-sm" data-act="pdf">PDF למתאמן</button></div>
  ${t.live?awBanner(t):(t.plan[ui.planIdx]&&t.plan[ui.planIdx].ex.length?`<button class="btn btn-primary btn-block aw-start" data-act="awStart">${mini(I.play,16)} אימון עם ${esc(firstName(t))} · ${esc(t.plan[ui.planIdx].title)}</button>`:'')}
  ${planBlock(t,true)}
  <div class="h-sec"><span>תפריט תזונה</span><button class="btn btn-ghost btn-sm" data-act="addFood">+ ארוחה</button></div>
  ${foodBlock(t,true)}
  ${nutriCoach(t)}
  ${habitsCoach(t)}
  ${weekStripBlock(t,true)}
  ${workoutsBlock(t,true)}
  ${rmBlock(t)}
  ${reportBlock(t,true)}
  ${t.logs.length?`<div class="h-sec"><span>התקדמות בתרגילים</span></div>${progressBlock(t)}`:''}
  ${bodyBlock(t)}
  ${photoBlock(t)}
  <div style="margin-top:28px"><button class="btn btn-danger btn-block" data-act="delTrainee">מחיקת מתאמן</button></div>`;
}

/* ----- shared blocks ----- */
function planBlock(t,editable){
  const plan=t.plan; if(ui.planIdx>=plan.length)ui.planIdx=0;
  const day=plan[ui.planIdx];
  return `<div class="pills">${plan.map((p,i)=>`<button class="pill ${i===ui.planIdx?'on':''}" data-act="planIdx" data-v="${i}">${esc(p.title)}</button>`).join('')}${editable?`<button class="pill" data-act="addDay">+ יום</button><button class="pill" data-act="tplMenu">${mini(I.copy,13)} תבניות</button>${t.planOnly?'':`<button class="pill" data-act="cycle">${mini(I.chart,13)} מחזוריות</button>`}`:''}</div>
  ${(()=>{const ci=cycleInfo(t);return ci?`<div class="cyc ${ci.dl?'dl':''}">${mini(I.chart,14)} מחזוריות · שבוע ${ci.wk} מתוך ${ci.weeks} · ${ci.dl?`שבוע הקלה (${Math.round((ci.f-1)*100)}%)`:ci.f>1?`+${+((ci.f-1)*100).toFixed(1)}% ממשקל הבסיס`:'משקל בסיס'}</div>`:''})()}
  ${day?`<div class="stack" style="margin-top:12px">
    ${!editable&&!t.live?`<button class="btn btn-primary btn-block aw-start" data-act="awStart">${mini(I.play,16)} התחלת אימון · ${esc(day.title)}</button>`:''}
    ${editable?`<div class="row" style="justify-content:flex-end;gap:6px"><button class="btn btn-ghost btn-sm" data-act="editDay">${mini(I.edit,14)} שם היום</button><button class="btn btn-danger btn-sm" data-act="delDay">מחיקת יום</button></div>`:''}
    ${day.ex.length?day.ex.map((e,i)=>{const l=lastLog(t,e.name),my=t.exNotes[e.name],sg=t.planOnly?null:suggest(t,e.name),ss=e.ss&&i>0;return `<div class="ex ${ss?'ss':''}"><span class="ex-n num">${i+1}</span><div class="grow" style="min-width:0">${ss?`<div class="ss-tag">${mini(I.swap,12)} סופר-סט עם הקודם</div>`:''}<div class="ex-name">${esc(e.name)}</div><div class="ex-meta num">${e.sets} סטים × ${esc(e.reps)} חזרות${hasKg(e)?` · <b style="color:var(--accent2)">${+adjKg(t,e.kg)!==+e.kg?`<s class="muted" style="font-weight:400">${e.kg}</s> ${adjKg(t,e.kg)}`:e.kg} ק״ג</b>`:''}</div>${e.note?`<div class="ex-note"><b>יקיר:</b> ${esc(e.note)}</div>`:''}${my?`<div class="ex-mynote"><b>${editable?esc(firstName(t)):'ההערה שלי'}:</b> ${esc(my)}</div>`:''}${l?`<div class="last num">אחרון: ${l.kg} ק״ג × ${l.reps} · ${fmtShort(l.d)}${l.fail?' · כשל':''}</div>`:''}${sg?`<div class="ex-sug">💡 בפעם הבאה: <b>${kgf(sg.kg)} ק״ג</b></div>`:''}${(()=>{const lv=t.vids.filter(v=>v.ex===e.name).sort((a,b)=>b.at-a.at)[0];if(!lv)return '';const f=t.fb[lv.id];return `<div class="ex-vid">${mini(I.vid,13)} ${f?(f.score?'ציון '+f.score+'/10':'יקיר הגיב'):(editable?'סרטון מחכה לציון':'ממתין לציון של יקיר')}</div>`})()}</div>
      <div class="ex-btns">${e.video&&/^https?:\/\//i.test(e.video)?`<a class="icon-btn sm vid" data-act="video" data-v="${esc(e.video)}" data-n="${esc(e.name)}" href="${esc(e.video)}" target="_blank" rel="noopener" aria-label="סרטון הדגמה: ${esc(e.name)}" title="סרטון הדגמה">${I.play}</a>`:''}
      ${editable?`${t.planOnly?'':`<button class="icon-btn sm accent" data-act="logEx" data-v="${esc(e.name)}" aria-label="רישום משקל: ${esc(e.name)}" title="רישום משקל">${I.log}</button>`}<button class="icon-btn sm" data-act="editEx" data-id="${e.id}" aria-label="עריכה">${I.edit}</button><button class="icon-btn sm" data-act="delEx" data-id="${e.id}" aria-label="מחיקה">${I.trash}</button>`:`${billOf(t)==='online'?`<button class="icon-btn sm" data-act="vidUp" data-v="${esc(e.name)}" aria-label="סרטון ליקיר: ${esc(e.name)}" title="סרטון ליקיר">${I.vid}</button>`:''}<button class="icon-btn sm" data-act="exNote" data-v="${esc(e.name)}" aria-label="הערה שלי: ${esc(e.name)}" title="הערה שלי">${I.edit}</button>${t.features.log?`<button class="icon-btn accent" data-act="logEx" data-v="${esc(e.name)}" aria-label="רישום משקל">${I.log}</button>`:''}`}</div></div>`}).join(''):'<div class="empty">אין עדיין תרגילים ביום הזה.</div>'}
    ${editable?`<button class="btn btn-ghost btn-block" data-act="addEx">${mini(I.plus)} הוספת תרגיל</button>`:''}
  </div>`:`<div class="empty" style="margin-top:12px"><b>אין תוכנית עדיין</b>${editable?'הוסיפו יום אימון ראשון.':'יקיר יעלה כאן את התוכנית שלך.'}</div>`}`;
}
function foodBlock(t,editable){
  if(!t.food.length)return `<div class="empty">עוד אין ארוחות בתפריט.</div>`;
  return `<div class="stack">${t.food.map(m=>`<div class="item"><div class="grow" style="min-width:0"><div class="food-meal">${esc(m.meal)}</div><div>${esc(m.text)}</div></div>${editable?`<button class="icon-btn sm" data-act="editFood" data-id="${m.id}" aria-label="עריכה">${I.edit}</button><button class="icon-btn sm" data-act="delFood" data-id="${m.id}" aria-label="מחיקה">${I.trash}</button>`:''}</div>`).join('')}</div>`;
}
function progressBlock(t){
  const exs=[...new Set(t.logs.map(l=>l.ex))];
  if(!exs.length)return `<div class="empty"><b>עוד אין רישומים</b>בכל אימון לחצו על + ליד התרגיל ורשמו כמה הרמתם. הגרף ייבנה מעצמו.</div>`;
  if(!exs.includes(ui.progEx))ui.progEx=exs[0];
  const pts=Object.values(t.logs.filter(l=>l.ex===ui.progEx).reduce((m,l)=>{if(!m[l.d]||m[l.d].kg<l.kg)m[l.d]=l;return m},{})).sort((a,b)=>a.d.localeCompare(b.d));
  const best=Math.max(...pts.map(p=>p.kg)), diff=+(pts[pts.length-1].kg-pts[0].kg).toFixed(1);
  return `<div class="pills">${exs.map(e=>`<button class="pill ${e===ui.progEx?'on':''}" data-act="progEx" data-v="${esc(e)}">${esc(e)}</button>`).join('')}</div>
  <div class="card" style="margin-top:12px">
    <div class="row"><div class="grow"><div class="small muted">שיא אישי</div><div class="num" style="font-family:var(--display);font-weight:800;font-size:32px;line-height:1;color:var(--accent2)">${best} <span style="font-size:22px">ק״ג</span></div></div>
    <span class="chip ${diff>0?'good':diff<0?'bad':''} num">${diff>0?'+':''}${diff} ק״ג מההתחלה</span></div>
    ${chart(pts)}
    <div class="stack" style="margin-top:8px;gap:6px">${pts.slice(-4).reverse().map(p=>`<div class="row small"><span class="muted grow num">${fmt(p.d)}</span><b class="num">${p.kg} ק״ג × ${p.reps}</b>${p.kg===best?'<span class="chip good">'+mini(I.trophy,12)+' שיא</span>':''}</div>`).join('')}</div>
  </div>`;
}
let chartN=0;
function chart(pts){
  const W=340,H=170,L=34,R=12,Tp=14,B=26,gid='g'+(++chartN);
  if(pts.length<2)return `<div class="small muted" style="margin:10px 0">רישום אחד בינתיים. מהרישום השני יופיע גרף.</div>`;
  const ys=pts.map(p=>p.kg);let mn=Math.min(...ys),mx=Math.max(...ys);if(mn===mx){mn-=5;mx+=5}
  /* צעדים עגולים בציר: 2.5, 50, 1000... */
  const raw=(mx-mn)/3,mag=Math.pow(10,Math.floor(Math.log10(raw||1))),step=Math.max(.5,[1,2,2.5,5,10].map(x=>x*mag).find(x=>x>=raw)||raw);mn=Math.floor(mn/step)*step;mx=Math.ceil(mx/step)*step;if(mx===mn)mx=mn+step;
  const X=i=>L+(i/(pts.length-1))*(W-L-R), Y=v=>Tp+(1-(v-mn)/(mx-mn))*(H-Tp-B);
  let grid='';for(let v=mn;v<=mx+.001;v+=step){grid+=`<line x1="${L}" x2="${W-R}" y1="${Y(v)}" y2="${Y(v)}" stroke="var(--line)" stroke-dasharray="3 4"/><text x="${L-6}" y="${Y(v)+4}" text-anchor="end" fill="var(--muted)" font-size="10">${(+v.toFixed(1)).toLocaleString('he-IL')}</text>`}
  const line=pts.map((p,i)=>`${i?'L':'M'}${X(i).toFixed(1)},${Y(p.kg).toFixed(1)}`).join('');
  const area=line+`L${X(pts.length-1).toFixed(1)},${H-B}L${X(0).toFixed(1)},${H-B}Z`;
  const lab=[0,Math.floor((pts.length-1)/2),pts.length-1].filter((v,i,a)=>a.indexOf(v)===i);
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="גרף התקדמות" dir="ltr"><defs><linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff6a2b" stop-opacity=".35"/><stop offset="1" stop-color="#ff6a2b" stop-opacity="0"/></linearGradient></defs>
  ${grid}<path d="${area}" fill="url(#${gid})"/><path d="${line}" fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
  ${pts.map((p,i)=>`<circle cx="${X(i)}" cy="${Y(p.kg)}" r="${i===pts.length-1?5:3}" fill="${i===pts.length-1?'var(--accent2)':'var(--surface)'}" stroke="var(--accent)" stroke-width="2"/>`).join('')}
  ${lab.map(i=>`<text x="${X(i)}" y="${H-8}" text-anchor="middle" fill="var(--muted)" font-size="10">${fmtShort(pts[i].d)}</text>`).join('')}</svg>`;
}
function bodyBlock(t){
  const b=t.body.slice().sort((x,y)=>x.d.localeCompare(y.d));
  const head=`<div class="h-sec"><span>מדדי גוף</span><button class="btn btn-ghost btn-sm" data-act="addBody">+ מדידה</button></div>`;
  if(!b.length)return head+`<div class="empty"><b>עוד אין מדידות</b>רשמו משקל והיקפים פעם בשבוע או שבועיים, וכאן יופיע השינוי.</div>`;
  const f=b[0],l=b[b.length-1];
  const M=[['kg','משקל','ק״ג'],['waist','מותניים','ס״מ'],['chest','חזה','ס״מ'],['hips','ירכיים','ס״מ'],['arm','זרוע','ס״מ']];
  const metrics=M.filter(([k])=>l[k]!=null&&l[k]!=='').map(([k,n,u])=>{const fv=b.find(x=>x[k]!=null&&x[k]!=='');const d=fv?+(l[k]-fv[k]).toFixed(1):0;const good=k==='arm'?d>0:d<0;return `<div class="metric"><span>${n} (${u})</span><b class="num">${l[k]}</b><i class="num" style="color:${d===0?'var(--muted)':good?'var(--good)':'var(--warn)'}">${d>0?'+':''}${d}</i></div>`}).join('');
  const has=k=>x=>x[k]!=null&&x[k]!=='',avail=M.filter(([k])=>b.filter(has(k)).length>1),mk=avail.some(m=>m[0]===ui.bodyM)?ui.bodyM:(avail[0]||[])[0];
  const w=mk?b.filter(has(mk)).map(x=>({d:x.d,kg:+x[mk]})):[];
  return head+`<div class="card"><div class="small muted" style="margin-bottom:8px">מדידה אחרונה ${fmtShort(l.d)} · שינוי מאז ${fmtShort(f.d)}</div><div class="metrics">${metrics}</div>${avail.length>1?`<div class="seg body-seg" style="margin-top:12px">${avail.map(([k,n])=>`<button data-act="bodyM" data-v="${k}" class="${k===mk?'on':''}">${n}</button>`).join('')}</div>`:''}${w.length>1?'<div style="margin-top:10px">'+chart(w)+'</div>':''}
  <div class="stack" style="margin-top:6px;gap:4px">${b.slice(-3).reverse().map(x=>`<div class="row small"><span class="grow muted">${fmt(x.d)}</span><span class="num">${M.filter(([k])=>has(k)(x)).map(([k,n])=>k==='kg'?x.kg+' ק״ג':n+' '+x[k]).join(' · ')}</span><button class="icon-btn sm" data-act="delBody" data-v="${x.d}" aria-label="מחיקת מדידה">${I.trash}</button></div>`).join('')}</div></div>`;
}
function photoBlock(t){
  const ph=DB.photos[t.id]||[];
  const head=`<div class="h-sec"><span>תמונות לפני ואחרי</span><label class="btn btn-ghost btn-sm upload">${mini(I.cam)} הוספה<input type="file" accept="image/*" id="ph-in-${t.id}" data-act="photo" data-id="${t.id}"></label></div>`;
  if(!ph.length)return head+`<div class="empty">צלמו באותה תאורה ובאותה תנוחה כל כמה שבועות. התמונה הראשונה והאחרונה יוצגו זו לצד זו. רק את/ה ויקיר רואים אותן.</div>`;
  const pic=(p,cap,del)=>`<div class="photo"><img src="${esc(p.data)}" alt="${esc(cap)}" loading="lazy"><div class="cap">${esc(cap)}</div>${del?`<button class="icon-btn sm" data-act="delPhoto" data-id="${esc(p.id)}" aria-label="מחיקת תמונה">${I.trash}</button>`:''}</div>`;
  return head+cmpBlock(t,ph)+(ph.length>1?`<div class="ba">${pic(ph[0],'לפני · '+fmtShort(ph[0].d))}${pic(ph[ph.length-1],'עכשיו · '+fmtShort(ph[ph.length-1].d))}</div><div class="small muted" style="margin:14px 0 8px">כל התמונות</div>`:'')+`<div class="photos">${ph.slice().reverse().map(p=>pic(p,fmtShort(p.d),true)).join('')}</div>`;
}
function shrink(file,max,q){return new Promise((res,rej)=>{const img=new Image();const u=URL.createObjectURL(file);img.onload=()=>{const k=Math.min(1,max/Math.max(img.width,img.height));const c=document.createElement('canvas');c.width=Math.round(img.width*k);c.height=Math.round(img.height*k);c.getContext('2d').drawImage(img,0,0,c.width,c.height);URL.revokeObjectURL(u);res(c.toDataURL('image/jpeg',q))};img.onerror=()=>{URL.revokeObjectURL(u);rej(new Error('img'))};img.src=u})}
async function uploadPhoto(t,file){
  if(!file)return;if(!/^image\//.test(file.type)){toast('אפשר להעלות רק תמונות');return}
  toast('מעלה תמונה…');
  try{let data=await shrink(file,1000,.72);if(data.length>900000)data=await shrink(file,720,.6);await api.addPhoto(t.id,today(),data);toast('התמונה נשמרה')}catch(e){toast('לא הצלחנו לקרוא את התמונה')}
}
async function uploadAvatar(t,file){
  if(!file)return;if(!/^image\//.test(file.type)){toast('אפשר להעלות רק תמונות');return}
  try{const data=await squareThumb(file,200);t.avatar=data;save(t,'avatar');toast('תמונת הפרופיל עודכנה')}catch(e){toast('לא הצלחנו לקרוא את התמונה')}
}
function squareThumb(file,size){return new Promise((res,rej)=>{const img=new Image();const u=URL.createObjectURL(file);img.onload=()=>{const s=Math.min(img.width,img.height);const c=document.createElement('canvas');c.width=c.height=size;c.getContext('2d').drawImage(img,(img.width-s)/2,(img.height-s)/2,s,s,0,0,size,size);URL.revokeObjectURL(u);res(c.toDataURL('image/jpeg',.82))};img.onerror=()=>{URL.revokeObjectURL(u);rej()};img.src=u})}

/* =========================================================
   TRAINEE
   ========================================================= */
function renderTrainee(){
  const t=T(user.uid);
  if(ui.sum&&ui.sum.tid===t.id){renderSummary(t);return}
  if(ui.aw&&t.live){renderLive(t);return}
  ui.aw=false;
  const online=billOf(t)==='online';
  if(!['plan','prog','sched','more','vids'].includes(ui.tab)||(online&&ui.tab==='sched')||(!online&&ui.tab==='vids'))ui.tab='plan';
  header(`<label class="me" title="שינוי תמונת פרופיל">${avatar(t,40)}<span class="me-cam">${mini(I.cam,11)}</span><input type="file" accept="image/*" id="av-in" data-act="avatar"></label>
    <div class="grow" style="min-width:0"><div class="small muted" style="line-height:1.1">שלום,</div><div class="me-name">${esc(cleanName(t.name))}</div></div>
    <button class="icon-btn" data-act="logout" aria-label="יציאה">${I.out}</button>`);
  $('#tabs').innerHTML=tabsHTML(online?[['plan','אימון',I.dumb],['vids','סרטונים',I.vid],['prog','התקדמות',I.chart],['more','הגדרות',I.more]]:[['plan','אימון',I.dumb],['prog','התקדמות',I.chart],['sched','לו״ז',I.cal],['more','הגדרות',I.more]]);
  const ci=cardInfo(t), p=PUB();
  const renewBtn=p.phone?`<a class="btn btn-wa btn-sm" data-act="renewWa" target="_blank" rel="noopener" href="${waLink(p.phone,`היי יקיר, נשארו לי ${ci.left} אימונים בכרטיסייה. אשמח לחדש 💪 ${cleanName(t.name)}`)}">${mini(I.wa,14)} חידוש בוואטסאפ</a>`:(t.renewReq?'<span class="chip warn">נשלח ליקיר</span>':'<button class="btn btn-primary btn-sm" data-act="reqRenew">בקשת חידוש</button>');
  const banner=ci.none?'':ci.left===0?`<div class="banner bad">${I.bell}<div class="grow small"><b>הכרטיסייה נגמרה.</b> כדי לקבוע אימונים חדשים צריך לחדש.</div>${renewBtn}</div>`
    :ci.low?`<div class="banner">${I.bell}<div class="grow small"><b>נשארו ${ci.left} אימונים בכרטיסייה.</b> זה הזמן לחדש.</div>${renewBtn}</div>`:'';
  const planBanner=needsPlan(t)?`<div class="banner">${I.cal}<div class="grow small"><b>עוד לא קבעת אימונים לשבוע הבא.</b> כדאי לשריין שעה לפני שהלו״ז של יקיר מתמלא.</div><button class="btn btn-primary btn-sm" data-act="planNext">לקביעה</button></div>`:'';
  ensureGs();checkNewBadges(t);checkTraineeNews(t);const ach=achievements(t);
  let body='';
  if(ui.tab==='plan'){
    const nx=sessOf(t).find(s=>s.date+s.time>=today()+nowHM());
    body=`<div class="card hero" style="margin-top:6px"><div class="muted small">${fmt(today())}</div><h1 class="h-display">${nx?(nx.date===today()?'יש אימון היום':'האימון הבא'):'מוכנים לאימון?'}</h1>
      <div class="row wrap-ok small" style="margin-top:10px;gap:8px">${nx?`<span class="chip cool num">${nx.date===today()?'היום':fmt(nx.date)} ב-${nx.time}</span>`:''}${ci.none?(online?`<span class="chip cool">${mini(I.vid,12)} אונליין</span>`:''):`<span class="chip ${ci.low?'bad':'good'} num">${ci.left} אימונים בכרטיסייה</span>`}${ach.streak?`<button class="chip warn num" data-act="tab" data-v="prog" style="border:0;cursor:pointer">${mini(I.flame,12)} רצף ${ach.streak} ${ach.streak===1?'שבוע':'שבועות'}</button>`:''}</div></div>
      ${msgBanner()}${bdayBanner(t)}${awBanner(t)}${healthOk(t)?'':`<div class="banner bad">${I.note}<div class="grow small"><b>חסרה הצהרת בריאות</b> · 2 דקות, לפני האימון הבא</div><button class="btn btn-primary btn-sm" data-act="hFill">למילוי</button></div>`}${payCard(t)}${banner}${planBanner}${ckDue(t)?`<div class="banner">${I.note}<div class="grow small"><b>צ׳ק-אין שבועי</b> · דקה אחת, ויקיר יודע איך עבר השבוע</div><button class="btn btn-primary btn-sm" data-act="ckOpen">למילוי</button></div>`:''}
      ${revDue(t)?`<div class="banner">${mini(I.medal,20)}<div class="grow small"><b>נהנית להתאמן עם יקיר?</b> משפט אחד ממך עוזר לו המון</div><button class="btn btn-primary btn-sm" data-act="revOpen">המלצה</button><button class="icon-btn sm" data-act="revSkip" aria-label="לא עכשיו">${I.x}</button></div>`:''}
      ${t.features.water?waterCard(t):''}
      ${t.features.nutri?nutriCard(t):''}
      ${t.features.habits?habitsCard(t):''}
      <div class="h-sec"><span>התוכנית שלי</span><span class="row" style="gap:6px"><button class="btn btn-ghost btn-sm" data-act="pdf" style="text-transform:none;letter-spacing:0">PDF</button><button class="btn btn-ghost btn-sm" data-act="timer" style="text-transform:none;letter-spacing:0">${I.timer} טיימר מנוחה</button></span></div>
      ${planBlock(t,false)}
      ${(()=>{const w=workouts(t).find(x=>x.d===today());return w?`<div class="h-sec"><span>סיכום האימון של היום</span></div>${workoutCard(t,w,{logs:true,del:true})}`:''})()}
      ${t.features.food?`<div class="h-sec"><span>תפריט תזונה</span><button class="btn btn-ghost btn-sm" data-act="addFood">+ ארוחה</button></div>${foodBlock(t,true)}`:''}`;
  }else if(ui.tab==='prog'){
    const a=attendance(t);
    body=`<h1 class="h-display" style="margin-top:6px">ההתקדמות שלי</h1>
    ${a.pct!=null?`<div class="card hero row" style="margin-top:14px"><div class="grow"><div class="small muted">התמדה באימונים</div><div class="num" style="font-family:var(--display);font-weight:800;font-size:32px;line-height:1">${a.pct}%</div></div><div class="small muted num">${a.c} אימונים הושלמו<br>${a.m} פוספסו</div></div>`:''}
    ${weekStripBlock(t)}
    ${chCard(t)}
    ${t.features.report?reportBlock(t):''}
    ${t.features.rm?rmBlock(t):''}
    ${achievementsBlock(t)}
    ${t.features.log||t.logs.length?workoutsBlock(t):''}
    ${t.features.log?`<div class="h-sec"><span>תרגילים</span></div>${progressBlock(t)}`:`<div class="item" style="margin-top:14px"><div class="grow small muted">רוצה גרף לכל תרגיל? הפעילו ״מעקב משקלים״ בהגדרות.</div><button class="btn btn-ghost btn-sm" data-act="tab" data-v="more">להגדרות</button></div>`}
    ${bodyBlock(t)}${photoBlock(t)}`;
  }else if(ui.tab==='sched')body=traineeSched(t,ci,msgBanner()+banner+planBanner);
  else if(ui.tab==='vids')body=traineeVids(t);
  else body=moreView(t);
  $('#app').innerHTML=body;
}
function traineeSched(t,ci,banner){
  const C=2*Math.PI*42, frac=ci.size?ci.left/ci.size:0, p=PUB(), td=today();
  const ws=weekStart(ui.wk), wd=[...Array(7)].map((_,i)=>addDays(ws,i));
  const items=d=>[...t.sessions.filter(s=>s.date===d).map(s=>Object.assign({kind:'s'},s)),...t.requests.filter(r=>r.date===d&&r.status!=='approved').map(r=>Object.assign({kind:'r'},r))].sort((a,b)=>a.time.localeCompare(b.time));
  const weekItems=wd.flatMap(d=>items(d).map(x=>Object.assign({d},x)));
  const declined=t.requests.filter(r=>r.status==='declined');
  const days=[...Array(14)].map((_,i)=>addDays(td,i));if(!days.includes(ui.bookDay))ui.bookDay=td;if(!ui.bookPicked&&!slotsFor(ui.bookDay).length){const f=days.find(d=>slotsFor(d).some(h=>d!==td||h>nowHM()));if(f)ui.bookDay=f}
  const busy=POL().wait&&Array.isArray(PUB().busy)?PUB().busy.filter(x=>x.startsWith(ui.bookDay+'|')).map(x=>x.split('|')[1]):[];
  const mineAt=new Set([...t.sessions,...t.requests.filter(r=>r.status==='pending'||r.status==='wait')].filter(x=>x.date===ui.bookDay).map(x=>x.time));
  const slots=slotsFor(ui.bookDay);
  const d0=parse(ws),d6=parse(addDays(ws,6));
  return `<h1 class="h-display" style="margin-top:6px">הלו״ז שלי</h1>
  ${ci.none?`<div class="card hero" style="margin-top:14px"><b>${ci.used} אימונים התקיימו</b><div class="small muted">תשלום לפי אימון</div></div>`:`  <div class="card hero row" style="margin-top:14px;gap:16px">
    <div class="ring"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="42" fill="none" stroke="var(--surface2)" stroke-width="9"/><circle cx="50" cy="50" r="42" fill="none" stroke="${ci.low?'var(--bad)':'var(--accent)'}" stroke-width="9" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C*(1-frac)}"/></svg><div class="lbl"><div><b class="num">${ci.left}</b><span>נשארו</span></div></div></div>
    <div class="grow"><div style="font-weight:700">כרטיסייה של ${ci.size} אימונים</div><div class="small muted num">נוצלו ${ci.used} · התחילה ב-${fmtShort(t.card.start)}</div>
    ${p.phone?`<a class="btn btn-wa btn-sm" style="margin-top:10px" data-act="renewWa" target="_blank" rel="noopener" href="${waLink(p.phone,`היי יקיר, נשארו לי ${ci.left} אימונים בכרטיסייה. אשמח לחדש 💪 ${cleanName(t.name)}`)}">${mini(I.wa,14)} חידוש בוואטסאפ</a>`:''}</div>
  </div>`}
  ${banner}
  ${declined.length?`<div class="stack" style="margin-top:8px">${declined.map(r=>`<div class="banner bad">${I.x}<div class="grow small">הבקשה ל${fmt(r.date)} ב-${r.time} לא אושרה. נסו שעה אחרת.</div><button class="icon-btn sm" data-act="dismissReq" data-id="${r.id}" aria-label="הסרה">${I.x}</button></div>`).join('')}</div>`:''}
  <div class="h-sec"><span>שבוע ${d0.getDate()}.${d0.getMonth()+1} – ${d6.getDate()}.${d6.getMonth()+1}</span>
    <span class="row"><button class="icon-btn sm" data-act="wk" data-v="-7" aria-label="שבוע קודם">${I.prev}</button><button class="btn btn-ghost btn-sm" data-act="wkToday">השבוע</button><button class="icon-btn sm" data-act="wk" data-v="7" aria-label="שבוע הבא">${I.next}</button></span></div>
  <div class="week">${wd.map(d=>{const it=items(d);return `<div class="wday ${d===td?'today':''}"><div class="wday-h"><span>${DS[parse(d).getDay()]}</span><b class="num">${parse(d).getDate()}</b></div>${it.map(x=>`<div class="wslot ${x.kind==='r'?(x.status==='declined'?'no':'pend'):''} num">${x.time}</div>`).join('')}</div>`}).join('')}</div>
  <div class="stack" style="margin-top:10px">${weekItems.length?weekItems.map(x=>x.kind==='s'?`<div class="item"><div class="time num" style="font-size:24px;min-width:52px">${x.time}</div><div class="grow">${fmt(x.d)}<div class="small" style="color:${x.st==='missed'?'var(--bad)':x.st==='came'?'var(--good)':'var(--muted)'}">${x.st==='came'?'התקיים':x.st==='missed'?'לא הגעת':'מאושר'}</div></div>${sesTail(t,x)}</div>`
    :`<div class="item"><div class="time num" style="font-size:24px;min-width:52px;color:var(--muted)">${x.time}</div><div class="grow">${fmt(x.d)}<div class="small" style="color:${x.status==='declined'?'var(--bad)':'var(--warn)'}">${x.status==='declined'?'לא אושר':x.status==='wait'?'ברשימת המתנה':'ממתין לאישור של יקיר'}</div></div><button class="btn btn-ghost btn-sm" data-act="cancelReq" data-id="${x.id}">${x.status==='declined'?'הסרה':'ביטול הבקשה'}</button></div>`).join(''):'<div class="empty">אין אימונים השבוע.</div>'}</div>
  ${grpTrainee(t)}
  <div class="h-sec" id="bookSec"><span>בקשה לקביעת אימון</span></div>
  ${ci.left===0?'<div class="empty"><b>הכרטיסייה נגמרה</b>אחרי החידוש אפשר לבקש אימונים חדשים.</div>':`
  <div class="pills">${days.map(d=>`<button class="daypill ${d===ui.bookDay?'on':''}" style="${slotsFor(d).length?'':'opacity:.4'}" data-act="bookDay" data-v="${d}"><span class="small">${DS[parse(d).getDay()]}</span><b>${parse(d).getDate()}</b><i class="dot ${mineAt.size&&d===ui.bookDay?'has':''}"></i></button>`).join('')}</div>
  ${slots.length?`<div class="slots" style="margin-top:12px">${slots.map(h=>{const past=ui.bookDay===td&&h<=nowHM();const mine=mineAt.has(h),bz=!mine&&busy.includes(h);return `<button class="slot ${mine?'mine':''} ${past?'past':''} ${bz?'busy':''}" ${past||mine?'disabled':''} data-act="${bz?'waitReq':'request'}" data-v="${h}" ${bz?'aria-label="'+h+' תפוס · רשימת המתנה"':''}>${h}${bz?'<small>תפוס</small>':''}</button>`}).join('')}</div>
  <p class="small muted" style="margin-top:8px">בחרו שעה ונשלח ליקיר בקשה. האימון ייכנס ללו״ז אחרי שיאשר.</p>`:'<div class="empty" style="margin-top:12px"><b>יקיר לא עובד ביום הזה</b>בחרו יום אחר.</div>'}`}`;
}
function waterCard(t){
  const k='yf-water-'+t.id+'-'+today(), n=ls.get(k,0), goal=Math.max(4,Math.round(((+t.water.to.slice(0,2))-(+t.water.from.slice(0,2)))/t.water.every)+1);
  return `<div class="card" style="margin-top:12px"><div class="row"><span style="color:var(--cool)">${mini(I.drop,22)}</span><div class="grow"><b>מים היום</b><div class="small muted num">${n} מתוך ${goal} כוסות · תזכורת כל ${t.water.every} שעות</div></div><button class="icon-btn" data-act="cup" data-v="-1" aria-label="הורדת כוס">−</button><button class="icon-btn accent" data-act="cup" data-v="1" aria-label="הוספת כוס">${I.plus}</button></div>
  <div class="cups" style="margin-top:12px">${[...Array(goal)].map((_,i)=>`<span class="cup ${i<n?'full':''}"></span>`).join('')}</div></div>`;
}
function moreView(t){
  const sw=(k,title,sub)=>`<div class="item"><div class="grow"><b>${title}</b><div class="small muted">${sub}</div></div><label class="switch"><input type="checkbox" id="f-${k}" data-act="feat" data-v="${k}" ${t.features[k]?'checked':''} aria-label="${title}"><span></span></label></div>`;
  return `<h1 class="h-display" style="margin-top:6px">הגדרות</h1>
  <div class="card row" style="margin-top:12px">${avatar(t,64)}<div class="grow" style="min-width:0"><b style="font-size:18px">${esc(cleanName(t.name))}</b><div class="small muted" dir="ltr" style="text-align:end">${esc(t.phone)}</div><div class="row" style="margin-top:8px;gap:6px;flex-wrap:wrap"><label class="btn btn-ghost btn-sm upload">${mini(I.cam,14)} תמונת פרופיל<input type="file" accept="image/*" id="av-in2" data-act="avatar"></label><button class="btn btn-ghost btn-sm" data-act="editMe">${mini(I.edit,14)} פרטים</button></div></div></div>
  <p class="muted small" style="margin-top:18px">כל אחד בוחר מה מתאים לו. אפשר להפעיל ולכבות בכל רגע.</p>
  <div class="stack">
    ${sw('log','מעקב משקלים','רישום משקל בכל תרגיל וגרף התקדמות')}
    ${sw('water','תזכורת לשתות מים','תזכורת קבועה במהלך היום')}
    ${t.features.water?`<div class="card"><div class="two"><div class="field"><label for="w-every">כל כמה זמן</label><select id="w-every" data-act="water" data-v="every">${[1,1.5,2,3].map(v=>`<option value="${v}" ${t.water.every==v?'selected':''}>כל ${v} שעות</option>`).join('')}</select></div><div class="field"><label for="w-test">בדיקה</label><button id="w-test" class="btn btn-ghost" data-act="testWater">שלחו תזכורת</button></div></div><div class="two"><div class="field"><label for="w-from">משעה</label><input id="w-from" type="time" value="${t.water.from}" data-act="water" data-v="from"></div><div class="field"><label for="w-to">עד שעה</label><input id="w-to" type="time" value="${t.water.to}" data-act="water" data-v="to"></div></div><div class="small muted">התזכורת מופיעה כשהאפליקציה פתוחה.</div></div>`:''}
    ${sw('food','תפריט תזונה','הארוחות שלך, מסודרות לפי שעות היום')}
    ${sw('nutri','יעדי תזונה','קלוריות וחלבון ביום, לפי היעד של יקיר')}
    ${sw('habits','הרגלים','צעדים, שינה, תוספים ועוד, עם רצפים')}
    ${sw('rm','כוח ו-1RM','המשקל המקסימלי המשוער ורמת הכוח שלך')}
    ${sw('cmp','השוואת תמונות','מחוון לפני / אחרי ושיתוף')}
    ${sw('report','דוח חודשי','סיכום מעוצב של כל חודש, לשיתוף')}
  </div>
  ${refCard(t)}
  <div>
  </div>
  <button class="btn btn-ghost btn-block" style="margin-top:24px" data-act="logout">${mini(I.out)} יציאה מהחשבון</button>`;
}

/* =========================================================
   SHEETS / TOAST
   ========================================================= */
let onSubmit=null;
function sheet(title,html,submit,submitLabel='שמירה',danger=false){
  onSubmit=submit;
  $('#sheet').innerHTML=`<div class="scrim" data-act="closeSheet"><form class="sheet" id="sheetForm" novalidate><div class="grab"></div><h3>${title}</h3>${html}
  <div class="row" style="margin-top:6px"><button type="submit" class="btn ${danger?'btn-danger':'btn-primary'} grow">${submitLabel}</button><button type="button" class="btn btn-ghost" data-act="closeSheet">ביטול</button></div></form></div>`;
  const f=$('#sheetForm');[...f.children].forEach((c,i)=>c.style.setProperty('--i',i));f.addEventListener('submit',e=>{e.preventDefault();const fd=Object.fromEntries(new FormData(f));if(onSubmit&&onSubmit(fd)!==false)closeSheet()});
  const first=f.querySelector('input:not([type=checkbox]):not([type=radio]):not([type=file]),select,textarea');if(first&&!f.querySelector('video,iframe'))setTimeout(()=>first.focus(),60); // בחלון עם סרטון לא פותחים מקלדת
}
function closeSheet(){onSubmit=null;const sc=$('#sheet .scrim');if(!sc||RM){$('#sheet').innerHTML='';return}sc.classList.add('closing');setTimeout(()=>{if(sc.isConnected)sc.remove()},210)}
const fld=(id,label,attrs='',val='')=>`<div class="field"><label for="${id}">${label}</label><input id="${id}" name="${id}" value="${esc(val)}" ${attrs}></div>`;
function confirmSheet(title,text,fn,label='כן, למחוק'){sheet(title,`<p class="muted" style="margin-top:0">${text}</p>`,()=>{fn()},label,true)}
let toastTimer;
function toast(msg,cls=''){if(!msg)return;$('#toast').innerHTML=`<div class="toast ${cls}">${msg}</div>`;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').innerHTML='',cls==='water'||cls==='badge'?6000:2800)}

/* ---------- rest timer ---------- */
let tEnd=0,tInt=null,actx=null;
const mmss=s=>Math.floor(s/60)+':'+pad(s%60);
function timerSheet(){
  const last=ls.get('yf-rest',90);
  sheet('טיימר מנוחה',`<div class="timer-big num" id="tbig">${mmss(last)}</div><div class="presets">${[45,60,90,120,150,180,240,300].map(s=>`<button type="button" class="btn ${s===last?'btn-primary':'btn-ghost'} btn-sm num" data-act="tpre" data-v="${s}">${mmss(s)}</button>`).join('')}</div><div class="item" style="margin-bottom:10px"><label for="t-auto" class="grow small"><b>הפעלה אוטומטית</b><div class="muted">אחרי כל סט שמסמנים ✓ באימון</div></label><label class="switch"><input type="checkbox" id="t-auto" data-act="autoRest" ${ls.get('yf-autorest',false)?'checked':''}><span></span></label></div><p class="small muted" style="text-align:center">בסוף המנוחה תשמעו צפצוף והטלפון ירטוט.</p>`,()=>{startTimer(ls.get('yf-rest',90))},'התחלה');
}
function startTimer(sec){try{actx=actx||new (window.AudioContext||window.webkitAudioContext)();actx.resume&&actx.resume()}catch(e){}tEnd=Date.now()+sec*1000;clearInterval(tInt);tick();tInt=setInterval(tick,250)}
function tick(){
  const left=Math.max(0,Math.ceil((tEnd-Date.now())/1000));
  let p=$('#timerPill');if(!p){p=document.createElement('div');p.id='timerPill';p.className='timer-pill';p.dir='rtl';document.body.appendChild(p)}
  p.innerHTML=`<span class="small muted">מנוחה</span><b class="num">${mmss(left)}</b><button class="icon-btn sm" data-act="timerStop" aria-label="עצירת הטיימר">${I.x}</button>`;
  if(left<=0){stopTimer();beep();toast(mini(I.timer,18)+' סוף המנוחה, לסט הבא!')}
}
function stopTimer(){clearInterval(tInt);tInt=null;const p=$('#timerPill');if(p)p.remove()}
function beep(){
  try{navigator.vibrate&&navigator.vibrate([300,120,300])}catch(e){}
  try{if(!actx)return;[0,.25,.5].forEach(o=>{const g=actx.createGain(),os=actx.createOscillator();os.frequency.value=880;os.connect(g);g.connect(actx.destination);g.gain.setValueAtTime(.25,actx.currentTime+o);g.gain.exponentialRampToValueAtTime(.001,actx.currentTime+o+.2);os.start(actx.currentTime+o);os.stop(actx.currentTime+o+.22)})}catch(e){}
}
/* ---------- water reminders ---------- */
setInterval(()=>{
  if(!user||ui.role!=='trainee')return;const t=T(user.uid);if(!t||!t.features.water)return;
  const n=nowHM();if(n<t.water.from||n>t.water.to)return;
  const k='yf-wlast-'+t.id,last=ls.get(k,0);
  if(!last){ls.set(k,Date.now());return}
  if(Date.now()-last>=t.water.every*3600000){ls.set(k,Date.now());remindWater()}
},30000);
function remindWater(){
  toast(mini(I.drop,18)+' הגיע הזמן לכוס מים','water');
  try{if('Notification' in window&&Notification.permission==='granted'){if(navigator.serviceWorker&&navigator.serviceWorker.ready)navigator.serviceWorker.ready.then(r=>r.showNotification('Yakir fit',{body:'הגיע הזמן לכוס מים 💧',icon:'icon-192.png'})).catch(()=>new Notification('Yakir fit',{body:'הגיע הזמן לכוס מים'}));else new Notification('Yakir fit',{body:'הגיע הזמן לכוס מים'})}}catch(e){}
  try{navigator.vibrate&&navigator.vibrate([120,80,120])}catch(e){}
}

/* =========================================================
   ACTIONS
   ========================================================= */
const cur=()=>ui.role==='trainer'?T(ui.sel):(user?T(user.uid):null);
document.addEventListener('click',async e=>{
  const el=e.target.closest('[data-act]');if(!el)return;
  const a=el.dataset.act,v=el.dataset.v,id=el.dataset.id;
  if(a==='closeSheet'){if(e.target===el||el.tagName==='BUTTON')closeSheet();return}
  if(el.tagName==='A'&&el.getAttribute('href')==='#')e.preventDefault();
  if(['feat','water','pubField','photo','avatar','failToggle','priceSet','pubSet','cldField','billType','cardSize','awIn','autoRest','macroSet','habNum','cmpR'].includes(a))return;
  if(a==='tpre'){const s=+v;ls.set('yf-rest',s);document.querySelectorAll('[data-act="tpre"]').forEach(x=>{x.className='btn '+(x===el?'btn-primary':'btn-ghost')+' btn-sm num'});const big=$('#tbig');if(big)big.textContent=mmss(s);return}
  const tr=cur(), day=tr&&tr.plan[ui.planIdx];
  const [tid,sid]=(id||'').split('|');
  switch(a){
    /* auth */
    case 'authMode':ui.authMode=v;break;
    case 'demoLogin':authApi.demo&&authApi.demo(v);return;
    case 'google':try{await authApi.google()}catch(x){const m=errMsg(x);if(m)showAuthErr(m)}return;
    case 'forgot':return forgotSheet();
    case 'logout':logout();return;
    /* nav */
    case 'tab':ui.tab=v;ui.sel=null;window.scrollTo(0,0);break;
    case 'day':ui.day=v;break;
    case 'week':ui.day=addDays(ui.day,+v);break;
    case 'goToday':ui.day=today();break;
    case 'wk':ui.wk=addDays(ui.wk,+v);break;
    case 'wkToday':ui.wk=today();break;
    case 'openT':ui.tab='people';ui.sel=id;ui.planIdx=0;window.scrollTo(0,0);break;
    case 'incM':ui.incM=v;break;
    case 'wmDay':ui.wmDay=v;break;
    case 'cycle':return cycleSheet(tr);
    case 'cmpA':ui.cmpA=+v;break;
    case 'cmpB':ui.cmpB=+v;break;
    case 'cmpShare':{const t=T(id);toast('מכין תמונה…');cmpImage(t).then(f=>{if(!f){toast('לא הצלחנו ליצור תמונה');return}shareImg.f=f;sheet('לפני ואחרי',`<img class="rep-img" src="${URL.createObjectURL(f)}" alt="לפני ואחרי">`,()=>{giveFile(shareImg.f)},'שיתוף / שמירה')});return}
    case 'report':{const t=T(id)||tr;toast('מכין את הדוח…');reportImage(t,v).then(x=>{shareImg.f=x.file;sheet('הדוח של '+ymName(v,{month:'long'}),`<img class="rep-img" src="${x.url}" alt="דוח חודשי">${!x.r.days?'<p class="small muted">לא נרשמו אימונים בחודש הזה.</p>':''}`,()=>{giveFile(shareImg.f)},'שיתוף / שמירה')}).catch(e=>{console.error(e);toast('לא הצלחנו ליצור דוח')});return}
    case 'eatAdd':return sheet('מה אכלת?',`<div class="cpick">${FOODS.map(([n,k,p])=>`<button type="button" class="pill" data-act="eatPick" data-v="${esc(n)}|${k}|${p}">${esc(n)}</button>`).join('')}</div>${fld('ea-n','מה','placeholder="למשל: חביתה ולחם"')}<div class="two">${fld('ea-k','קלוריות','type="number" min="0" inputmode="numeric"')}${fld('ea-p','חלבון (גרם)','type="number" min="0" inputmode="numeric"')}</div><p class="small muted">לא חייבים להיות מדויקים. הערכה מספיקה.</p>`,fd=>{const k=+fd['ea-k']||0,p=+fd['ea-p']||0;if(!k&&!p){toast('מלאו קלוריות או חלבון');return false}const me=cur(),cut=addDays(today(),-14);me.eat=(Array.isArray(me.eat)?me.eat:[]).filter(e=>e.d>=cut).concat([{d:today(),n:(fd['ea-n']||'').trim(),k,p}]);save(me,'eat');toast('נרשם')},'הוספה');
    case 'eatPick':{const [n,k,p]=v.split('|'),a=$('#ea-n'),b=$('#ea-k'),c=$('#ea-p');if(a)a.value=n;if(b)b.value=(+b.value||0)?+b.value+ +k:k;if(c)c.value=(+c.value||0)?+c.value+ +p:p;return}
    case 'eatDel':{const t=tr;t.eat=(Array.isArray(t.eat)?t.eat:[]).filter((_,i)=>i!==+v);save(t,'eat');return}
    case 'habTog':{const t=tr,d=today(),h=(t.habits||{}).list||[];const cur0=habVal(t,d,v);t.habits=Object.assign({list:h},t.habits,{log:habLog(t).filter(x=>!(x.d===d&&x.id===v)&&x.d>=addDays(d,-60)).concat(cur0?[]:[{d,id:v,v:1}])});save(t,'habits');return}
    case 'habEdit':{const t=tr,list=((t.habits||{}).list)||[];return sheet('ההרגלים שלי',`<div class="stack" style="gap:8px">${HAB_PRESETS.map(h=>`<label class="item" for="hb-${h.id}"><span class="grow"><b>${h.n}</b>${h.type==='num'?`<div class="small muted">יעד: ${h.target} ${h.unit}</div>`:''}</span><input type="checkbox" id="hb-${h.id}" name="hb-${h.id}" ${list.some(x=>x.id===h.id)?'checked':''} style="width:22px;height:22px;accent-color:var(--accent)"></label>`).join('')}${list.filter(x=>!HAB_PRESETS.some(p=>p.id===x.id)).map(h=>`<label class="item" for="hb-${h.id}"><b class="grow">${esc(h.n)}</b><input type="checkbox" id="hb-${h.id}" name="hb-${h.id}" checked style="width:22px;height:22px;accent-color:var(--accent)"></label>`).join('')}</div>${fld('hb-new','הרגל משלך (לא חובה)','placeholder="למשל: 10 דקות הליכה" style="margin-top:10px"')}`,fd=>{const me=cur(),old=((me.habits||{}).list)||[];let nl=[...HAB_PRESETS,...old.filter(x=>!HAB_PRESETS.some(p=>p.id===x.id))].filter(h=>fd['hb-'+h.id]).map(h=>old.find(x=>x.id===h.id)||h);const nw=(fd['hb-new']||'').trim();if(nw)nl.push({id:uid(),n:nw,type:'chk'});me.habits={list:nl,log:habLog(me)};save(me,'habits')},'שמירה')}
    case 'libDel':{const L=EXLIB().slice();L.splice(+v,1);saveSettings({exlib:L});return}
    case 'copyRef':{const u=appUrl()+'?ref='+tr.id;(navigator.clipboard?navigator.clipboard.writeText(u):Promise.reject()).then(()=>toast('הקישור הועתק')).catch(()=>toast(u));return}
    case 'refGift':{const t=T(id);if(!t)return;t.refGiven=!t.refGiven;save(t,'refGiven');return}
    case 'revOpen':return sheet('המלצה על יקיר',`<div class="field"><label>דירוג</label><div class="score-pick">${[1,2,3,4,5].map(n=>`<label class="sc"><input type="radio" name="rv-s" value="${n}" ${n===5?'checked':''}><span>${'★'.repeat(n)}</span></label>`).join('')}</div></div><div class="field"><label for="rv-t">מה תגיד/י על האימונים עם יקיר?</label><textarea id="rv-t" name="rv-t" maxlength="400" placeholder="משפט אחד או שניים מספיקים"></textarea></div><div class="item" style="margin-bottom:12px"><label for="rv-ok" class="grow small">מאשר/ת ליקיר לפרסם את ההמלצה עם השם הפרטי שלי</label><input type="checkbox" id="rv-ok" name="rv-ok" checked style="width:22px;height:22px;accent-color:var(--accent)"></div>`,fd=>{const tx=(fd['rv-t']||'').trim();if(!tx){toast('כתבו משפט קצר');return false}const me=cur();me.review={stars:+fd['rv-s']||5,text:tx,ok:!!fd['rv-ok'],d:today()};save(me,'review');toast('תודה רבה! 🙏')},'שליחה');
    case 'revSkip':ls.set('yf-revskip-'+tr.id,true);break;
    case 'revCopy':{const t=T(id);if(!t||!t.review)return;const txt=`״${t.review.text}״ — ${firstName(t)}`;(navigator.clipboard?navigator.clipboard.writeText(txt):Promise.reject()).then(()=>toast('ההמלצה הועתקה')).catch(()=>toast(txt));return}
    case 'hFill':return healthSheet(id?T(id):tr);
    case 'sigClear':{const c=$('#sig');if(c){delete c.dataset.drawn;const g=c.getContext('2d');g.setTransform(1,0,0,1,0,0);g.fillStyle='#fff';g.fillRect(0,0,c.width,c.height);g.setTransform(2,0,0,2,0,0)}return}
    case 'hPaper':{const t=T(id);if(!t)return;t.hpaper=t.hpaper?'':today();save(t,'hpaper');closeSheet();toast(t.hpaper?'סומן: ההצהרה מולאה ✓':'הסימון בוטל');return}
    case 'hPdf':return healthPdfSheet(id?T(id):null);
    case 'hqEdit':{const qs=HQS().map(x=>({k:x.k,q:x.q})),i=v==='new'?-1:+v;return sheet(i<0?'שאלה חדשה':'עריכת שאלה',`<div class="field"><label for="hq-t">השאלה (תשובה כן / לא)</label><textarea id="hq-t" name="hq-t" maxlength="200" placeholder="למשל: האם יש לך בעיה בברכיים?">${i<0?'':esc(qs[i].q)}</textarea></div><p class="small muted">״כן״ תמיד מסומן אצלך כהערה רפואית שכדאי לבדוק.</p>`,fd=>{const q=(fd['hq-t']||'').trim();if(!q)return false;if(i<0)qs.push({k:'q'+uid(),q});else qs[i].q=q;saveHq(qs);toast('נשמר')},'שמירה')}
    case 'hqDel':{const qs=HQS().map(x=>({k:x.k,q:x.q}));if(qs.length<=1){toast('צריך לפחות שאלה אחת');return}return confirmSheet('מחיקת שאלה',`למחוק את השאלה ״${esc(qs[+v].q)}״?`,()=>{qs.splice(+v,1);saveHq(qs)},'כן, למחוק')}
    case 'hqMove':{const qs=HQS().map(x=>({k:x.k,q:x.q})),[i,d]=v.split('|').map(Number),j=i+d;if(j<0||j>=qs.length)return;[qs[i],qs[j]]=[qs[j],qs[i]];saveHq(qs);return}
    case 'hqReset':return confirmSheet('חזרה לשאלות המקוריות','להחזיר את 9 השאלות המקוריות? השאלות שהוספת יימחקו.',()=>saveHq([]),'כן, להחזיר');
    case 'bodyM':ui.bodyM=v;break;
    case 'cal':{const [d,h]=v.split('|');return calSheet(id||'אימון עם יקיר',d,h)}
    case 'calIcs':return calIcs();
    case 'lsMark':ls.set(v,id||1);setTimeout(render,150);return;
    case 'msgX':ls.set('yf-msgx',v);break;
    case 'bcast':{const m=MSG();return sheet('הודעה לכל המתאמנים',`<div class="field"><label for="bc-t">ההודעה</label><textarea id="bc-t" name="bc-t" maxlength="300" placeholder="למשל: אין אימונים ביום שני בגלל החג. חג שמח!">${m?esc(m.text):''}</textarea></div>${fld('bc-u','להציג עד תאריך','type="date" required',m?m.until:addDays(today(),3))}<p class="small muted">כל המתאמנים יראו את ההודעה למעלה באפליקציה עד התאריך הזה.</p>`,fd=>{const tx=(fd['bc-t']||'').trim();if(!tx||!fd['bc-u'])return false;const msg={id:uid(),text:tx,until:fd['bc-u'],at:Date.now()};DB.pub=Object.assign({},PUB(),{msg});api.set('pub','main',{msg});render();toast('ההודעה פורסמה לכל המתאמנים')},'פרסום')}
    case 'bcastDel':return confirmSheet('הסרת ההודעה','להסיר את ההודעה מכל המתאמנים?',()=>{DB.pub=Object.assign({},PUB(),{msg:null});api.set('pub','main',{msg:null});render()},'כן, להסיר');
    case 'grpEdit':{const G=GRP(),i=v==='new'?-1:+v,g=i<0?{title:'',dow:PUB().days[0]||0,time:'07:00',cap:6}:G.list[i];if(!g)return;
      return sheet(i<0?'שיעור חדש':'עריכת שיעור',fld('g-t','שם השיעור','required placeholder="למשל קבוצת בוקר"',g.title)+`<div class="two"><div class="field"><label for="g-d">יום</label><select id="g-d" name="g-d">${DAYS.map((n,k)=>`<option value="${k}" ${+g.dow===k?'selected':''}>${n}</option>`).join('')}</select></div>${fld('g-h','שעה','type="time" step="900" required',g.time)}</div>`+fld('g-c','כמה מקומות','type="number" min="1" max="100" inputmode="numeric" required',g.cap)+'<p class="small muted">השיעור חוזר כל שבוע. ימי חופש מדולגים לבד.</p>',fd=>{const ti=(fd['g-t']||'').trim(),c=+fd['g-c'];if(!ti||!fd['g-h']||!(c>0))return false;const o=Object.assign({},G,{list:G.list.slice()}),n={id:i<0?uid():g.id,title:ti,dow:+fd['g-d'],time:fd['g-h'],cap:c};if(i<0)o.list.push(n);else o.list[i]=n;saveGrp(o);toast('השיעור נשמר')},'שמירה')}
    case 'grpDel':{const G=GRP(),g=G.list[+v];if(!g)return;return confirmSheet('מחיקת שיעור',`למחוק את ״${esc(g.title)}״? הוא ייעלם אצל המתאמנים.`,()=>{saveGrp(Object.assign({},G,{list:G.list.filter((_,k)=>k!==+v)}))})}
    case 'grpJoin':{const t=tr,x=grpInst(today(),8).find(y=>y.k===v);if(!t||!x||x.skip)return;if(x.n>=+x.g.cap){toast('השיעור התמלא');return}if(billOf(t)==='card'&&cardInfo(t).left<=0){toast('הכרטיסייה נגמרה. צריך לחדש כדי להירשם');return}
      const did=x.k+'_'+t.id,doc={o:t.id,k:x.k,d:x.d,at:Date.now()};DB.gs=gsList().concat([Object.assign({id:did},doc)]);api.set('gsign',did,doc);render();return calSheet(x.g.title,x.d,x.g.time,'נרשמת! 🎉')}
    case 'grpLeave':{const t=tr,x=grpOf(v);if(!t||!x)return;return confirmSheet('ביטול הרשמה',`לבטל את ההרשמה ל${esc(x.g.title)} ב${fmt(x.d)} בשעה ${x.g.time}? המקום יתפנה למישהו אחר.`,()=>{const did=v+'_'+t.id;DB.gs=gsList().filter(y=>y.id!==did);api.del('gsign',did);render();toast('ההרשמה בוטלה')},'כן, לבטל')}
    case 'grpAdd':{const x=grpOf(v);if(!x)return;const inn=gsList().filter(y=>y.k===v).map(y=>y.o),opts=tList().filter(t=>!inn.includes(t.id));if(!opts.length){toast('כל המתאמנים כבר רשומים');return}
      return sheet('הוספה ל'+esc(x.g.title),`<div class="field"><label for="ga-t">מתאמן</label><select id="ga-t" name="ga-t">${opts.map(t=>`<option value="${t.id}">${esc(t.name)}</option>`).join('')}</select></div>${inn.length>=+x.g.cap?'<p class="small" style="color:var(--warn)">השיעור כבר מלא. אפשר להוסיף בכל זאת.</p>':''}`,fd=>{const o=fd['ga-t'];if(!o)return false;const did=v+'_'+o,doc={o,k:v,d:x.d,at:Date.now()};DB.gs=gsList().concat([Object.assign({id:did},doc)]);ls.set('yf-gsseen',(ls.get('yf-gsseen',[])||[]).concat([did]));api.set('gsign',did,doc);render()},'הוספה')}
    case 'grpKick':{const y=gsList().find(z=>z.id===id);if(!y)return;const t=T(y.o);return confirmSheet('הסרה מהשיעור',`להסיר את ${esc(t?t.name:'המתאמן')} מהשיעור?`,()=>{DB.gs=gsList().filter(z=>z.id!==id);api.del('gsign',id);render()},'כן, להסיר')}
    case 'grpAtt':{const [ti,k]=id.split('|'),t=T(ti),x=grpOf(k);if(!t||!x)return;if(t.sessions.some(z=>z.gk===k))t.sessions=t.sessions.filter(z=>z.gk!==k);else t.sessions.push({id:uid(),date:x.d,time:x.g.time,by:'grp',gk:k,st:'came'});save(t,'sessions');return}
    case 'grpSkip':{const G=GRP(),x=grpOf(v);if(!x)return;const on=(G.skip||[]).includes(v),old=addDays(today(),-30);saveGrp(Object.assign({},G,{skip:on?G.skip.filter(z=>z!==v):(G.skip||[]).filter(z=>z>=old).concat([v])}));
      const ps=gsList().filter(y=>y.k===v).map(y=>T(y.o)).filter(t=>t&&t.phone);if(on||!ps.length){toast(on?'השיעור חזר':'השיעור בוטל');return}
      return sheet('השיעור בוטל',`<p class="muted" style="margin-top:0">לעדכן את הנרשמים בוואטסאפ:</p><div class="stack" style="gap:8px">${ps.map(t=>`<div class="row">${avatar(t,30)}<b class="grow small">${esc(t.name)}</b><a class="icon-btn sm wa" href="${waLink(t.phone,`היי ${firstName(t)}, השיעור ${x.g.title} ב${fmt(x.d)} בשעה ${x.g.time} מבוטל. מצטער! יקיר`)}" target="_blank" rel="noopener" aria-label="הודעה בוואטסאפ">${I.wa}</a></div>`).join('')}</div>`,()=>{},'סגירה')}
    case 'cxDo':{const t=T(tid),x=t&&t.sessions.find(y=>y.id===sid);if(!x)return;t.cancels=t.cancels.filter(c=>c.sid!==sid);
      if(v!=='keep'&&x.by==='fixed')t.fixedSkip=t.fixedSkip.concat([x.date+'|'+x.time]);
      if(v==='free'){t.sessions=t.sessions.filter(y=>y.id!==sid);waitFree(x.date,x.time)}else if(v==='late')x.st='late';
      save(t,'sessions','fixedSkip','cancels');const when=`${fmt(x.date)} בשעה ${x.time}`;
      const msg=v==='free'?`היי ${firstName(t)}, ביטלתי את האימון ב${when}, בלי חיוב 👍 יקיר`:v==='late'?`היי ${firstName(t)}, ביטלתי את האימון ב${when}. לפי מדיניות הביטול ${billOf(t)==='card'?'הוא נספר בכרטיסייה':'הוא מחויב'}. יקיר`:`היי ${firstName(t)}, לצערי אי אפשר לבטל את האימון ב${when}. נתראה! 💪 יקיר`;
      toast(v==='keep'?'האימון נשאר':'האימון בוטל');return waNext('לעדכן את '+esc(firstName(t))+'?','ההודעה מוכנה:',t.phone,msg,'שליחה בוואטסאפ')}
    case 'sesCancel':{const t=tr,x=t&&t.sessions.find(y=>y.id===v);if(!x)return;const pol=POL(),p=PUB(),hrs=(sesDT(x)-Date.now())/36e5,when=`${fmt(x.date)} בשעה ${x.time}`;
      const done=(late,ask)=>{const m=cur();m.cancels=m.cancels.concat([Object.assign({sid:x.id,at:Date.now()},ask?{ask:true}:{late})]);save(m,'cancels');toast(ask?'בקשת הביטול נשלחה':'האימון בוטל');
        waNext(ask?'הבקשה נשלחה ליקיר':'האימון בוטל',ask?'שלחו ליקיר הודעה בוואטסאפ, כדי שיראה את הבקשה מהר.':'שלחו ליקיר עדכון בוואטסאפ.',p.phone,ask?`היי יקיר, אני מבקש/ת לבטל את האימון ב${when}. ${cleanName(m.name)}`:`היי יקיר, ביטלתי באפליקציה את האימון ב${when}${late?' (ביטול מאוחר)':''}. ${cleanName(m.name)}`,'עדכון ליקיר בוואטסאפ')};
      if(!pol.cancel)return sheet('ביטול אימון',`<p style="margin-top:0"><b>${when}</b></p><p class="muted">הבקשה תישלח ליקיר. הוא יבדוק אותה לפי מדיניות הביטול שלו ויעדכן אותך.</p>`,()=>done(false,true),'שליחת בקשת ביטול',true);
      const late=hrs<+pol.hours,chg=late&&pol.charge,cardT=billOf(t)==='card';
      const polTxt=`<div class="card pol-box"><b class="small">מדיניות הביטול של יקיר</b><div class="small muted">ביטול עד ${pol.hours} שעות לפני האימון: בלי חיוב.${pol.charge?` ביטול מאוחר יותר ${cardT?'נספר כאימון בכרטיסייה':'מחויב במחיר האימון'}.`:''}</div></div>`;
      if(!chg)return sheet('ביטול אימון',`<p style="margin-top:0"><b>${when}</b></p>${polTxt}<p><b style="color:var(--good)">✓ הביטול בלי חיוב.</b></p>`,()=>done(false),'כן, לבטל',true);
      const talk=p.phone?`<a class="btn btn-wa btn-block" style="margin-bottom:6px" data-act="waSent" href="${waLink(p.phone,`היי יקיר, אני צריך/ה לבטל את האימון ב${when} (פחות מ-${pol.hours} שעות לפני). אפשר לדבר על זה? ${cleanName(t.name)}`)}" target="_blank" rel="noopener">${mini(I.wa)} לדבר עם יקיר לפני הביטול</a>`:'';
      return sheet('ביטול מאוחר',`<p style="margin-top:0"><b>${when}</b> · בעוד ${hrs<1?'פחות משעה':Math.floor(hrs)+' שעות'}</p>${polTxt}<p><b style="color:var(--bad)">לפי המדיניות ${cardT?'האימון ייספר בכרטיסייה.':'האימון יחויב.'}</b></p>${talk}`,()=>done(true),'לבטל בכל זאת',true)}
    case 'waitReq':{const t=tr,d=ui.bookDay;return sheet('השעה תפוסה',`<p style="margin-top:0">${fmt(d)} בשעה <b class="num">${v}</b> כבר תפוסה.</p><p class="muted small">אפשר להיכנס לרשימת המתנה. אם השעה תתפנה, יקיר יאשר לך.</p>`,()=>{const me=cur();me.requests=me.requests.concat([{id:uid(),date:d,time:v,note:'',status:'wait',at:Date.now()}]);save(me,'requests');toast('נכנסת לרשימת ההמתנה')},'לרשימת ההמתנה')}
    case 'fixAdd':{const t=T(id);if(!t)return;return sheet('זמן קבוע · '+esc(t.name),`<div class="two"><div class="field"><label for="fx-d">יום</label><select id="fx-d" name="fx-d">${DAYS.map((d,i)=>`<option value="${i}" ${PUB().days.includes(i)?'':'disabled'}>${d}</option>`).join('')}</select></div>${fld('fx-t','שעה','type="time" step="900" required','18:00')}</div><p class="small muted">האימונים ייקבעו לבד ${POL().weeks} שבועות קדימה. ימי חופש מדולגים.</p>`,fd=>{if(!fd['fx-t'])return false;const me=T(id);me.fixed=me.fixed.concat([{dow:+fd['fx-d'],time:fd['fx-t']}]);save(me,'fixed');setTimeout(syncFixed,50);toast('הזמן הקבוע נשמר')},'שמירה')}
    case 'fixDel':{const t=T(id);if(!t)return;const f=t.fixed[+v];t.fixed.splice(+v,1);if(f)t.sessions=t.sessions.filter(x=>!(x.by==='fixed'&&x.date>today()&&parse(x.date).getDay()===+f.dow&&x.time===f.time));save(t,'fixed','sessions');toast('הוסר, והאימונים הקבועים העתידיים בוטלו');return}
    case 'awSug':{const t=awT();if(!t||!t.live)return;const e=t.live.ex[+v],sg=e&&suggest(t,e.name);if(!sg)return;e.sets.forEach(x=>{if(!x.done&&!x.warm)x.kg=sg.kg});saveLive(t);toast(`עודכן ל-${kgf(sg.kg)} ק״ג`);return}
    case 'awWarm':{const t=awT();if(!t||!t.live)return;const e=t.live.ex[+v];if(!e)return;const w=e.sets.find(x=>!x.warm),kg=w&&(+w.kg||0);
      if(!kg){toast('קודם צריך משקל בסט הראשון');return}
      const r=x=>Math.max(0,Math.round(kg*x/2.5)*2.5);e.sets=[[.4,10],[.6,6],[.8,3]].map(([f,n])=>({kg:r(f),reps:n,done:false,warm:true})).concat(e.sets.filter(x=>!x.warm));saveLive(t);closeSheet();toast('נוספו 3 סטים של חימום (40%, 60%, 80%)');return}
    case 'woSet':{const t=tr;if(!t)return;const [wid,ei,si]=(id||'').split('|'),w=t.wos.find(x=>x.id===wid),e=w&&w.ex[+ei],x=e&&e.sets[+si];if(!x)return;
      return sheet(`${setLabel(e,+si)} · ${esc(e.name)}`,setFieldsHTML(t,x),fd=>{const me=cur(),w2=me&&me.wos.find(y=>y.id===wid),e2=w2&&w2.ex[+ei],x2=e2&&e2.sets[+si];if(!x2)return;applySetFields(x2,fd);
        if(!x2.warm){const wi=e2.sets.slice(0,+si+1).filter(y=>!y.warm).length-1,lg=me.logs.filter(l=>l.wo===wid&&l.ex===e2.name)[wi];if(lg){lg.fail=!!x2.fail;lg.failNote=x2.fail?(x2.note||x2.cnote||''):'';if(x2.rpe)lg.rpe=x2.rpe;else delete lg.rpe}}
        save(me,'wos','logs');toast('נשמר')},'שמירה')}
    case 'tplMenu':return tplMenu(tr);
    case 'tplSave':{const t=tr;if(!t)return;return sheet('שמירה כתבנית',fld('tp-n','שם התבנית','required placeholder="למשל מתחילים · 3 ימים"',t.plan.map(d=>d.title.split('·')[0].trim()).join(' + ')),fd=>{const n=(fd['tp-n']||'').trim();if(!n)return false;saveSettings({templates:TPLS().concat([{id:uid(),name:n,plan:copyPlan(cur().plan),at:today()}])});toast('התבנית נשמרה')},'שמירה')}
    case 'tplApply':{const [tid2,mode]=(v||'').split('|'),tp=TPLS().find(x=>x.id===tid2),t=tr;if(!tp||!t)return;
      const go=()=>{const me=cur();me.plan=mode==='add'?me.plan.concat(copyPlan(tp.plan)):copyPlan(tp.plan);ui.planIdx=mode==='add'?me.plan.length-tp.plan.length:0;save(me,'plan');toast(mode==='add'?'הימים מהתבנית נוספו':'התוכנית הוחלפה')};
      if(mode==='replace'&&t.plan.some(d=>d.ex.length))return confirmSheet('החלפת התוכנית',`להחליף את התוכנית הנוכחית בתבנית ״${esc(tp.name)}״?`,go,'כן, להחליף');closeSheet();go();return}
    case 'tplDel':return confirmSheet('מחיקת תבנית','למחוק את התבנית? תוכניות שכבר נטענו ממנה לא ישתנו.',()=>saveSettings({templates:TPLS().filter(x=>x.id!==v)}),'כן, למחוק');
    case 'ckOpen':return ckSheet(tr);
    case 'ckReply':{const t=T(tid),c=t&&t.checkins.find(x=>x.wk===sid);if(!c)return;const f=t.ckfb[c.wk]||{};
      return sheet('תגובה · '+esc(t.name),ckHTML(t,c,false)+`<div class="field" style="margin-top:12px"><label for="ck-r">התגובה של יקיר</label><textarea id="ck-r" name="ck-r" maxlength="600" placeholder="למשל: שבוע מצוין! בשבוע הבא ננסה להוסיף עוד אימון">${esc(f.text||'')}</textarea></div>`,fd=>{const tx=(fd['ck-r']||'').trim();if(!tx)return false;const me=T(tid);me.ckfb[c.wk]={text:tx,d:today()};save(me,'ckfb');toast('התגובה נשלחה');
        waNext('התגובה נשלחה ✅',`רוצה לעדכן את ${esc(firstName(me))} בוואטסאפ?`,me.phone,`היי ${firstName(me)}, הגבתי לצ׳ק-אין השבועי שלך באפליקציה 💪 יקיר`,'שליחת עדכון בוואטסאפ')},'שליחה')}
    case 'dash':return dashSheet(v);
    case 'chNew':return sheet('אתגר חדש',fld('ch-t','שם האתגר','required',`אתגר ${ymName(today().slice(0,7),{month:'long'})}: 12 אימונים`)+`<div class="two">${fld('ch-g','יעד אימונים','type="number" min="1" inputmode="numeric" required',12)}${fld('ch-to','עד תאריך','type="date" required',addDays(today(),30))}</div><p class="small muted">נספר כל יום שבו נרשם אימון או שסומן ״הגיע״. משתתפים רואים רק שם פרטי וכמות אימונים.</p>`,fd=>{const ti=(fd['ch-t']||'').trim(),g=+fd['ch-g'],to=fd['ch-to'];if(!ti||!(g>0)||!to||to<today())return false;const ch={id:uid(),title:ti,goal:g,from:today(),to,board:[]};DB.pub=Object.assign({},PUB(),{ch});api.set('pub','main',{ch});render();toast('האתגר נפתח. המתאמנים יראו אותו בלשונית ״התקדמות״')},'פתיחת האתגר');
    case 'chEnd':return confirmSheet('סיום האתגר','לסיים את האתגר? הוא ייעלם אצל המתאמנים.',()=>{DB.pub=Object.assign({},PUB(),{ch:null});api.set('pub','main',{ch:null});render()},'סיום');
    case 'chJoin':{const c=CH();if(!c||!tr)return;tr.chJoin=c.id;save(tr,'chJoin');toast('הצטרפת לאתגר! 💪');return}
    case 'chLeave':tr.chJoin='';save(tr,'chJoin');return;
    case 'wmWeek':ui.wmWeek=addDays(ui.wmWeek||today(),+v);ui.wmDay=null;break;
    case 'awStart':{const t=tr;if(!t)return;if(isCoach)ui.awFor=t.id;ui.aw=true;window.scrollTo(0,0);if(t.live){render();return}t.live=newLive(t,t.plan[ui.planIdx]);save(t,'live');return}
    case 'awOpen':{const t=tr;if(!t||!t.live)return;if(isCoach)ui.awFor=t.id;ui.aw=true;window.scrollTo(0,0);break}
    case 'awHide':ui.aw=false;window.scrollTo(0,0);break;
    case 'awDone':{const t=awT();if(!t||!t.live)return;const [ei,si]=(id||'').split('|').map(Number),x=t.live.ex[ei]&&t.live.ex[ei].sets[si];if(!x)return;
      if(!x.done){const row=el.closest('.aw-set'),ik=row&&row.querySelector('[data-id$="|kg"]'),ir=row&&row.querySelector('[data-id$="|reps"]');
        if(ik&&ik.value!=='')x.kg=+ik.value;if(ir&&ir.value!=='')x.reps=+ir.value;
        if(x.kg===''||x.kg==null)x.kg=ik&&ik.placeholder!==''?+ik.placeholder:0;
        if(x.reps===''||x.reps==null){if(ir&&ir.placeholder!==''){x.reps=+ir.placeholder}else{toast('כתבו כמה חזרות עשיתם');if(ir)ir.focus();return}}
        x.done=true;try{navigator.vibrate&&navigator.vibrate(25)}catch(z){}const nx=t.live.ex[ei+1];if(ls.get('yf-autorest',false)&&!(nx&&nx.ss))startTimer(ls.get('yf-rest',90));
      }else x.done=false;
      saveLive(t);return}
    case 'awSet':{const t=awT();if(!t||!t.live)return;const [ei,si]=(id||'').split('|').map(Number);return awNoteSheet(t,ei,si)}
    case 'awExNote':{const t=awT();if(!t||!t.live)return;return awNoteSheet(t,+v,null)}
    case 'awAddSet':{const t=awT();if(!t||!t.live)return;const e=t.live.ex[+v];if(!e)return;const l=e.sets[e.sets.length-1]||{kg:'',reps:''};e.sets.push({kg:l.kg,reps:l.reps,done:false});saveLive(t);closeSheet();return}
    case 'awDelSet':{const t=awT();if(!t||!t.live)return;const [ei,si]=(id||'').split('|').map(Number),e=t.live.ex[ei];if(!e)return;e.sets.splice(si,1);saveLive(t);closeSheet();return}
    case 'awExMenu':{const t=awT();if(!t||!t.live)return;const e=t.live.ex[+v];if(!e)return;return sheet(esc(e.name),`<div class="stack"><button type="button" class="btn btn-ghost btn-block" data-act="awAddSet" data-v="${v}">${mini(I.plus)} הוספת סט</button><button type="button" class="btn btn-ghost btn-block" data-act="awWarm" data-v="${v}">${mini(I.flame)} הוספת סטים של חימום</button><button type="button" class="btn btn-ghost btn-block" data-act="awExNote" data-v="${v}">${mini(I.note)} הערה לתרגיל</button><button type="button" class="btn btn-danger btn-block" data-act="awDelEx" data-v="${v}">הסרת התרגיל מהאימון</button></div>`,()=>{},'סגירה')}
    case 'awDelEx':{const t=awT();if(!t||!t.live)return;t.live.ex.splice(+v,1);saveLive(t);closeSheet();return}
    case 'awAddEx':{const t=awT();if(!t||!t.live)return;const names=[...new Set([...t.plan.flatMap(d=>d.ex.map(e=>e.name)),...libNames()])];
      return sheet('הוספת תרגיל',fld('aw-x','שם התרגיל','required list="aw-lib" autocomplete="off"')+`<datalist id="aw-lib">${names.map(n=>`<option value="${esc(n)}">`).join('')}</datalist>`,fd=>{const n=(fd['aw-x']||'').trim();if(!n)return false;const me=awT();if(!me||!me.live)return;me.live.ex.push(exEntry(me,n,planEx(me,n)));saveLive(me)},'הוספה')}
    case 'awMus':{const t=awT();if(!t||!t.live||!isCoach)return;const L=t.live;L.extra=L.extra.includes(v)?L.extra.filter(k=>k!==v):L.extra.concat([v]);saveLive(t);return}
    case 'woMus':{const t=tr;if(!t||!isCoach)return;const w=t.wos.find(x=>x.id===id);if(!w)return;w.extra=(w.extra||[]).includes(v)?w.extra.filter(k=>k!==v):(w.extra||[]).concat([v]);save(t,'wos');const sw=workouts(t).find(x=>x.d===w.d);if(sw&&$('#sheet .scrim'))sheet('האימון של '+fmt(w.d),workoutCard(t,sw,{logs:true,del:true}),()=>{},'סגירה');return}
    case 'awFinish':{const t=awT();if(!t||!t.live)return;const n=t.live.ex.reduce((a,e)=>a+e.sets.filter(x=>x.done).length,0);
      if(!n){toast('סמנו ✓ על לפחות סט אחד שסיימתם');return}
      const left=t.live.ex.reduce((a,e)=>a+e.sets.filter(x=>!x.done).length,0);
      if(left)return confirmSheet('לסיים את האימון?',`${left} סטים לא סומנו ✓ ולא יישמרו. ${n} סטים שסומנו יישמרו.`,()=>finishWorkout(awT()),'סיום ושמירה');
      finishWorkout(t);return}
    case 'awDiscard':return confirmSheet('ביטול האימון','למחוק את האימון הזה בלי לשמור?',()=>{const t=awT();if(!t)return;t.live=null;ui.aw=false;save(t,'live');toast('האימון בוטל')},'כן, לבטל');
    case 'sumOpen':{const t=tr;if(!t)return;closeSheet();ui.sum={tid:t.id,key:v};window.scrollTo(0,0);break}
    case 'sumDone':ui.sum=null;window.scrollTo(0,0);break;
    case 'sumShare':case 'sumSave':{const f=sumState&&sumState.cards&&sumState.cards.files[sumIdx()];if(!f){toast('רגע, מכין את התמונה…');return}
      if(navigator.canShare&&navigator.canShare({files:[f]}))navigator.share({files:[f],title:'האימון שלי'}).catch(()=>{});else saveFile(f);return}
    case 'sumText':{if(!sumState)return;const txt=sumText(T(sumState.t),sumState.sd);(navigator.clipboard?navigator.clipboard.writeText(txt):Promise.reject()).then(()=>toast('הטקסט הועתק')).catch(()=>toast('לא הצלחנו להעתיק'));return}
    case 'delWo':return confirmSheet('מחיקת האימון','למחוק את האימון הזה וכל הסטים שלו?',()=>{const t=tr;if(!t)return;t.wos=t.wos.filter(x=>x.id!==v);t.logs=t.logs.filter(l=>l.wo!==v);save(t,'wos','logs');toast('האימון נמחק')},'כן, למחוק');
    case 'invite':return inviteSheet();
    case 'copyInvite':{const u=appUrl();(navigator.clipboard?navigator.clipboard.writeText(u):Promise.reject()).then(()=>toast('הקישור הועתק')).catch(()=>toast('לא הצלחנו להעתיק. אפשר לסמן את הקישור ולהעתיק ידנית'));return}
    case 'allVids':ui.allVids=!ui.allVids;break;
    case 'vidsCleaned':saveSettings({cleanedAt:vidCut()});toast('מעולה, התזכורת אופסה');return;
    case 'sesPaid':case 'sesUnpaid':{const t=T(tid),on=a==='sesPaid';t.sessions=t.sessions.map(x=>x.id===sid?Object.assign({},x,on?{paid:true,paidDate:today(),price:+x.price||rateOf(t)}:{paid:false,paidDate:''}):x);save(t,'sessions');toast(on?'סומן כשולם':'הסימון בוטל');return}
    case 'sesPayAll':{const t=T(id);t.sessions=t.sessions.map(x=>x.st==='came'&&!x.paid?Object.assign({},x,{paid:true,paidDate:today(),price:+x.price||rateOf(t)}):x);save(t,'sessions');toast('הכול סומן כשולם');return}
    case 'subPaid':{const t=T(id);t.subPays=t.subPays.filter(x=>x.m!==v).concat([{m:v,paidDate:today(),price:rateOf(t)}]);save(t,'subPays');toast('סומן כשולם');return}
    case 'subUnpaid':{const t=T(id);t.subPays=t.subPays.filter(x=>x.m!==v);save(t,'subPays');toast('הסימון בוטל');return}
    case 'subPayAll':{const t=T(id);t.subPays=t.subPays.concat(subDue(t).map(m=>({m,paidDate:today(),price:rateOf(t)})));save(t,'subPays');toast('הכול סומן כשולם');return}
    case 'cardPick':{const [sz,pr]=v.split('|'),a1=$('#c-size'),a2=$('#c-price');if(a1)a1.value=sz;if(a2)a2.value=pr;return}
    case 'addCardPrice':{const P=PRICES(),F=P.fmt[FMTN[ui.fmtP]?ui.fmtP:'solo'];F.cards.push({size:(F.cards.length?F.cards[F.cards.length-1].size:0)+10,price:0});savePrices(P);return}
    case 'delCardPrice':{const P=PRICES();P.fmt[FMTN[ui.fmtP]?ui.fmtP:'solo'].cards.splice(+v,1);savePrices(P);return}
    case 'bizTab':ui.bizTab=v;window.scrollTo(0,0);break;
    case 'fmtP':ui.fmtP=v;break;
    case 'finF':ui.finF=v;break;
    case 'exp':exportData(v);return;
    case 'pcPaidX':{const t=T(id);if(!t)return;savePC(t,{paid:true,paidDate:today()});toast('סומן כשולם');return}
    case 'payRep':{const t=tr,o=owed(t);if(!o.amount)return;t.payRep={at:Date.now(),d:today(),amount:o.amount};save(t,'payRep');toast('הדיווח נשלח ליקיר');
      waNext('הדיווח נשלח ✅','יקיר יראה אותו באפליקציה. רוצה לעדכן אותו גם בוואטסאפ?',PUB().phone,`היי יקיר, שילמתי ${ils(o.amount)} 🙏 ${cleanName(t.name)}`,'עדכון ליקיר בוואטסאפ');return}
    case 'payOk':{const t=T(id);if(!t||!t.payRep)return;const amt=t.payRep.amount,b=billOf(t);
      if(b==='card'){t.card.paid=true;t.card.paidDate=today()}
      else if(b==='single')t.sessions=t.sessions.map(x=>(x.st==='came'||x.st==='late')&&!x.paid?Object.assign({},x,{paid:true,paidDate:today(),price:+x.price||rateOf(t)}):x);
      else t.subPays=t.subPays.concat(subDue(t).map(m=>({m,paidDate:today(),price:rateOf(t)})));
      t.payRep=null;save(t,'card','sessions','subPays','payRep');toast('התשלום אושר');
      waNext('התשלום אושר ✅','רוצה לשלוח אישור וקבלה בוואטסאפ? את הקבלה מצרפים בצ׳אט.',t.phone,`היי ${firstName(t)}, קיבלתי את התשלום (${ils(amt)}), תודה! 🙏 מצרף קבלה. יקיר`,'שליחת אישור בוואטסאפ');return}
    case 'payNo':{const t=T(id);if(!t)return;t.payRep=null;save(t,'payRep');toast('הדיווח הוסר');return}
    case 'vidUp':return vidSheet(tr,v||'');
    case 'vidPlay':{const vv=tr.vids.find(x=>x.id===id);if(!vv)return;return sheet(esc(vv.ex),vidPlayer(vv)+(tr.fb[vv.id]?`<div style="margin-top:12px">${fbHTML(tr.fb[vv.id])}</div>`:'<p class="small muted">יקיר עוד לא צפה בסרטון.</p>'),()=>{},'סגירה')}
    case 'vidDel':return confirmSheet('מחיקת סרטון','למחוק את הסרטון מהרשימה?',()=>{tr.vids=tr.vids.filter(x=>x.id!==id);save(tr,'vids')});
    case 'vidReview':{const t=T(tid),vv=t&&t.vids.find(x=>x.id===sid);if(!vv)return;return reviewSheet(t,vv)}
    case 'openP':ui.tab='plans';ui.sel=id;ui.planIdx=0;window.scrollTo(0,0);break;
    case 'addPC':return pcSheet();
    case 'editPC':return pcSheet(tr);
    case 'pcPaid':{const paid=!tr.paid;savePC(tr,{paid,paidDate:paid?today():''});toast(paid?'סומן כשולם':'הסימון בוטל');return}
    case 'delPC':return confirmSheet('מחיקת תוכנית',`למחוק את התוכנית של ${esc(tr.name)}?`,()=>{api.del('coach',tr.id);delete DB.coach[tr.id];ui.sel=null;render();toast('התוכנית נמחקה')});
    case 'back':ui.sel=null;break;
    case 'planIdx':ui.planIdx=+v;break;
    case 'progEx':ui.progEx=v;break;
    case 'bookDay':ui.bookDay=v;ui.bookPicked=true;break;
    /* trainer: people */
    case 'addTrainee':return traineeSheet();
    case 'editTrainee':return traineeSheet(tr);
    case 'joinOk':return joinSheet(T(id));
    case 'joinNo':{const t=T(id);return confirmSheet('דחיית בקשה',`לדחות את הבקשה של ${esc(t.name)}? אפשר יהיה להירשם שוב.`,()=>{api.del('members',id);delete DB.members[id];render()},'דחייה')}
    case 'delTrainee':return confirmSheet('מחיקת מתאמן',`למחוק את ${esc(tr.name)} ואת כל הנתונים שלו?`,()=>{api.del('coach',tr.id);api.del('members',tr.id);(DB.photos[tr.id]||[]).forEach(p=>api.del('photos',p.id));delete DB.coach[tr.id];delete DB.members[tr.id];ui.sel=null;render();toast('המתאמן נמחק')});
    case 'wa':return waSheet(tr);
    case 'renew':return renewSheet(tr);
    case 'markPaid':case 'markUnpaid':{const t=T(id);t.card.paid=a==='markPaid';t.card.paidDate=t.card.paid?today():'';save(t,'card');toast(t.card.paid?'סומן כשולם':'הסימון בוטל');return}
    /* sessions */
    case 'addSession':return sessionSheet(id);
    case 'delSession':{const t=T(tid);const s=t.sessions.find(x=>x.id===sid);if(!s)return;return confirmSheet('ביטול אימון',`לבטל את האימון של ${esc(t.name)} ב${fmt(s.date)} בשעה ${s.time}?`,()=>{if(s.by==='fixed')t.fixedSkip=t.fixedSkip.concat([s.date+'|'+s.time]);t.sessions=t.sessions.filter(x=>x.id!==sid);save(t,'sessions','fixedSkip');waitFree(s.date,s.time);toast('האימון בוטל')},'כן, לבטל')}
    case 'att':{const t=T(tid);t.sessions=t.sessions.map(s=>s.id===sid?Object.assign({},s,{st:s.st===v?null:v}):s);save(t,'sessions');return}
    case 'reqOk':{const t=T(tid);const r=t.requests.find(x=>x.id===sid);if(!r)return;const clash=daySess(r.date).find(s=>s.time===r.time);
      const go=()=>{t.sessions=t.sessions.concat([{id:uid(),date:r.date,time:r.time,by:'trainee'}]);t.requests=t.requests.filter(x=>x.id!==sid);save(t,'sessions','requests');toast('האימון אושר ונכנס ללו״ז');
        waNext('האימון אושר ✅',`רוצה לעדכן את ${esc(firstName(t))} בוואטסאפ?`,t.phone,`היי ${firstName(t)}, האימון שלך ב${fmt(r.date)} בשעה ${r.time} אושר ✅ נתראה! יקיר`,'שליחת אישור בוואטסאפ')};
      if(clash)return confirmSheet('השעה תפוסה',`בשעה הזו כבר יש אימון עם ${esc(T(clash.tid).name)}. לאשר בכל זאת?`,go,'לאשר בכל זאת');go();return}
    case 'reqNo':{const t=T(tid);const r=t.requests.find(x=>x.id===sid);if(!r)return;t.requests=t.requests.map(x=>x.id===sid?Object.assign({},x,{status:'declined'}):x);save(t,'requests');toast('הבקשה נדחתה');
      waNext('הבקשה נדחתה',`רוצה לעדכן את ${esc(firstName(t))} בוואטסאפ?`,t.phone,`היי ${firstName(t)}, ב${fmt(r.date)} בשעה ${r.time} לא מסתדר לי. אפשר לבחור שעה אחרת באפליקציה 🙏 יקיר`,'שליחת עדכון בוואטסאפ');return}
    case 'remindSent':{const k='yf-remind-'+nextWeek()[0];ls.set(k,[...new Set(ls.get(k,[]).concat([id]))]);setTimeout(render,150);return}
    case 'waSent':setTimeout(closeSheet,150);return;
    /* trainer: business */
    case 'wd':{const s=PUB();const i=+v;s.days=s.days.includes(i)?s.days.filter(x=>x!==i):s.days.concat([i]).sort();DB.pub=s;api.set('pub','main',{days:s.days});break}
    case 'addOff':return sheet('יום חופש',fld('o-date','תאריך','type="date" required',today()),fd=>{if(!fd['o-date'])return false;const s=PUB();s.off=[...new Set((s.off||[]).filter(d=>d>=today()).concat([fd['o-date']]))];DB.pub=s;api.set('pub','main',{off:s.off});const n=daySess(fd['o-date']).length;toast(n?`שימו לב: יש ${n} אימונים ביום הזה`:'יום החופש נשמר');render()});
    case 'delOff':{const s=PUB();s.off=(s.off||[]).filter(d=>d!==v);DB.pub=s;api.set('pub','main',{off:s.off});break}
    /* plan */
    case 'addDay':return sheet('יום אימון חדש',fld('d-title','שם היום','required placeholder="למשל C · גב ויד קדמית"'),fd=>{if(!fd['d-title'].trim())return false;tr.plan.push({id:uid(),title:fd['d-title'].trim(),ex:[]});ui.planIdx=tr.plan.length-1;save(tr,'plan')});
    case 'editDay':return sheet('שם היום',fld('d-title','שם היום','required',day.title),fd=>{if(!fd['d-title'].trim())return false;day.title=fd['d-title'].trim();save(tr,'plan')});
    case 'delDay':return confirmSheet('מחיקת יום',`למחוק את ״${esc(day.title)}״ מהתוכנית?`,()=>{tr.plan.splice(ui.planIdx,1);ui.planIdx=0;save(tr,'plan')});
    case 'addEx':return exSheet(tr,day);
    case 'editEx':return exSheet(tr,day,day.ex.find(x=>x.id===id));
    case 'delEx':day.ex=day.ex.filter(x=>x.id!==id);save(tr,'plan');return;
    case 'logEx':return logSheet(tr,v,day);
    case 'exNote':{const cur0=tr.exNotes[v]||'';return sheet('הערה שלי · '+esc(v),`<p class="small muted" style="margin-top:0">למשל גובה מושב, אחיזה או משהו שחשוב לזכור. יקיר רואה את ההערה.</p><div class="field"><label for="n-text">ההערה</label><textarea id="n-text" name="n-text" maxlength="300">${esc(cur0)}</textarea></div>`,fd=>{tr.exNotes[v]=(fd['n-text']||'').trim();save(tr,'exNotes');toast(tr.exNotes[v]?'ההערה נשמרה':'ההערה נמחקה')})}
    case 'video':if(!embedUrl(v))return;e.preventDefault();return videoSheet(el.dataset.n||'',v);
    case 'pdf':return exportPlan(tr);
    case 'pdfShare':if(pdfFile)navigator.share({files:[pdfFile],title:pdfFile.name}).catch(()=>{});return;
    case 'pdfView':return pdfPreviewSheet();
    case 'woOpen':{const w=workouts(tr).find(x=>x.d===v);if(!w)return;return sheet('האימון של '+fmt(v),workoutCard(tr,w,{logs:true,del:true}),()=>{},'סגירה')}
    case 'delLog':{const l=tr.logs[+v];if(!l)return;return confirmSheet('מחיקת רישום',`למחוק את הרישום של ${esc(l.ex)} (${kgf(l.kg)} ק״ג × ${esc(l.reps)})?`,()=>{tr.logs.splice(+v,1);save(tr,'logs');toast('הרישום נמחק')})}
    case 'musCycle':{const h=$('#e-mus');if(!h)return;const m=JSON.parse(h.value),st=m.p.includes(v)?'p':m.s.includes(v)?'s':'',nx=st===''?'p':st==='p'?'s':'';m.p=m.p.filter(x=>x!==v);m.s=m.s.filter(x=>x!==v);if(nx)m[nx].push(v);h.value=JSON.stringify(m);h.dataset.touched='1';el.className='mchip '+nx;return}
    /* food */
    case 'addFood':return foodSheet(tr);
    case 'editFood':return foodSheet(tr,tr.food.find(x=>x.id===id));
    case 'delFood':tr.food=tr.food.filter(x=>x.id!==id);save(tr,'food');return;
    /* body & photos */
    case 'addBody':return bodySheet(tr);
    case 'delBody':tr.body=tr.body.filter(x=>x.d!==v);save(tr,'body');return;
    case 'delPhoto':return confirmSheet('מחיקת תמונה','למחוק את התמונה לצמיתות?',()=>{api.del('photos',id)});
    /* trainee */
    case 'request':{const t=tr;return sheet('בקשה לאימון',`<p style="margin-top:0">${fmt(ui.bookDay)} בשעה <b class="num">${v}</b></p>${fld('r-note','הערה ליקיר (לא חובה)','maxlength="120" placeholder="למשל: אפשר גם חצי שעה אחר כך"')}<p class="small muted">יקיר יקבל את הבקשה ויאשר. אחרי האישור האימון ייכנס ללו״ז שלך.</p>`,fd=>{const date=ui.bookDay,note=(fd['r-note']||'').trim();t.requests=t.requests.concat([{id:uid(),date,time:v,note,status:'pending',at:Date.now()}]);save(t,'requests');toast('הבקשה נשלחה ליקיר');
        waNext('הבקשה נשלחה ✅','יקיר יראה אותה באפליקציה. רוצה לעדכן אותו גם בוואטסאפ?',PUB().phone,`היי יקיר, ביקשתי אימון ב${fmt(date)} בשעה ${v}${note?' ('+note+')':''}. אשמח לאישור 🙏 ${cleanName(t.name)}`,'עדכון ליקיר בוואטסאפ')},'שליחת בקשה')}
    case 'planNext':{const w=nextWeek();ui.bookDay=w.find(d=>slotsFor(d).length)||w[0];ui.bookPicked=true;ui.wk=w[0];ui.tab='sched';render();const b=$('#bookSec');if(b)b.scrollIntoView({behavior:'smooth',block:'start'});return}
    case 'cancelReq':case 'dismissReq':tr.requests=tr.requests.filter(x=>x.id!==id);save(tr,'requests');toast(a==='cancelReq'?'הבקשה בוטלה':'');return;
    case 'renewWa':if(!tr.renewReq){tr.renewReq=true;save(tr,'renewReq')}return;
    case 'reqRenew':tr.renewReq=true;save(tr,'renewReq');toast('הבקשה נשלחה ליקיר');return;
    case 'editMe':return sheet('הפרטים שלי',fld('m-name','שם מלא','required',tr.name)+fld('m-phone','טלפון','type="tel" dir="ltr" inputmode="tel"',tr.phone)+fld('m-goal','המטרה שלי','',tr.goal)+fld('m-bday','תאריך לידה','type="date"',tr.bday||''),fd=>{if(!fd['m-name'].trim())return false;tr.name=fd['m-name'].trim();tr.phone=fd['m-phone'];tr.goal=fd['m-goal'];tr.bday=fd['m-bday']||'';save(tr,'name','phone','goal','bday')});
    case 'cup':{const k='yf-water-'+tr.id+'-'+today();ls.set(k,Math.max(0,ls.get(k,0)+(+v)));break}
    case 'testWater':try{if('Notification' in window&&Notification.permission==='default')Notification.requestPermission().catch(()=>{})}catch(x){}remindWater();return;
    case 'timer':return timerSheet();
    case 'timerStop':stopTimer();return;
    default:return;
  }
  render();
});
document.addEventListener('change',e=>{
  const el=e.target.closest('[data-act]');if(!el)return;const a=el.dataset.act;
  if(a==='awIn'){const t=awT();if(!t||!t.live)return;const [ei,si,k]=el.dataset.id.split('|'),x=t.live.ex[+ei]&&t.live.ex[+ei].sets[+si];if(!x)return;x[k]=el.value===''?'':+el.value;saveLive(t,false);return}
  if(a==='macroSet'){const t=cur();if(!t)return;t.macro=Object.assign({},t.macro||{},{[el.dataset.v]:Math.max(0,+el.value||0)});save(t,'macro');toast('היעד נשמר');return}
  if(a==='habNum'){const t=cur(),d=today(),id=el.dataset.v,val=el.value===''?null:+el.value;t.habits=Object.assign({list:[]},t.habits,{log:habLog(t).filter(x=>!(x.d===d&&x.id===id)&&x.d>=addDays(d,-60)).concat(val==null?[]:[{d,id,v:val}])});save(t,'habits');return}
  if(a==='autoRest'){ls.set('yf-autorest',el.checked);toast(el.checked?'הטיימר יופעל אחרי כל סט':'הטיימר האוטומטי כבוי');return}
  if(a==='billType'){const dyn=$('#b-dyn');if(!dyn)return;const t=dyn.dataset.tid?T(dyn.dataset.tid):null;dyn.innerHTML=billDyn($('#b-type').value,$('#b-fmt').value,t,!!dyn.dataset.new);return}
  if(a==='cardSize'){const fm=($('#b-fmt')||{}).value||el.dataset.fmt||'solo',tt=el.dataset.tid?T(el.dataset.tid):{fmt:fm},pr=$('#c-price'),v=el.dataset.tid?cardPriceFor(tt,el.value):((PRICES().fmt[fm].cards.find(x=>x.size===+el.value)||{}).price||0);if(v&&pr)pr.value=v;return}
  if(a==='priceSet'){const P=PRICES(),ks=el.dataset.v.split('.'),val=Math.max(0,+el.value||0);let o=P;for(let k=0;k<ks.length-1;k++)o=o[ks[k]];o[ks[ks.length-1]]=ks[ks.length-1]==='size'?Math.max(1,val):val;savePrices(P);toast('נשמר');return}
  if(a==='pubSet'){const [k,f]=el.dataset.v.split('.'),s0=PUB(),o=Object.assign({},k==='policy'?POL():k==='growth'?GROW():k==='grp'?GRP():PAY(),s0[k]||{});o[f]=el.type==='checkbox'?el.checked:el.type==='number'?Math.max(0,+el.value||0):el.value.trim();DB.pub=Object.assign({},s0,{[k]:o});api.set('pub','main',{[k]:o});toast('נשמר');render();return}
  if(a==='cldField'){const s0=PUB(),c=Object.assign({},s0.cld||{});c[el.dataset.v]=el.value.trim();DB.pub=Object.assign({},s0,{cld:c});api.set('pub','main',{cld:c});toast('נשמר');render();return}
  if(a==='failToggle'){const b=$('#l-fail-box');if(b){b.hidden=!el.checked;if(el.checked)$('#l-failnote').focus()}return}
  if(a==='pubField'){const k=el.dataset.v;let val=el.value;if(k!=='phone')val=val.slice(0,2)+':00';const s=PUB();s[k]=val;if(s.from>=s.to){toast('שעת הסיום צריכה להיות אחרי שעת ההתחלה');render();return}DB.pub=s;api.set('pub','main',{[k]:val});toast('נשמר');return}
  if(a==='photo'){const t=T(el.dataset.id);uploadPhoto(t,el.files&&el.files[0]);el.value='';return}
  const t=cur();if(!t)return;
  if(a==='avatar'){uploadAvatar(t,el.files&&el.files[0]);el.value='';return}
  if(a==='feat'){t.features[el.dataset.v]=el.checked;if(el.dataset.v==='habits'&&el.checked&&!((t.habits||{}).list||[]).length){t.habits={list:HAB_PRESETS.slice(0,4),log:habLog(t)};save(t,'features','habits')}else save(t,'features');if(el.dataset.v==='water'&&el.checked)ls.set('yf-wlast-'+t.id,Date.now())}
  if(a==='water'){t.water[el.dataset.v]=el.dataset.v==='every'?+el.value:el.value;save(t,'water')}
});
document.addEventListener('submit',async e=>{
  if(e.target.id==='authForm'){
    e.preventDefault();const fd=Object.fromEntries(new FormData(e.target));const up=ui.authMode==='up';
    if(up&&!String(fd.name||'').trim())return showAuthErr('צריך למלא שם');
    if(!fd.email||!fd.pw)return showAuthErr('צריך למלא מייל וסיסמה');
    ui.busy=true;renderAuth();
    try{if(up)await authApi.signUp(fd.email.trim(),fd.pw,String(fd.name).trim());else await authApi.signIn(fd.email.trim(),fd.pw)}
    catch(x){ui.busy=false;renderAuth();$('#a-email').value=fd.email;showAuthErr(errMsg(x))}
    ui.busy=false;return;
  }
  if(e.target.id==='joinForm'){
    e.preventDefault();const fd=Object.fromEntries(new FormData(e.target));
    if(!fd.name.trim()||!fd.phone.trim()){toast('צריך למלא שם וטלפון');return}
    const rf=ls.get('yf-ref','');api.set('members',user.uid,Object.assign(newMember(fd.name.trim(),fd.phone.trim(),fd.goal.trim()),{email:user.email,wants:fd.wants==='online'?'online':'personal'},rf&&rf!==user.uid?{ref:rf}:{},fd.bday?{bday:fd.bday}:{}));
  }
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('#sheet').innerHTML)closeSheet()});
function showAuthErr(m,kind){const el=$('#authErr');if(el){el.textContent=m||'';el.className='auth-err'+(kind==='ok'?' ok':'')}}

/* =========================================================
   PLAN CLIENTS — אנשים שקונים רק תוכנית אימונים (לא מתאמנים, לא בלו״ז).
   נשמרים ב-coach/{id} עם planOnly:true, כך שרק יקיר רואה אותם (אותם חוקי אבטחה).
   ========================================================= */
const planClients=()=>Object.keys(DB.coach).filter(id=>DB.coach[id]&&DB.coach[id].planOnly).map(norm).sort((a,b)=>String(b.createdAt||'').localeCompare(String(a.createdAt||'')));
function saveSettings(o){DB.coach.settings=Object.assign({},DB.coach.settings||{},o);api.set('coach','settings',o);render()}
function savePrices(P){const prices={plan:+P.plan||0,online:+P.online||0,fmt:P.fmt};DB.coach.settings=Object.assign({},DB.coach.settings||{},{prices});api.set('coach','settings',{prices});render()}
function savePC(t,o){DB.coach[t.id]=deepMerge(DB.coach[t.id]||{},clone(o));api.set('coach',t.id,o);render()}
const copyPlan=plan=>(plan||[]).map(d=>({id:uid(),title:d.title,ex:(d.ex||[]).map(e=>Object.assign(clone(e),{id:uid()}))}));
function trainerPlans(){
  const ps=planClients();
  return `<div class="row" style="justify-content:space-between;margin-top:6px;flex-wrap:wrap"><h1 class="h-display">תוכניות</h1><button class="btn btn-primary" data-act="addPC">${mini(I.plus,18)} תוכנית חדשה</button></div>
  <p class="muted small" style="margin-top:8px">ללקוחות שקונים רק תוכנית אימונים. הם לא נכנסים ללו״ז ולא צריכים את האפליקציה: בונים תוכנית ושולחים להם PDF.</p>
  <div class="stack" style="margin-top:12px">${ps.length?ps.map(t=>{const n=t.plan.reduce((a,d)=>a+d.ex.length,0);return `<button class="item tap" data-act="openP" data-id="${t.id}">${avatar(t)}<span class="grow" style="min-width:0"><b style="display:block">${esc(t.name)}</b><span class="small muted num">${t.plan.length} ימים · ${n} תרגילים${t.createdAt?' · '+fmtShort(t.createdAt):''}</span></span>${t.price?`<span class="chip ${t.paid?'good':'bad'} num">₪${t.price}${t.paid?'':' · לא שולם'}</span>`:''}${mini(I.next,18)}</button>`}).join(''):`<div class="empty"><b>עוד אין תוכניות</b>לחצו על ״תוכנית חדשה״, בנו את התוכנית ושלחו אותה כ-PDF.</div>`}</div>
  ${tplBlock()}
  ${libBlock()}`;
}
function planClientView(t){
  const n=t.plan.reduce((a,d)=>a+d.ex.length,0);
  return `<div class="row" style="margin-top:4px"><button class="icon-btn" data-act="back" aria-label="חזרה">${I.back}</button><span class="muted small">חזרה לתוכניות</span></div>
  <div class="card hero" style="margin-top:12px">
    <div class="row">${avatar(t,58)}<div class="grow" style="min-width:0"><h1 class="h-display" style="font-size:28px">${esc(t.name)}</h1><div class="small muted">${esc(t.goal||'תוכנית בלבד')}${t.phone?' · <span class="num" dir="ltr">'+esc(t.phone)+'</span>':''}</div></div><button class="icon-btn" data-act="editPC" aria-label="עריכת פרטים">${I.edit}</button></div>
    <div class="row wrap-ok" style="margin-top:14px;gap:8px"><button class="btn btn-primary" data-act="pdf" ${n?'':'disabled'}>PDF ושליחה</button>${t.phone?`<a class="btn btn-wa" target="_blank" rel="noopener" href="${waLink(t.phone,`היי ${firstName(t)}, תוכנית האימונים שלך מוכנה 💪 שולח לך אותה כקובץ PDF. יקיר`)}">${mini(I.wa)} וואטסאפ</a>`:''}</div>
    <div class="row" style="margin-top:14px;border-top:1px solid var(--line);padding-top:12px"><div class="grow small">${t.price?`מחיר: <b class="num">₪${t.price}</b> · `:''}<b class="${t.paid?'paid':'unpaid'}">${t.paid?'שולם'+(t.paidDate?' ב-'+fmtShort(t.paidDate):''):'לא שולם'}</b></div><button class="btn btn-ghost btn-sm" data-act="pcPaid">${t.paid?'ביטול סימון':'סימון כשולם'}</button></div>
  </div>
  <div class="h-sec"><span>התוכנית · ${n} תרגילים</span></div>
  ${planBlock(t,true)}
  <div style="margin-top:28px"><button class="btn btn-danger btn-block" data-act="delPC">מחיקת התוכנית</button></div>`;
}
function pcSheet(t){
  const srcs=[...tList().filter(x=>x.plan.some(d=>d.ex.length)).map(x=>['t:'+x.id,'העתקה מהתוכנית של '+cleanName(x.name)]),...planClients().filter(x=>x.plan.some(d=>d.ex.length)).map(x=>['p:'+x.id,'העתקה מהתוכנית של '+cleanName(x.name)+' (תוכנית בלבד)']),...TPLS().map(x=>['x:'+x.id,'תבנית: '+x.name])];
  sheet(t?'עריכת פרטים':'תוכנית חדשה',fld('pc-name','שם הלקוח','required',t?t.name:'')+fld('pc-phone','טלפון (לא חובה)','type="tel" dir="ltr" inputmode="tel"',t?t.phone:'')+fld('pc-goal','מטרה (לא חובה)','placeholder="למשל עלייה במסה, חיטוב"',t?t.goal:'')
    +`<div class="two">${fld('pc-price','מחיר (₪)','type="number" min="0" inputmode="numeric"',t&&t.price?t.price:(PRICES().plan||''))}<div class="field"><label for="pc-paid">שולם</label><label class="switch" style="margin-top:8px"><input type="checkbox" id="pc-paid" name="pc-paid" ${t&&t.paid?'checked':''}><span></span></label></div></div>`
    +(t?'':`<div class="field"><label for="pc-from">מאיפה מתחילים?</label><select id="pc-from" name="pc-from"><option value="base">תוכנית בסיס (A + B) לעריכה</option><option value="empty">תוכנית ריקה</option>${srcs.map(([v,l])=>`<option value="${v}">${esc(l)}</option>`).join('')}</select><span class="small muted">העתקה חוסכת זמן: משנים רק מה שצריך.</span></div>`),fd=>{
    const name=fd['pc-name'].trim();if(!name){toast('צריך למלא שם');return false}
    const paid=!!fd['pc-paid'],o={name,phone:fd['pc-phone']||'',goal:fd['pc-goal']||'',price:+fd['pc-price']||0,paid};
    if(t){o.paidDate=paid?(t.paid&&t.paidDate?t.paidDate:today()):'';savePC(t,o);toast('נשמר');return}
    const f=fd['pc-from']||'base',src=f.slice(2);
    const plan=f==='empty'?[]:f==='base'?newCoach().plan:f.startsWith('x:')?copyPlan((TPLS().find(x=>x.id===src)||{}).plan):copyPlan((DB.coach[src]||{}).plan);
    const id=api.newId(),c=Object.assign(o,{planOnly:true,approved:false,color:Math.floor(Math.random()*AV.length),createdAt:today(),paidDate:paid?today():'',plan});
    DB.coach[id]=c;api.set('coach',id,c);ui.sel=id;ui.tab='plans';ui.planIdx=0;render();toast('התוכנית נוצרה. עכשיו בונים אותה');
  },t?'שמירה':'יצירה');
}
/* =========================================================
   ONLINE — מתאמני אונליין שולחים סרטון לכל תרגיל ויקיר נותן ציון והערות.
   סרטונים: קישור (יוטיוב/דרייב) תמיד; העלאה ישירה ל-Cloudinary (חינם) כשמוגדר ב-pub/main.cld
   ========================================================= */
const cldOn=()=>{const c=PUB().cld;return !!(c&&c.cloud&&c.preset)};
const vidSrc=u=>/res\.cloudinary\.com\/.+\/video\/upload\//.test(u)?u.replace('/video/upload/','/video/upload/q_auto,w_720/').replace(/\.(mov|qt|webm|mkv|avi|m4v|3gp)$/i,'.mp4'):u;
function vidPlayer(v){
  if(v.kind==='cld'||/\.(mp4|webm|mov|m4v)(\?|$)/i.test(v.url))return `<video class="vid-el" src="${esc(vidSrc(v.url))}" controls playsinline preload="metadata"></video>`;
  const em=embedUrl(v.url);
  if(em)return `<div class="vid-frame ${em[1]?'tall':''}"><iframe src="${esc(em[0])}" title="סרטון" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div><a class="btn btn-ghost btn-block btn-sm" style="margin-top:8px" href="${esc(v.url)}" target="_blank" rel="noopener">לא נטען? פתיחה בחלון חדש</a>`;
  return `<a class="btn btn-primary btn-block" href="${esc(v.url)}" target="_blank" rel="noopener">${mini(I.play,16)} פתיחת הסרטון</a>`;
}
const fbHTML=f=>f?`<div class="fb-box"><div class="row"><span class="score-big num">${f.score?f.score+'<span>/10</span>':''}</span><span class="grow small muted">${f.score?'הציון של יקיר':'הערות של יקיר'} · ${fmtShort(f.d||today())}</span></div>${f.text?`<div style="margin-top:6px;white-space:pre-wrap">${esc(f.text)}</div>`:''}</div>`:'';
/* סרטונים ישנים: אחרי ציון ו-60 יום הם יורדים מהרשימות (הציון נשמר). הקבצים עצמם נמחקים ידנית ב-Cloudinary */
const OLD_VID_DAYS=60, vidCut=()=>addDays(today(),-OLD_VID_DAYS);
const isOldVid=(t,v)=>!!t.fb[v.id]&&v.d<vidCut();
function oldCloudVids(){const done=(DB.coach.settings||{}).cleanedAt||'',cut=vidCut();return tList().flatMap(t=>t.vids.filter(v=>v.kind==='cld'&&v.d<cut&&v.d>=done))}
function cleanupBanner(){
  const n=cldOn()?oldCloudVids().length:0;if(n<10)return '';
  return `<div class="banner" style="margin-top:12px;flex-wrap:wrap">${I.vid}<div class="grow small" style="min-width:200px"><b>יש ${n} סרטונים בני יותר מחודשיים ב-Cloudinary.</b> כדאי למחוק אותם כדי להישאר במכסה החינמית: ב-Cloudinary נכנסים ל-Media Library ← תיקייה yakirfit ← מסמנים סרטונים ישנים ← Delete.</div><div class="row" style="gap:6px"><a class="btn btn-ghost btn-sm" href="https://console.cloudinary.com/" target="_blank" rel="noopener">פתיחת Cloudinary</a><button class="btn btn-primary btn-sm" data-act="vidsCleaned">ניקיתי ✓</button></div></div>`;
}
const hiddenVidsNote=n=>n?`<div class="small muted" style="margin-top:10px;text-align:center">${n} סרטונים שקיבלו ציון לפני יותר מחודשיים ${ui.allVids?'מוצגים':'הוסתרו (הציונים נשמרו)'} · <button class="linkish" data-act="allVids">${ui.allVids?'הסתרה':'הצגת הכול'}</button></div>`:'';
function vidsCoachBlock(t){
  const all=t.vids.slice().sort((a,b)=>b.at-a.at),vs=ui.allVids?all:all.filter(v=>!isOldVid(t,v));
  return `<div class="h-sec"><span>סרטונים · ${all.length}</span></div>
  <div class="stack">${vs.length?vs.slice(0,ui.allVids?999:12).map(v=>{const f=t.fb[v.id];return `<div class="item"><span class="grow" style="min-width:0"><b>${esc(v.ex)}</b><div class="small muted">${fmtShort(v.d)}${v.note?' · ״'+esc(v.note)+'״':''}</div></span>${f?`<span class="chip good num">${f.score?f.score+'/10':'נבדק'}</span>`:'<span class="chip warn">מחכה</span>'}<button class="btn ${f?'btn-ghost':'btn-primary'} btn-sm" data-act="vidReview" data-id="${t.id}|${v.id}">${f?'עריכה':'ציון'}</button></div>`}).join(''):'<div class="empty">עוד לא נשלחו סרטונים.</div>'}</div>${hiddenVidsNote(all.filter(v=>isOldVid(t,v)).length)}`;
}
function trainerOnline(){
  const os=tList().filter(t=>billOf(t)==='online'), cur=ymOf(today());
  const pend=os.flatMap(t=>t.vids.filter(v=>!t.fb[v.id]).map(v=>({t,v}))).sort((a,b)=>a.v.at-b.v.at);
  return `<h1 class="h-display" style="margin-top:6px">אונליין</h1>
  <p class="muted small" style="margin-top:8px">מתאמנים שמתאמנים לבד לפי התוכנית, שולחים סרטון של התרגילים ומקבלים ממך ציון והערות לשיפור.</p>
  ${cleanupBanner()}
  <div class="stats" style="margin-top:12px"><div class="stat"><b class="num">${os.length}</b><span>מתאמני אונליין</span></div><div class="stat"><b class="num" style="color:${pend.length?'var(--accent2)':'var(--fg)'}">${pend.length}</b><span>מחכים לציון</span></div><div class="stat"><b class="num" style="color:${os.some(t=>subDue(t).includes(cur))?'var(--bad)':'var(--fg)'}">${os.filter(t=>subDue(t).includes(cur)).length}</b><span>לא שילמו החודש</span></div></div>
  ${ckCoachBlock()}
  <div class="h-sec"><span>סרטונים שמחכים לציון</span></div>
  <div class="stack">${pend.length?pend.map(({t,v})=>`<div class="sess"><div class="row">${avatar(t,40)}<div class="grow" style="min-width:0"><b>${esc(t.name)}</b><div class="small muted">${esc(v.ex)} · ${fmtShort(v.d)}</div>${v.note?`<div class="small">״${esc(v.note)}״</div>`:''}</div><button class="btn btn-primary btn-sm" data-act="vidReview" data-id="${t.id}|${v.id}">${mini(I.play,14)} צפייה וציון</button></div></div>`).join(''):'<div class="empty">אין סרטונים חדשים לבדיקה.</div>'}</div>
  <div class="h-sec"><span>מתאמני אונליין · ${os.length}</span></div>
  <div class="stack">${os.length?os.map(t=>{const due=subDue(t),last=t.vids.slice().sort((a,b)=>b.at-a.at)[0];return `<button class="item tap" data-act="openT" data-id="${t.id}">${avatar(t)}<span class="grow" style="min-width:0"><b style="display:block">${esc(t.name)}</b><span class="small muted">${t.vids.length} סרטונים${last?' · אחרון '+fmtShort(last.d):''} · ${ils(rateOf(t))} לחודש</span></span>${due.length?`<span class="chip bad">לא שולם${due.length>1?' · '+due.length+' חודשים':''}</span>`:'<span class="chip good">שולם</span>'}</button>`}).join(''):`<div class="empty"><b>עוד אין מתאמני אונליין</b>כדי להפוך מתאמן לאונליין: מתאמנים ← שם המתאמן ← העיפרון (עריכה) ← סוג תשלום: אונליין. מתאמן חדש אפשר להגדיר כאונליין כבר באישור.</div>`}</div>`;
}
function traineeVids(t){
  const all=t.vids.slice().sort((a,b)=>b.at-a.at),vs=ui.allVids?all:all.filter(v=>!isOldVid(t,v));
  return `<h1 class="h-display" style="margin-top:6px">הסרטונים שלי</h1>
  <div class="card hero" style="margin-top:14px"><div class="small">צלמו סט אחד של תרגיל מהתוכנית ושלחו ליקיר. הוא יחזיר ציון והערות לשיפור.</div><button class="btn btn-primary btn-block" style="margin-top:12px" data-act="vidUp">${mini(I.vid,18)} סרטון חדש ליקיר</button></div>
  <div class="h-sec"><span>נשלחו · ${all.length}</span></div>
  <div class="stack">${vs.length?vs.map(v=>{const f=t.fb[v.id];return `<div class="card"><div class="row"><div class="grow" style="min-width:0"><b>${esc(v.ex)}</b><div class="small muted">${fmt(v.d)}</div></div>${f?`<span class="chip good num">${f.score?f.score+'/10':'נבדק'}</span>`:'<span class="chip warn">ממתין לציון</span>'}<button class="icon-btn sm vid" data-act="vidPlay" data-id="${v.id}" aria-label="צפייה בסרטון">${I.play}</button>${f?'':`<button class="icon-btn sm" data-act="vidDel" data-id="${v.id}" aria-label="מחיקת הסרטון">${I.trash}</button>`}</div>${v.note?`<div class="small muted" style="margin-top:6px">״${esc(v.note)}״</div>`:''}${f?`<div style="margin-top:10px">${fbHTML(f)}</div>`:''}</div>`}).join(''):'<div class="empty"><b>עוד לא נשלחו סרטונים</b>אפשר גם ללחוץ על המצלמה ליד כל תרגיל במסך האימון.</div>'}</div>${hiddenVidsNote(all.filter(v=>isOldVid(t,v)).length)}
  ${ckTraineeBlock(t)}`;
}
function uploadVideo(file,onProg){
  const c=PUB().cld;
  return new Promise((res,rej)=>{const x=new XMLHttpRequest();x.open('POST','https://api.cloudinary.com/v1_1/'+encodeURIComponent(c.cloud)+'/video/upload');
    x.upload.onprogress=e=>{if(e.lengthComputable)onProg(e.loaded/e.total)};
    x.onload=()=>{try{const r=JSON.parse(x.responseText);r.secure_url?res(r.secure_url):rej(new Error((r.error&&r.error.message)||'upload'))}catch(e){rej(e)}};
    x.onerror=()=>rej(new Error('net'));
    const f=new FormData();f.append('file',file);f.append('upload_preset',c.preset);f.append('folder','yakirfit/'+(user?user.uid:'x'));x.send(f)});
}
function vidSheet(t,ex){
  const cld=cldOn(), exs=[...new Set(t.plan.flatMap(d=>d.ex.map(e=>e.name)))];
  if(!ex&&!exs.length){toast('עוד אין תרגילים בתוכנית');return}
  sheet('סרטון ליקיר',`${ex?`<p style="margin-top:0;font-weight:700">${esc(ex)}</p><input type="hidden" name="v-ex" value="${esc(ex)}">`:`<div class="field"><label for="v-ex">איזה תרגיל?</label><select id="v-ex" name="v-ex">${exs.map(n=>`<option>${esc(n)}</option>`).join('')}</select></div>`}
    ${cld?`<div class="field"><label for="v-file">צילום או בחירת סרטון</label><input type="file" id="v-file" name="v-file" accept="video/*"><span class="small muted">עד 100MB. סט אחד מספיק.</span></div><div class="upbar" id="v-prog" hidden><i></i></div><div class="or"><span>או קישור</span></div>`:''}
    ${fld('v-link',cld?'קישור לסרטון (לא חובה)':'קישור לסרטון','type="url" dir="ltr" inputmode="url" placeholder="https://"')}
    ${cld?'':'<p class="small muted" style="margin-top:-6px">מעלים את הסרטון ליוטיוב כ״לא רשום״ (Unlisted), או לגוגל דרייב עם שיתוף ״כל מי שיש לו את הקישור״, ומדביקים כאן את הקישור.</p>'}
    <div class="field"><label for="v-note">הערה ליקיר (לא חובה)</label><textarea id="v-note" name="v-note" maxlength="300" placeholder="למשל: הרגשתי לחץ בברך בסט האחרון"></textarea></div>`,fd=>{
    const exn=fd['v-ex'], file=fd['v-file']&&fd['v-file'].size?fd['v-file']:null, note=(fd['v-note']||'').trim();
    let link=(fd['v-link']||'').trim();if(link&&!/^https?:\/\//i.test(link))link='https://'+link;
    if(!file&&!link){toast(cld?'בחרו סרטון או הדביקו קישור':'הדביקו קישור לסרטון');return false}
    if(link){try{new URL(link)}catch(x){toast('הקישור לא תקין');return false}}
    const add=(url,kind)=>{const me=T(t.id);me.vids=me.vids.concat([{id:uid(),ex:exn,url,kind,d:today(),at:Date.now(),note}]);save(me,'vids');toast('הסרטון נשלח ליקיר 💪');
      const ph=PUB().phone;waNext('הסרטון נשלח ✅','יקיר יראה אותו באפליקציה. רוצה לעדכן אותו גם בוואטסאפ?',ph,`היי יקיר, שלחתי לך סרטון של ${exn} באפליקציה. אשמח לציון והערות 🙏 ${cleanName(t.name)}`,'עדכון ליקיר בוואטסאפ')};
    if(!file){add(link,'link');return}
    if(file.size>100*1024*1024){toast('הסרטון גדול מדי (עד 100MB). נסו סרטון קצר יותר');return false}
    const btn=$('#sheetForm button[type=submit]'),bar=$('#v-prog');btn.disabled=true;btn.textContent='מעלה…';bar.hidden=false;
    uploadVideo(file,f=>{const i=bar.querySelector('i');if(i)i.style.width=Math.round(f*100)+'%';btn.textContent='מעלה… '+Math.round(f*100)+'%'})
      .then(url=>{closeSheet();add(url,'cld')})
      .catch(e=>{console.error(e);btn.disabled=false;btn.textContent='שליחה ליקיר';bar.hidden=true;toast('ההעלאה נכשלה. בדקו חיבור ונסו שוב')});
    return false;
  },'שליחה ליקיר');
}
function reviewSheet(t,v){
  const f=t.fb[v.id]||{};
  sheet('ציון · '+esc(v.ex),`<div class="small muted" style="margin:-6px 0 10px">${esc(t.name)} · ${fmt(v.d)}</div>${vidPlayer(v)}${v.note?`<div class="small" style="margin-top:10px">״${esc(v.note)}״</div>`:''}
    <div class="field" style="margin-top:14px"><label>ציון</label><div class="score-pick">${[...Array(10)].map((_,i)=>`<label class="sc"><input type="radio" name="fb-score" value="${i+1}" ${f.score===i+1?'checked':''}><span class="num">${i+1}</span></label>`).join('')}</div></div>
    <div class="field"><label for="fb-text">הערות לשיפור</label><textarea id="fb-text" name="fb-text" maxlength="800" placeholder="למשל: לשמור על גב ישר בירידה, לרדת עוד קצת בעומק">${esc(f.text||'')}</textarea></div>`,fd=>{
    const sc=+fd['fb-score']||0,tx=(fd['fb-text']||'').trim();if(!sc&&!tx){toast('תנו ציון או כתבו הערה');return false}
    t.fb[v.id]={score:sc,text:tx,at:Date.now(),d:today()};save(t,'fb');toast('הציון נשלח');
    waNext('הציון נשלח ✅',`רוצה לעדכן את ${esc(firstName(t))} בוואטסאפ?`,t.phone,`היי ${firstName(t)}, צפיתי בסרטון של ${v.ex}${sc?' ונתתי ציון '+sc+'/10':''}. כל ההערות מחכות לך באפליקציה 💪 יקיר`,'שליחת עדכון בוואטסאפ');
  },'שליחת ציון');
}
/* =========================================================
   LIVE WORKOUT — אימון בזמן אמת: שורה לכל סט (קודם / ק״ג / חזרות / ✓), הערות לתרגיל ולסט.
   נשמר ב-members.live; בסיום עובר ל-members.wos (60 אחרונים) והסטים שסומנו ✓ נכנסים ל-logs עם wo=id.
   הערות: note = של המתאמן, cnote = של יקיר (מוצגת "יקיר: ...")
   ========================================================= */
const awT=()=>isCoach?T(ui.awFor):(user?T(user.uid):null);
const nNum=x=>{const m=String(x??'').match(/\d+(\.\d+)?/);return m?+m[0]:''};
const clock=st=>{const s=Math.max(0,Math.floor((Date.now()-st)/1000)),h=Math.floor(s/3600),m=Math.floor(s%3600/60);return (h?h+':'+pad(m):m)+':'+pad(s%60)};
const durTxt=min=>min<60?`${min} דק׳`:`${Math.floor(min/60)}:${pad(min%60)} שע׳`;
function prevSets(t,name){
  const w=t.wos.slice().reverse().find(w=>w.ex.some(e=>e.name===name&&e.sets.some(x=>!x.warm)));
  if(w)return w.ex.find(e=>e.name===name).sets.filter(x=>!x.warm);
  const l=lastLog(t,name);return l?[...Array(+l.sets||1)].map(()=>({kg:l.kg,reps:l.reps})):[];
}
function exEntry(t,name,e){
  const pv=prevSets(t,name),n=e?(+e.sets||3):Math.max(3,pv.length);
  const kg=hasKg(e)?adjKg(t,+e.kg):'',reps=e?nNum(e.reps):'';
  return {id:uid(),name,ss:!!(e&&e.ss),sets:[...Array(n)].map((_,i)=>({kg:kg!==''?kg:(pv[i]?pv[i].kg:''),reps:reps!==''?reps:(pv[i]?pv[i].reps:''),done:false}))};
}
function newLive(t,day){return {id:uid(),dayId:day?day.id:'',title:day?day.title:'אימון חופשי',start:Date.now(),by:isCoach?'coach':'me',extra:[],ex:(day?day.ex:[]).map(e=>exEntry(t,e.name,e))}}
function saveLive(t,rr=true){DB.members[t.id]=Object.assign({},DB.members[t.id]||{},{live:clone(t.live)});api.set('members',t.id,{live:t.live});if(rr)render()}
const liveLogs=L=>L.ex.flatMap(e=>e.sets.filter(s=>s.done&&!s.warm).map(s=>({ex:e.name,kg:+s.kg||0,reps:+s.reps||0,sets:1})));
function awBanner(t){
  if(!t.live)return '';
  return `<button class="banner aw-banner" data-act="awOpen" style="width:100%;text-align:start;cursor:pointer">${I.timer}<div class="grow small"><b>אימון בתהליך</b> · ${esc(t.live.title)} · <span class="num" data-clock="${t.live.start}">${clock(t.live.start)}</span></div><span class="btn btn-primary btn-sm">המשך</span></button>`;
}
function awView(t){
  const L=t.live,done=L.ex.reduce((a,e)=>a+e.sets.filter(s=>s.done).length,0),tot=L.ex.reduce((a,e)=>a+e.sets.length,0),m=musFrom(t,liveLogs(L),L.extra);
  return `<div class="aw-top"><button class="icon-btn" data-act="awHide" aria-label="מזעור האימון">${I.down}</button><div class="grow" style="min-width:0"><div class="small muted" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(L.title)}${isCoach?' · '+esc(cleanName(t.name)):''}</div><b class="aw-clock num" data-clock="${L.start}">${clock(L.start)}</b></div><button class="icon-btn" data-act="timer" aria-label="טיימר מנוחה">${I.timer}</button><button class="btn btn-primary btn-sm" data-act="awFinish">סיום</button></div>
  <div class="aw-prog" role="progressbar" aria-label="סטים שהושלמו" aria-valuenow="${done}" aria-valuemax="${tot}"><i style="width:${tot?done/tot*100:0}%"></i></div>
  <div class="small muted num" style="margin-top:8px">${done} מתוך ${tot} סטים · נפח ${kgf(m.vol)} ק״ג</div>
  <div class="stack" style="margin-top:12px;gap:14px">${L.ex.map((e,ei)=>awEx(t,e,ei)).join('')||'<div class="empty">אין עדיין תרגילים באימון.</div>'}</div>
  <button class="btn btn-ghost btn-block" style="margin-top:14px" data-act="awAddEx">${mini(I.plus)} הוספת תרגיל</button>
  <div class="card" style="margin-top:14px"><b>מפת השרירים של האימון</b>
    ${m.mus.length?bodyMap(Object.fromEntries(m.mus)):'<div class="small muted" style="margin-top:6px">סמנו ✓ על סטים והמפה תתמלא.</div>'}
    ${isCoach?`<div class="small muted" style="margin:10px 0 6px">יקיר: שרירים נוספים שעבדנו עליהם (חימום, בטן, מתיחות…)</div><div class="mus-pick">${MUS.map(([k,n])=>`<button type="button" class="mchip ${L.extra.includes(k)?'p':''}" data-act="awMus" data-v="${k}">${n}</button>`).join('')}</div>`:(L.extra.length?`<div class="small muted" style="margin-top:8px">יקיר הוסיף: ${L.extra.map(k=>MUSN[k]).join(', ')}</div>`:'')}
  </div>
  <button class="btn btn-primary btn-block" style="margin-top:18px" data-act="awFinish">סיום אימון</button>
  <button class="linkish" style="display:block;margin:16px auto 0" data-act="awDiscard">ביטול האימון</button>`;
}
/* 1. המלצה להעלאת משקל: כל הסטים הושלמו בחזרות היעד (בלי כשל) → עולים 1 / 2.5 / 5 ק״ג */
const LOWER=['quads','glutes','hams','calves','adductors','glutemed'];
function suggest(t,name){
  const pe=planEx(t,name),nums=pe?(String(pe.reps||'').match(/\d+/g)||[]).map(Number):[],top=nums.length?Math.max(...nums):0;if(!top)return null;
  const w=t.wos.slice().reverse().find(x=>x.ex.some(e=>e.name===name&&e.sets.some(y=>!y.warm)));if(!w)return null;
  const sets=w.ex.find(e=>e.name===name).sets.filter(y=>!y.warm),need=+pe.sets||sets.length,kg=Math.max(0,...sets.map(y=>+y.kg||0));
  if(!kg||sets.length<need||!sets.every(y=>+y.reps>=top&&!y.fail))return null;
  const inc=exMus(t,name).p.some(k=>LOWER.includes(k))&&kg>=40?5:kg>=20?2.5:1;
  return {kg:kg+inc,from:kg};
}
const setLabel=(e,si)=>e.sets[si].warm?'חימום':'סט '+e.sets.slice(0,si+1).filter(x=>!x.warm).length;
/* שדות לסט: הערה של מי שכותב (יקיר=cnote, מתאמן=note), כשל, רמת מאמץ */
function setFieldsHTML(t,o){
  const k=isCoach?'cnote':'note',other=isCoach?o.note:o.cnote;
  return `${other?`<div class="aw-note ${isCoach?'':'coach'}" style="margin-bottom:10px"><b>${isCoach?esc(firstName(t)):'יקיר'}:</b> ${esc(other)}</div>`:''}
    <div class="field"><label for="aw-n">${isCoach?'ההערה של יקיר':'ההערה שלי'}</label><textarea id="aw-n" name="aw-n" maxlength="300" placeholder="למשל: כאב קל בכתף, הסט האחרון היה קשה">${esc(o[k]||'')}</textarea></div>
    <div class="field"><label>רמת מאמץ (RPE)</label><div class="score-pick" style="grid-template-columns:repeat(6,1fr)">${['',6,7,8,9,10].map(v=>`<label class="sc"><input type="radio" name="aw-rpe" value="${v}" ${String(o.rpe||'')===String(v)?'checked':''}><span class="num">${v||'—'}</span></label>`).join('')}</div><span class="small muted">10 = מקסימום · 9 = נשארה עוד חזרה · 8 = עוד 2 · 7 = עוד 3</span></div>
    <div class="item" style="margin-bottom:12px"><label for="aw-f" class="grow"><b>הגעתי לכשל</b><div class="small muted">לא הצלחתי לבצע עוד חזרה</div></label><label class="switch"><input type="checkbox" id="aw-f" name="aw-f" ${o.fail?'checked':''}><span></span></label></div>`;
}
function applySetFields(o,fd){o[isCoach?'cnote':'note']=(fd['aw-n']||'').trim();o.fail=!!fd['aw-f'];o.rpe=+fd['aw-rpe']||0}
function awEx(t,e,ei){
  const pe=planEx(t,e.name),pv=prevSets(t,e.name),my=t.exNotes[e.name],sg=suggest(t,e.name),pr=t.live.ex[ei-1];let wi=0;
  return `<div class="aw-ex ${e.ss&&pr?'ss':''}">
    ${e.ss&&pr?`<div class="ss-tag">${mini(I.swap,13)} סופר-סט עם ${esc(pr.name)} · בלי מנוחה ביניהם</div>`:''}
    <div class="row"><span class="ex-n num">${ei+1}</span><b class="grow aw-name">${esc(e.name)}</b>${pe&&pe.video&&/^https?:\/\//i.test(pe.video)?`<a class="icon-btn sm vid" data-act="video" data-v="${esc(pe.video)}" data-n="${esc(e.name)}" href="${esc(pe.video)}" target="_blank" rel="noopener" aria-label="סרטון הדגמה">${I.play}</a>`:''}<button class="icon-btn sm" data-act="awExNote" data-v="${ei}" aria-label="הערה לתרגיל ${esc(e.name)}">${I.note}</button><button class="icon-btn sm" data-act="awExMenu" data-v="${ei}" aria-label="אפשרויות לתרגיל: חימום, סט, הסרה">${I.dots}</button></div>
    ${pe&&pe.note?`<div class="aw-note coach"><b>יקיר:</b> ${esc(pe.note)}</div>`:''}${my?`<div class="aw-note"><b>${isCoach?esc(firstName(t))+' (קבוע)':'ההערה הקבועה שלי'}:</b> ${esc(my)}</div>`:''}${notesHTML(t,e)}
    ${sg&&e.sets.some(x=>!x.done&&!x.warm&&+x.kg<sg.kg)?`<div class="aw-sug"><span class="grow">💡 בפעם הקודמת השלמת את כל הסטים ב-${kgf(sg.from)} ק״ג. הגיע הזמן ל-<b>${kgf(sg.kg)} ק״ג</b></span><button class="btn btn-primary btn-sm" data-act="awSug" data-v="${ei}">החלה</button></div>`:''}
    <div class="aw-grid aw-head"><span>סט</span><span>קודם</span><span>ק״ג</span><span>חזרות</span><span>${mini(I.check,14)}</span></div>
    ${e.sets.map((x,si)=>{const n=x.warm?'ח':String(++wi),pp=x.warm?null:pv[wi-1];return `<div class="aw-grid aw-set ${x.done?'done':''} ${x.warm?'warm':''}">
      <button class="aw-sn num" data-act="awSet" data-id="${ei}|${si}" aria-label="${x.warm?'סט חימום':'סט '+n}: הערה, כשל ורמת מאמץ">${n}${x.note||x.cnote?'<i></i>':''}</button>
      <span class="aw-prev num" dir="ltr">${pp?kgf(pp.kg)+'×'+pp.reps:'—'}</span>
      <input class="num" type="number" inputmode="decimal" step="0.25" min="0" value="${x.kg??''}" placeholder="${pp?pp.kg:'0'}" data-act="awIn" data-id="${ei}|${si}|kg" aria-label="ק״ג ב${x.warm?'חימום':'סט '+n}">
      <input class="num" type="number" inputmode="numeric" min="0" value="${x.reps??''}" placeholder="${pp?pp.reps:''}" data-act="awIn" data-id="${ei}|${si}|reps" aria-label="חזרות ב${x.warm?'חימום':'סט '+n}">
      <button class="aw-chk" data-act="awDone" data-id="${ei}|${si}" aria-pressed="${!!x.done}" aria-label="סיימתי את ${x.warm?'סט החימום':'סט '+n}">${I.check}</button>
    </div>${x.note||x.cnote||x.fail||x.rpe?`<div class="aw-setnote"><div class="row" style="gap:6px">${x.fail?'<span class="chip bad">כשל</span>':''}${x.rpe?`<span class="chip">RPE ${x.rpe}</span>`:''}</div>${notesHTML(t,x)}</div>`:''}`}).join('')}
    ${ei===0?'<div class="aw-hint">לחיצה על מספר הסט: הערה, כשל ורמת מאמץ (RPE)</div>':''}
    <button class="btn btn-ghost btn-sm btn-block" style="margin-top:8px" data-act="awAddSet" data-v="${ei}">${mini(I.plus,14)} הוספת סט</button>
  </div>`;
}
function awNoteSheet(t,ei,si){
  const e=t.live.ex[ei];if(!e)return;
  if(si!=null){const o=e.sets[si];if(!o)return;
    return sheet(`${setLabel(e,si)} · ${esc(e.name)}`,setFieldsHTML(t,o)+`<button type="button" class="btn btn-danger btn-sm" style="margin-bottom:14px" data-act="awDelSet" data-id="${ei}|${si}">מחיקת הסט</button>`,fd=>{
      const me=awT();if(!me||!me.live)return;const tg=me.live.ex[ei]&&me.live.ex[ei].sets[si];if(!tg)return;applySetFields(tg,fd);saveLive(me)},'שמירה')}
  const k=isCoach?'cnote':'note',other=isCoach?e.note:e.cnote;
  sheet('הערה · '+esc(e.name),`${other?`<div class="aw-note ${isCoach?'':'coach'}" style="margin-bottom:10px"><b>${isCoach?esc(firstName(t)):'יקיר'}:</b> ${esc(other)}</div>`:''}
    <div class="field"><label for="aw-n">${isCoach?'ההערה של יקיר':'ההערה שלי'}</label><textarea id="aw-n" name="aw-n" maxlength="300" placeholder="למשל: להוריד משקל בסט האחרון">${esc(e[k]||'')}</textarea></div>`,fd=>{
    const me=awT();if(!me||!me.live)return;const ex=me.live.ex[ei];if(!ex)return;ex[k]=(fd['aw-n']||'').trim();saveLive(me)},'שמירה');
}
function finishWorkout(t){
  const L=clone(t.live),end=Date.now(),d=iso(new Date(L.start));
  L.ex=L.ex.map(e=>Object.assign({},e,{sets:e.sets.filter(x=>x.done)})).filter(e=>e.sets.length);
  const w={id:L.id,d,title:L.title,dayId:L.dayId,start:L.start,end,ex:L.ex,extra:L.extra||[],by:L.by};
  t.wos=t.wos.filter(x=>x.id!==w.id).concat([w]).slice(-60);
  t.logs=t.logs.filter(l=>l.wo!==w.id).concat(w.ex.flatMap(e=>e.sets.filter(x=>!x.warm).map(x=>Object.assign({d,ex:e.name,kg:+x.kg||0,reps:+x.reps||0,sets:1,wo:w.id},x.fail?{fail:true,failNote:x.note||x.cnote||''}:{},x.rpe?{rpe:x.rpe}:{}))));
  t.live=null;ui.aw=false;ui.sum={tid:t.id,key:w.id};window.scrollTo(0,0);
  save(t,'wos','logs','live');
}
/* ---------- סיכום אחרי אימון + תמונות לשיתוף (1080×1920, סטורי) עם הלוגו של יקיר ---------- */
function sumData(t,key){
  const wo=t.wos.find(x=>x.id===key),d=wo?wo.d:key,all=workouts(t),w=all.find(x=>x.d===d);if(!w)return null;
  const dates=all.map(x=>x.d),set=new Set(dates),last7=[...Array(7)].map((_,i)=>addDays(d,i-6));
  return {key,d,wo,w,n:dates.indexOf(d)+1,vol:w.vol,sets:w.logs.reduce((a,l)=>a+logSets(t,l),0),mus:w.mus,like:heavyLike(w.vol),
    dur:wo&&wo.end&&wo.start?Math.max(1,Math.round((wo.end-wo.start)/60000)):0,title:wo?wo.title:'',
    month:dates.filter(x=>x.slice(0,7)===d.slice(0,7)),last7,week:last7.map(x=>set.has(x)),recs:records(t).filter(r=>r.d===d).length,
    who:cleanName(t.name),exs:[...new Set(w.logs.map(l=>l.ex))]};
}
function sumText(t,sd){
  const lines=sd.exs.map(n=>{const ls=sd.w.logs.filter(l=>l.ex===n);return `• ${n}: ${ls.map(l=>(+l.sets>1?l.sets+'×':'')+l.reps+(+l.kg?'×'+kgf(l.kg):'')).join(', ')}`});
  return `💪 ${sd.title||'אימון'} · ${fmt(sd.d)}\n${sd.dur?'⏱ '+durTxt(sd.dur)+' · ':''}🏋️ ${kgf(sd.vol)} ק״ג · ${sd.sets} סטים\n${lines.join('\n')}${sd.like?'\n'+sd.like.emo+' '+sd.like.text:''}\n\nYakir Levi · אימון אישי`;
}
const shareCache={};let sumState=null;
const svgImg=svg=>new Promise(r=>{const im=new Image();im.onload=()=>r(im);im.onerror=()=>r(null);im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg)});
async function buildShareCards(t,sd){
  const key=sd.key+'|'+sd.vol+'|'+sd.n+'|'+sd.sets+'|'+sd.mus.map(x=>x.join(':')).join(',');if(shareCache[key])return shareCache[key];
  try{await Promise.all(['800 40px Rubik','700 40px Rubik','600 40px Rubik','500 40px Rubik','400 40px Heebo'].map(f=>document.fonts.load(f)))}catch(e){}
  const [logo,body]=await Promise.all([loadImg('logo-dark.png'),svgImg(bodyMap(Object.fromEntries(sd.mus),true))]);
  const W=1080,H=1920,A='#ff6b2c',INK='#121212',FG='#f5f5f4',MU='#9a9aa0',F=(w,px)=>`${w} ${px}px Rubik,Heebo,Arial,sans-serif`;
  const rr=(g,x,y,w,h,r)=>{g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath()};
  const mk=draw=>{const c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d');
    g.fillStyle='#0a0a0b';g.fillRect(0,0,W,H);
    const gr=g.createRadialGradient(W/2,620,0,W/2,620,980);gr.addColorStop(0,'rgba(255,107,44,.26)');gr.addColorStop(1,'rgba(255,107,44,0)');g.fillStyle=gr;g.fillRect(0,0,W,H);
    const T=(s,x,y,f,col)=>{g.font=f;g.fillStyle=col;g.textAlign='center';g.direction='rtl';g.fillText(s,x,y)};
    T(sd.who,W/2,150,F(600,42),FG);T(fmt(sd.d),W/2,206,F(400,34),MU);
    draw(g,T);
    if(logo){const lw=440,lh=lw*logo.height/logo.width;g.drawImage(logo,(W-lw)/2,H-lh-90,lw,lh)}else T('YAKIR LEVI',W/2,H-150,F(800,64),FG);
    return c};
  const cards=[
    mk((g,T)=>{T('כל הכבוד!',W/2,390,F(800,104),FG);T(`זה האימון ה-${sd.n}${sd.title?' · '+sd.title:''}`,W/2,462,F(500,40),MU);
      const rows=[sd.dur?[durTxt(sd.dur),'משך האימון',FG]:null,[kgf(sd.vol)+' ק״ג','נפח',A],[String(sd.sets),'סטים',FG],sd.recs?[String(sd.recs),sd.recs===1?'שיא חדש':'שיאים חדשים',FG]:null].filter(Boolean);
      const top=560,h=rows.length*230+80;rr(g,100,top,880,h,60);g.fillStyle='#151517';g.fill();
      rows.forEach(([v,l,c],i)=>{const y=top+80+i*230+110;T(v,W/2,y,F(800,108),c);T(l,W/2,y+60,F(500,40),MU)});
      if(sd.like){const s=sd.like.emo+'  '+sd.like.text;g.font=F(600,46);const w2=g.measureText(s).width+100,y=top+h+60;rr(g,(W-w2)/2,y,w2,100,50);g.fillStyle=A;g.fill();T(s,W/2,y+66,F(600,46),INK)}}),
    mk((g,T)=>{const [yy,mm]=sd.d.split('-').map(Number),first=new Date(yy,mm-1,1).getDay(),days=new Date(yy,mm,0).getDate(),done=new Set(sd.month),cnt=sd.month.length;
      T(`${cnt} ${cnt===1?'אימון':'אימונים'}`,W/2,420,F(800,120),FG);T('ב'+ymName(sd.d.slice(0,7),{month:'long'}),W/2,500,F(500,50),MU);
      const rows=Math.ceil((first+days)/7);rr(g,70,580,940,200+rows*128,60);g.fillStyle='#151517';g.fill();
      const cx=col=>W/2+(3-col)*126;DS.forEach((l,i)=>T(l,cx(i),700,F(600,40),MU));
      for(let k=1;k<=days;k++){const p=first+k-1,col=p%7,row=Math.floor(p/7),x=cx(col),y=790+row*128,ds=sd.d.slice(0,8)+pad(k),on=done.has(ds);
        g.beginPath();g.arc(x,y,52,0,Math.PI*2);g.fillStyle=on?A:'#202024';g.fill();
        if(ds===sd.d){g.lineWidth=6;g.strokeStyle=FG;g.stroke()}
        T(String(k),x,y+15,F(on?700:500,42),on?INK:'#c9c9cd')}}),
    mk((g,T)=>{T('השרירים שעבדו',W/2,330,F(800,84),FG);
      if(body)g.drawImage(body,140,390,800,838);
      T(sd.mus.slice(0,3).map(([k,p])=>`${MUSN[k]} ${p}%`).join('  ·  '),W/2,1300,F(600,42),A);
      const cx=i=>W/2+(3-i)*128;sd.last7.forEach((d,i)=>{const x=cx(i),y=1470,on=sd.week[i];T(DS[parse(d).getDay()],x,1395,F(600,38),MU);
        g.beginPath();g.arc(x,y,50,0,Math.PI*2);g.fillStyle=on?A:'#202024';g.fill();
        if(on){g.strokeStyle=INK;g.lineWidth=10;g.lineCap='round';g.lineJoin='round';g.beginPath();g.moveTo(x-20,y);g.lineTo(x-6,y+15);g.lineTo(x+22,y-16);g.stroke()}});
      const c7=sd.week.filter(Boolean).length;T(`${c7} ${c7===1?'אימון':'אימונים'} ב-7 הימים האחרונים`,W/2,1600,F(500,46),FG)})
  ];
  const files=await Promise.all(cards.map((c,i)=>new Promise(r=>c.toBlob(b=>r(b?new File([b],`yakir-levi-workout-${i+1}.jpg`,{type:'image/jpeg'}):null),'image/jpeg',.92))));
  return shareCache[key]={imgs:cards.map(c=>c.toDataURL('image/jpeg',.85)),files};
}
function summaryView(t,sd){
  const act=(a,ic,l)=>`<button class="sum-act" data-act="${a}"><span>${ic}</span>${l}</button>`;
  return `<div class="sum">
    <h1 class="h-display" style="text-align:center;margin-top:18px">כל הכבוד! 🎉</h1>
    <p class="muted" style="text-align:center;margin:6px 0 16px">זה האימון ה-${sd.n} ${isCoach?'של '+esc(firstName(t)):'שלך'}${sd.recs?` · ${mini(I.medal,14)} ${sd.recs} ${sd.recs===1?'שיא חדש':'שיאים חדשים'}`:''}</p>
    <div class="sum-cards" id="sumCards">${[0,1,2].map(i=>`<div class="sum-card"><div class="sum-ph">מכין את התמונה…</div></div>`).join('')}</div>
    <div class="sum-dots" id="sumDots">${[0,1,2].map(i=>`<i class="${i?'':'on'}"></i>`).join('')}</div>
    <div class="small muted" style="text-align:center;margin-top:14px">שיתוף לאינסטגרם, לוואטסאפ או לכל מקום. הלוגו של יקיר כבר בתמונה.</div>
    <div class="sum-acts">${act('sumShare',I.share,'שיתוף')}${act('sumSave',I.download,'שמירה')}${act('sumText',I.copy,'העתקת טקסט')}</div>
    <button class="btn btn-primary btn-block" style="margin-top:18px" data-act="sumDone">סיום</button>
  </div>`;
}
const sumIdx=()=>{const sc=$('#sumCards');return sc?Math.max(0,Math.min(2,Math.round(Math.abs(sc.scrollLeft)/(sc.clientWidth+12)))):0};
function renderSummary(t){
  const sd=sumData(t,ui.sum.key);if(!sd){ui.sum=null;render();return}
  $('#top').hidden=true;$('#tabs').innerHTML='';$('#app').innerHTML=summaryView(t,sd);sumState={t:t.id,sd,cards:null};
  const sc=$('#sumCards');sc.addEventListener('scroll',()=>{const i=sumIdx();document.querySelectorAll('#sumDots i').forEach((d,k)=>d.classList.toggle('on',k===i))},{passive:true});
  buildShareCards(t,sd).then(r=>{if(!sumState||sumState.sd!==sd)return;sumState.cards=r;const box=$('#sumCards');if(!box)return;
    [...box.children].forEach((c,i)=>{c.innerHTML=`<img src="${r.imgs[i]}" alt="כרטיס סיכום ${i+1} מתוך 3">`})}).catch(e=>console.error(e));
}
function renderLive(t){$('#top').hidden=true;$('#tabs').innerHTML='';$('#app').innerHTML=awView(t)}
function saveFile(f){const a=document.createElement('a');a.href=URL.createObjectURL(f);a.download=f.name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1500)}
setInterval(()=>{document.querySelectorAll('[data-clock]').forEach(n=>{n.textContent=clock(+n.dataset.clock)})},1000);
/* =========================================================
   4. TEMPLATES — תבניות תוכניות של יקיר (coach/settings.templates)
   ========================================================= */
const TPLS=()=>((DB.coach.settings||{}).templates)||[];
function tplMenu(t){
  const ts=TPLS();
  sheet('תבניות',`<p class="small muted" style="margin-top:0">שומרים תוכנית כתבנית, וטוענים אותה בלחיצה לכל מתאמן, לקוח או לעצמך.</p>
    <button type="button" class="btn btn-primary btn-block" data-act="tplSave" ${t.plan.some(d=>d.ex.length)?'':'disabled'}>${mini(I.copy,16)} שמירת התוכנית הזו כתבנית</button>
    <div class="h-sec" style="margin-top:20px"><span>טעינת תבנית</span></div>
    <div class="stack">${ts.length?ts.map(x=>`<div class="item"><span class="grow" style="min-width:0"><b>${esc(x.name)}</b><div class="small muted">${x.plan.length} ימים · ${x.plan.reduce((a,d)=>a+d.ex.length,0)} תרגילים</div></span><button type="button" class="btn btn-ghost btn-sm" data-act="tplApply" data-v="${x.id}|add">הוספה</button><button type="button" class="btn btn-primary btn-sm" data-act="tplApply" data-v="${x.id}|replace">החלפה</button></div>`).join(''):'<div class="empty">עוד אין תבניות.</div>'}</div>`,()=>{},'סגירה');
}
function tplBlock(){
  const ts=TPLS();
  return `<div class="h-sec"><span>התבניות שלי · ${ts.length}</span></div>
  <div class="stack">${ts.length?ts.map(x=>`<div class="item"><span class="grow" style="min-width:0"><b>${esc(x.name)}</b><div class="small muted">${x.plan.length} ימים · ${x.plan.reduce((a,d)=>a+d.ex.length,0)} תרגילים${x.at?' · '+fmtShort(x.at):''}</div></span><button class="icon-btn sm" data-act="tplDel" data-v="${x.id}" aria-label="מחיקת התבנית">${I.trash}</button></div>`).join(''):'<div class="empty">בתוכנית של כל מתאמן יש כפתור ״תבניות״: שם שומרים תוכנית כתבנית ומשתמשים בה שוב.</div>'}</div>`;
}
/* =========================================================
   5. WEEKLY CHECK-IN — מתאמני אונליין: members.checkins, תגובת יקיר ב-coach.ckfb
   ========================================================= */
const ckWk=()=>weekStart(today());
const ckDue=t=>billOf(t)==='online'&&!t.checkins.some(c=>c.wk===ckWk());
function ckHTML(t,c,reply){
  const f=t.ckfb[c.wk];
  return `<div class="card ck"><div class="row"><b class="grow">שבוע ${fmtShort(c.wk)}</b><span class="small muted">נשלח ${fmtShort(c.d)}</span></div>
    <div class="ck-rates">${[['sleep','שינה'],['energy','אנרגיה'],['food','תזונה']].map(([k,l])=>`<div class="ck-r"><span>${l}</span><b class="num">${c[k]||'—'}<i>/5</i></b></div>`).join('')}${c.kg?`<div class="ck-r"><span>משקל</span><b class="num">${c.kg}</b></div>`:''}</div>
    ${c.note?`<div class="small" style="margin-top:10px">״${esc(c.note)}״</div>`:''}
    ${f?`<div class="aw-note coach" style="margin-top:10px"><b>יקיר:</b> ${esc(f.text)}</div>`:''}
    ${reply?`<button class="btn ${f?'btn-ghost':'btn-primary'} btn-sm" style="margin-top:10px" data-act="ckReply" data-id="${t.id}|${c.wk}">${f?'עריכת התגובה':'תגובה'}</button>`:''}</div>`;
}
function ckSheet(t){
  const wk=ckWk(),c=t.checkins.find(x=>x.wk===wk)||{};
  const rate=(k,l)=>`<div class="field"><label>${l}</label><div class="score-pick">${[1,2,3,4,5].map(v=>`<label class="sc"><input type="radio" name="ck-${k}" value="${v}" ${+c[k]===v?'checked':''}><span class="num">${v}</span></label>`).join('')}</div></div>`;
  sheet('צ׳ק-אין שבועי',`<p class="muted small" style="margin-top:0">דקה אחת, ויקיר יודע איך עבר עליך השבוע. 1 = גרוע · 5 = מצוין</p>${rate('sleep','שינה')}${rate('energy','אנרגיה')}${rate('food','תזונה')}${fld('ck-kg','משקל (ק״ג, לא חובה)','type="number" step="0.1" min="0" inputmode="decimal"',c.kg||'')}<div class="field"><label for="ck-note">איך היה השבוע?</label><textarea id="ck-note" name="ck-note" maxlength="500" placeholder="אימונים, קשיים, הצלחות…">${esc(c.note||'')}</textarea></div>`,fd=>{
    const me=T(t.id),e={wk,d:today(),sleep:+fd['ck-sleep']||0,energy:+fd['ck-energy']||0,food:+fd['ck-food']||0,kg:+fd['ck-kg']||0,note:(fd['ck-note']||'').trim()};
    if(!e.sleep&&!e.energy&&!e.food&&!e.note){toast('מלאו לפחות דירוג אחד');return false}
    me.checkins=me.checkins.filter(x=>x.wk!==wk).concat([e]).slice(-30);const keys=['checkins'];
    if(e.kg){const old=me.body.find(x=>x.d===e.d)||{};me.body=me.body.filter(x=>x.d!==e.d).concat([Object.assign({},old,{d:e.d,kg:e.kg})]);keys.push('body')}
    save(me,...keys);toast('הצ׳ק-אין נשלח ליקיר');
  },'שליחה ליקיר');
}
function ckCoachBlock(){
  const os=tList().filter(t=>billOf(t)==='online'),wk=ckWk(),got=os.filter(t=>t.checkins.some(c=>c.wk===wk)),miss=os.filter(t=>!t.checkins.some(c=>c.wk===wk));
  if(!os.length)return '';
  return `<div class="h-sec"><span>צ׳ק-אינים השבוע · ${got.length}/${os.length}</span></div>
  <div class="stack">${got.sort((a,b)=>(!!a.ckfb[wk])-(!!b.ckfb[wk])).map(t=>`<div><div class="row small" style="margin-bottom:6px">${avatar(t,26)}<b>${esc(t.name)}</b></div>${ckHTML(t,t.checkins.find(c=>c.wk===wk),true)}</div>`).join('')}
  ${miss.length?`<div class="item"><span class="grow small muted">עוד לא שלחו: ${miss.map(t=>esc(firstName(t))).join(', ')}</span></div>`:''}</div>`;
}
function ckTraineeBlock(t,coach){
  const cs=t.checkins.slice().sort((a,b)=>b.wk.localeCompare(a.wk)).slice(0,4);
  return `<div class="h-sec"><span>${coach?'צ׳ק-אינים':'הצ׳ק-אינים שלי'}</span>${coach?'':`<button class="btn btn-ghost btn-sm" data-act="ckOpen">${ckDue(t)?'מילוי השבוע':'עריכת השבוע'}</button>`}</div>
  <div class="stack">${cs.length?cs.map(c=>ckHTML(t,c,coach)).join(''):`<div class="empty">${coach?'עוד לא נשלח צ׳ק-אין.':'פעם בשבוע ממלאים צ׳ק-אין קצר, ויקיר מגיב.'}</div>`}</div>`;
}
/* =========================================================
   6. DASHBOARD — "השבוע במבט" ליקיר
   ========================================================= */
function dashData(){
  const ts=tList(),td=today(),from=addDays(td,-6);
  const active=t=>workouts(t).some(w=>w.d>=from)||t.sessions.some(x=>x.st==='came'&&x.date>=from&&x.date<=td);
  return {from,
    idle:ts.filter(t=>(lastAct(t)||t.joinedAt||'')<=addDays(td,-10)&&!t.sessions.some(x=>x.date>=td&&x.st!=='late')).sort((a,b)=>(lastAct(a)||'').localeCompare(lastAct(b)||'')),
    prs:ts.flatMap(t=>records(t).filter(r=>r.d>=from).map(r=>({t,r}))),
    vids:ts.filter(t=>billOf(t)==='online').reduce((a,t)=>a+t.vids.filter(v=>!t.fb[v.id]).length,0),
    cks:ts.filter(t=>billOf(t)==='online').filter(t=>t.checkins.some(c=>c.wk===ckWk()&&!t.ckfb[c.wk])).length};
}
function dashBlock(){
  const d=dashData(),tile=(k,n,l,hot)=>`<button class="stat dash-t" data-act="dash" data-v="${k}"><b class="num" style="${hot&&n?'color:var(--accent2)':''}">${n}</b><span>${l}</span></button>`;
  return `<div class="h-sec"><span>השבוע במבט</span></div><div class="dash">${tile('idle',d.idle.length,'ממתינים לתשומת לב',1)}${tile('prs',d.prs.length,'שיאים השבוע')}${tile('vids',d.vids,'סרטונים לציון',1)}${tile('cks',d.cks,'צ׳ק-אינים חדשים',1)}</div>`;
}
function dashSheet(k){
  const d=dashData();
  if(k==='vids'||k==='cks'){ui.tab='online';ui.sel=null;window.scrollTo(0,0);render();return}
  if(k==='idle')return sheet('ממתינים לתשומת לב',`<p class="small muted" style="margin-top:0">לא התאמנו 10 ימים ואין להם אימון בהמשך.</p><div class="stack" style="gap:10px">${d.idle.length?d.idle.map(missRow).join(''):'<div class="empty">כולם מתאמנים 🎉</div>'}</div>`,()=>{},'סגירה');
  return sheet('שיאים השבוע',`<div class="stack">${d.prs.length?d.prs.map(({t,r})=>`<div class="item"><span class="medal-ic">${mini(I.medal,20)}</span><div class="grow" style="min-width:0"><b>${esc(t.name)}</b><div class="small muted">${r.type==='vol'?'שיא נפח באימון':esc(r.ex)} · ${fmtShort(r.d)}</div></div><b class="num">${kgf(r.val)} ק״ג</b>${t.phone?`<a class="icon-btn sm wa" href="${waLink(t.phone,`היי ${firstName(t)}, ראיתי את השיא החדש ${r.type==='vol'?'בנפח':'ב'+r.ex} (${kgf(r.val)} ק״ג)! כל הכבוד 🔥 יקיר`)}" target="_blank" rel="noopener" aria-label="ברכה בוואטסאפ">${I.wa}</a>`:''}</div>`).join(''):'<div class="empty">עוד אין שיאים השבוע.</div>'}</div>`,()=>{},'סגירה');
}
/* =========================================================
   8. CHALLENGES — אתגר בין מתאמנים. pub/main.ch, הצטרפות ב-members.chJoin.
   הטבלה (שם פרטי + כמות אימונים בלבד) מחושבת אצל יקיר ונשמרת ב-pub, כי מתאמן לא יכול לקרוא נתונים של אחרים.
   ========================================================= */
const CH=()=>{const c=PUB().ch;return c&&c.id&&c.to>=today()?c:null};
function chCount(t,c){return new Set([...workouts(t).map(w=>w.d),...t.sessions.filter(x=>x.st==='came').map(x=>x.date)].filter(d=>d>=c.from&&d<=c.to&&d<=today())).size}
function chBoard(c){return tList().filter(t=>t.chJoin===c.id).map(t=>({n:(firstName(t)+' '+((cleanName(t.name).split(/\s+/)[1]||'').slice(0,1))).trim(),c:chCount(t,c),k:t.id.slice(0,6)})).sort((a,b)=>b.c-a.c).slice(0,20)}
function syncChallenge(){const c=CH();if(!c||!isCoach)return;const b=chBoard(c);if(JSON.stringify(b)===JSON.stringify(c.board||[]))return;const nc=Object.assign({},c,{board:b,upd:Date.now()});DB.pub=Object.assign({},PUB(),{ch:nc});api.set('pub','main',{ch:nc})}
const boardHTML=(c,me)=>(c.board||[]).length?`<div class="ch-board">${c.board.slice(0,10).map((b,i)=>`<div class="ch-row ${b.k===me?'me':''}"><span class="num">${i+1}</span><b class="grow">${esc(b.n)}</b><span class="num">${b.c}/${c.goal}</span></div>`).join('')}</div>`:'';
function chCard(t){
  const c=CH();if(!c)return '';const joined=t.chJoin===c.id,n=chCount(t,c),days=Math.max(0,Math.round((parse(c.to)-parse(today()))/864e5));
  return `<div class="h-sec"><span>אתגר</span></div><div class="card"><div class="row"><span class="medal-ic">${mini(I.trophy,22)}</span><div class="grow" style="min-width:0"><b>${esc(c.title)}</b><div class="small muted">${c.goal} אימונים עד ${fmtShort(c.to)} · נשארו ${days} ימים</div></div></div>
    ${joined?`<div class="row" style="margin-top:14px"><div class="grow"><div class="bar"><i style="width:${Math.min(100,n/c.goal*100)}%"></i></div></div><b class="num">${n}/${c.goal}</b></div>`:`<p class="small muted" style="margin:12px 0">המשתתפים רואים רק את השם הפרטי שלך וכמה אימונים עשית באתגר.</p><button class="btn btn-primary btn-block" data-act="chJoin">הצטרפות לאתגר</button>`}
    ${boardHTML(c,t.id.slice(0,6))}${(c.board||[]).length?'<div class="small muted" style="margin-top:6px">הטבלה מתעדכנת כשיקיר נכנס לאפליקציה.</div>':''}
    ${joined?'<button class="linkish" style="margin-top:10px" data-act="chLeave">יציאה מהאתגר</button>':''}</div>`;
}
function chCoachBlock(){
  const c=CH();
  if(!c)return `<div class="card" style="margin-top:14px"><div class="row"><span class="medal-ic">${mini(I.trophy,22)}</span><div class="grow"><b>אתגר בין מתאמנים</b><div class="small muted">למשל ״12 אימונים בחודש״. מי שמצטרף רואה טבלה עם שמות פרטיים בלבד.</div></div><button class="btn btn-primary btn-sm" data-act="chNew">אתגר חדש</button></div></div>`;
  return `<div class="card" style="margin-top:14px"><div class="row"><span class="medal-ic">${mini(I.trophy,22)}</span><div class="grow" style="min-width:0"><b>${esc(c.title)}</b><div class="small muted">${c.goal} אימונים · ${fmtShort(c.from)}–${fmtShort(c.to)} · ${(c.board||[]).length} משתתפים</div></div><button class="btn btn-ghost btn-sm" data-act="chEnd">סיום</button></div>${boardHTML(c,'')||'<div class="small muted" style="margin-top:10px">עוד אין משתתפים. המתאמנים רואים את האתגר בלשונית ״התקדמות״.</div>'}</div>`;
}
/* =========================================================
   YAKIR'S OWN TRAINING — פרופיל אישי ליקיר: members/{uid} + coach/{uid} עם self:true (approved:false → לא מופיע כמתאמן)
   ========================================================= */
function ensureSelf(){
  const id=user.uid;if(DB.coach[id]&&DB.members[id])return;
  if(!DB.members[id]){const m=Object.assign(newMember(cleanName(user.name)||'יקיר',PUB().phone,''),{features:{log:true,water:false,food:false},email:user.email});DB.members[id]=m;api.set('members',id,m)}
  if(!DB.coach[id]){const c=Object.assign(newCoach(10,0,true,1),{approved:false,self:true});DB.coach[id]=c;api.set('coach',id,c)}
}
function trainerSelf(t){
  const ws=workouts(t),ach=achievements(t),mon=ws.filter(w=>w.d.slice(0,7)===today().slice(0,7)),wk=ws.filter(w=>w.d>=weekStart(today())),day=t.plan[ui.planIdx];
  return `<h1 class="h-display" style="margin-top:6px">האימונים שלי</h1>
  <div class="card hero" style="margin-top:14px"><div class="small muted">היי ${esc(firstName(t))}, גם המאמן מתאמן 💪</div>
    <div class="stats" style="margin-top:12px"><div class="stat"><b class="num">${mon.length}</b><span>אימונים החודש</span></div><div class="stat"><b class="num">${kgf(wk.reduce((a,w)=>a+w.vol,0))}</b><span>ק״ג השבוע</span></div><div class="stat"><b class="num">${ach.streak}</b><span>שבועות ברצף</span></div></div></div>
  ${t.live?awBanner(t):(day&&day.ex.length?`<button class="btn btn-primary btn-block aw-start" style="margin-top:14px" data-act="awStart">${mini(I.play,16)} התחלת אימון · ${esc(day.title)}</button>`:'')}
  ${weekStripBlock(t)}
  <div class="h-sec"><span>התוכנית שלי</span><span class="row" style="gap:6px"><button class="btn btn-ghost btn-sm" data-act="pdf">PDF</button><button class="btn btn-ghost btn-sm" data-act="timer">${I.timer} טיימר</button></span></div>
  ${planBlock(t,true)}
  ${achievementsBlock(t)}
  ${workoutsBlock(t)}
  ${rmBlock(t)}
  ${reportBlock(t)}
  ${t.logs.length?`<div class="h-sec"><span>התקדמות בתרגילים</span></div>${progressBlock(t)}`:''}
  ${bodyBlock(t)}
  ${photoBlock(t)}`;
}
/* =========================================================
   HEALTH DECLARATION — הצהרת בריאות ושאלון קבלה עם חתימה (members.health). נייר: coach.hpaper
   ========================================================= */
const HQ=[['heart','האם רופא אמר לך שיש לך בעיה בלב או לחץ דם גבוה?'],['chest','האם את/ה חש/ה כאבים בחזה, במנוחה או במאמץ?'],['dizzy','האם איבדת הכרה או נפלת בגלל סחרחורת בשנה האחרונה?'],['chronic','האם יש לך מחלה כרונית (סוכרת, אסתמה, אפילפסיה וכו׳)?'],['meds','האם את/ה נוטל/ת תרופות באופן קבוע?'],['joints','האם יש לך פציעה, כאב או בעיה במפרקים, בגב או בעצמות?'],['surgery','האם עברת ניתוח בשנה האחרונה?'],['preg','לנשים: האם את בהריון או אחרי לידה בחצי השנה האחרונה?'],['doctor','האם רופא אמר לך להימנע מפעילות גופנית כלשהי?']];
const EXP=['בלי ניסיון','עד שנה','שנה עד 3 שנים','יותר מ-3 שנים'];
/* השאלות שיקיר קבע (pub.hq) או ברירת המחדל. בכל הצהרה נשמר עותק של השאלות (health.qs) כדי שתמיד יוצג מה נשאל */
const HQS=()=>{const h=PUB().hq;return Array.isArray(h)&&h.length?h.filter(x=>x&&x.k&&x.q):HQ.map(([k,q])=>({k,q}))};
const hQs=h=>h&&Array.isArray(h.qs)&&h.qs.length?h.qs:HQS().map(x=>[x.k,x.q]);
const healthFlag=t=>!!(t.health&&t.health.q&&Object.values(t.health.q).some(Boolean));
const healthOk=t=>!!(t.health||t.hpaper);
function healthSheet(t){
  const h=t.health||{},q=h.q||{};
  sheet('הצהרת בריאות',`<p class="small muted" style="margin-top:0">לפני שמתחילים להתאמן, יקיר צריך להכיר את המצב הבריאותי שלך. המידע נשמר רק אצלך ואצל יקיר.</p>
    ${HQS().map(({k,q:l})=>`<fieldset class="hq"><legend>${l}</legend><label><input type="radio" name="hq-${k}" value="0" ${h.q&&q[k]===false?'checked':''}><span>לא</span></label><label><input type="radio" name="hq-${k}" value="1" ${q[k]?'checked':''}><span>כן</span></label></fieldset>`).join('')}
    <div class="field"><label for="h-det">אם ענית ״כן״: פרט/י (מה, מתי, איזה טיפול)</label><textarea id="h-det" name="h-det" maxlength="800">${esc(h.detail||'')}</textarea></div>
    <div class="two"><div class="field"><label for="h-exp">ניסיון באימוני כוח</label><select id="h-exp" name="h-exp">${EXP.map((x,i)=>`<option value="${i}" ${+h.exp===i?'selected':''}>${x}</option>`).join('')}</select></div><div class="field"><label for="h-sex">מין (לחישוב רמת כוח, לא חובה)</label><select id="h-sex" name="h-sex"><option value="">לא לציין</option><option value="m" ${h.sex==='m'?'selected':''}>זכר</option><option value="f" ${h.sex==='f'?'selected':''}>נקבה</option></select></div></div>
    ${fld('h-avail','מתי נוח לך להתאמן?','placeholder="למשל: ימים א׳-ה׳ אחרי 18:00"',h.avail||'')}
    <div class="item" style="margin-bottom:12px"><label for="h-ok" class="grow small">אני מצהיר/ה שכל המידע נכון ומלא, ושאעדכן את המאמן על כל שינוי במצב הבריאותי שלי.</label><input type="checkbox" id="h-ok" name="h-ok" style="width:22px;height:22px;accent-color:var(--accent)"></div>
    ${fld('h-name','שם מלא','required',h.name||cleanName(t.name))}
    <div class="field"><label>חתימה</label><canvas id="sig" class="sig" aria-label="שטח לחתימה באצבע"></canvas><button type="button" class="linkish" data-act="sigClear" style="align-self:flex-start">ניקוי החתימה</button></div>`,fd=>{
    const qs=HQS().map(x=>[x.k,x.q]),qq={};for(const [k] of qs){if(fd['hq-'+k]==null){toast('צריך לענות על כל השאלות');return false}qq[k]=fd['hq-'+k]==='1'}
    const any=Object.values(qq).some(Boolean),det=(fd['h-det']||'').trim();
    if(any&&!det){toast('ענית ״כן״ על שאלה: פרט/י בבקשה');$('#h-det').focus();return false}
    if(!fd['h-ok']){toast('צריך לאשר את ההצהרה');return false}
    if(!(fd['h-name']||'').trim()){toast('צריך למלא שם מלא');return false}
    const c=$('#sig');if(!c||!c.dataset.drawn){toast('צריך לחתום במסגרת');return false}
    const me=T(t.id);me.health={d:today(),q:qq,qs,detail:det,exp:+fd['h-exp']||0,sex:fd['h-sex']||'',avail:(fd['h-avail']||'').trim(),name:fd['h-name'].trim(),sig:c.toDataURL('image/jpeg',.6),by:isCoach?'coach':'me'};
    save(me,'health');toast('הצהרת הבריאות נשמרה ✓');
  },'שליחה');
  initSig();
}
function initSig(){
  const c=$('#sig');if(!c)return;const k=2,w=c.clientWidth||300,h=c.clientHeight||140;c.width=w*k;c.height=h*k;const g=c.getContext('2d');g.scale(k,k);g.fillStyle='#fff';g.fillRect(0,0,w,h);g.lineWidth=2.4;g.lineCap='round';g.lineJoin='round';g.strokeStyle='#111';
  let on=false;const pt=e=>{const b=c.getBoundingClientRect();return [e.clientX-b.left,e.clientY-b.top]};
  c.addEventListener('pointerdown',e=>{on=true;try{c.setPointerCapture(e.pointerId)}catch(x){}const [x,y]=pt(e);g.beginPath();g.moveTo(x,y);g.lineTo(x+.1,y+.1);g.stroke();c.dataset.drawn='1'});
  c.addEventListener('pointermove',e=>{if(!on)return;const [x,y]=pt(e);g.lineTo(x,y);g.stroke()});
  ['pointerup','pointercancel','pointerleave'].forEach(n=>c.addEventListener(n,()=>{on=false}));
}
function healthBlock(t){
  const h=t.health;
  return `<div class="h-sec"><span>הצהרת בריאות</span>${h?`<button class="btn btn-ghost btn-sm" data-act="hPdf" data-id="${t.id}">${mini(I.download,14)} PDF</button>`:`<button class="btn btn-ghost btn-sm" data-act="hFill" data-id="${t.id}">מילוי כאן</button>`}</div>
  <div class="card">${h?`<div class="row"><span class="chip ${healthFlag(t)?'bad':'good'}">${healthFlag(t)?'⚠ יש הערות רפואיות':'✓ הכול תקין'}</span><span class="grow small muted" style="text-align:end">נחתם ${fmtShort(h.d)}${h.by==='coach'?' (במכשיר של יקיר)':''}</span></div>
    ${healthFlag(t)?`<div class="stack" style="gap:4px;margin-top:10px">${hQs(h).filter(([k])=>h.q[k]).map(([,l])=>`<div class="small" style="color:var(--bad)">• ${esc(l)}</div>`).join('')}</div>`:''}
    ${h.detail?`<div class="small" style="margin-top:8px">״${esc(h.detail)}״</div>`:''}
    <div class="small muted" style="margin-top:8px">ניסיון: ${EXP[+h.exp||0]}${h.avail?' · זמינות: '+esc(h.avail):''}</div>
    ${h.sig?`<img class="sig-img" src="${h.sig}" alt="חתימה של ${esc(h.name||'')}">`:''}<div class="small muted">${esc(h.name||'')}</div>`
    :t.hpaper?`<div class="row"><span class="chip good">✓ ההצהרה מולאה</span><span class="grow small muted" style="text-align:end">סומן${typeof t.hpaper==='string'?' ב-'+fmtShort(t.hpaper):''} (PDF / נייר)</span></div><div class="row wrap-ok" style="gap:8px;margin-top:10px"><button class="btn btn-ghost btn-sm" data-act="hPdf" data-id="${t.id}">${mini(I.download,14)} PDF ריק</button><button class="btn btn-ghost btn-sm" data-act="hPaper" data-id="${t.id}">ביטול הסימון</button></div>`
    :`<div class="small muted">עוד לא מולאה הצהרת בריאות. אפשר לבקש מילוי באפליקציה, או לשלוח PDF לחתימה ולסמן כשחוזר.</div>
      <div class="row wrap-ok" style="gap:8px;margin-top:12px"><button class="btn btn-primary btn-sm" data-act="hPdf" data-id="${t.id}">${mini(I.share,14)} שליחת PDF לחתימה</button><button class="btn btn-ghost btn-sm" data-act="hPaper" data-id="${t.id}">${mini(I.check,14)} מולא</button>${t.phone&&!t.offline?`<a class="btn btn-wa btn-sm" target="_blank" rel="noopener" href="${waLink(t.phone,`היי ${firstName(t)}, לפני האימון הבא אשמח שתמלא/י הצהרת בריאות קצרה באפליקציה 🙏 יקיר`)}">${mini(I.wa,14)} בקשה באפליקציה</a>`:''}</div>`}</div>`;
}
/* ---------- PDF של הצהרת הבריאות (A4 לבן, עם הלוגו). ריק לחתימה, או מלא עם התשובות והחתימה ---------- */
async function healthPdf(t){
  const JsPDF=await loadPdfLib(),h=t&&t.health,qs=h?hQs(h):HQS().map(x=>[x.k,x.q]);
  try{await Promise.all(['400 30px Heebo','500 30px Heebo','700 30px Heebo','800 30px Heebo'].map(f=>document.fonts.load(f)))}catch(e){}
  const logo=await loadImg('logo-print.png'),PW=1240,PH=1754,M=96,INK='#15181d',MU='#6b7280',A='#e2541a',LN='#d6d9de';
  const F=(w,px)=>`${w} ${px}px Heebo,Arial,sans-serif`,cv=document.createElement('canvas');cv.width=PW;cv.height=PH;const g=cv.getContext('2d');
  const T2=(s2,x,y,f,col,al)=>{g.font=f;g.fillStyle=col||INK;g.textAlign=al||'right';g.direction='rtl';g.fillText(s2,x,y)};
  const wrap=(s2,f,w)=>{g.font=f;g.direction='rtl';const out=[];String(s2||'').split('\n').forEach(par=>{let ln='';par.split(/\s+/).filter(Boolean).forEach(wd=>{const tt=ln?ln+' '+wd:wd;if(g.measureText(tt).width>w&&ln){out.push(ln);ln=wd}else ln=tt});if(ln)out.push(ln)});return out};
  const line=(x1,x2,y)=>{g.strokeStyle=LN;g.lineWidth=2;g.beginPath();g.moveTo(x1,y);g.lineTo(x2,y);g.stroke()};
  const box=(x,y,on)=>{g.strokeStyle=INK;g.lineWidth=2.5;g.strokeRect(x,y,30,30);if(on){g.strokeStyle=A;g.lineWidth=5;g.beginPath();g.moveTo(x+6,y+16);g.lineTo(x+13,y+24);g.lineTo(x+25,y+7);g.stroke()}};
  const pages=[];let y=0,pn=0;
  const start=()=>{pn++;g.fillStyle='#fff';g.fillRect(0,0,PW,PH);
    if(pn===1){if(logo){const w=440,hh=w*logo.height/logo.width;g.drawImage(logo,(PW-w)/2,56,w,hh);y=56+hh+70}else y=150;
      T2('הצהרת בריאות ושאלון היכרות',PW/2,y,F(800,48),INK,'center');y+=26;g.fillStyle=A;g.fillRect(PW/2-60,y,120,5);y+=60}
    else{if(logo){const w=220,hh=w*logo.height/logo.width;g.drawImage(logo,(PW-w)/2,40,w,hh);y=40+hh+50}else y=100}};
  const end=()=>{line(M,PW-M,PH-90);T2('Yakir Levi · אימון אישי',PW-M,PH-52,F(500,24),MU);T2(String(pn),M,PH-52,F(700,24),MU,'left');pages.push(cv.toDataURL('image/jpeg',.9))};
  const need=hh=>{if(y+hh>PH-130){end();start()}};
  start();
  /* פרטים */
  const fieldRow=(label,val,x,w)=>{T2(label,x,y,F(700,28));g.font=F(700,28);const lw=g.measureText(label).width+14;line(x-w,x-lw,y+8);if(val)T2(val,x-lw-8,y-2,F(500,30),INK)};
  fieldRow('שם מלא:',h?h.name:(t?cleanName(t.name):''),PW-M,560);fieldRow('תאריך:',h?parse(h.d).toLocaleDateString('he-IL'):'',PW-M-620,PW-2*M-620);y+=70;
  fieldRow('טלפון:',t&&t.phone?t.phone:'',PW-M,560);fieldRow('גיל:','',PW-M-620,PW-2*M-620);y+=80;
  wrap('לפני שמתחילים להתאמן, חשוב שהמאמן יכיר את המצב הבריאותי שלך. סמנו ״כן״ או ״לא״ בכל שאלה. המידע נשמר אצל המאמן בלבד.',F(400,27),PW-2*M).forEach(l=>{T2(l,PW-M,y,F(400,27),MU);y+=40});y+=24;
  /* שאלות */
  qs.forEach(([k,q],i)=>{const ls=wrap(q,F(500,29),PW-2*M-300),hh=Math.max(64,ls.length*40+26);need(hh);
    T2(String(i+1)+'.',PW-M,y+34,F(800,29),A);ls.forEach((l,j)=>T2(l,PW-M-58,y+34+j*40,F(500,29),INK));
    const ans=h&&h.q?h.q[k]:null,bx=M;T2('כן',bx+96,y+34,F(700,28),INK);box(bx+108,y+10,ans===true);T2('לא',bx+222,y+34,F(700,28),INK);box(bx+234,y+10,ans===false);
    y+=hh;line(M,PW-M,y-8)});
  y+=20;need(240);T2('אם סימנת ״כן״, פרט/י (מה, מתי, איזה טיפול):',PW-M,y,F(700,28));y+=24;
  if(h&&h.detail){wrap(h.detail,F(500,28),PW-2*M).forEach(l=>{y+=44;T2(l,PW-M,y,F(500,28),INK);line(M,PW-M,y+12)});y+=40}else{[0,1,2].forEach(()=>{y+=58;line(M,PW-M,y)});y+=40}
  y+=24;need(200);T2('ניסיון באימוני כוח:',PW-M,y,F(700,28));y+=50;let x=PW-M;EXP.forEach((e,i)=>{g.font=F(500,27);const w=g.measureText(e).width;box(x-30,y-26,h&&+h.exp===i);T2(e,x-42,y,F(500,27),INK);x-=w+100});y+=70;
  fieldRow('מתי נוח לך להתאמן?',h?h.avail:'',PW-M,PW-2*M);y+=90;
  need(420);g.fillStyle='#f6f6f7';const dl=wrap('אני מצהיר/ה שכל המידע שמסרתי נכון ומלא, ושאעדכן את המאמן על כל שינוי במצב הבריאותי שלי. ידוע לי שעליי להפסיק את האימון ולפנות לרופא אם אני חש/ה כאב, סחרחורת או קוצר נשימה חריג.',F(500,27),PW-2*M-60);g.fillRect(M,y-10,PW-2*M,dl.length*42+40);dl.forEach((l,i)=>T2(l,PW-M-30,y+34+i*42,F(500,27),INK));y+=dl.length*42+80;
  T2('חתימה:',PW-M,y,F(700,28));g.strokeStyle=INK;g.lineWidth=2;g.strokeRect(PW-M-560,y+20,560,190);
  if(h&&h.sig){const im=await loadImg(h.sig);if(im)g.drawImage(im,PW-M-550,y+28,540,174)}
  T2('שם:',PW-M-640,y,F(700,28));line(M,PW-M-700,y+60);if(h)T2(h.name||'',PW-M-700,y+50,F(500,30),INK);
  end();
  const W=595.28,H=841.89,doc=new JsPDF({unit:'pt',format:'a4',orientation:'portrait',compress:true});
  pages.forEach((src,i)=>{if(i)doc.addPage('a4','portrait');doc.addImage(src,'JPEG',0,0,W,H,undefined,'FAST')});
  doc.setProperties({title:'הצהרת בריאות'+(t?' - '+cleanName(t.name):''),author:'Yakir Levi'});
  return new File([doc.output('blob')],`הצהרת בריאות${t?' - '+cleanName(t.name):''}.pdf`,{type:'application/pdf'});
}
async function healthPdfSheet(t){
  toast('מכין PDF…');
  try{const f=await healthPdf(t);pdfFile=f;const share=!!(navigator.canShare&&navigator.canShare({files:[f]})),url=URL.createObjectURL(f),filled=!!(t&&t.health);
    sheet('הצהרת בריאות · PDF',`<p class="muted small" style="margin-top:0">${filled?'ההצהרה החתומה, לשמירה או לשליחה.':'טופס עם הלוגו שלך. שולחים למתאמן, הוא ממלא, חותם ומחזיר צילום, ואז מסמנים ״מולא ✓״.'}</p>
      <div class="stack">${share?'<button type="button" class="btn btn-primary btn-block" data-act="pdfShare">שליחה (וואטסאפ, מייל…)</button>':`<a class="btn btn-primary btn-block" href="${url}" download="${esc(f.name)}">הורדת הקובץ</a>`}
      ${t&&!filled&&t.phone?`<a class="btn btn-wa btn-block" target="_blank" rel="noopener" href="${waLink(t.phone,`היי ${firstName(t)}, שולח לך הצהרת בריאות. אשמח שתמלא/י, תחתום/י ותחזיר/י לי צילום 🙏 יקיר`)}">${mini(I.wa)} הודעה מוכנה למתאמן</a>`:''}
      ${t&&!filled&&!t.hpaper?`<button type="button" class="btn btn-ghost btn-block" data-act="hPaper" data-id="${t.id}">${mini(I.check)} כבר חזר חתום? סימון ״מולא״</button>`:''}</div>`,()=>{},'סגירה');
  }catch(e){console.error(e);toast('לא הצלחנו ליצור PDF. בדקו שיש אינטרנט ונסו שוב')}
}
/* ---------- עריכת השאלות (עסק ← הגדרות) ---------- */
function hqBlock(){
  const qs=HQS(),custom=Array.isArray(PUB().hq)&&PUB().hq.length;
  return `<div class="h-sec"><span>הצהרת בריאות · ${qs.length} שאלות</span><button class="btn btn-ghost btn-sm" data-act="hPdf">${mini(I.download,14)} PDF ריק</button></div>
  <div class="card"><div class="small muted" style="margin-bottom:10px">אלה השאלות שהמתאמנים עונים עליהן (באפליקציה וב-PDF). שינוי חל על הצהרות חדשות, הצהרות שכבר נחתמו נשמרות כמו שהן.</div>
    <div class="stack" style="gap:6px">${qs.map((x,i)=>`<div class="hq-row"><span class="num muted">${i+1}</span><span class="grow small">${esc(x.q)}</span><button class="icon-btn sm" data-act="hqMove" data-v="${i}|-1" ${i?'':'disabled'} aria-label="למעלה">${I.next}</button><button class="icon-btn sm" data-act="hqEdit" data-v="${i}" aria-label="עריכה">${I.edit}</button><button class="icon-btn sm" data-act="hqDel" data-v="${i}" aria-label="מחיקה">${I.trash}</button></div>`).join('')}</div>
    <div class="row wrap-ok" style="gap:8px;margin-top:12px"><button class="btn btn-primary btn-sm" data-act="hqEdit" data-v="new">${mini(I.plus,14)} שאלה חדשה</button>${custom?'<button class="btn btn-ghost btn-sm" data-act="hqReset">חזרה לשאלות המקוריות</button>':''}</div></div>`;
}
const saveHq=list=>{DB.pub=Object.assign({},PUB(),{hq:list});api.set('pub','main',{hq:list});render()};
/* =========================================================
   קבוצות, הודעה לכולם, ימי הולדת, יומן, תשומת לב
   ========================================================= */
let gsSub=null,gsErr=0;
const GRP=()=>Object.assign({on:false,list:[],skip:[]},PUB().grp||{});
const gsList=()=>DB.gs||[];
function ensureGs(){if(gsSub||!GRP().on||!user)return;gsSub=api.gsign(addDays(today(),isCoach?-21:-1),a=>{DB.gs=a;render()});subs.push(()=>{const u=gsSub;gsSub=null;DB.gs=null;if(u)u()})}
function grpInst(from,days){const G=GRP(),off=PUB().off||[],out=[];for(let k=0;k<days;k++){const d=addDays(from,k),dow=parse(d).getDay();if(off.includes(d))continue;G.list.filter(g=>+g.dow===dow).forEach(g=>{const key=d+'_'+g.id;out.push({d,g,k:key,skip:(G.skip||[]).includes(key),n:gsList().filter(x=>x.k===key).length})})}return out.sort((a,b)=>(a.d+a.g.time).localeCompare(b.d+b.g.time))}
const grpOf=k=>{const d=k.slice(0,10),g=GRP().list.find(x=>x.id===k.slice(11));return g?{d,g,k}:null};
const saveGrp=o=>{DB.pub=Object.assign({},PUB(),{grp:o});api.set('pub','main',{grp:o});render()};
function grpTrainee(t){
  const G=GRP();if(!G.on||!G.list.length)return '';const now=today()+nowHM();
  const it=grpInst(today(),8).filter(x=>x.d+x.g.time>now);
  return `<div class="h-sec"><span>שיעורים קבוצתיים</span></div><div class="stack">${DB.gs==null?'<div class="empty">טוען…</div>':it.length?it.map(x=>{const mine=gsList().some(y=>y.k===x.k&&y.o===t.id),left=Math.max(0,(+x.g.cap||0)-x.n);
    return `<div class="item"><div class="time num" style="font-size:22px;min-width:52px">${x.g.time}</div><div class="grow" style="min-width:0"><b>${esc(x.g.title)}</b>${mine?' <span class="chip good">רשום/ה ✓</span>':''}<div class="small muted">${fmt(x.d)}</div><div class="small" style="color:${x.skip?'var(--bad)':left?'var(--good)':'var(--warn)'}">${x.skip?'השיעור בוטל':left===1?`נשאר מקום אחד מתוך ${x.g.cap}`:left?`נשארו ${left} מקומות מתוך ${x.g.cap}`:'השיעור מלא'}</div></div>
    ${mine?`${x.skip?'':`<button class="icon-btn sm" data-act="cal" data-v="${x.d}|${x.g.time}" data-id="${esc(x.g.title)}" aria-label="הוספה ליומן">${I.cal}</button>`}<button class="btn btn-ghost btn-sm" data-act="grpLeave" data-v="${x.k}">ביטול</button>`:(!x.skip&&left?`<button class="btn btn-primary btn-sm" data-act="grpJoin" data-v="${x.k}">הרשמה</button>`:'')}</div>`}).join(''):'<div class="empty">אין שיעורים בשבוע הקרוב.</div>'}</div>`;
}
function grpDayCoach(d){
  const G=GRP();if(!G.on)return '';const it=grpInst(d,1);if(!it.length)return '';
  return `<div class="h-sec"><span>שיעורים קבוצתיים</span></div><div class="stack">${it.map(x=>{const ps=gsList().filter(y=>y.k===x.k);
    return `<div class="sess"><div class="row"><div class="time num">${x.g.time}</div><div class="grow" style="min-width:0"><b>${esc(x.g.title)}</b><div class="small muted num">${x.n} / ${x.g.cap} רשומים${x.skip?' · <span style="color:var(--bad)">בוטל</span>':x.n>=+x.g.cap?' · מלא':''}</div></div><button class="btn btn-ghost btn-sm" data-act="grpAdd" data-v="${x.k}">+ מתאמן</button></div>
    ${ps.length?`<div class="stack" style="gap:8px;margin-top:10px">${ps.map(y=>{const t=T(y.o);if(!t)return '';const on=t.sessions.some(z=>z.gk===x.k);return `<div class="row">${avatar(t,30)}<b class="grow small" style="min-width:0">${esc(t.name)}</b>${d<=today()?`<button class="att ${on?'on good':''}" data-act="grpAtt" data-id="${t.id}|${x.k}">${I.check}הגיע</button>`:''}<button class="icon-btn sm" data-act="grpKick" data-id="${y.id}" aria-label="הסרה מהשיעור">${I.trash}</button></div>`}).join('')}</div>`:'<div class="small muted" style="margin-top:8px">עוד אין נרשמים.</div>'}
    <div class="row sess-actions"><span class="grow"></span><button class="btn btn-ghost btn-sm" data-act="grpSkip" data-v="${x.k}">${x.skip?'החזרת השיעור':'ביטול השיעור בתאריך הזה'}</button></div></div>`}).join('')}</div>`;
}
function grpSettings(){
  const G=GRP();
  return `<div class="h-sec"><span>שיעורים קבוצתיים</span></div><div class="stack">${swPub('grp.on','שיעורים קבוצתיים','שיעור קבוע עם מספר מקומות. המתאמנים נרשמים ומבטלים לבד ורואים כמה מקומות נשארו',G.on)}
  ${G.on?`<div class="card">${G.list.length?G.list.map((g,i)=>`<div class="row grp-row"><div class="grow" style="min-width:0"><b>${esc(g.title)}</b><div class="small muted num">כל יום ${DAYS[+g.dow]} · ${g.time} · ${g.cap} מקומות</div></div><button class="icon-btn sm" data-act="grpEdit" data-v="${i}" aria-label="עריכה">${I.edit}</button><button class="icon-btn sm" data-act="grpDel" data-v="${i}" aria-label="מחיקה">${I.trash}</button></div>`).join(''):'<div class="small muted">עוד אין שיעורים. הוסיפו את הראשון.</div>'}
  <button class="btn btn-ghost btn-sm" style="margin-top:10px" data-act="grpEdit" data-v="new">+ שיעור חדש</button>
  <div class="small muted" style="margin-top:10px">השיעורים מופיעים אצל המתאמנים בלשונית ״לו״ז״, ואצלך בלו״ז של כל יום. מי שסומן ״הגיע״ נספר כמו אימון רגיל (כרטיסייה / תשלום).</div></div>`:''}</div>`;
}
/* הודעה לכל המתאמנים: pub.msg {id, text, until} */
const MSG=()=>{const m=PUB().msg;return m&&m.id&&m.text&&(m.until||'')>=today()?m:null};
const nl=x=>esc(x).replace(/\n/g,'<br>');
function msgBanner(){const m=MSG();if(!m||ls.get('yf-msgx','')===m.id)return '';return `<div class="banner msg-b"><span class="emo">📣</span><div class="grow small"><b>הודעה מיקיר</b><div>${nl(m.text)}</div></div><button class="icon-btn sm" data-act="msgX" data-v="${m.id}" aria-label="סגירה">${I.x}</button></div>`}
function bcastBlock(){const m=MSG();return m?`<div class="banner msg-b"><span class="emo">📣</span><div class="grow small"><b>הודעה לכל המתאמנים · עד ${fmtShort(m.until)}</b><div>${nl(m.text)}</div></div><button class="btn btn-ghost btn-sm" data-act="bcast">עריכה</button><button class="icon-btn sm" data-act="bcastDel" aria-label="הסרת ההודעה">${I.trash}</button></div>`:`<button class="btn btn-ghost btn-sm" style="margin-top:12px" data-act="bcast">📣 הודעה לכל המתאמנים</button>`}
/* ימי הולדת: members.bday YYYY-MM-DD */
function bdayIn(b,days){if(!b||!/^\d{4}-\d\d-\d\d$/.test(b))return -1;for(let k=0;k<=days;k++)if(addDays(today(),k).slice(5)===b.slice(5))return k;return -1}
const bdayMsg=t=>`מזל טוב ${firstName(t)}! 🎂 מאחל לך שנה של בריאות, כוח והמון התקדמות. יקיר`;
function bdayCoachBlock(){
  const L=tList().map(t=>({t,k:bdayIn(t.bday,7)})).filter(x=>x.k>=0).sort((a,b)=>a.k-b.k);if(!L.length)return '';const yr=today().slice(0,4);
  return `<div class="h-sec"><span>ימי הולדת 🎂</span></div><div class="card"><div class="stack" style="gap:8px">${L.map(({t,k})=>{const age=+yr-+t.bday.slice(0,4),sk='yf-bday-'+yr+'-'+t.id;return `<div class="row">${avatar(t,32)}<div class="grow small" style="min-width:0"><b>${esc(t.name)}</b><div class="muted">${k===0?'<b style="color:var(--accent2)">היום!</b>':fmt(addDays(today(),k))}${age>0&&age<100?` · ${k===0?'חוגג/ת':'יחגוג/תחגוג'} ${age}`:''}</div></div>${k===0&&ls.get(sk,0)?'<span class="chip good">נשלח</span>':''}${k===0&&t.phone?`<a class="icon-btn sm wa" data-act="lsMark" data-v="${sk}" href="${waLink(t.phone,bdayMsg(t))}" target="_blank" rel="noopener" aria-label="ברכה בוואטסאפ">${I.wa}</a>`:''}</div>`}).join('')}</div></div>`;
}
const bdayBanner=t=>bdayIn(t.bday,0)===0?`<div class="banner msg-b"><span class="emo">🎂</span><div class="grow small"><b>יום הולדת שמח, ${esc(firstName(t))}!</b><div>יקיר מאחל לך שנה של בריאות, כוח והמון התקדמות 💪</div></div></div>`:'';
/* תשומת לב: מי שלא התאמן 10 ימים, כרטיסיות שנגמרות */
function lastAct(t){const a=[...workouts(t).map(w=>w.d),...t.sessions.filter(x=>x.st==='came').map(x=>x.date)].filter(d=>d<=today()).sort();return a[a.length-1]||''}
const daysAgo=d=>Math.round((parse(today())-parse(d))/864e5);
const missMsg=t=>`היי ${firstName(t)}, מתגעגעים אליך 💪 מתי חוזרים להתאמן? יקיר`;
function missRow(t){const l=lastAct(t),sk='yf-miss-'+t.id,sent=ls.get(sk,'');const ok=sent&&sent>=addDays(today(),-7);
  return `<div class="row">${avatar(t,32)}<div class="grow small" style="min-width:0"><b>${esc(t.name)}</b><div class="muted">${l?`לא התאמן/ה ${daysAgo(l)} ימים`:'עוד לא התאמן/ה'}</div></div>${ok?'<span class="chip good">נשלח</span>':''}${t.phone?`<a class="icon-btn sm wa" data-act="lsMark" data-v="${sk}" data-id="${today()}" href="${waLink(t.phone,missMsg(t))}" target="_blank" rel="noopener" aria-label="הודעה בוואטסאפ">${I.wa}</a>`:''}<button type="button" class="btn btn-ghost btn-sm" data-act="openT" data-id="${t.id}">פתיחה</button></div>`}
function attnBlock(){const L=dashData().idle;if(!L.length)return '';return `<div class="h-sec"><span>ממתינים לתשומת לב · ${L.length}</span></div><div class="card"><div class="small muted" style="margin-bottom:10px">לא התאמנו 10 ימים ואין להם אימון קבוע בהמשך. הודעה קטנה עושה הבדל גדול.</div><div class="stack" style="gap:8px">${L.slice(0,6).map(missRow).join('')}</div>${L.length>6?`<button class="btn btn-ghost btn-sm" style="margin-top:10px" data-act="dash" data-v="idle">עוד ${L.length-6}</button>`:''}</div>`}
function renewMsg(t){const ci=cardInfo(t),pr=cardPriceFor(t,t.card.size);return `היי ${firstName(t)}, ${ci.left?`נשארו לך ${ci.left} אימונים בכרטיסייה`:'הכרטיסייה שלך נגמרה'} 💪 רוצה שנחדש?${pr?` כרטיסייה של ${t.card.size} אימונים: ${ils(pr)}.`:''} יקיר`}
function lowBlock(low){if(!low.length)return '';return `<div class="h-sec"><span>כרטיסיות שנגמרות · ${low.length}</span></div><div class="card"><div class="stack" style="gap:8px">${low.map(t=>{const ci=cardInfo(t);return `<div class="row">${avatar(t,32)}<a href="#" class="grow small" style="min-width:0;color:inherit" data-act="openT" data-id="${t.id}"><b>${ci.low?(ci.left?`נשארו ${ci.left} אימונים בכרטיסייה של ${esc(firstName(t))}`:`הכרטיסייה של ${esc(firstName(t))} נגמרה`):`${esc(firstName(t))} ביקש/ה לחדש (נשארו ${ci.left})`}</b>${t.renewReq&&ci.low?'<div style="color:var(--accent2)">ביקש/ה חידוש</div>':''}</a>${t.phone?`<a class="icon-btn sm wa" href="${waLink(t.phone,renewMsg(t))}" target="_blank" rel="noopener" aria-label="הצעת חידוש בוואטסאפ">${I.wa}</a>`:''}</div>`}).join('')}</div></div>`}
/* בקשות ביטול (כשמדיניות הביטול כבויה יקיר מחליט) */
const sesDT=x=>{const d=parse(x.date),[h,m]=x.time.split(':').map(Number);d.setHours(h,m);return d};
function cxAsks(){return tList().flatMap(t=>(t.cancels||[]).filter(c=>c.ask).map(c=>({t,c,s:t.sessions.find(x=>x.id===c.sid)})).filter(x=>x.s))}
function cxAskBlock(){const a=cxAsks();if(!a.length)return '';return `<div class="h-sec"><span>בקשות ביטול · ${a.length}</span></div><div class="stack">${a.map(({t,c,s})=>{const h=Math.max(0,Math.round((sesDT(s)-c.at)/36e5));return `<div class="sess"><div class="row">${avatar(t,38)}<div class="grow" style="min-width:0"><b>${esc(t.name)}</b><div class="small muted num">${fmt(s.date)} · ${s.time}</div><div class="small">ביקש/ה לבטל ${h>=48?Math.round(h/24)+' ימים':h+' שעות'} לפני האימון</div></div></div><div class="row sess-actions" style="flex-wrap:wrap"><button class="btn btn-primary btn-sm" data-act="cxDo" data-id="${t.id}|${s.id}" data-v="free">ביטול בלי חיוב</button><button class="btn btn-ghost btn-sm" data-act="cxDo" data-id="${t.id}|${s.id}" data-v="late">ביטול עם חיוב</button><button class="btn btn-ghost btn-sm" data-act="cxDo" data-id="${t.id}|${s.id}" data-v="keep">האימון נשאר</button></div></div>`}).join('')}</div>`}
function sesTail(t,x){
  const c=(t.cancels||[]).find(y=>y.sid===x.id);if(c)return c.ask?'<span class="chip warn">ביקשת ביטול · ממתין ליקיר</span>':'<span class="chip warn">בוטל · ממתין לעדכון</span>';
  if(x.st==='late')return '<span class="chip bad">ביטול מאוחר</span>';
  if(x.d+x.time<=today()+nowHM())return '';
  return `<button class="icon-btn sm" data-act="cal" data-v="${x.d}|${x.time}" data-id="אימון עם יקיר" aria-label="הוספה ליומן">${I.cal}</button><button class="btn btn-ghost btn-sm" data-act="sesCancel" data-v="${x.id}">ביטול</button>`;
}
/* יומן: Google או קובץ ics (תזכורת שעתיים לפני) */
const calStamp=(d,t,add=0)=>{const x=parse(d),[h,m]=t.split(':').map(Number);x.setHours(h,m+add);return iso(x).replace(/-/g,'')+'T'+pad(x.getHours())+pad(x.getMinutes())+'00'};
function calSheet(title,d,time,head){
  ui.calEv={title,d,time};
  const g='https://calendar.google.com/calendar/render?action=TEMPLATE&text='+encodeURIComponent(title)+'&dates='+calStamp(d,time)+'/'+calStamp(d,time,60)+'&ctz=Asia/Jerusalem&details='+encodeURIComponent('Yakir fit');
  sheet(head||'הוספה ליומן',`<p style="margin-top:0"><b>${esc(title)}</b><br><span class="muted">${fmt(d)} בשעה ${time}</span></p>
  <a class="btn btn-ghost btn-block" style="margin-bottom:8px" href="${g}" target="_blank" rel="noopener">${mini(I.cal)} יומן Google</a>
  <button type="button" class="btn btn-ghost btn-block" data-act="calIcs">${mini(I.cal)} יומן הטלפון (אייפון ואחרים)</button>
  <p class="small muted">ביומן הטלפון נוספת תזכורת שעתיים לפני.</p>`,()=>{},'סגירה');
}
function calIcs(){const e=ui.calEv;if(!e)return;const z=new Date().toISOString().replace(/[-:]/g,'').slice(0,15)+'Z';
  const txt=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Yakir fit//HE','CALSCALE:GREGORIAN','BEGIN:VEVENT','UID:'+uid()+'@yakirfit','DTSTAMP:'+z,'DTSTART:'+calStamp(e.d,e.time),'DTEND:'+calStamp(e.d,e.time,60),'SUMMARY:'+e.title.replace(/[,;]/g,' '),'BEGIN:VALARM','TRIGGER:-PT2H','ACTION:DISPLAY','DESCRIPTION:'+e.title.replace(/[,;]/g,' '),'END:VALARM','END:VEVENT','END:VCALENDAR'].join('\r\n');
  giveFile(new File([txt],'yakir-fit-'+e.d+'.ics',{type:'text/calendar'}))}
/* =========================================================
   POLICY — ביטולים (members.cancels → יקיר מעבד), אימונים קבועים (coach.fixed), רשימת המתנה (pub.busy)
   ========================================================= */
function processCancels(){
  tList().forEach(t=>{
    if(!t.cancels.length)return;
    const keep=t.cancels.filter(c=>c.ask&&t.sessions.some(y=>y.id===c.sid&&y.date>=addDays(today(),-1))),now=t.cancels.filter(c=>!c.ask);
    if(!now.length&&keep.length===t.cancels.length)return;const msgs=[];
    now.forEach(c=>{const x=t.sessions.find(y=>y.id===c.sid);if(!x)return;msgs.push(`${fmt(x.date)} ${x.time}${c.late?' (ביטול מאוחר)':''}`);
      if(x.by==='fixed')t.fixedSkip=t.fixedSkip.concat([x.date+'|'+x.time]);
      if(c.late)x.st='late';else{t.sessions=t.sessions.filter(y=>y.id!==x.id);waitFree(x.date,x.time)}});
    t.cancels=keep;save(t,'sessions','fixedSkip','cancels');
    if(msgs.length)notify(`${cleanName(t.name)} ביטל/ה: ${msgs.join(', ')}`);
  });
}
function waitFree(d,h){const w=tList().flatMap(t=>t.requests.filter(r=>r.status==='wait'&&r.date===d&&r.time===h).map(r=>t));if(w.length)setTimeout(()=>notify(`השעה ${fmt(d)} ${h} התפנתה · ברשימת המתנה: ${w.map(t=>cleanName(t.name)).join(', ')}`),600)}
function syncFixed(){
  const pol=POL();if(!pol.fixed)return;const td=today(),off=PUB().off||[],days=Math.min(12,Math.max(1,+pol.weeks||4))*7;
  tList().forEach(t=>{if(!t.fixed.length)return;let add=0;
    for(let k=0;k<days;k++){const d=addDays(td,k),dow=parse(d).getDay();if(off.includes(d))continue;
      t.fixed.filter(f=>+f.dow===dow).forEach(f=>{if(d===td&&f.time<=nowHM())return;if(t.sessions.some(x=>x.date===d&&x.time===f.time)||t.fixedSkip.includes(d+'|'+f.time))return;if(billOf(t)==='card'&&cardInfo(t).left<=0)return;t.sessions.push({id:uid(),date:d,time:f.time,by:'fixed'});add++})}
    if(add)save(t,'sessions');});
}
function syncBusy(){
  /* רשימה (לא מפה): מערך מוחלף בשלמותו בשמירה עם merge, מפה הייתה משאירה תאריכים ישנים ונכנסת ללולאה */
  if(!POL().wait)return;const td=today(),to=addDays(td,14);
  const b=[...new Set(allSessions().filter(x=>x.date>=td&&x.date<=to&&x.st!=='late').map(x=>x.date+'|'+x.time))].sort();
  const old=Array.isArray(PUB().busy)?PUB().busy:[];if(JSON.stringify(b)===JSON.stringify(old))return;DB.pub=Object.assign({},PUB(),{busy:b});api.set('pub','main',{busy:b});
}
function fixedBlock(t){
  if(!POL().fixed)return '';
  return `<div class="h-sec"><span>אימונים קבועים</span><button class="btn btn-ghost btn-sm" data-act="fixAdd" data-id="${t.id}">+ זמן קבוע</button></div>
  <div class="stack">${t.fixed.length?t.fixed.map((f,i)=>`<div class="item"><b class="grow">כל יום ${DAYS[+f.dow]} · <span class="num">${f.time}</span></b><button class="icon-btn sm" data-act="fixDel" data-id="${t.id}" data-v="${i}" aria-label="הסרת הזמן הקבוע">${I.trash}</button></div>`).join(''):`<div class="empty">אין זמן קבוע. אימונים קבועים נקבעים לבד ${POL().weeks} שבועות קדימה.</div>`}</div>`;
}
/* =========================================================
   TRACKING (אופציונלי) — מחזוריות בתוכנית, 1RM ורמת כוח, השוואת תמונות, דוח חודשי
   ========================================================= */
function cycleInfo(t){const c=t.cycle;if(!c||!c.on||!c.start)return null;const n=Math.max(0,Math.floor((parse(today())-parse(c.start))/6048e5)),weeks=Math.max(2,+c.weeks||6),wk=n%weeks+1,de=+c.deload||0,dl=de>0&&wk%de===0;
  const f=dl?1-(+c.dpct||10)/100:1+(+c.step||2.5)/100*(wk-1-(de>0?Math.floor((wk-1)/de):0));return {wk,weeks,dl,f}}
const roundKg=x=>x>=20?Math.round(x/2.5)*2.5:Math.round(x*2)/2;
const adjKg=(t,kg)=>{const ci=cycleInfo(t);return ci&&+kg?roundKg(+kg*ci.f):kg};
function cycleSheet(t){
  const c=Object.assign({on:false,weeks:6,step:2.5,deload:4,dpct:10,start:weekStart(today())},t.cycle||{});
  sheet('מחזוריות בתוכנית',`<p class="small muted" style="margin-top:0">המשקלים בתוכנית עולים לבד כל שבוע, ובשבוע הקלה יורדים. המשקל שנכתב בכל תרגיל הוא משקל הבסיס של שבוע 1.</p>
    <div class="item" style="margin-bottom:12px"><label for="cy-on" class="grow"><b>הפעלת מחזוריות</b></label><label class="switch"><input type="checkbox" id="cy-on" name="cy-on" ${c.on?'checked':''}><span></span></label></div>
    <div class="two">${fld('cy-w','שבועות במחזור','type="number" min="2" max="16" inputmode="numeric"',c.weeks)}${fld('cy-s','עלייה בכל שבוע (%)','type="number" min="0" max="20" step="0.5" inputmode="decimal"',c.step)}</div>
    <div class="two">${fld('cy-d','שבוע הקלה כל (שבועות)','type="number" min="0" max="12" inputmode="numeric"',c.deload)}${fld('cy-p','ירידה בשבוע הקלה (%)','type="number" min="0" max="50" inputmode="numeric"',c.dpct)}</div>
    ${fld('cy-st','תחילת המחזור','type="date"',c.start)}<p class="small muted">0 בשבוע הקלה = בלי שבוע הקלה.</p>`,fd=>{const me=cur();me.cycle={on:!!fd['cy-on'],weeks:+fd['cy-w']||6,step:+fd['cy-s']||0,deload:+fd['cy-d']||0,dpct:+fd['cy-p']||0,start:fd['cy-st']||weekStart(today())};save(me,'cycle');toast(me.cycle.on?'המחזוריות פעילה':'המחזוריות כבויה')},'שמירה');
}
const e1rm=(kg,r)=>kg>0&&r>0?(r===1?kg:kg*(1+r/30)):0;
const STD=[[/^(?!.*שיפוע)(?!.*incline).*(לחיצת חזה|bench)/i,{m:[.5,.75,1,1.5,2],f:[.25,.5,.75,1,1.5]}],[/סקוואט|squat/i,{m:[.75,1.25,1.5,2,2.5],f:[.5,.75,1.25,1.5,2]}],[/^(?!.*רומני)(?!.*רגל אחת)(?!.*romanian).*(דדליפט|deadlift)/i,{m:[1,1.5,2,2.5,3],f:[.5,1,1.25,1.75,2.25]}],[/לחיצת כתפיים|overhead|ohp|military/i,{m:[.35,.55,.8,1.05,1.35],f:[.2,.35,.5,.75,1]}]];
const LVL=['מתחיל/ה','בסיסי','בינוני','מתקדם/ת','עילית'];
function rmBlock(t){
  const by={};t.logs.forEach(l=>{const v=e1rm(+l.kg,+l.reps);if(v&&(!by[l.ex]||v>by[l.ex].v))by[l.ex]={v,l}});
  const list=Object.entries(by).sort((a,b)=>b[1].v-a[1].v).slice(0,8);if(!list.length)return '';
  const bw=bodyKg(t),sex=(t.health||{}).sex;
  return `<div class="h-sec"><span>כוח · 1RM משוער</span></div><div class="card"><div class="small muted" style="margin-bottom:10px">המשקל המקסימלי המשוער לחזרה אחת, לפי הסט הכי טוב (נוסחת Epley).${bw?'':' כדי לראות יחס למשקל הגוף, רשמו משקל במדדי גוף.'}${sex||!bw?'':' לרמת כוח צריך לציין מין בהצהרת הבריאות.'}</div>
    <div class="stack" style="gap:8px">${list.map(([n,{v,l}])=>{const r=bw?v/bw:0,sd=STD.find(([re])=>re.test(n)),th=sd&&sex?sd[1][sex]:null,lv=th&&r?th.reduce((a,x,i)=>r>=x?i:a,-1):-2;
      return `<div class="row rm-row"><div class="grow" style="min-width:0"><b>${esc(n)}</b><div class="small muted num">${kgf(l.kg)}×${l.reps} · ${fmtShort(l.d)}${r?` · פי ${r.toFixed(2)} ממשקל הגוף`:''}</div></div>${lv>-2?`<span class="chip ${lv>=3?'good':lv>=1?'cool':''}">${lv<0?'לפני רמה 1':LVL[lv]}</span>`:''}<b class="num rm-v">${kgf(Math.round(v*2)/2)}<small> ק״ג</small></b></div>`}).join('')}</div></div>`;
}
const shareImg={};
function cmpBlock(t,ph){
  if(ph.length<2||!(t.features.cmp||isCoach))return '';
  const a=Math.min(ph.length-1,ui.cmpA??0),b=Math.min(ph.length-1,ui.cmpB??ph.length-1),A=ph[a],B=ph[b];
  return `<div class="card" style="margin-bottom:10px"><div class="row"><b class="grow">השוואה</b><button class="btn btn-ghost btn-sm" data-act="cmpShare" data-id="${t.id}">${mini(I.share,14)} שיתוף</button></div>
    <div class="cmp" style="--p:50%"><img src="${esc(B.data)}" alt="אחרי · ${fmtShort(B.d)}"><div class="cmp-top"><img src="${esc(A.data)}" alt="לפני · ${fmtShort(A.d)}"></div><i class="cmp-line"></i><span class="cmp-l">לפני · ${fmtShort(A.d)}</span><span class="cmp-r">אחרי · ${fmtShort(B.d)}</span><input type="range" min="0" max="100" value="50" data-act="cmpR" aria-label="גרירה להשוואה בין לפני לאחרי"></div>
    <div class="row wrap-ok small" style="gap:6px;margin-top:10px"><span class="muted">לפני:</span>${ph.map((p,i)=>`<button class="pill ${i===a?'on':''}" style="padding:4px 10px" data-act="cmpA" data-v="${i}">${fmtShort(p.d)}</button>`).join('')}</div>
    <div class="row wrap-ok small" style="gap:6px;margin-top:6px"><span class="muted">אחרי:</span>${ph.map((p,i)=>`<button class="pill ${i===b?'on':''}" style="padding:4px 10px" data-act="cmpB" data-v="${i}">${fmtShort(p.d)}</button>`).join('')}</div></div>`;
}
async function cmpImage(t){
  const ph=DB.photos[t.id]||[],A=ph[Math.min(ph.length-1,ui.cmpA??0)],B=ph[Math.min(ph.length-1,ui.cmpB??ph.length-1)];if(!A||!B)return null;
  try{await document.fonts.load('700 40px Rubik')}catch(e){}
  const [ia,ib,logo]=await Promise.all([loadImg(A.data),loadImg(B.data),loadImg('logo-dark.png')]);
  const W=1080,H=1350,c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d');g.fillStyle='#0a0a0b';g.fillRect(0,0,W,H);
  const cover=(im,x,y,w,h)=>{if(!im)return;const s2=Math.max(w/im.width,h/im.height),sw=w/s2,sh=h/s2;g.drawImage(im,(im.width-sw)/2,(im.height-sh)/2,sw,sh,x,y,w,h)};
  cover(ia,40,170,490,900);cover(ib,550,170,490,900);
  const T2=(s2,x,y,f,col)=>{g.font=f;g.fillStyle=col;g.textAlign='center';g.direction='rtl';g.fillText(s2,x,y)};
  T2(cleanName(t.name),W/2,110,'700 48px Rubik,Heebo,Arial','#f5f5f4');T2('לפני · '+fmtShort(A.d),285,1130,'600 40px Rubik,Heebo,Arial','#9a9aa0');T2('אחרי · '+fmtShort(B.d),795,1130,'600 40px Rubik,Heebo,Arial','#ff6b2c');
  if(logo){const lw=380,lh=lw*logo.height/logo.width;g.drawImage(logo,(W-lw)/2,H-lh-40,lw,lh)}
  return await new Promise(r=>c.toBlob(b=>r(b?new File([b],'yakir-levi-before-after.jpg',{type:'image/jpeg'}):null),'image/jpeg',.9));
}
function reportData(t,ym){
  const ws=workouts(t).filter(w=>w.d.slice(0,7)===ym),came=t.sessions.filter(x=>x.st==='came'&&x.date.slice(0,7)===ym).map(x=>x.date);
  const days=new Set([...ws.map(w=>w.d),...came]).size,vol=ws.reduce((a,w)=>a+w.vol,0),recs=records(t).filter(r=>r.d.slice(0,7)===ym);
  const body=t.body.slice().sort((a,b)=>a.d.localeCompare(b.d)).filter(b=>+b.kg),last=body.filter(b=>b.d.slice(0,7)<=ym).pop(),base=body.filter(b=>b.d.slice(0,7)<ym).pop()||body.find(b=>b.d.slice(0,7)===ym);
  const mm={};ws.forEach(w=>w.mus.forEach(([k,p])=>{mm[k]=(mm[k]||0)+p*w.vol}));const tot=Object.values(mm).reduce((a,b)=>a+b,0)||1;
  return {ym,days,vol,sets:ws.reduce((a,w)=>a+w.logs.reduce((x,l)=>x+logSets(t,l),0),0),recs,dkg:last&&base&&last!==base&&last.d.slice(0,7)===ym?+(last.kg-base.kg).toFixed(1):null,mus:Object.entries(mm).map(([k,v])=>[k,Math.round(v/tot*100)]).sort((a,b)=>b[1]-a[1]).slice(0,3),like:heavyLike(vol)};
}
async function reportImage(t,ym){
  const r=reportData(t,ym);try{await Promise.all(['800 40px Rubik','600 40px Rubik','500 40px Rubik'].map(f=>document.fonts.load(f)))}catch(e){}
  const logo=await loadImg('logo-dark.png'),W=1080,H=1920,A='#ff6b2c',FG='#f5f5f4',MU='#9a9aa0',F=(w,px)=>`${w} ${px}px Rubik,Heebo,Arial,sans-serif`;
  const c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d');g.fillStyle='#0a0a0b';g.fillRect(0,0,W,H);
  const gr=g.createRadialGradient(W/2,600,0,W/2,600,980);gr.addColorStop(0,'rgba(255,107,44,.26)');gr.addColorStop(1,'rgba(255,107,44,0)');g.fillStyle=gr;g.fillRect(0,0,W,H);
  const T2=(s2,x,y,f,col)=>{g.font=f;g.fillStyle=col;g.textAlign='center';g.direction='rtl';g.fillText(s2,x,y)};
  const rr=(x,y,w,h,rad)=>{g.beginPath();g.moveTo(x+rad,y);g.arcTo(x+w,y,x+w,y+h,rad);g.arcTo(x+w,y+h,x,y+h,rad);g.arcTo(x,y+h,x,y,rad);g.arcTo(x,y,x+w,y,rad);g.closePath()};
  T2(cleanName(t.name),W/2,150,F(600,42),FG);T2('הדוח של',W/2,320,F(500,52),MU);T2(ymName(ym),W/2,420,F(800,96),FG);
  const tiles=[[String(r.days),'אימונים',FG],[kgf(r.vol),'ק״ג נפח',A],[String(r.recs.length),'שיאים חדשים',FG],[r.dkg==null?String(r.sets):((r.dkg>0?'+':'')+r.dkg),r.dkg==null?'סטים':'שינוי במשקל (ק״ג)',FG]];
  tiles.forEach(([v,l,col],i)=>{const x=100+(1-i%2)*450,y=520+Math.floor(i/2)*330;rr(x,y,430,300,50);g.fillStyle='#151517';g.fill();T2(v,x+215,y+170,F(800,96),col);T2(l,x+215,y+240,F(500,38),MU)});
  let y=1240;if(r.like){T2(r.like.emo+'  '+r.like.text,W/2,y,F(600,46),A);y+=80}
  if(r.mus.length){T2('הכי עבדו: '+r.mus.map(([k])=>MUSN[k]).join(' · '),W/2,y,F(500,42),FG);y+=80}
  r.recs.slice(-3).reverse().forEach(x=>{T2(`🏅 ${x.type==='vol'?'שיא נפח':x.ex} · ${kgf(x.val)} ק״ג`,W/2,y,F(500,40),MU);y+=62});
  if(logo){const lw=440,lh=lw*logo.height/logo.width;g.drawImage(logo,(W-lw)/2,H-lh-90,lw,lh)}
  return {url:c.toDataURL('image/jpeg',.85),file:await new Promise(res=>c.toBlob(b=>res(b?new File([b],`yakir-levi-report-${ym}.jpg`,{type:'image/jpeg'}):null),'image/jpeg',.92)),r};
}
function reportBlock(t,coach){
  const cur=today().slice(0,7),prev=ymAdd(cur,-1);
  return `<div class="h-sec"><span>דוח חודשי</span></div><div class="card"><div class="small muted" style="margin-bottom:10px">${coach?'סיכום מעוצב עם הלוגו, לשליחה למתאמן':'סיכום מעוצב של החודש, עם הלוגו של יקיר, לשמירה או לשיתוף'}.</div><div class="row wrap-ok" style="gap:8px"><button class="btn btn-primary btn-sm" data-act="report" data-id="${t.id}" data-v="${prev}">${ymName(prev,{month:'long'})}</button><button class="btn btn-ghost btn-sm" data-act="report" data-id="${t.id}" data-v="${cur}">${ymName(cur,{month:'long'})} (עד היום)</button></div></div>`;
}
/* =========================================================
   NUTRITION & HABITS (אופציונלי) — members.eat [{d,n,k,p}], coach.macro {kcal,prot}, members.habits {list, log:[{d,id,v}]}
   ========================================================= */
const FOODS=[['ביצה',70,6],['חזה עוף 100 גרם',165,31],['טונה במים',120,26],['יוגורט חלבון',120,20],['שייק חלבון',120,24],['קוטג׳ 5%',220,27],['פרוסת לחם מלא',80,4],['כוס אורז מבושל',200,4],['בננה',105,1],['חופן אגוזים',180,5],['תפוח',95,0],['סלט ירקות',60,2]];
const eatOf=(t,d)=>(Array.isArray(t.eat)?t.eat:[]).filter(e=>e.d===d);
function nutriCard(t){
  const d=today(),es=eatOf(t,d),k=es.reduce((a,e)=>a+(+e.k||0),0),p=es.reduce((a,e)=>a+(+e.p||0),0),m=t.macro||{};
  const bar=(v,goal,l,u)=>`<div class="nut-row"><div class="row small"><b class="grow">${l}</b><span class="num">${kgf(v)}${goal?' / '+kgf(goal):''} ${u}</span></div><div class="bar"><i style="width:${goal?Math.min(100,v/goal*100):0}%"></i></div></div>`;
  return `<div class="h-sec"><span>תזונה היום</span><button class="btn btn-ghost btn-sm" data-act="eatAdd">+ הוספה</button></div><div class="card">
    ${bar(k,+m.kcal,'קלוריות','')}${bar(p,+m.prot,'חלבון','גרם')}${!m.kcal&&!m.prot?'<div class="small muted">יקיר עוד לא קבע לך יעד יומי, אבל אפשר כבר לרשום.</div>':''}
    ${es.length?`<div class="wo-sets" style="margin-top:10px">${es.map(e=>`<span class="wo-set">${esc(e.n||'ארוחה')} · ${e.k||0} קק״ל · ${e.p||0} ג׳<button data-act="eatDel" data-v="${t.eat.indexOf(e)}" aria-label="מחיקה">${I.x}</button></span>`).join('')}</div>`:''}</div>`;
}
function nutriCoach(t){
  const m=t.macro||{},days=[...Array(7)].map((_,i)=>addDays(today(),-i)),logged=days.map(d=>eatOf(t,d)).filter(x=>x.length),avg=f=>logged.length?Math.round(logged.reduce((a,es)=>a+es.reduce((x,e)=>x+(+e[f]||0),0),0)/logged.length):0;
  return `<div class="h-sec"><span>יעדי תזונה</span>${t.features.nutri?'':'<span class="chip">המתאמן עוד לא הפעיל</span>'}</div><div class="card"><div class="two">${fld('mc-k','קלוריות ביום','type="number" min="0" inputmode="numeric" data-act="macroSet" data-v="kcal"',m.kcal||'')}${fld('mc-p','חלבון ביום (גרם)','type="number" min="0" inputmode="numeric" data-act="macroSet" data-v="prot"',m.prot||'')}</div>${logged.length?`<div class="small muted">ממוצע ב-${logged.length} ימים שנרשמו השבוע: <b style="color:var(--fg)">${avg('k')}</b> קק״ל · <b style="color:var(--fg)">${avg('p')}</b> ג׳ חלבון</div>`:''}</div>`;
}
const HAB_PRESETS=[{id:'steps',n:'צעדים',type:'num',target:8000,unit:'צעדים'},{id:'sleep',n:'שינה',type:'num',target:7,unit:'שעות'},{id:'vit',n:'ויטמינים / תוספים',type:'chk'},{id:'stretch',n:'מתיחות',type:'chk'},{id:'protein',n:'עמדתי ביעד החלבון',type:'chk'},{id:'nosugar',n:'בלי מתוקים',type:'chk'}];
const habLog=t=>((t.habits||{}).log)||[];
const habVal=(t,d,id)=>{const e=habLog(t).find(x=>x.d===d&&x.id===id);return e?e.v:null};
const habMet=(h,v)=>h.type==='chk'?!!v:+v>=+h.target;
function habStreak(t,h){let d=today();if(!habMet(h,habVal(t,d,h.id)))d=addDays(d,-1);let n=0;while(n<400&&habMet(h,habVal(t,d,h.id))){n++;d=addDays(d,-1)}return n}
function habitsCard(t){
  const list=((t.habits||{}).list)||[],d=today();
  return `<div class="h-sec"><span>ההרגלים שלי</span><button class="btn btn-ghost btn-sm" data-act="habEdit">עריכה</button></div><div class="stack">${list.length?list.map(h=>{const v=habVal(t,d,h.id),met=habMet(h,v),st=habStreak(t,h);return `<div class="item hab ${met?'met':''}"><div class="grow" style="min-width:0"><b>${esc(h.n)}</b><div class="small muted">${h.type==='num'?`יעד ${kgf(h.target)} ${esc(h.unit||'')}`:'כל יום'}${st?` · ${mini(I.flame,11)} ${st===1?'יום אחד':st+' ימים'} ברצף`:''}</div></div>${h.type==='num'?`<input class="hab-in num" type="number" min="0" inputmode="decimal" value="${v??''}" placeholder="0" data-act="habNum" data-v="${h.id}" aria-label="${esc(h.n)} היום">`:`<button class="aw-chk ${met?'on':''}" data-act="habTog" data-v="${h.id}" aria-pressed="${met}" aria-label="${esc(h.n)} היום">${I.check}</button>`}</div>`}).join(''):'<div class="empty">בחרו הרגלים ב״עריכה״.</div>'}</div>`;
}
function habitsCoach(t){
  const list=((t.habits||{}).list)||[];if(!t.features.habits||!list.length)return '';const days=[...Array(7)].map((_,i)=>addDays(today(),-i));
  return `<div class="h-sec"><span>הרגלים · 7 ימים אחרונים</span></div><div class="stack">${list.map(h=>{const n=days.filter(d=>habMet(h,habVal(t,d,h.id))).length;return `<div class="item"><b class="grow">${esc(h.n)}</b><span class="chip ${n>=5?'good':n>=3?'warn':'bad'} num">${n}/7</span></div>`}).join('')}</div>`;
}
/* =========================================================
   EXERCISE LIBRARY — הספרייה של יקיר (coach/settings.exlib): שם, שרירים, סרטון, הערה
   ========================================================= */
const EXLIB=()=>((DB.coach.settings||{}).exlib)||[];
const libNames=()=>[...new Set([...EXLIB().map(x=>x.name),...EX_LIB])];
function libBlock(){
  const L=EXLIB();
  return `<div class="h-sec"><span>ספריית התרגילים שלי · ${L.length}</span></div><div class="stack">${L.length?L.map((x,i)=>`<div class="item"><span class="grow" style="min-width:0"><b>${esc(x.name)}</b><div class="small muted">${(x.mus&&x.mus.p||[]).map(k=>MUSN[k]).join(', ')}${x.video?' · יש סרטון':''}</div></span>${x.video?`<a class="icon-btn sm vid" data-act="video" data-v="${esc(x.video)}" data-n="${esc(x.name)}" href="${esc(x.video)}" target="_blank" rel="noopener" aria-label="סרטון">${I.play}</a>`:''}<button class="icon-btn sm" data-act="libDel" data-v="${i}" aria-label="מחיקה מהספרייה">${I.trash}</button></div>`).join(''):'<div class="empty">תרגיל שנשמר עם סרטון והערה נכנס לכאן, ובפעם הבאה שכותבים את השם הכול מתמלא לבד.</div>'}</div>`;
}
/* =========================================================
   GROWTH (רק כשיקיר מפעיל) — חבר מביא חבר (members.ref, coach.refGiven) + המלצות (members.review)
   ========================================================= */
function refCard(t){
  const g=GROW();if(!g.ref)return '';const link=appUrl()+'?ref='+t.id,txt=`מתאמנים איתי אצל יקיר לוי 💪 בואו גם! נרשמים כאן: ${link}`;
  return `<div class="h-sec"><span>חבר מביא חבר</span></div><div class="card"><div class="row"><span class="medal-ic">${mini(I.users,20)}</span><div class="grow"><b>הזמינו חבר ותקבלו ${esc(g.gift||'מתנה')}</b><div class="small muted">כשמישהו נרשם דרך הקישור שלך ומתחיל להתאמן</div></div></div>
    <div class="row wrap-ok" style="gap:8px;margin-top:12px"><a class="btn btn-wa btn-sm" target="_blank" rel="noopener" href="https://wa.me/?text=${encodeURIComponent(txt)}">${mini(I.wa,14)} שליחה לחבר</a><button class="btn btn-ghost btn-sm" data-act="copyRef">העתקת הקישור</button></div></div>`;
}
const workDays=t=>new Set([...workouts(t).map(w=>w.d),...t.sessions.filter(x=>x.st==='came').map(x=>x.date)]).size;
const revDue=t=>{const g=GROW();return g.rev&&!t.review&&workDays(t)>=(+g.after||10)&&!ls.get('yf-revskip-'+t.id,false)};
function growthLists(){
  const g=GROW(),all=[...tList(),...joinReqs()],refs=all.filter(t=>t.ref&&t.ref!==t.id),revs=tList().filter(t=>t.review);
  return `${g.ref?`<div class="card"><b>הצטרפו דרך חבר · ${refs.length}</b>${refs.length?`<div class="stack" style="gap:8px;margin-top:10px">${refs.map(t=>{const by=T(t.ref);return `<div class="row small"><span class="grow">${esc(by?by.name:'מתאמן')} הביא/ה את <b>${esc(t.name)}</b></span>${DB.coach[t.id]?`<button class="btn ${t.refGiven?'btn-ghost':'btn-primary'} btn-sm" data-act="refGift" data-id="${t.id}">${t.refGiven?'המתנה ניתנה ✓':'סימון: המתנה ניתנה'}</button>`:'<span class="chip warn">ממתין לאישור</span>'}</div>`}).join('')}</div>`:'<div class="small muted" style="margin-top:6px">עוד אין.</div>'}</div>`:''}
  ${g.rev?`<div class="card"><b>המלצות · ${revs.length}</b>${revs.length?`<div class="stack" style="gap:10px;margin-top:10px">${revs.map(t=>`<div><div class="row small"><b class="grow">${esc(firstName(t))} · ${'★'.repeat(+t.review.stars||5)}</b>${t.review.ok?'<span class="chip good">מאשר/ת לפרסם</span>':'<span class="chip">לא לפרסום</span>'}</div><div class="small" style="margin-top:4px">״${esc(t.review.text)}״</div>${t.review.ok?`<button class="linkish" data-act="revCopy" data-id="${t.id}">העתקה לפרסום</button>`:''}</div>`).join('')}</div>`:'<div class="small muted" style="margin-top:6px">עוד אין.</div>'}</div>`:''}`;
}
/* ---------- sheet builders ---------- */
const appUrl=()=>location.origin+location.pathname.replace(/index\.html$/,'');
const inviteMsg=n=>`היי${n?' '+n:''}! 💪 זה הקישור לאפליקציית האימונים של יקיר לוי:\n${appUrl()}\n\nנרשמים עם מייל או עם Google, ממלאים כמה פרטים, ואני מאשר.\nכדאי גם להוסיף את האפליקציה למסך הבית: בספארי לוחצים על כפתור השיתוף ← ״הוספה למסך הבית״.\nיקיר`;
function inviteSheet(){
  sheet('הזמנת מתאמן חדש',`<p class="muted" style="margin-top:0">שולחים קישור לאפליקציה בוואטסאפ. אחרי שהמתאמן יירשם, הוא יופיע אצלך ב״מחכים לאישור״.</p>
    <div class="two">${fld('inv-name','שם (לא חובה)','placeholder="למשל דני" autocomplete="off"')}${fld('inv-phone','טלפון (לא חובה)','type="tel" dir="ltr" inputmode="tel" placeholder="050-0000000"')}</div>
    <p class="small muted" style="margin-top:-4px">בלי מספר, הוואטסאפ ייפתח ותבחר למי לשלוח.</p>
    <div class="item" style="margin-bottom:12px"><span class="grow small" dir="ltr" style="overflow-wrap:anywhere;text-align:start">${esc(appUrl())}</span><button type="button" class="btn btn-ghost btn-sm" data-act="copyInvite">העתקת קישור</button></div>`,fd=>{
    const ph=(fd['inv-phone']||'').trim(),n=(fd['inv-name']||'').trim();
    if(ph&&waPhone(ph).length<11){toast('מספר הטלפון לא תקין');return false}
    window.open(ph?waLink(ph,inviteMsg(n)):'https://wa.me/?text='+encodeURIComponent(inviteMsg(n)),'_blank','noopener');
  },'שליחה בוואטסאפ');
}
function logSheet(tr,v,day){
  const l=lastLog(tr,v), pe=(day&&day.ex.find(x=>x.name===v))||planEx(tr,v), goal=hasKg(pe)?pe.kg:null;
  sheet(esc(v),`<div class="two">${fld('l-kg','משקל (ק״ג)','type="number" step="0.25" min="0" inputmode="decimal" required',goal!=null?goal:l?l.kg:'')}${fld('l-reps','חזרות','type="number" min="1" inputmode="numeric" required',l?l.reps:'')}</div>
  <div class="two">${fld('l-sets','סטים','type="number" min="1" max="20" inputmode="numeric" required',pe?pe.sets:l&&l.sets?l.sets:3)}${fld('l-date','תאריך','type="date" required',today())}</div>
  <div class="item" style="margin-bottom:12px"><label for="l-fail" class="grow"><b>הגעתי לכשל</b><div class="small muted">לא הצלחתי לבצע עוד חזרה</div></label><label class="switch"><input type="checkbox" id="l-fail" name="l-fail" data-act="failToggle"><span></span></label></div>
  <div class="field" id="l-fail-box" hidden><label for="l-failnote">אחרי כמה סטים / חזרות?</label><textarea id="l-failnote" name="l-failnote" maxlength="200" placeholder="למשל: בסט השלישי, אחרי 8 חזרות"></textarea></div>
  ${goal!=null?`<p class="small num" style="margin-bottom:0">יקיר קבע: <b>${goal} ק״ג</b></p>`:''}${l?`<p class="small muted num">בפעם הקודמת: ${l.kg} ק״ג × ${l.reps}${l.sets?' × '+l.sets+' סטים':''}</p>`:''}<p class="small muted">בתרגילים בלי משקל (כמו מתח) כתבו 0.</p>`,fd=>{
    const kg=+fd['l-kg'],r=+fd['l-reps'],n=+fd['l-sets'],d=fd['l-date'];if(!(kg>=0)||!(r>0)||!(n>0)||!d)return false;
    const e={d,ex:v,kg,reps:r,sets:n};if(fd['l-fail']){e.fail=true;e.failNote=(fd['l-failnote']||'').trim()}
    const cnt=(rs,type)=>rs.filter(x=>x.type===type&&x.d===d&&(type==='vol'||x.ex===v)).length;
    const before=records(tr);tr.logs.push(e);const after=records(tr);
    const pk=cnt(after,'kg')>cnt(before,'kg'), pv=cnt(after,'vol')>cnt(before,'vol'), w=workouts(tr).find(x=>x.d===d);
    save(tr,'logs');
    toast(pk&&pv?mini(I.medal,18)+` שני שיאים! ${kgf(kg)} ק״ג ושיא נפח באימון`:pk?mini(I.medal,18)+` שיא אישי חדש! ${kgf(kg)} ק״ג`:pv?mini(I.medal,18)+` שיא נפח חדש: ${kgf(w.vol)} ק״ג באימון`:'נרשם',pk||pv?'badge':'');
  },'רישום');
}
function musPicker(m,auto){
  return `<div class="field"><label>שרירים שעובדים <span class="muted" style="font-weight:400">· לחיצה: עיקרי ← משני ← בלי</span></label><div class="mus-pick" id="mus-pick">${MUS.map(([k,n])=>`<button type="button" class="mchip ${m.p.includes(k)?'p':m.s.includes(k)?'s':''}" data-act="musCycle" data-v="${k}">${n}</button>`).join('')}</div><input type="hidden" name="e-mus" id="e-mus" value="${esc(JSON.stringify(m))}"><span class="small muted" id="mus-hint">${auto?'סימנו לפי שם התרגיל. אפשר לשנות.':''}</span></div>`;
}
function forgotSheet(){
  const em=(($('#a-email')||{}).value||'').trim();
  sheet('שכחתי סיסמה',`<p class="muted" style="margin-top:0">כתבו את המייל שאיתו נרשמתם, ונשלח אליו קישור לבחירת סיסמה חדשה.</p>${fld('f-email','מייל','type="email" inputmode="email" autocomplete="email" dir="ltr" required',em)}`,fd=>{
    const e=(fd['f-email']||'').trim();if(!/^\S+@\S+\.\S+$/.test(e)){toast('כתובת המייל לא תקינה');return false}
    authApi.reset(e).then(()=>{
      if(DEMO){toast('במצב הדגמה לא נשלחים מיילים');return}
      sheet('המייל נשלח ✅',`<p style="margin-top:0">שלחנו קישור ל-<b dir="ltr">${esc(e)}</b>.</p><ol class="small" style="padding-inline-start:20px;line-height:1.8"><li>פתחו את המייל ולחצו על הקישור</li><li>בחרו סיסמה חדשה (לפחות 6 תווים)</li><li>חזרו לכאן והתחברו עם הסיסמה החדשה</li></ol><p class="small muted">לא הגיע תוך כמה דקות? בדקו בתיקיית הספאם או ״קידומי מכירות״. נרשמתם עם Google? אין צורך בסיסמה, פשוט לחצו ״המשך עם Google״.</p>`,()=>{},'הבנתי');
    }).catch(x=>toast(/user-not-found/.test((x&&x.code)||'')?'לא מצאנו חשבון עם המייל הזה':errMsg(x)));
  },'שליחת קישור');
}
function billFields(t,isNew){
  const b=t?billOf(t):'card',f=t?fmtOf(t):'solo';
  return `<div class="two"><div class="field"><label for="b-type">סוג עסקה</label><select id="b-type" name="b-type" data-act="billType">${[['card','כרטיסייה'],['single','לפי אימון'],['monthly','מנוי חודשי'],['online','אונליין (מנוי)']].map(([k,n])=>`<option value="${k}" ${b===k?'selected':''}>${n}</option>`).join('')}</select></div>
    <div class="field"><label for="b-fmt">סוג אימון</label><select id="b-fmt" name="b-fmt" data-act="billType">${FMTS.map(([k,n])=>`<option value="${k}" ${f===k?'selected':''}>${n}</option>`).join('')}</select></div></div>
  <div id="b-dyn" data-new="${isNew?1:''}" data-tid="${t&&t.id?t.id:''}">${billDyn(b,f,t,isNew)}</div>
  <div class="two">${fld('b-rate','מחיר מיוחד (₪)','type="number" min="0" inputmode="numeric" placeholder="לפי המחירון"',t&&+t.rate?t.rate:'')}${fld('b-disc','או הנחה (%)','type="number" min="0" max="100" inputmode="numeric" placeholder="0"',t&&+t.disc?t.disc:'')}</div>
  <p class="small muted" style="margin-top:-6px">מחיר מיוחד גובר על המחירון (בכרטיסייה: מחיר הכרטיסייה כולה). הנחה באחוזים יורדת מהמחירון.</p>`;
}
function billDyn(b,f,t,isNew){
  const P=PRICES(),F=P.fmt[f];
  if(b==='card')return isNew?`${F.cards.some(c=>c.price)?`<div class="cpick">${F.cards.map(c=>`<button type="button" class="pill" data-act="cardPick" data-v="${c.size}|${c.price||''}">${c.size} אימונים${c.price?' · '+ils(c.price):''}</button>`).join('')}</div>`:''}<div class="two">${fld('c-size','אימונים בכרטיסייה','type="number" min="1" inputmode="numeric" data-act="cardSize"',(F.cards[0]||{size:10}).size)}${fld('c-price','מחיר לפי המחירון (₪)','type="number" min="0" inputmode="numeric"',(F.cards[0]||{}).price||'')}</div>`:'<p class="small muted">הכרטיסייה עצמה מתעדכנת ב״חידוש כרטיסייה״.</p>';
  if(b==='monthly')return `<div class="field"><label for="b-freq">כמה אימונים בשבוע</label><select id="b-freq" name="b-freq">${[1,2,3,4,5].map(n=>`<option value="${n}" ${(t&&+t.freq||2)===n?'selected':''}>${n} בשבוע${F.monthly[n]?' · '+ils(F.monthly[n])+' לחודש':''}</option>`).join('')}</select></div>`;
  if(b==='single')return `<p class="small muted">אימון ${FMTN[f]} במחירון: ${F.single?ils(F.single):'עוד לא נקבע (עסק ← מחירון)'}</p>`;
  return `<p class="small muted">אונליין במחירון: ${P.online?ils(P.online)+' לחודש':'עוד לא נקבע (עסק ← מחירון)'}</p>`;
}
const dealFrom=fd=>({bill:fd['b-type']||'card',fmt:fd['b-fmt']||'solo',freq:+fd['b-freq']||2,rate:+fd['b-rate']||0,disc:Math.min(100,Math.max(0,+fd['b-disc']||0))});
function traineeSheet(t){
  sheet(t?'עריכת פרטים':'מתאמן בלי אפליקציה',(t?'':'<p class="small muted" style="margin-top:0">למתאמנים שלא משתמשים באפליקציה. אם ירשמו בהמשך, תוכלו לחבר את הנתונים שלהם בזמן האישור.</p>')+fld('t-name','שם מלא','required',t?t.name:'')+fld('t-phone','טלפון','type="tel" dir="ltr" inputmode="tel"',t?t.phone:'')+fld('t-goal','מטרה','placeholder="למשל ירידה במשקל, כוח, חיטוב"',t?t.goal:'')+fld('t-bday','תאריך לידה (לא חובה)','type="date"',t?t.bday||'':'')+billFields(t,!t),fd=>{
    const name=fd['t-name'].trim();if(!name){toast('צריך למלא שם');return false}
    const dl=dealFrom(fd),sub=['monthly','online'].includes(dl.bill);
    if(t){const wasSub=isSub(t);Object.assign(t,{name,phone:fd['t-phone'],goal:fd['t-goal'],bday:fd['t-bday']||''},dl);if(sub&&!wasSub)t.subStart=ymOf(today());save(t,'name','phone','goal','bday','bill','fmt','freq','rate','disc','subStart')}
    else{const id=api.newId();const m=newMember(name,fd['t-phone'],fd['t-goal']);if(fd['t-bday'])m.bday=fd['t-bday'];const c=Object.assign(newCoach(fd['c-size'],dl.rate||discOf(dl,fd['c-price']),false),{offline:true},dl,sub?{subStart:ymOf(today())}:{});DB.members[id]=m;DB.coach[id]=c;api.set('members',id,m);api.set('coach',id,c);ui.sel=id;ui.tab='people';render();toast('המתאמן נוסף, עם תוכנית בסיס לעריכה')}
  });
}
function joinSheet(t){
  const offline=tList().filter(x=>x.offline);
  sheet('אישור '+esc(cleanName(t.name)),`${t.wants==='online'?`<p class="small" style="margin-top:0">${mini(I.vid,14)} ביקש/ה <b>ליווי אונליין</b>. אפשר לשנות כאן.</p>`:''}${billFields(t.wants==='online'?{bill:'online'}:null,true)}
  <div class="item" style="margin-bottom:12px"><label for="c-paid" class="grow">שולם כבר</label><label class="switch"><input type="checkbox" id="c-paid" name="c-paid"><span></span></label></div>
  ${offline.length?`<div class="field"><label for="c-link">כבר רשום אצלך בלי אפליקציה?</label><select id="c-link" name="c-link"><option value="">לא, מתאמן חדש</option>${offline.map(o=>`<option value="${o.id}">לחבר ל: ${esc(o.name)}</option>`).join('')}</select><span class="small muted">בחיבור, התוכנית, הכרטיסייה והאימונים של המתאמן יעברו לחשבון החדש.</span></div>`:''}`,fd=>{
    const link=fd['c-link'];
    if(link){
      const o=T(link), c=clone(DB.coach[link]);c.offline=false;c.approved=true;
      const m={};['logs','body','food'].forEach(k=>{if(o[k].length&&!t[k].length)m[k]=o[k]});if(!t.goal&&o.goal)m.goal=o.goal;
      api.replace('coach',t.id,c);DB.coach[t.id]=c;if(Object.keys(m).length)api.set('members',t.id,m);
      (DB.photos[link]||[]).forEach(p=>api.set('photos',p.id,{owner:t.id}));
      api.del('coach',link);api.del('members',link);delete DB.coach[link];delete DB.members[link];
    }else{const dl=dealFrom(fd),paid=!!fd['c-paid'],c=Object.assign(newCoach(fd['c-size'],dl.rate||discOf(dl,fd['c-price']),dl.bill==='card'&&paid),dl);
      if(['monthly','online'].includes(dl.bill)){c.subStart=ymOf(today());if(paid)c.subPays=[{m:c.subStart,paidDate:today(),price:rateOf(c)}]}
      DB.coach[t.id]=c;api.set('coach',t.id,c)}
    render();toast('המתאמן אושר');
    waNext('המתאמן אושר ✅',`רוצה לעדכן את ${esc(firstName(t))} בוואטסאפ?`,t.phone,`היי ${firstName(t)}, אישרתי אותך באפליקציית Yakir fit 💪 אפשר להיכנס, לראות את התוכנית ולקבוע אימונים. יקיר`,'שליחת עדכון בוואטסאפ');
  },'אישור');
}
function renewSheet(tr){
  const F=PRICES().fmt[fmtOf(tr)],sz=tr.card.size||10;
  sheet('חידוש כרטיסייה',`<p class="small muted" style="margin-top:0">${esc(FMTN[fmtOf(tr)])}${+tr.rate?' · מחיר מיוחד '+ils(tr.rate):+tr.disc?` · הנחה ${tr.disc}%`:''}</p>${F.cards.some(c=>c.price)?`<div class="cpick">${F.cards.map(c=>`<button type="button" class="pill" data-act="cardPick" data-v="${c.size}|${cardPriceFor(tr,c.size)||''}">${c.size} אימונים${c.price?' · '+ils(cardPriceFor(tr,c.size)):''}</button>`).join('')}</div>`:''}<div class="two">${fld('c-size','מספר אימונים','type="number" min="1" max="100" inputmode="numeric" required data-act="cardSize" data-fmt="'+fmtOf(tr)+'" data-tid="'+tr.id+'"',sz)}${fld('c-price','מחיר (₪)','type="number" min="0" inputmode="numeric"',cardPriceFor(tr,sz)||tr.card.price||'')}</div><div class="item" style="margin-bottom:12px"><label for="c-paid" class="grow">שולם כבר</label><label class="switch"><input type="checkbox" id="c-paid" name="c-paid"><span></span></label></div><p class="small muted">הספירה תתחיל מהיום. אימונים שכבר נקבעו מהיום והלאה ייספרו בכרטיסייה החדשה.</p>`,fd=>{
    const n=+fd['c-size'];if(!(n>0))return false;
    tr.cardHistory=tr.cardHistory.concat([Object.assign({},tr.card,{used:cardInfo(tr).used})]);
    tr.card={size:n,start:today(),price:+fd['c-price']||0,paid:!!fd['c-paid'],paidDate:fd['c-paid']?today():''};tr.renewReq=false;
    save(tr,'card','cardHistory','renewReq');toast('הכרטיסייה חודשה');
  },'חידוש');
}
function sessionSheet(tid){
  const ts=tList();if(!ts.length){toast('עוד אין מתאמנים');return}
  sheet('קביעת אימון',`<div class="field"><label for="s-t">מתאמן</label><select id="s-t" name="s-t">${ts.map(t=>`<option value="${t.id}" ${t.id===(tid||ui.sel)?'selected':''}>${esc(t.name)} (${cardInfo(t).none?BILL_NAME[billOf(t)]:cardInfo(t).left+' נשארו'})</option>`).join('')}</select></div><div class="two">${fld('s-date','תאריך','type="date" required',tid?today():ui.day)}${fld('s-time','שעה','type="time" step="900" required','18:00')}</div>`,fd=>{
    if(!fd['s-date']||!fd['s-time'])return false;
    const clash=daySess(fd['s-date']).find(s=>s.time===fd['s-time']);
    if(clash){toast('בשעה הזו כבר יש אימון עם '+esc(T(clash.tid).name));return false}
    const t=T(fd['s-t']);t.sessions=t.sessions.concat([{id:uid(),date:fd['s-date'],time:fd['s-time'],by:'trainer'}]);ui.day=fd['s-date'];save(t,'sessions');toast('האימון נקבע');
    waNext('האימון נקבע ✅',`רוצה לעדכן את ${esc(firstName(t))} בוואטסאפ?`,t.phone,`היי ${firstName(t)}, קבעתי לך אימון ב${fmt(fd['s-date'])} בשעה ${fd['s-time']} 💪 יקיר`,'שליחת עדכון בוואטסאפ');
  },'קביעה');
}
function exSheet(t,day,ex){
  sheet(ex?'עריכת תרגיל':'תרגיל חדש',fld('e-name','שם התרגיל','required list="ex-lib" autocomplete="off"',ex?ex.name:'')+`<datalist id="ex-lib">${libNames().map(n=>`<option value="${esc(n)}">`).join('')}</datalist>`+`<div class="two">${fld('e-sets','סטים','type="number" min="1" inputmode="numeric"',ex?ex.sets:3)}${fld('e-reps','חזרות','',ex?ex.reps:'10')}</div>`+fld('e-kg','משקל (ק״ג)','type="number" step="0.25" min="0" inputmode="decimal" placeholder="לא חובה"',hasKg(ex)?ex.kg:'')+fld('e-note','הערה','placeholder="מנוחה 90 שניות, קצב איטי…"',ex?ex.note:'')+`<div class="item" style="margin-bottom:12px"><label for="e-ss" class="grow"><b>סופר-סט</b><div class="small muted">מבצעים ברצף עם התרגיל שלפניו, בלי מנוחה ביניהם</div></label><label class="switch"><input type="checkbox" id="e-ss" name="e-ss" ${ex&&ex.ss?'checked':''}><span></span></label></div>`+musPicker(ex&&ex.mus&&ex.mus.p&&ex.mus.p.length?ex.mus:guessMus(ex?ex.name:''),!(ex&&ex.mus))+fld('e-video','קישור לסרטון הדגמה (לא חובה)','type="url" dir="ltr" inputmode="url" placeholder="https://youtu.be/…"',ex?ex.video||'':'')+'<p class="small muted" style="margin-top:-6px">אפשר להדביק קישור מיוטיוב, מאינסטגרם או מטיקטוק.</p>'+`<div class="item" style="margin-bottom:12px"><label for="e-lib" class="grow"><b>שמירה בספרייה שלי</b><div class="small muted">בפעם הבאה שכותבים את השם, הסרטון, ההערה והשרירים יתמלאו לבד</div></label><label class="switch"><input type="checkbox" id="e-lib" name="e-lib" checked><span></span></label></div>`,fd=>{
    if(!fd['e-name'].trim())return false;
    let video=(fd['e-video']||'').trim();if(video&&!/^https?:\/\//i.test(video))video='https://'+video;
    if(video){try{new URL(video)}catch(x){toast('הקישור לסרטון לא תקין');return false}}
    const kg=String(fd['e-kg']||'').trim();
    let mus;try{mus=JSON.parse(fd['e-mus']||'')}catch(x){}if(!mus||!Array.isArray(mus.p))mus=guessMus(fd['e-name']);
    const o={name:fd['e-name'].trim(),sets:+fd['e-sets']||3,reps:fd['e-reps']||'10',kg:kg!==''&&+kg>=0?+kg:'',mus:{p:mus.p,s:mus.s},note:fd['e-note']||'',video,ss:!!fd['e-ss']};
    if(ex)Object.assign(ex,o);else day.ex.push(Object.assign({id:uid()},o));save(t,'plan');
    if(fd['e-lib']&&(o.video||o.note))saveSettings({exlib:EXLIB().filter(x=>x.name!==o.name).concat([{name:o.name,mus:o.mus,video:o.video,note:o.note}])});
  });
  const nm=$('#e-name'),h=$('#e-mus');
  if(nm)nm.addEventListener('change',()=>{const L=EXLIB().find(x=>x.name===nm.value.trim());if(!L)return;const vi=$('#e-video'),no=$('#e-note');if(vi&&!vi.value&&L.video)vi.value=L.video;if(no&&!no.value&&L.note)no.value=L.note;
    if(h&&!h.dataset.touched&&L.mus){h.value=JSON.stringify(L.mus);document.querySelectorAll('#mus-pick .mchip').forEach(b=>{const k=b.dataset.v;b.className='mchip '+(L.mus.p.includes(k)?'p':(L.mus.s||[]).includes(k)?'s':'')})}toast('מולא מהספרייה שלך')});
  if(nm&&h)nm.addEventListener('input',()=>{if(h.dataset.touched)return;const g=guessMus(nm.value);h.value=JSON.stringify(g);document.querySelectorAll('#mus-pick .mchip').forEach(b=>{const k=b.dataset.v;b.className='mchip '+(g.p.includes(k)?'p':g.s.includes(k)?'s':'')});$('#mus-hint').textContent=g.p.length?'סימנו לפי שם התרגיל. אפשר לשנות.':''});
}
function foodSheet(t,m){
  sheet(m?'עריכת ארוחה':'ארוחה חדשה',fld('m-meal','ארוחה','required placeholder="בוקר / ביניים / צהריים / ערב"',m?m.meal:'')+`<div class="field"><label for="m-text">מה אוכלים</label><textarea id="m-text" name="m-text" required>${esc(m?m.text:'')}</textarea></div>`,fd=>{
    if(!fd['m-meal'].trim()||!fd['m-text'].trim())return false;
    if(m){m.meal=fd['m-meal'];m.text=fd['m-text']}else t.food.push({id:uid(),meal:fd['m-meal'],text:fd['m-text']});save(t,'food');
  });
}
function bodySheet(tr){
  const l=tr.body.slice().sort((x,y)=>x.d.localeCompare(y.d)).pop()||{};
  const nf=(id,lab,val)=>fld(id,lab,'type="number" step="0.1" min="0" inputmode="decimal"',val||'');
  sheet('מדידה חדשה',fld('b-date','תאריך','type="date" required',today())+`<div class="two">${nf('b-kg','משקל (ק״ג)',l.kg)}${nf('b-waist','מותניים (ס״מ)',l.waist)}</div><div class="two">${nf('b-chest','חזה (ס״מ)',l.chest)}${nf('b-hips','ירכיים (ס״מ)',l.hips)}</div>`+nf('b-arm','זרוע (ס״מ)',l.arm)+'<p class="small muted">אפשר למלא רק חלק מהשדות.</p>',fd=>{
    if(!fd['b-date'])return false;const e={d:fd['b-date']};['kg','waist','chest','hips','arm'].forEach(k=>{const x=fd['b-'+k];if(x!==''&&!isNaN(+x))e[k]=+x});
    if(Object.keys(e).length<2){toast('מלאו לפחות מדד אחד');return false}
    tr.body=tr.body.filter(x=>x.d!==e.d).concat([e]);save(tr,'body');toast('המדידה נשמרה');
  });
}
function waSheet(t){
  const nx=sessOf(t).find(s=>s.date+s.time>=today()+nowHM()), ci=cardInfo(t), n=firstName(t);
  const opts=[];
  if(nx)opts.push(['תזכורת לאימון הבא',`היי ${n}, תזכורת לאימון ב${fmt(nx.date)} בשעה ${nx.time} 💪 יקיר`]);
  const b=billOf(t),o=owed(t);
  if(b==='card')opts.push(['חידוש כרטיסייה',`היי ${n}, נשארו לך ${ci.left} אימונים בכרטיסייה. רוצה שנחדש? יקיר`]);
  else if(o.n)opts.push(['תזכורת תשלום',payMsg(t,o.amount)]);
  if(b==='card'&&!t.card.paid)opts.push(['תזכורת תשלום',`היי ${n}, תזכורת קטנה לגבי התשלום על הכרטיסייה${t.card.price?' (₪'+t.card.price+')':''}. תודה! יקיר`]);
  opts.push(['עדכון תוכנית',`היי ${n}, עדכנתי לך את תוכנית האימונים באפליקציית Yakir fit. תציץ/י לפני האימון הבא 🔥`]);
  opts.push(['הודעה ריקה','']);
  sheet('וואטסאפ ל'+esc(n),`<div class="small muted num" style="margin-bottom:10px">מספר: <span style="user-select:all" dir="ltr">${esc(t.phone)}</span></div><div class="stack">${opts.map(([l,m])=>`<a class="wa-opt" href="${waLink(t.phone,m)}" target="_blank" rel="noopener"><span style="color:#3ddc84">${mini(I.wa,20)}</span><span><b>${l}</b>${m?`<div class="small muted">${esc(m)}</div>`:''}</span></a>`).join('')}</div>`,()=>{},'סגירה');
}

/* ---------- motion: כניסה למסכים, חשיפה בגלילה ----------
   רק כשעוברים מסך (לשונית / מתאמן / תפקיד). רינדור חוזר של אותו מסך (שמירת נתונים) לא מנפיש כלום. */
const RM=!!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches);
let lastScreen='',revealIO=null;
const screenKey=()=>[user?user.uid:(authReady?'auth':'-'),ui.role,ui.tab,ui.sel,ui.aw?'aw':'',ui.sum?ui.sum.key:'',ui.role==='trainee'?(DB.myM?1:0)+''+(DB.myC&&DB.myC.approved?1:0):''].join('|');
function afterRender(){
  const k=screenKey(),app=$('#app');
  if(!app||k===lastScreen||RM||app.querySelector('.loading')){if(!(app&&app.querySelector('.loading')))lastScreen=k;return}
  lastScreen=k;
  if(revealIO)revealIO.disconnect();
  revealIO='IntersectionObserver' in window?new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');revealIO.unobserve(e.target)}}),{rootMargin:'0px 0px -6% 0px'}):null;
  const vh=innerHeight;let i=0;
  const hide=el=>{if(revealIO){el.classList.add('rv');revealIO.observe(el)}};
  [...app.children].forEach(el=>{
    if(el.getBoundingClientRect().top<vh){el.style.setProperty('--i',i++);el.classList.add('anim-in')}
    else if(el.matches('.stack,.badges,.photos'))[...el.children].forEach(hide);
    else hide(el);
  });
}
document.addEventListener('input',e=>{const r=e.target.closest('[data-act="cmpR"]');if(r){r.closest('.cmp').style.setProperty('--p',r.value+'%');return}});
document.addEventListener('input',e=>{const el=e.target.closest('[data-act="awIn"]');if(!el)return;const id=awT()&&awT().id,m=id&&DB.members[id];if(!m||!m.live)return;const [ei,si,k]=el.dataset.id.split('|'),x=m.live.ex[+ei]&&m.live.ex[+ei].sets[+si];if(x)x[k]=el.value===''?'':+el.value});
const _render=render;
render=function(){
  const ae=document.activeElement,fid=ae&&ae.dataset&&ae.dataset.act==='awIn'?ae.dataset.id:null;
  _render();
  if(fid){const n=document.querySelector(`[data-act="awIn"][data-id="${fid}"]`);if(n&&document.activeElement!==n)n.focus({preventScroll:true})}
  afterRender();
};
addEventListener('scroll',()=>{const t=$('#top');if(t)t.classList.toggle('scrolled',scrollY>8)},{passive:true});

try{const rf=new URLSearchParams(location.search).get('ref');if(rf)ls.set('yf-ref',rf)}catch(e){}
/* ---------- boot ---------- */
if('serviceWorker' in navigator&&location.protocol==='https:'&&!DEMO){navigator.serviceWorker.register('sw.js').catch(()=>{})}
render();
})();
