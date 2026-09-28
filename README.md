# Vitest 5 vm-pool teardown strips `process` from the context

Run `npm install` to install deps and run `npm test` a few times. Most runs report a `ReferenceError: process is not defined` as an "Unhandled Rejection", even though every test passes:

```
⎯⎯⎯⎯ Unhandled Rejection ⎯⎯⎯⎯⎯
ReferenceError: process is not defined
 ❯ file000.test.ts:14:3
     12|   }
     13|
     14|   mockedAsyncCall(20).then(() => {
       |   ^
     15|     process.on('exit', () => {});
     16|   });
```

Each test file does a bit of sync work, then fires off an async call it doesn't await.
This mocks async work some code being tested might run. By the time the call resolves, `process` has already been deleted from the vm context.

Example of calls that can't be awaited easily:
- HTTP mocking libraries internal cleanup.
- RxJS operators with timers.
- third-party library's own internal async
- garbabe collection work (V8 internal)

Doesn't reproduce on `vitest@4.1.10` with the same files and config.
