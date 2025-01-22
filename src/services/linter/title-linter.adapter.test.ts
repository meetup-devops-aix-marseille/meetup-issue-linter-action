import { mock, MockProxy } from "jest-mock-extended";
import { getMeetupIssueFixture } from "../../__fixtures__/meetup-issue.fixture";
import { MeetupIssueService } from "../meetup-issue.service";
import { TitleLinterAdapter } from "./title-linter.adapter";
import { LintError } from "./lint.error";

describe("TitleLinterAdapter - lint", () => {
  let meetupIssueServiceMock: MockProxy<MeetupIssueService>;
  let adapter: TitleLinterAdapter;

  beforeEach(() => {
    meetupIssueServiceMock = mock<MeetupIssueService>();
    adapter = new TitleLinterAdapter(meetupIssueServiceMock);
  });

  describe("lint", () => {
    it("should return the meetupIssue as is if the title matches the expected format", async () => {
      const meetupIssue = getMeetupIssueFixture();

      const result = await adapter.lint(meetupIssue, false);
      expect(result).toBe(meetupIssue);
      expect(meetupIssueServiceMock.updateMeetupIssueTitle).not.toHaveBeenCalled();
    });

    it("should throw LintError if the title is invalid and shouldFix is false", async () => {
      const invalidMeetupIssue = getMeetupIssueFixture({
        title: "Wrong Title",
      });

      const expectedError = new LintError([
        'Title: Invalid, expected "[Meetup] - 2021-12-31 - Meetup Event"',
      ]);

      await expect(adapter.lint(invalidMeetupIssue, false)).rejects.toStrictEqual(expectedError);
      expect(meetupIssueServiceMock.updateMeetupIssueTitle).not.toHaveBeenCalled();
    });

    it("should fix the title if it is invalid and shouldFix is true", async () => {
      const invalidMeetupIssue = getMeetupIssueFixture({
        title: "Wrong Title",
      });

      const result = await adapter.lint(invalidMeetupIssue, true);
      expect(result.title).toBe("[Meetup] - 2021-12-31 - Meetup Event");
      expect(meetupIssueServiceMock.updateMeetupIssueTitle).toHaveBeenCalledWith(result);
    });

    it("should throw an error if there is no event_date", async () => {
      const invalidMeetupIssue = getMeetupIssueFixture({
        body: {
          event_date: undefined,
        },
      });

      const expectedError = new Error("Event Date is required to lint the title");

      await expect(adapter.lint(invalidMeetupIssue, false)).rejects.toStrictEqual(expectedError);
    });

    it("should throw an error if there is no event_title", async () => {
      const invalidMeetupIssue = getMeetupIssueFixture({
        body: {
          event_date: "2021-12-31",
          event_title: undefined,
        },
      });

      const expectedError = new Error("Event Title is required to lint the title");
      await expect(adapter.lint(invalidMeetupIssue, false)).rejects.toStrictEqual(expectedError);
    });
  });

  describe("getPriority", () => {
    it("should return 1", () => {
      expect(adapter.getPriority()).toBe(1);
    });
  });
});
