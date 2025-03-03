import { CNCFLinkLinterAdapter } from "./cncf-link-linter.adapter";
import { LintError } from "../lint.error";
import { getMeetupIssueFixture } from "../../__fixtures__/meetup-issue.fixture";

describe("CNCFLinkLinterAdapter", () => {
  let cncfLinkLinterAdapter: CNCFLinkLinterAdapter;

  beforeEach(() => {
    cncfLinkLinterAdapter = new CNCFLinkLinterAdapter();
  });

  describe("lint", () => {
    it("should return the cncf issue if the CNCF link is valid", async () => {
      // Arrange
      const meetupIssue = getMeetupIssueFixture();
      const shouldFix = false;

      // Act
      const result = await cncfLinkLinterAdapter.lint(meetupIssue, shouldFix);

      // Assert
      expect(result).toEqual(meetupIssue);
    });

    it("should throw a LintError if the CNCF link is invalid", async () => {
      // Arrange
      const invalidmeetupIssue = getMeetupIssueFixture({
        body: {
          cncf_link: "invalid-link",
        },
      });
      const shouldFix = false;

      // Act & Assert
      const expectedError = new LintError([
        "CNCF Link: Invalid url; Must be a valid CNCF link, e.g. https://community.cncf.io/events/details/cncf-cloud-native-aix-marseille-presents-quiz-conteneurs-et-observabilite",
      ]);

      await expect(cncfLinkLinterAdapter.lint(invalidmeetupIssue, shouldFix)).rejects.toStrictEqual(
        expectedError
      );
    });

    it("should throw a LintError if the CNCF link is not a CNCF link", async () => {
      // Arrange
      const invalidmeetupIssue = getMeetupIssueFixture({
        body: {
          cncf_link: "https://www.google.com",
        },
      });
      const shouldFix = false;

      // Act & Assert
      const expectedError = new LintError([
        "CNCF Link: Must be a valid CNCF link, e.g. https://community.cncf.io/events/details/cncf-cloud-native-aix-marseille-presents-quiz-conteneurs-et-observabilite",
      ]);

      await expect(cncfLinkLinterAdapter.lint(invalidmeetupIssue, shouldFix)).rejects.toStrictEqual(
        expectedError
      );
    });
  });
});
