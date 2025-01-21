import { injectable, multiInject } from "inversify";
import { LinterAdapter, LINTER_ADAPTER_IDENTIFIER } from "./linter/linter.adapter";
import { MeetupIssue } from "./meetup-issue.service";

@injectable()
export class LinterService {
  private readonly linters: LinterAdapter[];

  constructor(@multiInject(LINTER_ADAPTER_IDENTIFIER) linters: LinterAdapter[]) {
    // Sort linters by priority, lower first
    this.linters = linters.sort((a, b) => a.getPriority() - b.getPriority());
  }

  async lint(meetupIssue: MeetupIssue, shouldFix: boolean): Promise<void> {
    let currentMeetupIssue = meetupIssue;
    for (const linter of this.linters) {
      currentMeetupIssue = await linter.lint(currentMeetupIssue, shouldFix);
    }
  }
}
