var globals = {
  self: typeof self !== 'undefined' && self,
  window: typeof window !== 'undefined' && window,
  global: typeof global !== 'undefined' && global,
  document: typeof document !== 'undefined' && document
};
var self_ = globals.self || globals.window || globals.global;
var window_ = globals.window || globals.self || globals.global;
var global_ = globals.global || globals.self || globals.window;
var document_ = globals.document || {};
export { self_ as self, window_ as window, global_ as global, document_ as document };
//# sourceMappingURL=globals.js.map