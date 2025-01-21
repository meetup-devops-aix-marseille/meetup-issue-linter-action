import { injectable } from "inversify";

import { GithubService } from "./github.service";

export type MeetupIssueBodyFields = keyof MeetupIssueBody;

export type MeetupIssueBody = {
  event_date?: string;
  event_title?: string;
  hoster?: string[];
  agenda?: string;
  meetup_link?: string;
  drive_link?: string;
};

export type MeetupIssue = {
  number: number;
  title: string;
  body: MeetupIssueBody;
  labels: string[];
};

export const MEETUP_ISSUE_BODY_FIELD_LABELS: Record<MeetupIssueBodyFields, string> = {
  event_date: "Event Date",
  event_title: "Event Title",
  hoster: "Hoster",
  agenda: "Agenda",
  meetup_link: "Meetup Link",
  drive_link: "Drive Link",
};

@injectable()
export class MeetupIssueService {
  constructor(private readonly githubService: GithubService) {}

  async getMeetupIssue(
    issueNumber: number,
    IssueParsedBody: MeetupIssueBody
  ): Promise<MeetupIssue> {
    const issue = await this.githubService.getIssue(issueNumber);

    const meetupIssue: MeetupIssue = {
      number: issue.number,
      title: issue.title,
      labels: issue.labels,
      body: IssueParsedBody,
    };

    return meetupIssue;
  }

  async updateMeetupIssueTitle(meetupIssue: MeetupIssue): Promise<void> {
    await this.githubService.updateIssueTitle(meetupIssue.number, meetupIssue.title);
  }
}
