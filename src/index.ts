import minimist, { type Opts } from 'minimist';
import type { StringKeyOf } from 'type-fest';

export interface PargvOptions {
  /**
   * camelCase arguments to parse
   */
  args: {
    [key: string]: {
      /**
       * additional aliases to use for the argument, a kebab-cased version is included by default
       */
      aliases?: string[];
      /**
       * @default 'boolean'
       */
      type?: 'boolean' | 'string' | 'string[]' | 'number' | 'number[]';
    };
  };
}

type PargvOutput<T extends PargvOptions> = {
  [key in keyof T['args']]?: T['args'][key]['type'] extends 'boolean'
    ? boolean
    : T['args'][key]['type'] extends 'string'
    ? string
    : T['args'][key]['type'] extends 'string[]'
    ? string[]
    : T['args'][key]['type'] extends 'number'
    ? number
    : T['args'][key]['type'] extends 'number[]'
    ? number[]
    : boolean;
};

const createMinimistOptions = <T extends PargvOptions>(
  args: Array<StringKeyOf<T['args']>>,
  pargvOptions: T,
) => {
  const options: Opts = {};

  args.forEach((arg) => {
    options.alias ??= {};
    const kebabCase = arg.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
    const aliases = pargvOptions.args[arg].aliases ?? [];

    // only include kebabCase arg if it is different from the original arg
    // otherwise minimist will mangle the argument value
    if (kebabCase !== arg) {
      options.alias[arg] = [...aliases, kebabCase];
    } else {
      options.alias[arg] = [...aliases];
    }
  });

  return options;
};

/**
 * Returns only specified arguments specified in options. Default type is boolean.
 */
export const pargv = <T extends PargvOptions>(
  options: T,
): PargvOutput<T> & { _nodePath: string; _scriptPath: string } => {
  const [_nodePath, _scriptPath, ...args] = process.argv;
  const allowedArgs = Object.keys(options.args) as Array<
    StringKeyOf<T['args']>
  >;
  const minimistOptions = createMinimistOptions(allowedArgs, options);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const parsed: Record<string, any> = minimist(args, minimistOptions);

  const validArgs = allowedArgs.reduce(
    (acc: PargvOutput<T>, v: StringKeyOf<T['args']>) => {
      acc[v] = parsed[v];
      return acc;
    },
    {} as PargvOutput<T>,
  );

  return {
    _nodePath,
    _scriptPath,
    ...validArgs,
  };
};
