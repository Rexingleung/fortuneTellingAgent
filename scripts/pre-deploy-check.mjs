// scripts/pre-deploy-check.mjs
// 部署前检查脚本

import fs from 'fs';
import path from 'path';

console.log('🔍 部署前检查...');

// 检查必需文件
const requiredFiles = [
  'src/mastra/utils/streaming.ts',
  'src/mastra/agents/streaming.ts',
  'src/api/stream.ts',
  'src/index.ts',
  'wrangler.toml'
];

let allFilesExist = true;

for (const file of requiredFiles) {
  if (!fs.existsSync(file)) {
    console.error(`❌ 缺少必需文件: ${file}`);
    allFilesExist = false;
  } else {
    console.log(`✅ ${file}`);
  }
}

// 检查环境变量
if (!process.env.CLOUDFLARE_API_TOKEN && !process.env.CF_API_TOKEN) {
  console.warn('⚠️  警告: 未设置 Cloudflare API token');
}

// 检查 package.json 脚本
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const requiredScripts = ['deploy', 'build'];

for (const script of requiredScripts) {
  if (!packageJson.scripts[script]) {
    console.warn(`⚠️  警告: package.json 中缺少 ${script} 脚本`);
  }
}

if (allFilesExist) {
  console.log('✅ 所有检查通过，可以部署！');
  process.exit(0);
} else {
  console.error('❌ 部署前检查失败');
  process.exit(1);
}