function formatArrayValue(v, opts) {
  const _opts$maxElts = opts.maxElts,
        maxElts = _opts$maxElts === void 0 ? 16 : _opts$maxElts,
        _opts$size = opts.size,
        size = _opts$size === void 0 ? 1 : _opts$size;
  let string = '[';

  for (let i = 0; i < v.length && i < maxElts; ++i) {
    if (i > 0) {
      string += `,${i % size === 0 ? ' ' : ''}`;
    }

    string += formatValue(v[i], opts);
  }

  const terminator = v.length > maxElts ? '...' : ']';
  return `${string}${terminator}`;
}

export function formatValue(v, opts = {}) {
  const EPSILON = 1e-16;
  const _opts$isInteger = opts.isInteger,
        isInteger = _opts$isInteger === void 0 ? false : _opts$isInteger;

  if (Array.isArray(v) || ArrayBuffer.isView(v)) {
    return formatArrayValue(v, opts);
  }

  if (!Number.isFinite(v)) {
    return String(v);
  }

  if (Math.abs(v) < EPSILON) {
    return isInteger ? '0' : '0.';
  }

  if (isInteger) {
    return v.toFixed(0);
  }

  if (Math.abs(v) > 100 && Math.abs(v) < 10000) {
    return v.toFixed(0);
  }

  const string = v.toPrecision(2);
  const decimal = string.indexOf('.0');
  return decimal === string.length - 2 ? string.slice(0, -1) : string;
}
//# sourceMappingURL=format-value.js.map