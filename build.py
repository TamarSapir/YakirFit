css=open('base.css',encoding='utf-8').read()+open('extra.css',encoding='utf-8').read()+open('theme.css',encoding='utf-8').read()
app=open('app.js',encoding='utf-8').read()
fonts='<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;700;800&family=Karantina:wght@400;700&family=Rubik:wght@500;600;700;800&display=swap">'
body='''<div class="wrap" dir="rtl" lang="he">
  <header class="top" id="top" hidden></header>
  <main id="app"><div class="loading">טוען…</div></main>
</div>
<nav class="tabs" id="tabs" dir="rtl"></nav>
<div id="sheet" dir="rtl"></div>
<div id="toast" dir="rtl"></div>'''
FB='10.12.2'
standalone=f'''<!doctype html>
<html lang="he" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#0c0f13">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Yakir fit">
<title>Yakir fit</title>
<link rel="manifest" href="manifest.json">
<link rel="icon" href="icon-192.png">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
{fonts}
<style>
html{{background:#0c0f13}}
:root{{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}}
body{{margin:0}}
img{{max-width:100%}}
[hidden]{{display:none!important}}
{css}
</style>
</head>
<body>
{body}
<script src="https://www.gstatic.com/firebasejs/{FB}/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/{FB}/firebase-auth-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/{FB}/firebase-firestore-compat.js"></script>
<script src="config.js"></script>
<script src="app.js"></script>
</body>
</html>
'''
open('index.html','w',encoding='utf-8',newline='\n').write(standalone)
demo=f'''<title>Yakir fit</title>
<meta name="claude:viewport-fit-sides" content="cover">
{fonts}
<style>
{css}
</style>
{body}
<script>window.YF_CONFIG={{}};</script>
<script>
{app}
</script>
'''
open('../yakir-fit-demo.html','w',encoding='utf-8').write(demo)
print('ok')
