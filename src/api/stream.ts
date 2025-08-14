// src/api/stream.ts
// API 路由处理程序，支持 Cloudflare Workers 的 SSE 流式响应

import { createAdaptiveStreamingResponse } from '../mastra/agents/streaming';

/**
 * 处理流式聊天请求的主要处理程序
 * 兼容本地开发和 Cloudflare 部署环境
 */
export async function handleStreamRequest(request: Request): Promise<Response> {
  // 处理 CORS 预检请求
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400'
      }
    });
  }

  if (request.method !== 'POST') {
    return new Response('Method not allowed', { 
      status: 405,
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    });
  }

  try {
    // 解析请求体
    const body = await request.json();
    
    if (!body.messages || !Array.isArray(body.messages)) {
      return new Response(
        JSON.stringify({ error: 'Invalid request: messages array required' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    }

    // 创建自适应的流式响应
    return await createAdaptiveStreamingResponse({
      messages: body.messages
    });

  } catch (error) {
    console.error('Request handling error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        message: error.message 
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  }
}

/**
 * Cloudflare Workers 导出的 fetch 处理程序
 */
export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    
    // 路由处理
    if (url.pathname === '/api/stream') {
      return handleStreamRequest(request);
    }
    
    // 其他路由...
    return new Response('Not found', { status: 404 });
  }
};