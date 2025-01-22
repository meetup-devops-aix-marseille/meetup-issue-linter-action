import { EventDescriptionLinterAdapter } from "./event-description-linter.adapter";
import { LintError } from "./lint.error";
import { getMeetupIssueFixture } from "../../__fixtures__/meetup-issue.fixture";

describe("EventDescriptionLinterAdapter", () => {
  let eventDescriptionLinterAdapter: EventDescriptionLinterAdapter;

  beforeEach(() => {
    eventDescriptionLinterAdapter = new EventDescriptionLinterAdapter();
  });

  describe("lint", () => {
    it("should return the meetup issue if the event description is valid", async () => {
      // Arrange
      const meetupIssue = getMeetupIssueFixture();
      const shouldFix = false;

      // Act
      const result = await eventDescriptionLinterAdapter.lint(meetupIssue, shouldFix);

      // Assert
      expect(result).toEqual(meetupIssue);
    });

    it("should throw a LintError if the event description is invalid", async () => {
      // Arrange
      const invalidMeetupIssue = getMeetupIssueFixture({
        body: {
          event_description: "",
        },
      });
      const shouldFix = false;

      // Act & Assert
      const expectedError = new LintError(["Event Description: Must not be empty"]);

      await expect(
        eventDescriptionLinterAdapter.lint(invalidMeetupIssue, shouldFix)
      ).rejects.toThrow(expectedError);
    });
  });

  describe("getPriority", () => {
    it("should return priority as 0", () => {
      const priority = eventDescriptionLinterAdapter.getPriority();

      expect(priority).toBe(0);
    });
  });
});
