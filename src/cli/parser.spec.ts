import { parse } from "./parser";
import path from "path";
import glob from "glob";
import { promisify, inspect, InspectOptions } from "util";
import { promises as fs } from "fs";
import { Configuration } from "../util/configuration";
import colors from "ansi-colors";
import { diffLines } from "diff";

const globp = promisify(glob);

const inspectOptions: InspectOptions = {
  colors: false,
  depth: Infinity,
  sorted: true,
};
const cwd = process.cwd();
function replaceCWD(val: any): any {
  return typeof val === "string"
    ? val.replace(cwd, "{CWD}").replace(/\\/g, "/")
    : val;
}

interface TestInput {
  argv: string[];
  config: Configuration<any>;
}

export async function test(files: Promise<void>[]): Promise<boolean> {
  const tests = await globp("test/parser/**/*.test.js");
  const updateSnapshots = process.argv.includes("--create");
  let passed = true;
  for (const test of tests) {
    const input: TestInput = require(path.resolve(test));
    const dirname = path.dirname(test);
    const basename = path.basename(test, ".test.js");
    const configFileName = path.join(dirname, basename + ".config.js");
    await fs.appendFile(configFileName, "");
    const result = await parse(
      input.argv.concat(["--config", configFileName]),
      input.config,
    );
    Object.entries(result.options).forEach(([key, value]) => {
      if (typeof value === "string") {
        result.options[key] = replaceCWD(value);
      } else if (Array.isArray(value)) {
        result.options[key] = value.map(replaceCWD);
      }
    });
    result.errors = result.errors.map(replaceCWD);
    const inspected = inspect(result, inspectOptions) + "\n";

    const snapFileName = path.join(dirname, basename + ".snap");
    await fs.appendFile(snapFileName, "");


    const file = await fs.readFile(snapFileName, "utf8");
    if (updateSnapshots) {
      if (inspected !== file) {
        process.stdout.write(
          `  ${colors.greenBright("[ Updated Snapshot ]")} ${test}\n`,
        );
        files.push(
          fs.writeFile(path.join(dirname, basename + ".snap"), inspected),
        );
      }
    } else {
      if (file !== inspected) {
        process.stdout.write(colors.redBright(`  [ Fail ]`));
        // do a diff
        const linesDiff = diffLines(file, inspected);
        for (const lineDiff of linesDiff) {
          const lines = lineDiff.value.trimRight().split(/\r\n|\r|\n/);
          let func: (a: string) => string;
          let prefix: string;
          if (lineDiff.added) {
            func = colors.greenBright;
            prefix = "+ ";
          } else if (lineDiff.removed) {
            func = colors.redBright;
            prefix = "- ";
          } else {
            func = a => a;
            prefix = "  ";
          }
          for (const line of lines) {
            process.stdout.write(func(`${prefix}${line}\n`));
          }
        }
        passed = false;
      } else {
        process.stdout.write(colors.greenBright(`  [ Pass ]`));
      }
      process.stdout.write(` ${test}\n`);
    }
  }

  process.stdout.write("\n");
  return passed;
}
