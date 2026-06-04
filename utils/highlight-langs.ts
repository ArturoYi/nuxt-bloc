/**
 * Shiki languages bundled at build time for markdown code fences.
 * Setting `highlight.langs` replaces @nuxtjs/mdc defaults — keep defaults in this list.
 * @see https://content.nuxt.com/docs/getting-started/configuration#highlight
 */
export const markdownHighlightLangs = [
  // @nuxtjs/mdc defaults
  'js',
  'jsx',
  'json',
  'ts',
  'tsx',
  'vue',
  'css',
  'html',
  'bash',
  'md',
  'mdc',
  'yaml',
  // shells & ops
  'shell',
  'sh',
  'powershell',
  'dockerfile',
  'docker',
  'nginx',
  'apache',
  'cmake',
  'makefile',
  // C family & mobile
  'c',
  'cpp',
  'csharp',
  'objc',
  'objective-cpp',
  'swift',
  'kotlin',
  'java',
  'scala',
  'dart',
  // scripting
  'python',
  'ruby',
  'php',
  'perl',
  'lua',
  'r',
  // systems & functional
  'rust',
  'go',
  'zig',
  'haskell',
  'elixir',
  'clojure',
  // web & data
  'graphql',
  'sql',
  'prisma',
  'svelte',
  'astro',
  'wasm',
  'wgsl',
  // markup & config
  'xml',
  'toml',
  'ini',
  'jsonc',
  'diff',
  'scss',
  'less',
  'sass',
  'latex',
  // misc
  'verilog',
  'matlab',
] as const
