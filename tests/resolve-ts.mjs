// Lets the tests import the app's source files, which use extensionless
// specifiers the way the bundler expects them.
import { register } from "node:module";
import { pathToFileURL } from "node:url";

register("./resolve-ts-hooks.mjs", pathToFileURL("./tests/"));
