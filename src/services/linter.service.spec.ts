import { mock } from "jest-mock-extended";

import { LinterService } from "./linter.service";
import { LinterAdapter } from "./linter/linter.adapter";
import { getMeetupIssueFixture } from "../__fixtures__/meetup-issue.fixture";
import { LintError } from "./linter/lint.error";

describe("LinterService", () => {
  describe("lint", () => {
    it("should call lint on each linter in order of priority", async () => {
      // Arrange
      const linterAdapterWithLowPriority = mock<LinterAdapter>();
      linterAdapterWithLowPriority.getPriority.mockReturnValue(0);

      const linterAdapterWithMidPriority = mock<LinterAdapter>();
      linterAdapterWithMidPriority.getPriority.mockReturnValue(1);

      const linterAdapterWithHighPriority = mock<LinterAdapter>();
      linterAdapterWithHighPriority.getPriority.mockReturnValue(2);

      const linterService = new LinterService([
        linterAdapterWithMidPriority,
        linterAdapterWithHighPriority,
        linterAdapterWithLowPriority,
      ]);

      const meetupIssue = getMeetupIssueFixture();
      const shouldFix = false;

      // Act
      await linterService.lint(meetupIssue, shouldFix);

      // Assert
      expect(linterAdapterWithLowPriority.lint).toHaveBeenCalled();
      expect(linterAdapterWithMidPriority.lint).toHaveBeenCalled();
      expect(linterAdapterWithHighPriority.lint).toHaveBeenCalled();

      // Assert that the linters were called in order of priority
      const linterAdapterWithLowPriorityOrder =
        linterAdapterWithLowPriority.lint.mock.invocationCallOrder[0];
      const linterAdapterWithMidPriorityOrder =
        linterAdapterWithMidPriority.lint.mock.invocationCallOrder[0];
      const linterAdapterWithHighPriorityOrder =
        linterAdapterWithHighPriority.lint.mock.invocationCallOrder[0];

      expect(linterAdapterWithLowPriorityOrder).toBeLessThan(linterAdapterWithMidPriorityOrder);
      expect(linterAdapterWithMidPriorityOrder).toBeLessThan(linterAdapterWithHighPriorityOrder);
    });

    it("should throw a LintError if any linter fails aggragated by priority", async () => {
      // Arrange
      const firstLinterAdapterWithHighPriority = mock<LinterAdapter>();
      firstLinterAdapterWithHighPriority.getPriority.mockReturnValue(0);
      firstLinterAdapterWithHighPriority.lint.mockRejectedValue(
        new LintError(["First Lint error"])
      );

      const secondLinterAdapterWithHighPriority = mock<LinterAdapter>();
      secondLinterAdapterWithHighPriority.getPriority.mockReturnValue(0);
      secondLinterAdapterWithHighPriority.lint.mockRejectedValue(
        new LintError(["Second Lint error"])
      );

      // This linter has a higher priority than the previous two, so it should not be called as previous linters failed
      const linterAdapterWithLowPriority = mock<LinterAdapter>();
      linterAdapterWithLowPriority.getPriority.mockReturnValue(1);
      linterAdapterWithLowPriority.lint.mockRejectedValue(new LintError(["Third Lint error"]));

      const linterService = new LinterService([
        firstLinterAdapterWithHighPriority,
        secondLinterAdapterWithHighPriority,
        linterAdapterWithLowPriority,
      ]);

      const meetupIssue = getMeetupIssueFixture();
      const shouldFix = false;

      // Act & Assert
      const expectedError = new LintError(["First Lint error", "Second Lint error"]);
      await expect(linterService.lint(meetupIssue, shouldFix)).rejects.toStrictEqual(expectedError);

      expect(firstLinterAdapterWithHighPriority.lint).toHaveBeenCalled();
      expect(secondLinterAdapterWithHighPriority.lint).toHaveBeenCalled();

      expect(linterAdapterWithLowPriority.lint).not.toHaveBeenCalled();
    });
  });
});
