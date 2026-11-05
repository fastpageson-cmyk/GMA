// 실행: 레포 루트에서 node src/fonts/download-fonts.mjs
// Google Fonts CSS를 받아 woff2를 내려받고, 로컬 경로로 바꾼 fonts.css를 만든다.
import { mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const out = process.argv[2] ?? new URL('.', import.meta.url).pathname;
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';
const families = [
  ['roboto', 'https://fonts.googleapis.com/css2?family=Roboto:wght@400..700&display=swap'],
  ['noto-sans-kr', 'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400..700&display=swap'],
  ['material-symbols', 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block'],
];
let total = 0, css = '/* Google Fonts에서 받아 둔 로컬 폰트. 다시 받기: node src/fonts/download-fonts.mjs */\n';
for (const [dir, url] of families) {
  const r = await fetch(url, { headers: { 'user-agent': UA } });
  if (!r.ok) throw new Error(`${url} ${r.status}`);
  let text = await r.text();
  await mkdir(`${out}/${dir}`, { recursive: true });
  const urls = [...new Set([...text.matchAll(/url\((https:[^)]+)\)/g)].map((m) => m[1]))];
  let i = 0;
  for (const u of urls) {
    const f = await fetch(u, { headers: { 'user-agent': UA } });
    if (!f.ok) throw new Error(`${u} ${f.status}`);
    const buf = Buffer.from(await f.arrayBuffer());
    const name = `${dir}-${String(i++).padStart(3, '0')}.woff2`;
    await writeFile(`${out}/${dir}/${name}`, buf);
    total += buf.length;
    text = text.replaceAll(u, `${dir}/${name}`);
  }
  css += `\n/* ${dir}: ${urls.length}개 파일 */\n${text}`;
  console.log(dir, urls.length, 'files');
}
await writeFile(`${out}/fonts.css`, css);
console.log('total MB', (total / 1e6).toFixed(2));
