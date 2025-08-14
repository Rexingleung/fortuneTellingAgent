# Cloudflare SSE 流式响应修复指南

## 问题描述

在将 Fortune Telling Agent 部署到 Cloudflare Workers 后，发现 SSE (Server-Sent Events) 流式响应出现缓冲问题：

- **本地环境**：`agent.stream` 正常返回逐块的 SSE 数据，前端实时显示
- **Cloudflare 环境**：相同代码返回的数据被缓冲，一次性完整返回，失去流式效果

## 解决方案概述

本修复通过以下方式解决 Cloudflare Workers 环境下的 SSE 缓冲问题：

1. **正确的 HTTP 头部设置**
2. **优化的数据流处理**
3. **环境自适应的响应策略**
4. **前端客户端兼容性处理**

## 修复内容

### 新增文件

1. **`src/mastra/utils/streaming.ts`** - SSE 流式响应工具函数
2. **`src/mastra/agents/streaming.ts`** - Agent 流式响应修复
3. **`src/api/stream.ts`** - API 路由处理程序
4. **`src/index.ts`** - Cloudflare Workers 入口文件
5. **`frontend/streaming-client.ts`** - 前端 SSE 客户端
6. **`wrangler.toml`** - Cloudflare Workers 配置
7. **`scripts/pre-deploy-check.mjs`** - 部署前检查脚本

### 关键技术点

#### 1. 正确的 HTTP 头部

```typescript
{
  'Content-Type': 'text/event-stream',        // 告诉 Cloudflare 这是 SSE
  'Cache-Control': 'no-cache, no-transform', // 禁用缓存
  'Connection': 'keep-alive',                 // 保持连接
  'X-Accel-Buffering': 'no',                // 禁用代理缓冲
  'Transfer-Encoding': 'identity'             // 避免 chunked encoding 缓冲
}
```

#### 2. 微延迟技巧

```typescript
// 强制 Cloudflare 立即发送数据块
await new Promise(resolve => setTimeout(resolve, 1));
```

#### 3. 环境自适应

```typescript
export function isCloudflareEnvironment(): boolean {
  return typeof caches !== 'undefined' && 
         typeof globalThis.navigator !== 'undefined' && 
         globalThis.navigator.userAgent === 'Cloudflare-Workers';
}
```

## 部署指南

### 1. 检查文件

运行部署前检查：

```bash
npm run pre-deploy
```

### 2. 本地测试

```bash
# 本地模拟 Cloudflare Workers 环境
npm run dev:local

# 远程开发环境（连接到 Cloudflare）
npm run dev:remote
```

### 3. 部署到不同环境

```bash
# 部署到 staging 环境
npm run deploy:staging

# 部署到生产环境  
npm run deploy:prod

# 直接部署（使用默认配置）
npm run deploy:direct
```

### 4. 监控日志

```bash
# 查看实时日志
npm run logs

# 查看生产环境日志
npm run logs:prod
```

## 使用方法

### 后端 API

创建流式响应：

```typescript
import { createAdaptiveStreamingResponse } from './src/mastra/agents/streaming';

const response = await createAdaptiveStreamingResponse({
  messages: [{ role: 'user', content: '请为我做塔罗占卜' }]
});
```

### 前端客户端

使用新的流式客户端：

```typescript
import { StreamingClient } from './frontend/streaming-client';

const client = new StreamingClient({
  url: '/api/stream',
  onMessage: (message) => {
    console.log('收到消息:', message.payload);
  },
  onComplete: () => {
    console.log('流式响应完成');
  },
  onError: (error) => {
    console.error('错误:', error);
  }
});

await client.stream([{
  role: 'user',
  content: '请为我分析今天的运势'
}]);
```

## API 端点

- **`POST /api/stream`** - 流式占卜服务
- **`GET /health`** - 健康检查
- **`GET /`** - 服务信息页面

## 验证修复效果

### 1. 浏览器开发者工具

在 Network 标签页中查看 `/api/stream` 请求：
- ✅ **修复后**：应该看到数据逐步到达
- ❌ **修复前**：数据一次性完整返回

### 2. curl 测试

```bash
curl -N \
  -H "Accept: text/event-stream" \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"测试流式响应"}]}' \
  https://your-worker.your-subdomain.workers.dev/api/stream
```

### 3. 前端界面

- ✅ **修复后**：文字逐步显示，类似打字机效果
- ❌ **修复前**：文字一次性全部显示

## 环境变量

在 Cloudflare Workers 仪表板中设置以下环境变量：

```bash
# 可选：如果使用其他 AI 服务
DEEPSEEK_API_KEY=your_deepseek_api_key
OPENAI_API_KEY=your_openai_api_key

# 环境标识
NODE_ENV=production
```

## 故障排除

### 常见问题

1. **仍然出现缓冲**
   - 检查 Content-Type 是否设置为 `text/event-stream`
   - 确认 Cloudflare 缓存规则没有干扰

2. **CORS 错误**
   - 检查 `Access-Control-Allow-Origin` 头部设置
   - 确认处理了 OPTIONS 预检请求

3. **部署失败**
   - 运行 `npm run pre-deploy` 检查文件
   - 检查 Wrangler 配置和 API token

### 调试技巧

1. **查看实时日志**：
   ```bash
   npm run logs
   ```

2. **本地调试**：
   ```bash
   npm run dev:local
   ```

3. **检查响应头**：
   ```javascript
   console.log(response.headers.get('content-type'));
   ```

## 性能优化建议

1. **缓存策略**：对静态资源启用缓存，对 `/api/stream` 禁用缓存
2. **错误处理**：实现适当的重试和超时机制
3. **连接管理**：处理客户端断线重连

## 相关资源

- [Cloudflare Workers SSE 文档](https://developers.cloudflare.com/workers/runtime-apis/streams/)
- [Mastra 流式文档](https://mastra.ai/en/docs/agents/streaming)
- [SSE 标准规范](https://html.spec.whatwg.org/multipage/server-sent-events.html)

---

**注意**：这个修复确保了 Fortune Telling Agent 在 Cloudflare Workers 环境下的 SSE 流式响应与本地环境表现一致。
