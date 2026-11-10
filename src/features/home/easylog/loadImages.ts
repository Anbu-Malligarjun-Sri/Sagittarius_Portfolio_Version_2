export const LOG_URLS = [
  'https://assets.uberdesigner.ai/easylog/log-bare.webp',
  'https://assets.uberdesigner.ai/easylog/log-moss.webp',
] as const;

export type LogImages = { bare: ImageBitmap; moss: ImageBitmap };

export async function loadImages(signal: AbortSignal, progress: (value: number) => void): Promise<LogImages> {
  const received = [0, 0], totals = [0, 0], finished = [false, false];
  let last = 0;
  const report = () => {
    const next = totals.every(Boolean)
      ? Math.min(1, (received[0] + received[1]) / (totals[0] + totals[1]))
      : finished.filter(Boolean).length / 2;
    last = Math.max(last, next); progress(last);
  };
  const results = await Promise.allSettled(LOG_URLS.map(async (url, index) => {
    const response = await fetch(url, { signal, mode: 'cors', cache: 'force-cache' });
    if (!response.ok) throw new Error(`Log artwork could not load (${response.status}).`);
    totals[index] = Number(response.headers.get('Content-Length')) || 0;
    const chunks: Uint8Array<ArrayBuffer>[] = [];
    if (response.body) {
      const reader = response.body.getReader();
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        chunks.push(new Uint8Array(value)); received[index] += value.byteLength; report();
      }
    } else { const value = await response.arrayBuffer(); chunks.push(new Uint8Array(value)); received[index] = value.byteLength; }
    finished[index] = true; report();
    const bitmap = await createImageBitmap(new Blob(chunks, { type: 'image/webp' }));
    if (signal.aborted) { bitmap.close(); throw new DOMException('Aborted', 'AbortError'); }
    return bitmap;
  }));
  const failed = results.find(result => result.status === 'rejected');
  if (failed) {
    results.forEach(result => { if (result.status === 'fulfilled') result.value.close(); });
    throw failed.reason;
  }
  return { bare: (results[0] as PromiseFulfilledResult<ImageBitmap>).value, moss: (results[1] as PromiseFulfilledResult<ImageBitmap>).value };
}
