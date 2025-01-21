import { injectable } from "inversify";
import { LinterAdapter } from "./linter.adapter";
import { MeetupIssue, MeetupIssueService } from "../meetup-issue.service";
import { LintError } from "./lint.error";

@injectable()
export class TitleLinterAdapter implements LinterAdapter {
  private static TITLE_PATTERN = "[Meetup] - <date> - <title>";

  constructor(private readonly meetupIssueService: MeetupIssueService) {}

  async lint(meetupIssue: MeetupIssue, shouldFix: boolean): Promise<MeetupIssue> {
    const expectedTitle = this.getExpectedTitle(meetupIssue);

    if (meetupIssue.title === expectedTitle) {
      return meetupIssue;
    }

    if (shouldFix) {
      meetupIssue.title = expectedTitle;
      await this.meetupIssueService.updateMeetupIssueTitle(meetupIssue);
      return meetupIssue;
    }

    throw new LintError([`Title: Invalid, expected "${expectedTitle}"`]);
  }

  getPriority() {
    return 1;
  }

  private getExpectedTitle(meetupIssue: MeetupIssue) {
    const date = meetupIssue.body.event_date;
    if (!date) {
      throw new Error("Event Date is required to lint the title");
    }
    const title = meetupIssue.body.event_title;
    if (!title) {
      throw new Error("Event Title is required to lint the title");
    }

    return TitleLinterAdapter.TITLE_PATTERN.replace("<date>", date).replace("<title>", title);
  }
}
