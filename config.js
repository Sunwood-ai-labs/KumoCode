/**
 * KumoCode Configuration
 * Similar to Docusaurus config
 */

window.kumoConfig = {
  // Base URL for GitHub Pages deployment
  // For GitHub Pages: '/<repo-name>/' or '/' for custom domain
  // This is automatically set by the build process or can be configured here
  baseUrl: (function() {
    // Try to detect from current location
    const pathSegments = window.location.pathname.split('/').filter(Boolean);

    // If running on GitHub Pages with repo name in URL
    if (window.location.hostname.includes('github.io') && pathSegments.length > 0) {
      return '/' + pathSegments[0] + '/';
    }

    // Custom domain or local development
    return '/';
  })(),

  // Default theme (can be overridden by environment variable during build)
  defaultTheme: 'ocean',

  // Site metadata
  title: 'KumoCode',
  tagline: 'Modern Markdown Documentation Platform',

  // Organization info
  organizationName: 'Sunwood-ai-labs',
  projectName: 'KumoCode',
};

/**
 * Helper function to resolve paths with base URL
 */
window.kumoConfig.resolveUrl = function(path) {
  // Remove leading slash from path if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;

  // Combine base URL with path
  const baseUrl = this.baseUrl.endsWith('/') ? this.baseUrl : this.baseUrl + '/';

  return baseUrl + cleanPath;
};

/**
 * Helper to get asset URL
 */
window.kumoConfig.getAssetUrl = function(path) {
  return this.resolveUrl(path);
};

console.log('🔧 KumoCode Config:', window.kumoConfig);
