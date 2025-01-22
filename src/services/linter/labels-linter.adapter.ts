import { injectable } from "inversify";
import { LinterAdapter } from "./linter.adapter";
import { MeetupIssue, MeetupIssueService } from "../meetup-issue.service";
import { LintError } from "./lint.error";

@injectable()
export class LabelsLinterAdapter implements LinterAdapter {
  private static EXPECTED_LABELS = ["meetup"];

  constructor(private readonly meetupIssueService: MeetupIssueService) {}

  async lint(meetupIssue: MeetupIssue, shouldFix: boolean): Promise<MeetupIssue> {
    const expectedLabels = LabelsLinterAdapter.EXPECTED_LABELS;
    const meetupIssueLabels = meetupIssue.labels;

    // Ensure that the meetup issue has the expected labels and no other labels
    const missingLabels = expectedLabels.filter((label) => !meetupIssueLabels.includes(label));
    const extraLabels = meetupIssueLabels.filter((label) => !expectedLabels.includes(label));

    if (missingLabels.length === 0 && extraLabels.length === 0) {
      return meetupIssue;
    }

    if (shouldFix) {
      meetupIssue.labels = expectedLabels;
      await this.meetupIssueService.updateMeetupIssueLabels(meetupIssue);
      return meetupIssue;
    }

    const lintErrors: string[] = [];
    if (missingLabels.length > 0) {
      lintErrors.push(`Labels: Missing label(s) "${missingLabels.join(", ")}"`);
    }

    if (extraLabels.length > 0) {
      lintErrors.push(`Labels: Extra label(s) "${extraLabels.join(", ")}"`);
    }

    throw new LintError(lintErrors);
  }

  getPriority() {
    return 0;
  }
}
