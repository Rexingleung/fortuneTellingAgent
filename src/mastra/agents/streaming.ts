// src/mastra/agents/streaming.ts
// 修复 Cloudflare 环境下的 Agent 流式响应

import { fortuneTellingAgent } from './index';
import { createSSEResponse, createOptimizedStream } from '../utils/streaming';

export interface StreamingMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface StreamingOptions {
  messages: StreamingMessage[];
  // 其他选项...
}

/**
 * 创建 Cloudflare 兼容的流式响应
 * 解决本地环境和 Cloudflare 部署环境表现不一致的问题
 */
export async function createStreamingResponse(options: StreamingOptions): Promise<Response> {
  try {
    // 使用 agent.streamVNext 而不是 stream，这是 Mastra 推荐的方法
    const originalStream = await fortuneTellingAgent.streamVNext(options.messages[0]);
    
    // 创建优化的流，确保每个块都能立即发送
    const optimizedStream = createOptimizedStream(
      originalStream,
      (chunk) => ({
        type: chunk.type || 'data',
        runId: chunk.runId || 'unknown',
        from: chunk.from || 'agent',
        payload: chunk.payload || chunk
      })
    );
    
    // 返回正确配置的 SSE 响应
    return createSSEResponse(optimizedStream);
    
  } catch (error) {
    console.error('Streaming error:', error);
    
    // 错误情况下返回标准错误响应
    return new Response(
      JSON.stringify({ error: 'Streaming failed', message: error.message }),
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
 * Cloudflare Workers 环境检测和响应处理
 */
export function isCloudflareEnvironment(): boolean {
  // 检测是否在 Cloudflare Workers 环境中运行
  return typeof caches !== 'undefined' && 
         typeof globalThis.navigator !== 'undefined' && 
         globalThis.navigator.userAgent === 'Cloudflare-Workers';
}

/**
 * 根据环境选择合适的流式响应策略
 */
export async function createAdaptiveStreamingResponse(options: StreamingOptions): Promise<Response> {
  if (isCloudflareEnvironment()) {
    console.log('Detected Cloudflare environment, using optimized streaming');
    return createStreamingResponse(options);
  } else {
    console.log('Local environment detected, using standard streaming');
    // 本地环境可以使用标准的流式响应
    const stream = await fortuneTellingAgent.streamVNext(options.messages[0]);
    return createSSEResponse(stream);
  }
}