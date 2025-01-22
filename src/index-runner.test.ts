import * as core from "@actions/core";
import { mock, MockProxy } from "jest-mock-extended";
import { InputService } from "./services/input.service";
import { LoggerService } from "./services/logger.service";
import * as indexRunner from "./index-runner";
import { container } from "./container";
import { LinterService } from "./services/linter.service";
import { MeetupIssueService } from "./services/meetup-issue.service";
import { getMeetupIssueFixture } from "./__fixtures__/meetup-issue.fixture";

describe("run", () => {
  let setFailedMock: jest.SpiedFunction<typeof core.setFailed>;
  let inputServiceMock: MockProxy<InputService>;
  let loggerServiceMock: MockProxy<LoggerService>;
  let meetupIssueServiceMock: MockProxy<MeetupIssueService>;
  let linterServiceMock: MockProxy<LinterService>;

  beforeEach(() => {
    jest.clearAllMocks();

    setFailedMock = jest.spyOn(core, "setFailed").mockImplementation();
    inputServiceMock = mock<InputService>();
    loggerServiceMock = mock<LoggerService>();
    meetupIssueServiceMock = mock<MeetupIssueService>();
    linterServiceMock = mock<LinterService>();

    container.rebind(InputService).toConstantValue(inputServiceMock);
    container.rebind(LoggerService).toConstantValue(loggerServiceMock);
    container.rebind(MeetupIssueService).toConstantValue(meetupIssueServiceMock);
    container.rebind(LinterService).toConstantValue(linterServiceMock);
  });

  it("should install docker compose with specified version", async () => {
    // Arrange
    inputServiceMock.getIssueNumber.mockReturnValue(1);
    inputServiceMock.getShouldFix.mockReturnValue(true);

    const meetupIssue = getMeetupIssueFixture();
    meetupIssueServiceMock.getMeetupIssue.mockResolvedValue(meetupIssue);

    // Act
    await indexRunner.run();

    // Assert
    expect(loggerServiceMock.debug).toHaveBeenCalledWith("Issue number: 1");
    expect(loggerServiceMock.info).toHaveBeenCalledWith("Start linting issue 1...");

    expect(linterServiceMock.lint).toHaveBeenCalledWith(meetupIssue, true);

    expect(loggerServiceMock.info).toHaveBeenCalledWith("Issue linted successfully.");

    expect(setFailedMock).not.toHaveBeenCalled();
  });

  it("should handle errors and call setFailed", async () => {
    // Arrange
    inputServiceMock.getIssueNumber.mockReturnValue(1);

    const error = new Error("Test error");
    linterServiceMock.lint.mockRejectedValue(error);

    // Act
    await indexRunner.run();

    // Assert
    expect(setFailedMock).toHaveBeenCalledWith("Error: Test error");
  });

  it("should handle unknown errors and call setFailed", async () => {
    // Arrange
    inputServiceMock.getIssueNumber.mockReturnValue(1);

    const error = "Test error";
    linterServiceMock.lint.mockRejectedValue(error);

    // Act
    await indexRunner.run();

    // Assert
    expect(setFailedMock).toHaveBeenCalledWith('"Test error"');
  });
});
