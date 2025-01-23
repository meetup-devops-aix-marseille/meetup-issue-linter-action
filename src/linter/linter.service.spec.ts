import { mock } from "jest-mock-extended";

import { LinterService } from "./linter.service";
import { LinterAdapter, LinterDependency } from "./adapter/linter.adapter";
import { getMeetupIssueFixture } from "../__fixtures__/meetup-issue.fixture";
import { LintError } from "./lint.error";

class TestLinterWithoutDependency {}

class AnotherTestLinterWithoutDependency {}

class TestLinterWithDependency {}

describe("LinterService", () => {
  describe("lint", () => {
    it("should call lint on each linter respecting dependencies", async () => {
      const meetupIssue = getMeetupIssueFixture();
      const shouldFix = false;

      // Arrange
      const linterAdapterWithoutDependencies = mock<LinterAdapter>();
      linterAdapterWithoutDependencies.constructor = TestLinterWithoutDependency;
      linterAdapterWithoutDependencies.getDependencies.mockReturnValue([]);
      linterAdapterWithoutDependencies.lint.mockResolvedValue(meetupIssue);

      const linterAdapterWithDependency = mock<LinterAdapter>();
      linterAdapterWithDependency.constructor = TestLinterWithDependency;
      linterAdapterWithDependency.getDependencies.mockReturnValue([
        TestLinterWithoutDependency as LinterDependency,
      ]);
      linterAdapterWithDependency.lint.mockResolvedValue(meetupIssue);

      const linterService = new LinterService([
        linterAdapterWithDependency,
        linterAdapterWithoutDependencies,
      ]);

      // Act
      await linterService.lint(meetupIssue, shouldFix);

      // Assert
      expect(linterAdapterWithoutDependencies.lint).toHaveBeenCalled();
      expect(linterAdapterWithDependency.lint).toHaveBeenCalled();

      // Assert that the linters were called in order of priority
      const linterAdapterWithoutDependenciesOrder =
        linterAdapterWithoutDependencies.lint.mock.invocationCallOrder[0];
      const linterAdapterWithDependencyOrder =
        linterAdapterWithDependency.lint.mock.invocationCallOrder[0];

      expect(linterAdapterWithoutDependenciesOrder).toBeLessThan(linterAdapterWithDependencyOrder);
    });

    it("should throw a LintError if any linter fails", async () => {
      // Arrange
      const firstLinterAdapterWithoutDependencies = mock<LinterAdapter>();
      firstLinterAdapterWithoutDependencies.constructor = TestLinterWithoutDependency;
      firstLinterAdapterWithoutDependencies.getDependencies.mockReturnValue([]);
      firstLinterAdapterWithoutDependencies.lint.mockRejectedValue(
        new LintError(["First Lint error"])
      );

      const secondLinterAdapterWithoutDependencies = mock<LinterAdapter>();
      secondLinterAdapterWithoutDependencies.constructor = () => AnotherTestLinterWithoutDependency;
      secondLinterAdapterWithoutDependencies.getDependencies.mockReturnValue([]);
      secondLinterAdapterWithoutDependencies.lint.mockRejectedValue(
        new LintError(["Second Lint error"])
      );

      // This linter has a dependency with first linter, so it should not be called as depending linters have failed
      const linterAdapterWithDependency = mock<LinterAdapter>();
      linterAdapterWithDependency.constructor = TestLinterWithDependency;
      linterAdapterWithDependency.getDependencies.mockReturnValue([
        TestLinterWithoutDependency as LinterDependency,
      ]);

      const linterService = new LinterService([
        firstLinterAdapterWithoutDependencies,
        secondLinterAdapterWithoutDependencies,
        linterAdapterWithDependency,
      ]);

      const meetupIssue = getMeetupIssueFixture();
      const shouldFix = false;

      // Act & Assert
      const expectedError = new LintError(["First Lint error", "Second Lint error"]);
      await expect(linterService.lint(meetupIssue, shouldFix)).rejects.toStrictEqual(expectedError);

      expect(firstLinterAdapterWithoutDependencies.lint).toHaveBeenCalled();
      expect(secondLinterAdapterWithoutDependencies.lint).toHaveBeenCalled();

      expect(linterAdapterWithDependency.lint).not.toHaveBeenCalled();
    });
  });
});
