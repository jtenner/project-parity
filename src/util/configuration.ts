export enum OptionType {
  String,
  StringArray,
  Float,
  FloatArray,
  Integer,
  IntegerArray,
  TextFile,
  TextFileArray,
  File,
  FileArray,
  Require,
  RequireArray,
  Resolve,
  ResolveArray,
  Glob,
  GlobArray,
  RegExp,
  RegExpArray,
  Flag,
  JSON,
  JSONArray,
  Function,
}

export type ConfigurationDefinition = {
  /** The single letter alias of this parameter. */
  alias: string;
  /** A default value for this parameter if it isn't provided by the configuration or the cli. */
  default: any;
  /** The option type. */
  type: OptionType;
  /** The option group. */
  group: string;
  /** An indicator if the option is required. */
  required: boolean;
};

export type Configuration<T> = Record<
  keyof T,
  Partial<ConfigurationDefinition>
>;
