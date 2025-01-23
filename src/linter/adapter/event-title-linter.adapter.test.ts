import { EventTitleLinterAdapter } from "./event-title-linter.adapter";
import { LintError } from "../lint.error";
import { getMeetupIssueFixture } from "../../__fixtures__/meetup-issue.fixture";

describe("EventTitleLinterAdapter", () => {
  let eventTitleLinterAdapter: EventTitleLinterAdapter;

  beforeEach(() => {
    eventTitleLinterAdapter = new EventTitleLinterAdapter();
  });

  describe("lint", () => {
    it("should return the meetup issue if the event title is valid", async () => {
      // Arrange
      const meetupIssue = getMeetupIssueFixture();
      const shouldFix = false;

      // Act
      const result = await eventTitleLinterAdapter.lint(meetupIssue, shouldFix);

      // Assert
      expect(result).toEqual(meetupIssue);
    });

    it("should throw a LintError if the event title is invalid", async () => {
      // Arrange
      const invalidMeetupIssue = getMeetupIssueFixture({
        body: {
          event_title: "",
        },
      });
      const shouldFix = false;

      // Act & Assert
      const expectedError = new LintError(["Event Title: Must not be empty"]);

      await expect(
        eventTitleLinterAdapter.lint(invalidMeetupIssue, shouldFix)
      ).rejects.toStrictEqual(expectedError);
    });
  });
});
