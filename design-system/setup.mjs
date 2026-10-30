// 디자인 시스템 후보 4종을 한 번에 설치하고, 필요한 파일이 받아졌는지 확인합니다.
// 실행: GMA 폴더에서 `node design-system/setup.mjs`
import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));

// 각 시스템에서 "이 파일이 있으면 설치 성공"으로 보는 대표 파일
const systems = {
  material: [
    'node_modules/@material/web/all.js',
    'node_modules/@material/web/tokens/_index.scss',
    'node_modules/material-symbols/material-symbols-outlined.woff2',
    'node_modules/@fontsource/roboto/400.css',
    'node_modules/@fontsource-variable/google-sans/index.css',
    'node_modules/@fontsource-variable/google-sans-flex/index.css',
  ],
  'base-web': [
    'node_modules/baseui/index.js',
    'node_modules/baseui/themes/light-theme',
    'node_modules/baseui/tokens/index.js',
  ],
  pajamas: [
    'node_modules/@gitlab/ui/dist/index.js',
    'node_modules/@gitlab/ui/src/tokens/build/css/tokens.css',
    'node_modules/@gitlab/fonts/gitlab-sans/GitLabSans.woff2',
    'node_modules/@gitlab/svgs/dist/icons.svg',
  ],
  fluent: [
    'node_modules/@fluentui/react-components/lib/index.js',
    'node_modules/@fluentui/react-icons/package.json',
  ],
};

const major = Number(process.versions.node.split('.')[0]);
if (major < 18) {
  console.error(`Node.js 18 이상이 필요합니다. 지금 버전: ${process.versions.node}`);
  process.exit(1);
}

let failed = false;
for (const [name, files] of Object.entries(systems)) {
  const dir = join(root, name);
  console.log(`\n[${name}] 설치 중...`);
  try {
    execSync('npm ci --no-audit --no-fund', { cwd: dir, stdio: 'inherit' });
  } catch {
    console.error(`[${name}] 설치 실패`);
    failed = true;
    continue;
  }
  const missing = files.filter((f) => !existsSync(join(dir, f)));
  if (missing.length) {
    console.error(`[${name}] 빠진 파일:\n  ${missing.join('\n  ')}`);
    failed = true;
  } else {
    console.log(`[${name}] 확인 완료 (${files.length}개 파일)`);
  }
}

console.log(failed ? '\n일부 설치에 실패했습니다. 위 메시지를 확인해 주세요.' : '\n네 디자인 시스템 설치와 확인이 모두 끝났습니다.');
process.exit(failed ? 1 : 0);
