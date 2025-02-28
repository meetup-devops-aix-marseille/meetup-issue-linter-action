import * as core from "@actions/core";
import { mock, MockProxy } from "jest-mock-extended";
import { container } from "./container";
import { InputService } from "./services/input.service";
import { LinterService } from "./linter/linter.service";
import { LoggerService } from "./services/logger.service";
import { MeetupIssueService } from "./services/meetup-issue.service";

describe("index", () => {
  let setFailedMock: jest.SpiedFunction<typeof core.setFailed>;
  let inputServiceMock: MockProxy<InputService>;
  let loggerServiceMock: MockProxy<LoggerService>;
  let meetupIssueServiceMock: MockProxy<MeetupIssueService>;
  let linterServiceMock: MockProxy<LinterService>;

  beforeEach(async () => {
    jest.clearAllMocks();

    setFailedMock = jest.spyOn(core, "setFailed").mockImplementation();
    inputServiceMock = mock<InputService>();
    loggerServiceMock = mock<LoggerService>();
    meetupIssueServiceMock = mock<MeetupIssueService>();
    linterServiceMock = mock<LinterService>();

    container.snapshot();

    await container.unbind(InputService);
    container.bind(InputService).toConstantValue(inputServiceMock);
    await container.unbind(LoggerService);
    container.bind(LoggerService).toConstantValue(loggerServiceMock);
    await container.unbind(MeetupIssueService);
    container.bind(MeetupIssueService).toConstantValue(meetupIssueServiceMock);
    await container.unbind(LinterService);
    container.bind(LinterService).toConstantValue(linterServiceMock);
  });

  afterEach(() => {
    container.restore();
  });

  it("calls run when imported without failure", async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    await require("../src/index");
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(setFailedMock).not.toHaveBeenCalled();
  });
});
