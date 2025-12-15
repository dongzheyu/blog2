// Cloudflare Pages Functions - 代理到 Workers
export default {
  async fetch(request, env, ctx) {
    // 这里可以添加 Pages Functions 逻辑
    // 或者直接代理到你的 Workers
    return new Response('Pages Functions placeholder - 实际 API 在 Workers 运行', {
      headers: { 'content-type': 'text/plain' }
    })
  }
}