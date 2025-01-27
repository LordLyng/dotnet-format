import { getInput, setOutput } from "@actions/core";

import { format } from "./dotnet";
import { checkVersion } from "./version";

export async function check(): Promise<void> {
  const onlyChangedFiles = getInput("only-changed-files") === "true";
  const failFast = getInput("fail-fast") === "true";
  const version = getInput("version", { required: true });
  const args = getInput("run-args");

  const dotnetFormatVersion = checkVersion(version);

  const result = await format(dotnetFormatVersion)({
    dryRun: true,
    onlyChangedFiles,
    args,
  });

  setOutput("has-changes", result.toString());

  // fail fast will cause the workflow to stop on this job
  if (result && failFast) {
    throw Error("Formatting issues found");
  }
}

export async function fix(): Promise<void> {
  const onlyChangedFiles = getInput("only-changed-files") === "true";
  const version = getInput("version", { required: true });
  const args = getInput("run-args");

  const dotnetFormatVersion = checkVersion(version);

  const result = await format(dotnetFormatVersion)({
    dryRun: false,
    onlyChangedFiles,
    args,
  });

  setOutput("has-changes", result.toString());
}
