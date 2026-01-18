import { runCommandTests } from "./commands.test.js";

const results = [];

function report(name, fn) {
  try {
    fn();
    results.push({ name, status: "ok" });
  } catch (error) {
    results.push({ name, status: "fail", error });
  }
}

runCommandTests(report);

const failed = results.filter((r) => r.status === "fail");

for (const result of results) {
  if (result.status === "ok") {
    console.log(`✓ ${result.name}`);
  } else {
    console.error(`✗ ${result.name}`);
    console.error(result.error?.stack || result.error);
  }
}

if (failed.length) {
  console.error(`\n${failed.length} test(s) failed.`);
  process.exitCode = 1;
} else {
  console.log(`\nAll ${results.length} tests passed.`);
}
