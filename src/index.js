/**
 * Cloudflare Worker for Martin's Flying Machines
 * Serves static assets using Cloudflare Workers Assets
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Get the asset from the ASSETS binding
    try {
      // Try to get the exact path first
      let response = await env.ASSETS.fetch(request);

      // If not found and path doesn't have extension, try with .html
      if (response.status === 404 && !url.pathname.includes('.')) {
        const htmlPath = url.pathname.endsWith('/')
          ? url.pathname + 'index.html'
          : url.pathname + '.html';

        const htmlUrl = new URL(request.url);
        htmlUrl.pathname = htmlPath;

        const htmlRequest = new Request(htmlUrl, request);
        response = await env.ASSETS.fetch(htmlRequest);
      }

      // If still not found and ends with /, try index.html
      if (response.status === 404 && url.pathname.endsWith('/')) {
        const indexUrl = new URL(request.url);
        indexUrl.pathname = url.pathname + 'index.html';

        const indexRequest = new Request(indexUrl, request);
        response = await env.ASSETS.fetch(indexRequest);
      }

      // Clone response to add custom headers
      response = new Response(response.body, response);

      // Add security headers
      response.headers.set('X-Content-Type-Options', 'nosniff');
      response.headers.set('X-Frame-Options', 'DENY');
      response.headers.set('X-XSS-Protection', '1; mode=block');

      // Add cache headers for static assets
      if (url.pathname.match(/\.(css|js|jpg|jpeg|png|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
        response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
      } else {
        response.headers.set('Cache-Control', 'public, max-age=3600');
      }

      return response;

    } catch (error) {
      // Return a custom 404 page or error message
      return new Response('Not Found', {
        status: 404,
        headers: {
          'Content-Type': 'text/plain'
        }
      });
    }
  }
};
