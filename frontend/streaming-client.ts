// frontend/streaming-client.ts
// 前端 SSE 客户端，兼容本地和 Cloudflare 部署环境

export interface SSEMessage {
  type: string;
  runId: string;
  from: string;
  payload: any;
}

export interface StreamingClientOptions {
  url: string;
  onMessage: (message: SSEMessage) => void;
  onError: (error: Error) => void;
  onComplete: () => void;
  onStart?: () => void;
}

/**
 * 兼容 Cloudflare 部署的 SSE 客户端
 * 解决本地和云端环境表现不一致的问题
 */
export class StreamingClient {
  private abortController: AbortController | null = null;
  
  constructor(private options: StreamingClientOptions) {}

  /**
   * 发送流式请求
   */
  async stream(messages: Array<{ role: string; content: string }>): Promise<void> {
    this.abortController = new AbortController();
    
    try {
      this.options.onStart?.();
      
      const response = await fetch(this.options.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
          'Cache-Control': 'no-cache'
        },
        body: JSON.stringify({ messages }),
        signal: this.abortController.signal
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // 检查响应类型
      const contentType = response.headers.get('content-type');
      
      if (contentType?.includes('text/event-stream')) {
        // 标准 SSE 响应处理
        await this.handleSSEResponse(response);
      } else if (contentType?.includes('application/json')) {
        // 如果返回的是 JSON（可能是 Cloudflare 缓冲的结果）
        await this.handleJSONResponse(response);
      } else {
        // 尝试作为文本流处理
        await this.handleTextStreamResponse(response);
      }
      
    } catch (error) {
      if (error.name !== 'AbortError') {
        this.options.onError(error);
      }
    }
  }

  /**
   * 处理标准 SSE 响应
   */
  private async handleSSEResponse(response: Response): Promise<void> {
    const reader = response.body?.getReader();
    if (!reader) throw new Error('No response body');

    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        
        // 处理完整的 SSE 消息
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // 保留未完成的行
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            
            if (data === '[DONE]') {
              this.options.onComplete();
              return;
            }
            
            try {
              const message: SSEMessage = JSON.parse(data);
              this.options.onMessage(message);
            } catch (e) {
              console.warn('Failed to parse SSE message:', data);
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
      this.options.onComplete();
    }
  }

  /**
   * 处理 JSON 响应（Cloudflare 可能缓冲的情况）
   */
  private async handleJSONResponse(response: Response): Promise<void> {
    try {
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.message || 'Server error');
      }
      
      // 如果是单个消息对象
      if (data.type && data.payload) {
        this.options.onMessage(data as SSEMessage);
      }
      // 如果是消息数组
      else if (Array.isArray(data)) {
        for (const message of data) {
          this.options.onMessage(message);
        }
      }
      
      this.options.onComplete();
    } catch (error) {
      this.options.onError(error);
    }
  }

  /**
   * 处理文本流响应
   */
  private async handleTextStreamResponse(response: Response): Promise<void> {
    const reader = response.body?.getReader();
    if (!reader) throw new Error('No response body');

    const decoder = new TextDecoder();
    
    try {
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        const text = decoder.decode(value, { stream: true });
        
        // 尝试解析为 JSON 消息
        try {
          const message: SSEMessage = JSON.parse(text);
          this.options.onMessage(message);
        } catch (e) {
          // 如果不是 JSON，作为文本消息处理
          this.options.onMessage({
            type: 'text',
            runId: 'unknown',
            from: 'agent',
            payload: { content: text }
          });
        }
      }
    } finally {
      reader.releaseLock();
      this.options.onComplete();
    }
  }

  /**
   * 停止流式请求
   */
  stop(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }
}

/**
 * 简单的使用示例
 */
export function createStreamingChat(
  containerId: string, 
  apiUrl: string
): StreamingClient {
  const container = document.getElementById(containerId);
  if (!container) throw new Error(`Container ${containerId} not found`);
  
  return new StreamingClient({
    url: apiUrl,
    onStart: () => {
      console.log('Streaming started...');
    },
    onMessage: (message) => {
      // 显示消息
      const messageDiv = document.createElement('div');
      messageDiv.textContent = JSON.stringify(message.payload);
      container.appendChild(messageDiv);
      
      // 滚动到底部
      container.scrollTop = container.scrollHeight;
    },
    onError: (error) => {
      console.error('Streaming error:', error);
      const errorDiv = document.createElement('div');
      errorDiv.style.color = 'red';
      errorDiv.textContent = `Error: ${error.message}`;
      container.appendChild(errorDiv);
    },
    onComplete: () => {
      console.log('Streaming completed');
    }
  });
}

// 使用示例：
// const client = createStreamingChat('chat-container', '/api/stream');
// client.stream([{ role: 'user', content: '请为我占卜今天的运势' }]);