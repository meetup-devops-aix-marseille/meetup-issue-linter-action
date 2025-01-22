import { mock, MockProxy } from "jest-mock-extended";
import { InputService } from "../input.service";
import { HosterLinterAdapter } from "./hoster-linter.adapter";
import { getMeetupIssueFixture } from "../../__fixtures__/meetup-issue.fixture";
import { getHostersFixture } from "../../__fixtures__/hosters.fixture";
import { LintError } from "./lint.error";

describe("HosterLinterAdapter", () => {
  let inputServiceMock: MockProxy<InputService>;
  let hosterLinterAdapter: HosterLinterAdapter;

  beforeEach(() => {
    inputServiceMock = mock<InputService>();
    inputServiceMock.getHosters.mockReturnValue(getHostersFixture());

    hosterLinterAdapter = new HosterLinterAdapter(inputServiceMock);
  });

  describe("lint", () => {
    it("should validate a single hoster entry successfully", async () => {
      // Arrange
      const meetupIssue = getMeetupIssueFixture();

      // Act
      const result = await hosterLinterAdapter.lint(meetupIssue, false);

      // Assert
      expect(result).toEqual(meetupIssue);
    });

    it("should fail validation if the array is empty", async () => {
      // Arrange
      const invalidMeetupIssue = getMeetupIssueFixture({
        body: {
          hoster: [],
        },
      });

      // Act & Assert
      const expectedError = new LintError(["Hoster: Must not be empty"]);
      await expect(() => hosterLinterAdapter.lint(invalidMeetupIssue, false)).rejects.toStrictEqual(
        expectedError
      );
    });

    it("should fail validation if the array has more than one item", async () => {
      // Arrange
      const invalidMeetupIssue = getMeetupIssueFixture({
        body: {
          hoster: getHostersFixture(),
        },
      });

      // Act & Assert
      const expectedError = new LintError(["Hoster: Must have exactly one entry"]);
      await expect(() => hosterLinterAdapter.lint(invalidMeetupIssue, false)).rejects.toStrictEqual(
        expectedError
      );
    });

    it("should fail validation if the hoster is not in the list", async () => {
      // Arrange
      const invalidMeetupIssue = getMeetupIssueFixture({
        body: {
          hoster: ["invalidHoster"],
        },
      });

      // Act & Assert
      const expectedError = new LintError(["Hoster: Must be an existing hoster at index 0"]);
      await expect(() => hosterLinterAdapter.lint(invalidMeetupIssue, false)).rejects.toStrictEqual(
        expectedError
      );
    });
  });

  describe("getPriority", () => {
    it("should return 0 from getPriority", () => {
      expect(hosterLinterAdapter.getPriority()).toBe(0);
    });
  });
});
