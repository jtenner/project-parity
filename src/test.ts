import glob from "glob";
import colors from "ansi-colors";
import path from "path";
import { promisify } from "util";
const globp = promisify(glob);

async function main() {
  const matches = await globp("**/*.spec.js");
  const files: Promise<void>[] = [];
  let code = 0;

  const tests = matches
    .filter(match => !/node_modules/.test(match))
    .map(match => {
      process.stdout.write(colors.greenBright(`Found Test: ${match}\n\n`));
      const modulePath = path.resolve(match);
      const test: (
        files: Promise<void>[],
      ) => Promise<void> = require(modulePath).test;
      return test(files)
        .then(() => {
          process.stdout.write(colors.greenBright(`  Pass ✔ ${match}\n\n`));
        })
        .catch(err => {
          console.error(err);
          code = 1;
          process.stdout.write(colors.redBright(`  Fail ❌ ${match}\n\n`));
        });
    });

  await Promise.all(tests);
  await Promise.all(files);
  process.exit(code);
}

main();
