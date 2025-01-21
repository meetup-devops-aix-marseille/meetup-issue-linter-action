import { setFailed } from "@actions/core";
import { InputService } from "./services/input.service";
import { LoggerService } from "./services/logger.service";
import { container } from "./container";
import { LinterService } from "./services/linter.service";
import { MeetupIssueService } from "./services/meetup-issue.service";

/**
 * The run function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const loggerService = container.get(LoggerService);
    const inputService = container.get(InputService);
    const linterService = container.get(LinterService);
    const meetupIssueService = container.get(MeetupIssueService);

    const issueNumber = inputService.getIssueNumber();
    loggerService.debug(`Issue number: ${issueNumber}`);

    const IssueParsedBody = inputService.getIssueParsedBody();
    loggerService.debug(`Parsed issue body: ${JSON.stringify(IssueParsedBody)}`);

    const shouldFix = inputService.getShouldFix();
    loggerService.debug(`Should fix: ${shouldFix}`);

    loggerService.info(`Start linting issue ${issueNumber}...`);

    const meetupIssue = await meetupIssueService.getMeetupIssue(issueNumber, IssueParsedBody);

    await linterService.lint(meetupIssue, shouldFix);

    loggerService.info("Issue linted successfully.");
  } catch (error) {
    setFailed(`${error instanceof Error ? error : JSON.stringify(error)}`);
  }
}
