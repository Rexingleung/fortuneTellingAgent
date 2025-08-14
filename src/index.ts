// src/index.ts
// Cloudflare Workers 入口文件

import { handleStreamRequest } from './api/stream';
import { mastra } from './mastra';

/**
 * Cloudflare Workers 主要的 fetch 处理程序
 * 针对 SSE 流式响应进行了优化
 */
export default {
  async fetch(request: Request, env: any, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    
    // 设置 CORS 头部
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'
    };
    
    // 处理 CORS 预检请求
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }
    
    try {
      // 路由处理
      switch (url.pathname) {
        case '/api/stream':
          const response = await handleStreamRequest(request);
          // 添加 CORS 头部到流式响应
          Object.entries(corsHeaders).forEach(([key, value]) => {
            response.headers.set(key, value);
          });
          return response;
          
        case '/health':
          return new Response(JSON.stringify({ 
            status: 'healthy', 
            timestamp: new Date().toISOString(),
            environment: 'cloudflare-workers'
          }), {
            headers: { 
              'Content-Type': 'application/json',
              ...corsHeaders
            }
          });
          
        case '/':
          return new Response(`
            <!DOCTYPE html>
            <html>
            <head>
              <title>Fortune Telling Agent</title>
              <meta charset="utf-8">
            </head>
            <body>
              <h1>占卜智能代理 API</h1>
              <p>SSE 流式响应已针对 Cloudflare Workers 优化</p>
              <ul>
                <li><a href="/health">健康检查</a></li>
                <li><code>POST /api/stream</code> - 流式占卜服务</li>
              </ul>
            </body>
            </html>
          `, {
            headers: { 
              'Content-Type': 'text/html',
              ...corsHeaders
            }
          });
          
        default:
          return new Response('Not Found', { 
            status: 404,
            headers: corsHeaders
          });
      }
    } catch (error) {
      console.error('Request processing error:', error);
      
      return new Response(JSON.stringify({
        error: 'Internal Server Error',
        message: error.message,
        timestamp: new Date().toISOString()
      }), {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
  }
};

// 导出 Mastra 实例供外部使用
export { mastra } from './mastra';