import { getInput, getBooleanInput, debug, info, warning } from "@actions/core";

export const CORE_SERVICE_IDENTIFIER = Symbol("CoreService");

export type CoreService = {
  getInput: typeof getInput;
  getBooleanInput: typeof getBooleanInput;
  debug: typeof debug;
  info: typeof info;
  warning: typeof warning;
};

export const coreService: CoreService = {
  getInput,
  getBooleanInput,
  debug,
  info,
  warning,
};
