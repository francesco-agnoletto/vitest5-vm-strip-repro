import { setTimeout as nativeSetTimeout } from 'node:timers';
import { test, expect } from 'vitest';

function mockedAsyncCall(ms: number): Promise<void> {
  return new Promise((resolve) => nativeSetTimeout(resolve, ms));
}

test('file 1: floating async call touches process after the batch ends', () => {
  let acc = 0;
  for (let j = 0; j < 1_000_000; j++) {
    acc += Math.sqrt(j) % 7;
  }

  mockedAsyncCall(50).then(() => {
    process.on('exit', () => {});
  });

  expect(acc).toBeGreaterThan(0);
});
