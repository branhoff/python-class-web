const TOPBAR_STYLE = `.topbar { display: flex; justify-content: space-between; align-items: center; gap: 1rem; margin-bottom: 1.25rem; min-height: 2.75rem; }
.topbar-left { min-width: 0; }
a.account-link { font-family: 'Departure Mono', ui-monospace, monospace; font-size: .95rem; background: #fff1e8; color: #1d2b53; border: 2px solid #000; border-radius: 0; padding: .4rem .8rem; box-shadow: 3px 3px 0 #000; text-decoration: none; max-width: 18rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-left: auto; }
a.account-link:visited { color: #1d2b53; }
a.account-link:active { box-shadow: 1px 1px 0 #000; transform: translate(2px, 2px); }
a.account-link.signed-in::before { content: '\\25CF'; color: #008751; margin-right: .45rem; }
.continue { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; background: #fff1e8; border: 3px solid #000; box-shadow: 5px 5px 0 #000; padding: .75rem 1rem; margin: 1.25rem 0; }
.continue[hidden] { display: none; }
.continue-label { font-family: 'Departure Mono', ui-monospace, monospace; font-size: .75rem; text-transform: uppercase; letter-spacing: 1px; color: #5f574f; }
a.continue-link { font-family: 'Departure Mono', ui-monospace, monospace; font-size: .95rem; background: #7e2553; color: #fff1e8; border: 2px solid #000; border-radius: 0; padding: .4rem .8rem; box-shadow: 3px 3px 0 #000; text-decoration: none; }
a.continue-link:visited { color: #fff1e8; }
a.continue-link:active { box-shadow: 1px 1px 0 #000; transform: translate(2px, 2px); }
`;

export const LESSON_STYLE = `
@font-face { font-family: 'Departure Mono'; src: url('/static/fonts/departure-mono.woff2') format('woff2'); font-display: swap; }
@font-face { font-family: 'Press Start 2P'; src: url('/static/fonts/press-start-2p.woff2') format('woff2'); font-display: swap; }
body { font-family: system-ui, sans-serif; max-width: 64rem; margin: 2rem auto; padding: 0 1rem; line-height: 1.6; color: #1a1a2e; background: #f0f0f4; }
h1, h2, h3 { font-family: 'Press Start 2P', system-ui, sans-serif; color: #1d2b53; line-height: 1.7; }
h1 { font-size: 1.15rem; letter-spacing: 1px; }
h2 { font-size: .85rem; margin-top: 2rem; }
h3 { font-size: .7rem; }
a { color: #1d2b53; }
a:visited { color: #7e2553; }
pre, textarea, code { font-family: 'Departure Mono', ui-monospace, monospace; }
pre, textarea { padding: .75rem; border: 2px solid #000; border-radius: 0; font-size: 1rem; line-height: 1.4; }
pre { background: #fff1e8; color: #1a1a2e; white-space: pre-wrap; overflow-wrap: break-word; }
.hljs-comment { color: #5f574f; font-style: italic; }
.hljs-keyword, .hljs-literal, .hljs-meta { color: #7e2553; }
.hljs-string { color: #008751; }
.hljs-number { color: #ab5236; }
.hljs-built_in, .hljs-title { color: #1d2b53; }
textarea { background: #1d2b53; color: #fff1e8; width: 100%; box-sizing: border-box; }
.cell { border-left: 4px solid #29adff; padding-left: 1rem; margin: 1.5rem 0; }
.cell.exercise { border-left-color: #ffa300; }
.cell.completed { border-left-color: #00e436; }
.output { background: #5f574f; color: #fff1e8; white-space: pre-wrap; }
.output.pass { border-color: #00e436; }
.verdict.pass { color: #00e436; }
.output.fail { border-color: #ff004d; }
.verdict.fail { color: #ff77a8; }
button.run, button.stop, button.send, .pager a, a.home { font-family: 'Departure Mono', ui-monospace, monospace; font-size: .95rem; background: #7e2553; color: #fff1e8; border: 2px solid #000; border-radius: 0; padding: .4rem .8rem; box-shadow: 3px 3px 0 #000; cursor: pointer; text-decoration: none; display: inline-block; }
button.run:active, button.stop:active, button.send:active, .pager a:active, a.home:active { box-shadow: 1px 1px 0 #000; transform: translate(2px, 2px); }
button.stop { background: #ab5236; margin-left: .5rem; }
button.stop[hidden] { display: none; }
.stdin { display: flex; gap: .5rem; margin-top: .5rem; }
.stdin[hidden] { display: none; }
.stdin input { flex: 1 1 auto; min-width: 0; font-family: 'Departure Mono', ui-monospace, monospace; font-size: 1rem; padding: .4rem .6rem; border: 2px solid #000; border-radius: 0; background: #fff; color: #1a1a2e; }
.stdin input:focus { outline: 3px solid #29adff; outline-offset: 0; }
.notice-error { font-family: 'Departure Mono', ui-monospace, monospace; color: #ff004d; border: 2px solid #ff004d; background: #fff; padding: .5rem .75rem; }
button.run:disabled { background: #c2c3c7; color: #5f574f; box-shadow: 3px 3px 0 #5f574f; cursor: default; }
.badge { font-family: 'Departure Mono', ui-monospace, monospace; color: #008751; margin-left: .5rem; font-size: .9em; }
.layout { display: flex; gap: 2rem; align-items: flex-start; }
.sidebar { flex: 0 0 14rem; position: sticky; top: 1rem; background: #fff; border: 2px solid #1d2b53; padding: .75rem; }
.sidebar summary { font-family: 'Press Start 2P', system-ui, sans-serif; font-size: .6rem; line-height: 1.6; cursor: pointer; margin: .4rem 0; }
.sidebar summary .count { font-family: 'Departure Mono', ui-monospace, monospace; font-size: .85rem; margin-left: .5rem; color: #5f574f; }
.sidebar li.complete > a::before { content: '\\2713 '; color: #008751; }
.sidebar .group-label { font-family: 'Departure Mono', ui-monospace, monospace; font-size: .75rem; text-transform: uppercase; letter-spacing: 1px; color: #5f574f; margin: .75rem 0 .25rem; padding-top: .6rem; border-top: 1px solid #c2c3c7; }
.projects { margin-top: 2.5rem; border-top: 2px solid #1d2b53; }
.sidebar ul { list-style: none; padding-left: .75rem; margin: .25rem 0 .75rem; }
.sidebar li { margin: .3rem 0; }
.sidebar a { font-family: 'Departure Mono', ui-monospace, monospace; font-size: .95rem; text-decoration: none; }
.sidebar a[aria-current="page"] { color: #7e2553; font-weight: 700; }
main { flex: 1 1 auto; min-width: 0; }
.pager { display: flex; justify-content: space-between; gap: 1rem; margin-top: 3rem; }
${TOPBAR_STYLE}.project-done { margin-top: 2rem; padding: .75rem 1rem; background: #fff1e8; border: 3px solid #000; box-shadow: 5px 5px 0 #000; }
.project-done .check { display: flex; align-items: center; gap: .6rem; font-family: 'Departure Mono', ui-monospace, monospace; font-size: 1rem; cursor: pointer; }
.project-done input[type="checkbox"] { width: 1.4rem; height: 1.4rem; accent-color: #00e436; cursor: pointer; }
.project-done input[type="checkbox"]:disabled { cursor: default; }
.project-done .hint { margin: .5rem 0 0; font-size: .9rem; color: #5f574f; }
`;

export const HOME_STYLE = `
@font-face { font-family: 'Press Start 2P'; src: url('/static/fonts/press-start-2p.woff2') format('woff2'); font-display: swap; }
@font-face { font-family: 'Departure Mono'; src: url('/static/fonts/departure-mono.woff2') format('woff2'); font-display: swap; }

body { font-family: system-ui, sans-serif; max-width: 64rem; margin: 2rem auto; padding: 0 1rem; line-height: 1.6; color: #1a1a2e; background: #f0f0f4; }
h1, h2 { font-family: 'Press Start 2P', system-ui, sans-serif; color: #1d2b53; line-height: 1.7; }
h1 { font-size: 1.15rem; letter-spacing: 1px; }
h2 { font-size: .8rem; margin-top: 2rem; }
a { color: #1d2b53; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(13rem, 1fr)); gap: 1.25rem; margin-top: 1.5rem; }
.course { aspect-ratio: 1 / 1; border: 3px solid #000; box-shadow: 5px 5px 0 #000; padding: 1rem; display: flex; flex-direction: column; text-decoration: none; background: #fff1e8; color: #1a1a2e; }
.course .title { font-family: 'Press Start 2P', system-ui, sans-serif; font-size: .75rem; color: #1d2b53; line-height: 1.6; }
.course .desc { font-size: .95rem; margin-top: .5rem; flex: 1 1 auto; }
.course.available:active { box-shadow: 2px 2px 0 #000; transform: translate(3px, 3px); }
.course.soon { background: #c2c3c7; color: #5f574f; box-shadow: 5px 5px 0 #5f574f; cursor: default; }
.course.soon .title { color: #5f574f; }
.tag { font-family: 'Departure Mono', ui-monospace, monospace; font-size: .8rem; text-transform: uppercase; letter-spacing: 1px; }
.bar { height: .9rem; border: 2px solid #000; background: #fff; margin-top: .5rem; }
.bar > span { display: block; height: 100%; width: 0; background: #00e436; }
.count { font-family: 'Departure Mono', ui-monospace, monospace; font-size: .85rem; margin-top: .35rem; }
.lessons { list-style: none; padding-left: 0; }
.lessons li { margin: .4rem 0; }
.group-label { font-family: 'Departure Mono', ui-monospace, monospace; font-size: .8rem; text-transform: uppercase; letter-spacing: 1px; color: #5f574f; margin: 1rem 0 .25rem; }
.lessons a { font-family: 'Departure Mono', ui-monospace, monospace; font-size: 1rem; }
.back { font-family: 'Departure Mono', ui-monospace, monospace; }
${TOPBAR_STYLE}.panel { background: #fff1e8; border: 3px solid #000; box-shadow: 5px 5px 0 #000; padding: 1.25rem; max-width: 30rem; margin: 1.5rem 0; }
.panel p { margin: .5rem 0; }
.tabs { display: flex; gap: .5rem; margin-bottom: 1rem; }
.tab { font-family: 'Departure Mono', ui-monospace, monospace; font-size: .95rem; background: #fff; color: #1d2b53; border: 2px solid #000; border-radius: 0; padding: .4rem .8rem; cursor: pointer; }
.tab[aria-selected="true"] { background: #1d2b53; color: #fff1e8; }
.field { display: block; margin: .75rem 0; font-family: 'Departure Mono', ui-monospace, monospace; font-size: .9rem; }
.field input { display: block; width: 100%; box-sizing: border-box; margin-top: .25rem; font-family: inherit; font-size: 1rem; padding: .5rem; border: 2px solid #000; border-radius: 0; background: #fff; color: #1a1a2e; }
.field input:focus { outline: 3px solid #29adff; outline-offset: 0; }
button.btn { font-family: 'Departure Mono', ui-monospace, monospace; font-size: .95rem; background: #7e2553; color: #fff1e8; border: 2px solid #000; border-radius: 0; padding: .4rem .8rem; box-shadow: 3px 3px 0 #000; cursor: pointer; }
button.btn:active { box-shadow: 1px 1px 0 #000; transform: translate(2px, 2px); }
button.btn:disabled { background: #c2c3c7; color: #5f574f; box-shadow: 3px 3px 0 #5f574f; cursor: default; }
button.link { font-family: 'Departure Mono', ui-monospace, monospace; font-size: .85rem; background: none; border: 0; color: #1d2b53; text-decoration: underline; cursor: pointer; padding: 0; }
.actions { display: flex; align-items: center; gap: 1.25rem; margin-top: .75rem; }
.error { color: #ff004d; font-family: 'Departure Mono', ui-monospace, monospace; font-size: .9rem; min-height: 1.2em; }
.notice { color: #008751; font-family: 'Departure Mono', ui-monospace, monospace; font-size: .9rem; }
.account-courses { list-style: none; padding: 0; max-width: 30rem; }
.account-courses li { margin: 1rem 0; }
`;
