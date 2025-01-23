import { MeetupIssue } from "../../services/meetup-issue.service";

export const LINTER_ADAPTER_IDENTIFIER = Symbol("LinterAdapter");

export type LinterDependency = { new (): LinterAdapter };

export interface LinterAdapter {
  lint(meetupIssue: MeetupIssue, shouldFix: boolean): Promise<MeetupIssue>;

  getDependencies(): LinterDependency[];
}
