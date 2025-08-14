# 占卜智能代理 (Fortune Telling Agent)

一个全面的AI占卜代理，支持多种占卜方法，包括占星术、风水、塔罗牌、易经、数字命理学、手相学和八字。该项目使用Mastra框架构建，集成Deepseek AI模型。

## 🌟 功能特色

这个占卜智能代理提供以下专业占卜服务：

### 🏮 中国传统占卜 (算命)
- **八字 (四柱推命)** - 基于出生年月日时的命理分析
- **中国生肖** - 十二生肖动物与五行元素的组合解读
- **风水 (环境风水学)** - 环境能量优化与空间布局建议
- **易经 (周易占卜)** - 六十四卦占卜与变爻解析

### 🔮 西方占卜系统
- **西方占星术** - 星座、行星影响和宫位解读
- **塔罗牌占卜** - 多种牌阵类型与详细牌意解析
- **数字命理学** - 生命数、表达数、灵魂数字计算
- **手相学** - 手部线条与特征解读

## 🚀 快速开始

### 系统要求

- Node.js (v20.9.0 或更高版本)
- npm 或 yarn
- Git

### 安装步骤

1. **克隆仓库:**
   ```bash
   git clone https://github.com/Rexingleung/fortuneTellingAgent.git
   cd fortuneTellingAgent
   ```

2. **安装依赖:**
   ```bash
   npm install
   ```

3. **配置环境变量:**
   ```bash
   cp .env.example .env
   # 编辑 .env 文件，添加你的 Deepseek API 密钥
   ```

4. **启动开发服务器:**
   ```bash
   npm run dev
   ```

## 🌐 Cloudflare Workers 部署

本项目已针对 Cloudflare Workers 部署进行优化，特别是解决了 SSE 流式响应的缓冲问题。

### 部署步骤

1. **安装 Wrangler CLI:**
   ```bash
   npm install -g wrangler
   ```

2. **登录 Cloudflare:**
   ```bash
   wrangler auth login
   ```

3. **本地测试:**
   ```bash
   # 本地模拟 Cloudflare Workers
   npm run dev:local
   
   # 连接到 Cloudflare 开发环境
   npm run dev:remote
   ```

4. **部署到不同环境:**
   ```bash
   # 检查部署前状态
   npm run pre-deploy
   
   # 部署到 staging
   npm run deploy:staging
   
   # 部署到生产环境
   npm run deploy:prod
   ```

5. **查看日志:**
   ```bash
   # 实时日志
   npm run logs
   
   # 生产环境日志
   npm run logs:prod
   ```

### SSE 流式响应修复

在 Cloudflare Workers 环境中，我们修复了以下问题：

- ✅ **缓冲问题**: 确保 SSE 数据实时传输，不被缓冲
- ✅ **HTTP 头部**: 正确设置 `Content-Type: text/event-stream`
- ✅ **CORS 支持**: 完整的跨域访问支持
- ✅ **错误处理**: 优雅的错误和重连机制

详细的修复说明请查看 [Cloudflare SSE 修复指南](docs/CLOUDFLARE_SSE_FIX.md)。

### API 端点

部署后可访问以下端点：

- **`POST /api/stream`** - 流式占卜服务 (SSE)
- **`GET /health`** - 健康检查
- **`GET /`** - 服务信息页面

### 使用示例

```javascript
// 前端 SSE 客户端示例
import { StreamingClient } from './frontend/streaming-client';

const client = new StreamingClient({
  url: 'https://your-worker.your-subdomain.workers.dev/api/stream',
  onMessage: (message) => {
    console.log('实时占卜结果:', message.payload);
  },
  onComplete: () => {
    console.log('占卜完成');
  }
});

await client.stream([{
  role: 'user',
  content: '请为我做塔罗占卜'
}]);
```

## 🛠️ 可用工具

代理包含以下专业占卜工具：

### 1. 占星分析 (Astrological Reading)
```typescript
astrologicalReading({
  birthDate: "1990-04-15",        // 出生日期
  birthTime: "07:30",             // 出生时间 (可选)
  birthLocation: "上海, 中国",     // 出生地点
  question: "这个月我的事业运势如何?" // 具体问题 (可选)
})
```

### 2. 风水分析 (Feng Shui Analysis)
```typescript
fengShuiAnalysis({
  spaceType: "bedroom",           // 空间类型
  facing: "south",                // 朝向 (可选)
  concerns: ["睡眠质量", "感情和谐"], // 关注点
  birthYear: 1990,                // 出生年份 (个性化建议)
  description: "朝南的小卧室，有一扇窗户..." // 空间描述
})
```

### 3. 塔罗占卜 (Tarot Reading)
```typescript
tarotReading({
  spreadType: "three-card",       // 牌阵类型
  question: "我的感情会发展成认真的关系吗?" // 占卜问题
})
```

支持的牌阵类型：
- `single` - 单张牌
- `three-card` - 三张牌 (过去/现在/未来)
- `celtic-cross` - 凯尔特十字
- `relationship` - 感情专用
- `career` - 事业专用  
- `yes-no` - 是否问题

### 4. 易经占卜 (I Ching Divination)
```typescript
iChingDivination({
  question: "我应该接受这个新工作吗?",  // 占卜问题
  method: "three-coin"              // 占卜方法
})
```

### 5. 数字命理 (Numerology Calculation)
```typescript
numerologyCalculation({
  fullName: "张三",                 // 全名
  birthDate: "1990-04-15",         // 出生日期
  calculationType: "full-profile", // 计算类型
  comparisonName: "李四",           // 配对姓名 (兼容性分析用)
  comparisonBirthDate: "1992-08-20" // 配对生日
})
```

### 6. 手相分析 (Palmistry Reading)
```typescript
palmistryReading({
  dominantHand: "right",                    // 主导手
  lifeLineDescription: "长而深，绕拇指弯曲", // 生命线描述
  heartLineDescription: "直线穿过手掌",      // 感情线描述
  headLineDescription: "清晰而长",          // 智慧线描述
  generalDescription: "方形手掌，手指修长"   // 整体手部描述
})
```

### 7. 八字分析 (Ba Zi Reading)
```typescript
baZiReading({
  birthDate: "1990-04-15",        // 出生日期
  birthTime: "07:30",             // 出生时间 (必需)
  gender: "female",               // 性别
  question: "什么职业道路最适合我?" // 具体问题 (可选)
})
```

## 📋 使用示例

### 命令行界面
```bash
# 启动交互式 CLI
npm run cli

# 可用命令：
# astrology  - 占星分析
# tarot      - 塔罗占卜  
# numerology - 数字命理
# iching     - 易经占卜
# fengshui   - 风水分析
# palmistry  - 手相分析
# bazi       - 八字分析
# help       - 显示帮助
# exit       - 退出程序
```

### 程序化调用
```javascript
import { fortuneTellingAgent } from './src/mastra/agents';

// 基础占星分析
const reading = await fortuneTellingAgent.run({
  messages: [{
    role: 'user',
    content: '请为1988年4月15日出生于上海的人做占星分析'
  }]
});

// 风水家居分析
const analysis = await fortuneTellingAgent.run({
  messages: [{
    role: 'user', 
    content: '请分析我朝东北的客厅风水，希望改善家庭和谐和财运'
  }]
});
```

## 🎯 对话示例

**西方占星术:**
> **用户:** "我是1988年4月15日出生的白羊座，想知道这个月应该关注什么？"
> 
> **代理:** "作为白羊座，你拥有强烈的火象能量，这个月建议你发挥天生的领导才能。你的守护星火星暗示在事业方面采取主动..."

**中国八字:**
> **用户:** "请为1995年6月10日下午3点出生的人做八字分析"
> 
> **代理:** "根据四柱推命，你的主要元素是木，暗示成长和创造力。出生时辰显示你具有强烈的学习能力和艺术天赋..."

**塔罗指导:**
> **用户:** "关于一个困难的决定，能否做三张牌的塔罗占卜？"
> 
> **代理:** "我为你的决定进行过去-现在-未来牌阵。抽到的牌是：愚人(过去)、魔术师(现在)和星星(未来)..."

## ⚖️ 道德准则

这个代理遵循以下原则：

1. **解释性质**: 占卜结果作为可能的解释呈现，而非绝对预言
2. **自由意志**: 强调个人选择权和行动能力
3. **积极导向**: 避免预测死亡、重病或极度负面结果
4. **文化尊重**: 尊重各种占卜系统的传统和文化背景
5. **专业界限**: 建议在医疗、法律或心理健康问题上寻求专业帮助
6. **教育方法**: 解释所使用的占卜系统及其历史背景

## 🏗️ 项目架构

### 项目结构
```
fortuneTellingAgent/
├── src/
│   ├── mastra/
│   │   ├── agents/
│   │   │   ├── index.ts          # 主要代理实现
│   │   │   └── streaming.ts      # 流式响应处理
│   │   ├── utils/
│   │   │   └── streaming.ts      # SSE 工具函数
│   │   ├── data/                 # JSON 数据文件
│   │   │   ├── astrology.json    # 西方与中国占星数据
│   │   │   ├── fengshui.json     # 风水原理与方向
│   │   │   ├── iching.json       # 易经六十四卦
│   │   │   ├── numerology.json   # 数字含义与解释
│   │   │   ├── palmistry.json    # 手相数据
│   │   │   └── tarot.json        # 塔罗牌含义
│   │   └── index.ts              # Mastra 配置
│   ├── api/
│   │   └── stream.ts             # API 路由处理
│   └── index.ts                  # Cloudflare Workers 入口
├── frontend/
│   └── streaming-client.ts       # 前端 SSE 客户端
├── docs/
│   └── CLOUDFLARE_SSE_FIX.md     # SSE 修复指南
├── scripts/
│   ├── cli.mjs                   # 命令行工具
│   ├── validate-data.mjs         # 数据验证脚本
│   └── pre-deploy-check.mjs      # 部署前检查
├── .github/workflows/
│   └── ci.yml                    # CI/CD 工作流
├── wrangler.toml                 # Cloudflare Workers 配置
├── package.json
├── tsconfig.json
├── .env.example                  # 环境变量模板
├── README.md
└── CONTRIBUTING.md               # 贡献指南
```

### 数据整合

代理使用结构化的JSON数据文件确保准确解释：

- **astrology.json**: 包含星座、行星、宫位和中国生肖动物
- **tarot.json**: 大阿卡纳和小阿卡纳，正位/逆位含义
- **iching.json**: 六十四卦与传统解释
- **numerology.json**: 数字含义和主数字意义
- **fengshui.json**: 方向分析和八卦原理
- **palmistry.json**: 手型、线条和丘陵解释

## 🔧 开发

### 添加新功能

1. **新占卜系统**: 在 `/src/mastra/data/` 添加数据文件，在 `/src/mastra/agents/index.ts` 创建对应工具
2. **增强计算**: 修改工具函数以获得更准确的天文或数学计算
3. **文化扩展**: 添加现有系统的地区变体 (如印度吠陀占星、凯尔特塔罗解释)

### 测试

```bash
# 运行开发服务器
npm run dev

# 验证数据完整性
npm run validate-data  

# 测试命令行功能
npm run cli

# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

## 🌍 文化背景

### 中国占卜系统
- **八字 (四柱推命)**: 需要精确出生时间进行准确的四柱计算
- **风水**: 融合峦头派和理气派原理
- **易经**: 使用传统投币或蓍草方法生成卦象

### 西方占卜系统  
- **占星术**: 结合太阳星座解释与行星影响
- **塔罗牌**: 支持从简单单张牌到复杂凯尔特十字的多种牌阵
- **数字命理**: 使用毕达哥拉斯体系，识别主数字

## 📊 项目完成总结

### ✨ 主要完成的工作

这个项目经过全面的重构和增强，现在是一个功能完整的占卜智能代理：

#### 1. **核心功能全面升级**
- **完全重写了代理引擎** (`src/mastra/agents/index.ts`)，从简单的占位符升级为真实的占卜计算系统
- **整合了所有6个JSON数据文件**，实现真实的数据驱动占卜
- **新增了八字(Ba Zi)工具**，支持中国传统四柱推命
- **实现了7种完整的占卜系统**，每个都具有真实的计算逻辑

#### 2. **Cloudflare Workers 优化**
- **SSE 流式响应修复**: 解决了 Cloudflare 环境下的缓冲问题
- **环境自适应**: 自动检测运行环境并选择最佳策略
- **完整 CORS 支持**: 跨域访问和预检请求处理
- **性能优化**: 微延迟技巧确保实时数据传输

#### 3. **智能数据整合**
- **动态数据加载系统**: 自动读取和验证JSON数据文件
- **真实占卜计算**: 
  - 精确的星座日期计算 (考虑月日范围)
  - 正确的中国生肖年份计算 (基于12年周期)
  - 完整的数字命理算法 (包括主数字11, 22, 33)
  - 易经六爻生成系统 (模拟三钱法)
  - 塔罗牌随机抽取与逆位概率
- **优雅的错误处理**: 数据文件缺失时的回退机制

#### 4. **全新开发者工具生态**
- **交互式CLI工具**: 支持所有7种占卜类型的命令行操作
- **数据验证系统**: 自动检查JSON文件结构完整性
- **部署前检查**: 确保所有文件和配置正确
- **CI/CD流水线**: GitHub Actions自动化测试和部署检查
- **环境配置模板**: 完整的`.env.example`配置示例

#### 5. **文化敏感的设计理念**
- **尊重传统**: 保持各种占卜系统的文化准确性和历史背景
- **避免文化挪用**: 适当的术语使用和文化背景说明
- **道德准则**: 积极的指导方向，避免有害或极端负面的预测
- **教育价值**: 为用户提供占卜系统的背景知识

#### 6. **用户体验全面提升**
- **多种交互方式**: 命令行、程序化API、流式HTTP接口
- **实时流式响应**: 本地和云端环境一致的流式体验
- **清晰的错误消息**: 用户友好的错误提示和建议
- **详细的解释**: 不仅提供结果，还解释占卜系统的背景
- **个性化建议**: 基于用户具体情况的定制化指导

### 🚀 从原型到生产级系统

**原始状态 (项目开始时):**
- ❌ 工具函数返回静态占位符数据
- ❌ 未使用任何JSON数据文件  
- ❌ 缺少实际的占卜计算逻辑
- ❌ Cloudflare 部署时 SSE 响应被缓冲
- ❌ 没有开发者工具和文档
- ❌ 基础的README和最小功能集

**完成状态 (现在):**
- ✅ **7个完整占卜工具**，全部使用真实计算和数据
- ✅ **Cloudflare Workers 优化**，SSE 流式响应正常工作
- ✅ **智能数据整合系统**，动态加载6个JSON数据文件
- ✅ **完整开发者生态**：CLI、验证脚本、部署工具、CI/CD
- ✅ **生产级代码质量**：错误处理、类型安全、性能优化
- ✅ **全面中英双语文档**：使用指南、API参考、贡献指南
- ✅ **文化敏感设计**：尊重传统、道德准则、教育价值

### 🎯 项目亮点

1. **技术创新**: 将传统占卜智慧与现代AI技术完美结合
2. **云端优化**: 针对 Cloudflare Workers 的流式响应优化
3. **文化桥梁**: 东西方占卜系统的融合平台
4. **开源贡献**: 为社区提供高质量的占卜AI解决方案
5. **可扩展架构**: 模块化设计便于添加新的占卜系统
6. **负责任AI**: 道德准则和积极指导的占卜实践

### 📈 项目影响力

这个项目现在能够：
- **为全球用户**提供准确、有见地的占卜服务
- **在云端环境**提供与本地一致的流式体验
- **保护和传承**传统占卜文化知识
- **教育用户**了解不同文化的占卜传统
- **为开发者**提供可扩展的占卜AI平台
- **建立标准**负责任的AI占卜实践

## 🤝 贡献指南

我们欢迎对Fortune Telling Agent项目的贡献！请查看 [CONTRIBUTING.md](CONTRIBUTING.md) 获取详细的贡献指南。

### 优先级贡献领域

- **准确性改进**: 提升现有占卜系统的精确度
- **性能优化**: 大数据处理的性能改进
- **云端兼容性**: 改进其他云平台的兼容性
- **新占卜系统**: 添加更多传统占卜方法 (如吠陀占星、北欧符文)
- **国际化支持**: 多语言界面和解释
- **移动端适配**: 移动设备友好的界面

## 📄 许可证

本项目基于 ISC 许可证开源。

## 🙏 致谢

- 使用 [Mastra](https://mastra.ai) 代理框架构建
- 由 [Deepseek AI](https://deepseek.com) 语言模型驱动
- [Cloudflare Workers](https://workers.cloudflare.com) 提供云端部署
- 传统占卜实践的文化咨询
- 社区贡献和反馈

## 📞 支持

如有问题、问题或功能请求：

1. 查看现有 [Issues](https://github.com/Rexingleung/fortuneTellingAgent/issues)
2. 创建新的issue并提供详细描述
3. 加入我们的社区讨论

### 特别说明

如果你遇到 Cloudflare 部署相关的问题，请：

1. 首先查看 [Cloudflare SSE 修复指南](docs/CLOUDFLARE_SSE_FIX.md)
2. 运行 `npm run pre-deploy` 检查配置
3. 使用 `npm run logs` 查看实时日志

---

**重要声明**: 这个占卜智能代理专为娱乐和指导目的而设计。它不应作为医疗、法律、财务或心理建议的替代品。所有解释都基于传统占卜系统，应被视为在做出人生决定时的多种视角之一。请在重大决策中寻求专业建议。

**🌟 现在就开始你的占卜之旅吧！**
