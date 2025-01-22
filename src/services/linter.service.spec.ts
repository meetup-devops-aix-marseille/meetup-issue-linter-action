import { mock } from "jest-mock-extended";

import { LinterService } from "./linter.service";
import { LinterAdapter } from "./linter/linter.adapter";
import { getMeetupIssueFixture } from "../__fixtures__/meetup-issue.fixture";

describe("LinterService", () => {
  describe("lint", () => {
    it("should call lint on each linter in order of priority", async () => {
      // Arrange
      const linterAdapterWithLowPriority = mock<LinterAdapter>();
      linterAdapterWithLowPriority.getPriority.mockReturnValue(1);

      const linterAdapterWithMidPriority = mock<LinterAdapter>();
      linterAdapterWithMidPriority.getPriority.mockReturnValue(50);

      const linterAdapterWithHighPriority = mock<LinterAdapter>();
      linterAdapterWithHighPriority.getPriority.mockReturnValue(99);

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
  });
});
