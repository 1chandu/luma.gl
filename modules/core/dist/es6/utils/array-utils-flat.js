let arrayBuffer = null;
export function getScratchArrayBuffer(byteLength) {
  if (!arrayBuffer || arrayBuffer.byteLength < byteLength) {
    arrayBuffer = new ArrayBuffer(byteLength);
  }

  return arrayBuffer;
}
export function getScratchArray(Type, length) {
  const scratchArrayBuffer = getScratchArrayBuffer(Type.BYTES_PER_ELEMENT * length);
  return new Type(scratchArrayBuffer, 0, length);
}
export function fillArray({
  target,
  source,
  start = 0,
  count = 1
}) {
  const length = source.length;
  const total = count * length;
  let copied = 0;

  for (let i = start; copied < length; copied++) {
    target[i++] = source[copied];
  }

  while (copied < total) {
    if (copied < total - copied) {
      target.copyWithin(start + copied, start, start + copied);
      copied *= 2;
    } else {
      target.copyWithin(start + copied, start, start + total - copied);
      copied = total;
    }
  }

  return target;
}
//# sourceMappingURL=array-utils-flat.js.map