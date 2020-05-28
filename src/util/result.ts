export type OptionsResult<T> = Record<keyof T, any> & {
  configuration: Partial<Record<keyof T, any>>;
};
export type Result<T> = {
  /** Any argument that wasn't a flag. */
  args: string[];
  /** Any argument that wasn't confirgured. */
  unknown: string[];
  /** The resulting options object. */
  options: OptionsResult<T>;
  /** Cli provided these flags. */
  cliProvided: Set<string>;
  /** Config provided these options. */
  configProvided: Set<string>;
  /** If any errors occur, they are pushed here without unwinding the stack. */
  errors: string[];
};
