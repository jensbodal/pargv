/* eslint-disable @typescript-eslint/no-unused-vars */
import { beforeEach, describe, it } from 'node:test';
import { pargv } from './index';
import assert from 'node:assert';

describe(pargv.name, () => {
  const originalArgv = { ...process.argv };

  beforeEach(() => {
    process.argv = { ...originalArgv };
  });

  it('parses all given arguments', () => {
    process.argv = ['', '', '--bar=snakes', '--foo'];
    const { _nodePath, _scriptPath, ...args } = pargv({
      args: { foo: {}, bar: { type: 'string' } },
    });
    assert.deepEqual(args, {
      bar: 'snakes',
      foo: true,
    });
  });
});
