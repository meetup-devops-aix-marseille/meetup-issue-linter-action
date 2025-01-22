import { MeetupIssue } from "../services/meetup-issue.service";
import { getHostersFixture } from "./hosters.fixture";

export function getMeetupIssueFixture(override?: Partial<MeetupIssue>): MeetupIssue {
  return {
    number: 1,
    title: "[Meetup] - 2021-12-31 - Meetup Event",
    labels: [],
    body: {
      event_date: "2021-12-31",
      event_title: "Meetup Event",
      hoster: [getHostersFixture()[0]],
      event_description: "Description",
      agenda: "- Speaker One: Talk description One\n- Speaker Two: Talk description Two",
      ...(override?.body ?? {}),
    },
    ...(override ?? {}),
  };
}
