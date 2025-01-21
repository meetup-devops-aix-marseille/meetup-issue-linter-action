import { EventDateLinterAdapter } from "./event-date-linter.adapter";
import { LintError } from "./lint.error";
import { getMeetupIssueFixture } from "../../__fixtures__/meetup-issue";

describe("EventDateLinterAdapter", () => {
  let eventDateLinterAdapter: EventDateLinterAdapter;

  beforeEach(() => {
    eventDateLinterAdapter = new EventDateLinterAdapter();
  });

  it("should return the meetup issue if the event date is valid", async () => {
    // Arrange
    const meetupIssue = getMeetupIssueFixture();
    const shouldFix = false;

    // Act
    const result = await eventDateLinterAdapter.lint(meetupIssue, shouldFix);

    // Assert
    expect(result).toEqual(meetupIssue);
  });

  it("should throw a LintError if the event date is invalid", async () => {
    // Arrange
    const invalidMeetupIssue = getMeetupIssueFixture({
      body: {
        event_date: "invalid-date",
      },
    });
    const shouldFix = false;

    // Act & Assert

    const expectedError = new LintError(["Event Date: Invalid date"]);

    await expect(eventDateLinterAdapter.lint(invalidMeetupIssue, shouldFix)).rejects.toThrow(
      expectedError
    );
  });

  it("should return priority as 0", () => {
    const priority = eventDateLinterAdapter.getPriority();

    expect(priority).toBe(0);
  });
});
