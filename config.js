/* ==========================================================
   הגדרות Yakir fit
   1. הדביקו כאן את פרטי ה-Firebase של הפרויקט (מתוך
      Project settings > Your apps > SDK setup and configuration > Config).
   2. כתבו את המייל של יקיר ב-coachEmails. רק מי שנכנס עם המייל הזה
      יקבל גישת מאמן. אותו מייל צריך להופיע גם בקובץ firestore.rules.
   כל עוד apiKey לא מולא, האפליקציה עובדת במצב הדגמה.
   ========================================================== */
window.YF_CONFIG = {
  firebase: {
    apiKey: "AIzaSyCgBt0GvWOX8ML9cmYkEVZgMYVbk7JTLQ0",
    authDomain: "yakir-fit.firebaseapp.com",
    projectId: "yakir-fit",
    storageBucket: "yakir-fit.firebasestorage.app",
    messagingSenderId: "751437291544",
    appId: "1:751437291544:web:919717cdd9100f9153636d"
  },
  coachEmails: ["yakir17177@gmail.com"]
};