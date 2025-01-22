import { injectable, multiInject } from "inversify";
import { LinterAdapter, LINTER_ADAPTER_IDENTIFIER } from "./linter/linter.adapter";
import { MeetupIssue } from "./meetup-issue.service";
import { LintError } from "./linter/lint.error";

@injectable()
export class LinterService {
  private readonly linters: LinterAdapter[];

  constructor(@multiInject(LINTER_ADAPTER_IDENTIFIER) linters: LinterAdapter[]) {
    // Sort linters by priority, lower first, group  by priority
    this.linters = linters.sort((a, b) => a.getPriority() - b.getPriority());
  }

  async lint(meetupIssue: MeetupIssue, shouldFix: boolean): Promise<void> {
    let lintedMeetupIssue = meetupIssue;
    let previousPriority: number | undefined;
    let aggregatedError: LintError | undefined;

    for (const linter of this.linters) {
      this.ensureNoPendingErrors(previousPriority, linter.getPriority(), aggregatedError);
      previousPriority = linter.getPriority();

      const result = await this.runSingleLinter(
        linter,
        lintedMeetupIssue,
        shouldFix,
        aggregatedError
      );

      lintedMeetupIssue = result.lintedIssue;
      aggregatedError = result.aggregatedError;
    }

    if (aggregatedError) {
      throw aggregatedError;
    }
  }

  private ensureNoPendingErrors(
    prevPriority: number | undefined,
    currentPriority: number,
    aggregatedError: LintError | undefined
  ): void {
    if (prevPriority !== undefined && currentPriority > prevPriority && aggregatedError) {
      throw aggregatedError;
    }
  }

  private async runSingleLinter(
    linter: LinterAdapter,
    meetupIssue: MeetupIssue,
    shouldFix: boolean,
    aggregatedError: LintError | undefined
  ): Promise<{ lintedIssue: MeetupIssue; aggregatedError?: LintError }> {
    try {
      return {
        lintedIssue: await linter.lint(meetupIssue, shouldFix),
        aggregatedError: aggregatedError,
      };
    } catch (error) {
      if (error instanceof LintError) {
        return {
          lintedIssue: meetupIssue,
          aggregatedError: aggregatedError ? aggregatedError.merge(error) : error,
        };
      }
      throw error;
    }
  }
}
