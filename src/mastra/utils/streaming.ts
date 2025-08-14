// src/mastra/utils/streaming.ts
// SSE 流式响应工具函数

export interface SSEChunk {
  type: string;
  runId: string;
  from: string;
  payload: Record<string, any>;
}

/**
 * 创建 Cloudflare 兼容的 SSE 响应
 * 解决 Cloudflare Workers 环境下的流式响应缓冲问题
 */
export function createSSEResponse(stream: ReadableStream<SSEChunk>): Response {
  // 创建 TransformStream 来格式化 SSE 数据
  const { readable, writable } = new TransformStream({
    transform(chunk: SSEChunk, controller) {
      // 将数据块格式化为 SSE 格式
      const sseData = `data: ${JSON.stringify(chunk)}\n\n`;
      controller.enqueue(new TextEncoder().encode(sseData));
    },
    flush(controller) {
      // 确保流正确结束
      controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));
    }
  });

  // 将原始流连接到转换流
  stream.pipeTo(writable);

  // 创建 Response 对象，设置正确的 headers
  return new Response(readable, {
    headers: {
      // 关键：设置正确的 Content-Type 告诉 Cloudflare 这是 SSE
      'Content-Type': 'text/event-stream',
      // 禁用缓存
      'Cache-Control': 'no-cache, no-transform',
      // 保持连接活跃
      'Connection': 'keep-alive',
      // 允许跨域
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      // 重要：禁用 Cloudflare 的压缩和优化
      'X-Accel-Buffering': 'no',
      // 确保不使用 chunked encoding 的缓冲
      'Transfer-Encoding': 'identity'
    }
  });
}

/**
 * 为 Cloudflare Workers 优化的流式响应包装器
 * 确保小数据块能立即发送，不被缓冲
 */
export function createOptimizedStream<T>(
  originalStream: ReadableStream<T>,
  transformer: (chunk: T) => SSEChunk
): ReadableStream<SSEChunk> {
  return new ReadableStream<SSEChunk>({
    start(controller) {
      const reader = originalStream.getReader();
      
      const pump = async () => {
        try {
          while (true) {
            const { done, value } = await reader.read();
            
            if (done) {
              controller.close();
              break;
            }
            
            // 转换数据块
            const transformedChunk = transformer(value);
            
            // 立即推送数据块
            controller.enqueue(transformedChunk);
            
            // 关键：添加微小延迟确保 Cloudflare 不会缓冲
            // 这个技巧强制 Cloudflare 立即发送数据
            await new Promise(resolve => setTimeout(resolve, 1));
          }
        } catch (error) {
          controller.error(error);
        } finally {
          reader.releaseLock();
        }
      };
      
      pump();
    }
  });
}