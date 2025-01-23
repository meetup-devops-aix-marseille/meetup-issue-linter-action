import { AgendaLinterAdapter } from "./agenda-linter.adapter";
import { LintError } from "../lint.error";
import { getMeetupIssueFixture } from "../../__fixtures__/meetup-issue.fixture";

describe("AgendaLinterAdapter", () => {
  let agendaLinterAdapter: AgendaLinterAdapter;

  beforeEach(() => {
    agendaLinterAdapter = new AgendaLinterAdapter();
  });

  describe("lint", () => {
    it("should return the meetup issue if the Agenda is valid", async () => {
      // Arrange
      const meetupIssue = getMeetupIssueFixture();
      const shouldFix = false;

      // Act
      const result = await agendaLinterAdapter.lint(meetupIssue, shouldFix);

      // Assert
      expect(result).toEqual(meetupIssue);
    });

    it("should throw a LintError if the Agenda is invalid", async () => {
      // Arrange
      const invalidMeetupIssue = getMeetupIssueFixture({
        body: {
          agenda: "",
        },
      });
      const shouldFix = false;

      // Act & Assert
      const expectedError = new LintError(["Agenda: Must not be empty"]);

      await expect(agendaLinterAdapter.lint(invalidMeetupIssue, shouldFix)).rejects.toStrictEqual(
        expectedError
      );
    });

    it("should throw a LintError if the Agenda line is invalid", async () => {
      // Arrange
      const invalidMeetupIssue = getMeetupIssueFixture({
        body: {
          agenda: "wrong-line",
        },
      });
      const shouldFix = false;

      // Act & Assert
      const expectedError = new LintError([
        'Agenda: Entry "wrong-line" must follow the format: "- <speaker>: <talk_description>"',
      ]);

      await expect(agendaLinterAdapter.lint(invalidMeetupIssue, shouldFix)).rejects.toStrictEqual(
        expectedError
      );
    });
  });

  describe("getPriority", () => {
    it("should return priority as 0", () => {
      const priority = agendaLinterAdapter.getPriority();

      expect(priority).toBe(0);
    });
  });
});
