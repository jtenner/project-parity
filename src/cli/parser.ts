import {
  Configuration,
  ConfigurationDefinition,
  OptionType,
} from "../util/configuration";
import { Result, OptionsResult } from "../util/result";
import { promises as fs } from "fs";
import path from "path";
const isOption = (arg: string) => arg.startsWith("--");
const isAlias = (arg: string) => arg.startsWith("-");
import glob from "glob";
import { promisify } from "util";
const globp = promisify(glob);

async function obtainValue(type: OptionType, value: string): Promise<any> {
  switch (type) {
    case OptionType.Glob:
      return globp(value);
    case OptionType.GlobArray:
      return Promise.all(value.split(",").map(e => globp(e))).then(all =>
        Array.from(new Set(([] as string[]).concat.apply([], all))),
      );
    case OptionType.Integer:
      return parseInt(value);
    case OptionType.IntegerArray:
      return value.split(",").map(e => parseInt(e));
    case OptionType.Resolve:
      return path.resolve(value);
    case OptionType.ResolveArray:
      return value.split(",").map(e => path.resolve(e));
    case OptionType.RegExp:
      return new RegExp(value);
    case OptionType.RegExpArray:
      return value.split(",").map(e => new RegExp(e));
    case OptionType.Require: return require(path.resolve(value));
    case OptionType.RequireArray:
      return value.split(",").map(e => require(path.resolve(e)));
    case OptionType.JSONArray:
      return Promise.all(
        value
          .split(",")
          .map(location =>
            fs.readFile(location, "utf8").then(e => JSON.parse(e)),
          ),
      );
    case OptionType.JSON:
      return JSON.parse(await fs.readFile(value, "utf8"));
    case OptionType.TextFile:
      return fs.readFile(value, "utf8");
    case OptionType.TextFileArray:
      return Promise.all(
        value.split(",").map(location => fs.readFile(location, "utf8")),
      );
    case OptionType.File:
      return fs.readFile(value);
    case OptionType.FileArray:
      return Promise.all(
        value.split(",").map(location => fs.readFile(location)),
      );
    case OptionType.Float:
      return parseFloat(value);
    case OptionType.FloatArray:
      return value.split(",").map(parseFloat);
    case OptionType.String:
      return value;
    case OptionType.StringArray:
      return value.split(",");
    case OptionType.Flag:
    default:
      return true;
  }
}

async function resolveCliOption(
  argv: string[],
  index: number,
  name: string,
  definition: Partial<ConfigurationDefinition>,
  result: Result<any>,
): Promise<number> {
  const nextIndex = index + 1;
  switch (definition.type) {
    case OptionType.Function: {
      result.errors.push(
        `Invalid flag ${name}, can only be passed via configuration file.`,
      );
      return 0;
    }

    case OptionType.Glob:
    case OptionType.GlobArray:
    case OptionType.Integer:
    case OptionType.IntegerArray:
    case OptionType.Resolve:
    case OptionType.ResolveArray:
    case OptionType.RegExp:
    case OptionType.RegExpArray:
    case OptionType.Require:
    case OptionType.RequireArray:
    case OptionType.JSON:
    case OptionType.JSONArray:
    case OptionType.TextFile:
    case OptionType.TextFileArray:
    case OptionType.File:
    case OptionType.FileArray:
    case OptionType.FloatArray:
    case OptionType.Float:
    case OptionType.StringArray:
    case OptionType.String: {
      if (nextIndex >= argv.length) {
        result.errors.push(
          `Invalid option: ${name} not enough arguments provided.`,
        );
        return 0;
      }
      const nextValue = argv[nextIndex];
      if (isOption(nextValue) || isAlias(nextValue)) {
        result.errors.push(
          `Invalid option: ${name} not enough arguments provided.`,
        );
        return 0;
      }
      try {
        result.options[name] = await obtainValue(definition.type, nextValue);
      } catch (ex) {
        if (ex instanceof Error) {
          result.errors.push(ex.message);
        } else {
          result.errors.push(ex);
        }
      }
      return 1;
    }
    case OptionType.Flag:
    default: {
      result.options[name] = true;
      break;
    }
  }
  return 0;
}

function validateConfigOption(
  option: Partial<ConfigurationDefinition>,
  value: any,
): boolean {
  switch (option.type) {
    case OptionType.Function:
      return typeof value === "function";
    case OptionType.Integer:
      return Number.isInteger(value);
    case OptionType.Float:
      return typeof value === "number";
    case OptionType.IntegerArray: {
      return (
        Array.isArray(value) &&
        value.reduce(
          (result, value: any) => result && Number.isInteger(value),
          true,
        )
      );
    }
    case OptionType.FloatArray: {
      return (
        Array.isArray(value) &&
        value.reduce(
          (result, value: any) => result && typeof value === "number",
          true,
        )
      );
    }

    case OptionType.RegExp:
      return value && value.constructor === RegExp;
    case OptionType.RegExpArray: {
      return (
        Array.isArray(value) &&
        value.reduce(
          (result, e: any) => result && e && e.constructor === RegExp,
          true,
        )
      );
    }
    // string[]
    case OptionType.FileArray:
    case OptionType.GlobArray:
    case OptionType.JSONArray:
    case OptionType.RequireArray:
    case OptionType.ResolveArray:
    case OptionType.StringArray:
    case OptionType.TextFileArray: {
      return (
        Array.isArray(value) &&
        value.reduce(
          (result, value: any) => result && typeof value === "string",
          true,
        )
      );
    }

    // strings
    case OptionType.File:
    case OptionType.Glob:
    case OptionType.JSON:
    case OptionType.Require:
    case OptionType.Resolve:
    case OptionType.String:
    case OptionType.TextFile: {
      return typeof value === "string";
    }
    case OptionType.Flag:
    default: {
      return value === true || value === false;
    }
  }
}

async function obtainConfigValue(
  option: Partial<ConfigurationDefinition>,
  value: any,
): Promise<any> {
  switch (option.type) {
    case OptionType.File:
      return fs.readFile(value);
    case OptionType.FileArray:
      return Promise.all(value.map((file: string) => fs.readFile(file)));
    case OptionType.Glob:
      return globp(value);
    case OptionType.GlobArray:
      return Promise.all(value.map((e: string) => globp(e))).then(all =>
        Array.from(
          new Set(([] as string[]).concat.apply([], all as string[][])),
        ),
      );
    case OptionType.JSON:
      return JSON.parse(await fs.readFile(value, "utf8"));
    case OptionType.JSONArray:
      return Promise.all(
        value.map((e: string) =>
          fs.readFile(e, "utf8").then(e => JSON.parse(e)),
        ),
      );
    case OptionType.Require:
      return require(path.resolve(value));
    case OptionType.RequireArray:
      return value.map((e: string) => require(path.resolve(e)));
    case OptionType.Resolve:
      return path.resolve(value);
    case OptionType.ResolveArray:
      return value.map((e: string) => path.resolve(e));
    case OptionType.TextFile:
      return fs.readFile(value, "utf8");
    case OptionType.TextFileArray:
      return Promise.all(
        value.map((file: string) => fs.readFile(file, "utf8")),
      );

    case OptionType.RegExp:
    case OptionType.RegExpArray:
    case OptionType.IntegerArray:
    case OptionType.Integer:
    case OptionType.Function:
    case OptionType.String:
    case OptionType.StringArray:
    case OptionType.Float:
    case OptionType.Flag:
    default: {
      return value;
    }
  }
}

async function resolveConfigOption<T>(
  result: Result<T>,
  key: keyof T,
  option: Partial<ConfigurationDefinition>,
  value: any,
): Promise<void> {
  result.configProvided.add(key as string);
  if (validateConfigOption(option, value)) {
    result.options[key] = await obtainConfigValue(option, value);
  }
}

export async function resolveConfig<T>(
  result: Result<T>,
  configuration: Configuration<T>,
): Promise<void> {
  const promises: Promise<void>[] = [];
  for (const [key, value] of Object.entries(result.options.config)) {
    if (key === "config") continue;
    const configOption = configuration[key as keyof T];
    if (!configOption) {
      result.errors.push(`Unknown configuration property: ${key}`);
      continue;
    }
    if (!result.cliProvided.has(key as string)) {
      promises.push(
        resolveConfigOption(result, key as keyof T, configOption, value),
      );
    }
  }
  return Promise.all(promises).then(() => {});
}

export async function parse<T>(
  argv: string[],
  configuration: Configuration<T>,
): Promise<Result<T>> {
  const result: Result<T> = {
    args: [],
    unknown: [],
    cliProvided: new Set<string>(),
    options: {} as OptionsResult<T>,
    configProvided: new Set<string>(),
    errors: [],
  };

  // first, create lookup maps and set default values
  const optionLookup = new Map<string, Partial<ConfigurationDefinition>>();
  const aliasLookup = new Map<string, Partial<ConfigurationDefinition>>();
  const nameLookup = new Map<Partial<ConfigurationDefinition>, string>();
  const required = new Set<string>();

  for (const key in configuration) {
    const configOption = configuration[key];
    optionLookup.set(key, configOption);
    if (configOption.alias) aliasLookup.set(configOption.alias, configOption);
    nameLookup.set(configOption, key);
    const configOptionType = configOption.type ?? OptionType.Flag;
    result.options[key] =
      configOptionType === OptionType.Flag ? false : configOption.default;
    if (configOption.required) required.add(key);
  }

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (isOption(arg)) {
      let camelCaseArg = arg
        .slice(2)
        .replace(/-([a-z])/gi, (_, char) => char.toUpperCase());
      if (optionLookup.has(camelCaseArg)) {
        let option = optionLookup.get(camelCaseArg)!;
        let name = nameLookup.get(option)!;
        i += await resolveCliOption(argv, i, name, option, result);
        result.cliProvided.add(name);
      } else {
        result.unknown.push(arg);
      }
    } else if (isAlias(arg)) {
      if (optionLookup.has(arg)) {
        let option = aliasLookup.get(arg)!;
        let name = nameLookup.get(option)!;
        i += await resolveCliOption(argv, i, name, option, result);
        result.cliProvided.add(arg);
      } else {
        result.unknown.push(arg);
      }
    } else {
      result.args.push(arg);
    }
  }

  // @ts-ignore: Determine if a configuration exists
  if (configuration.config) {
    // @ts-ignore: Determine if a configuration exists
    const configDefinition = configuration.config as Partial<
      ConfigurationDefinition
    >;
    if (configDefinition.type === OptionType.Require) {
      await resolveConfig<T>(result, configuration);
    } else {
      result.errors.push(`Option --config must be of type OptionType.Require.`);
    }
  }

  for (const key of required) {
    if (!result.cliProvided.has(key) && !result.configProvided.has(key)) {
      result.errors.push(`Invalid configuration, "${key}" not provided.`);
    }
  }

  return result;
}
