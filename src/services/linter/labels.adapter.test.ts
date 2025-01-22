import { mock, MockProxy } from "jest-mock-extended";
import { getMeetupIssueFixture } from "../../__fixtures__/meetup-issue.fixture";
import { MeetupIssueService } from "../meetup-issue.service";
import { LabelsLinterAdapter } from "./labels-linter.adapter";
import { LintError } from "./lint.error";

describe("LabelsLinterAdapter - lint", () => {
  let meetupIssueServiceMock: MockProxy<MeetupIssueService>;
  let labelsLinterAdapter: LabelsLinterAdapter;

  beforeEach(() => {
    meetupIssueServiceMock = mock<MeetupIssueService>();
    labelsLinterAdapter = new LabelsLinterAdapter(meetupIssueServiceMock);
  });

  describe("lint", () => {
    it("should return the meetupIssue as is if the labels matches the expected labels", async () => {
      const meetupIssue = getMeetupIssueFixture();

      const result = await labelsLinterAdapter.lint(meetupIssue, false);
      expect(result).toBe(meetupIssue);
      expect(meetupIssueServiceMock.updateMeetupIssueTitle).not.toHaveBeenCalled();
    });

    it("should throw LintError if some label is missing and shouldFix is false", async () => {
      const invalidMeetupIssue = getMeetupIssueFixture({
        labels: ["Wrong Label"],
      });

      const expectedError = new LintError([
        'Labels: Missing label(s) "meetup"',
        'Labels: Extra label(s) "Wrong Label"',
      ]);

      await expect(labelsLinterAdapter.lint(invalidMeetupIssue, false)).rejects.toStrictEqual(
        expectedError
      );
      expect(meetupIssueServiceMock.updateMeetupIssueTitle).not.toHaveBeenCalled();
    });

    it("should throw LintError if some label is extra and shouldFix is false", async () => {
      const invalidMeetupIssue = getMeetupIssueFixture({
        labels: ["meetup", "Extra Label"],
      });

      const expectedError = new LintError(['Labels: Extra label(s) "Extra Label"']);

      await expect(labelsLinterAdapter.lint(invalidMeetupIssue, false)).rejects.toStrictEqual(
        expectedError
      );
      expect(meetupIssueServiceMock.updateMeetupIssueTitle).not.toHaveBeenCalled();
    });

    it("should fix the labels if it is invalid and shouldFix is true", async () => {
      const invalidMeetupIssue = getMeetupIssueFixture({
        labels: ["Wrong Label"],
      });

      const result = await labelsLinterAdapter.lint(invalidMeetupIssue, true);
      expect(result.labels).toStrictEqual(["meetup"]);
      expect(meetupIssueServiceMock.updateMeetupIssueLabels).toHaveBeenCalledWith(result);
    });
  });

  describe("getPriority", () => {
    it("should return 0", () => {
      expect(labelsLinterAdapter.getPriority()).toBe(0);
    });
  });
});
