import { registerHooks } from "node:module";
import { resolve } from "./test-resolve-hook.mjs";

registerHooks({ resolve });