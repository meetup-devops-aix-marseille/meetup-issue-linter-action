import { MeetupIssue } from "../meetup-issue.service";

export const LINTER_ADAPTER_IDENTIFIER = Symbol("LinterAdapter");

export interface LinterAdapter {
  lint(meetupIssue: MeetupIssue, shouldFix: boolean): Promise<MeetupIssue>;

  getPriority(): number;
}
