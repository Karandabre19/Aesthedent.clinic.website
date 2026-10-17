import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const React = require('react');
const { JSDOM } = require('jsdom');
const { createRoot } = require('react-dom/client');

test('smooth scrolling is disabled throughout Studio and restored after leaving it', async () => {
  const dom = new JSDOM('<div id="root"></div>', { pretendToBeVisual: true });
  const names = ['window', 'document', 'navigator', 'IS_REACT_ACT_ENVIRONMENT'];
  const previous = names.map(name => Object.getOwnPropertyDescriptor(globalThis, name));
  let pathname = '/', created = 0, destroyed = 0;
  dom.window.matchMedia = () => ({ matches: false });
  Object.defineProperty(dom.window.navigator, 'hardwareConcurrency', { value: 8 });
  const module = { exports: {} };
  const source = ts.transpileModule(readFileSync(new URL('../components/layout/SmoothScrollProvider.js', import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true },
  }).outputText;
  new Function('require', 'exports', source)(id => {
    if (id === 'next/navigation') return { usePathname: () => pathname };
    if (id === 'lenis') return class { constructor() { created++; } destroy() { destroyed++; } resize() {} };
    return require(id);
  }, module.exports);
  let root;
  try {
    for (const [name, value] of Object.entries({ window: dom.window, document: dom.window.document, navigator: dom.window.navigator, IS_REACT_ACT_ENVIRONMENT: true })) Object.defineProperty(globalThis, name, { configurable: true, writable: true, value });
    root = createRoot(document.getElementById('root'));
    const render = async path => { pathname = path; await React.act(async () => { root.render(React.createElement(module.exports.default, null, React.createElement('p', null, 'Preserved child'))); }); };
    await render('/'); assert.equal(created, 1);
    await render('/about'); assert.equal(created, 1);
    await render('/aesthedent-studio'); assert.equal(destroyed, 1);
    await render('/aesthedent-studio/structure/service'); assert.equal(created, 1);
    assert.equal(document.querySelector('p').textContent, 'Preserved child');
    await render('/aesthedent-studio-guide'); assert.equal(created, 2, 'only the exact Studio route subtree is excluded');
    await render('/aesthedent-studio/structure'); assert.equal(destroyed, 2);
  } finally {
    if (root) await React.act(async () => root.unmount());
    dom.window.close();
    names.forEach((name, i) => previous[i] ? Object.defineProperty(globalThis, name, previous[i]) : delete globalThis[name]);
  }
});
