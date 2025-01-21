import { mock, MockProxy } from "jest-mock-extended";
import { GithubService } from "./github.service";
import { MeetupIssueService } from "./meetup-issue.service";

describe("MeetupIssueService", () => {
  let githubServiceMock: MockProxy<GithubService>;

  let meetupIssueService: MeetupIssueService;

  beforeEach(() => {
    githubServiceMock = mock<GithubService>();

    meetupIssueService = new MeetupIssueService(githubServiceMock);
  });

  describe("getMeetupIssue", () => {
    it("should returns mapped meetup issue", async () => {
      githubServiceMock.getIssue.mockResolvedValue({
        number: 123,
        title: "Test Issue",
        labels: ["label1", "label2"],
      });

      const parsedBody = { event_date: "2023-10-10", hoster: ["test-host"] };
      const result = await meetupIssueService.getMeetupIssue(123, parsedBody);

      expect(result).toEqual({
        number: 123,
        title: "Test Issue",
        labels: ["label1", "label2"],
        body: parsedBody,
      });
    });
  });

  describe("updateMeetupIssueTitle", () => {
    it("should update the issue title", async () => {
      await meetupIssueService.updateMeetupIssueTitle({
        number: 456,
        title: "Updated Title",
        body: {},
        labels: [],
      });

      expect(githubServiceMock.updateIssueTitle).toHaveBeenCalledWith(456, "Updated Title");
    });
  });
});
