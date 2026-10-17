const postcss = require('postcss');
const tailwindcss = require('tailwindcss');

module.exports = function tailwindWithSanityExclusion() {
  const processor = postcss([tailwindcss()]);

  return {
    postcssPlugin: 'tailwind-with-sanity-exclusion',
    async Once(root, { result }) {
      const file = (root.source?.input.file || '').replace(/\\/g, '/');

      // Sanity's compiled native CSS layers must not be interpreted as Tailwind v3 layers.
      if (/\/node_modules\/@sanity\/ui\/dist\/styles\.css$/.test(file)) {
        return;
      }

      const processed = await processor.process(root, result.opts);
      // Preserve Tailwind's dependency messages so Next.js can track rebuilds.
      result.messages.push(...processed.messages);
    },
  };
};

module.exports.postcss = true;
