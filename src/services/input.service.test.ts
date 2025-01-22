import { mock, MockProxy } from "jest-mock-extended";
import { InputService, InputNames } from "./input.service";
import { CoreService } from "./core.service";

describe("InputService", () => {
  let coreServiceMock: MockProxy<CoreService>;

  let service: InputService;

  beforeEach(() => {
    coreServiceMock = mock<CoreService>();

    service = new InputService(coreServiceMock);
  });

  describe("getIssueNumber", () => {
    it("should return the issue number", () => {
      coreServiceMock.getInput.mockImplementation((name: string) => {
        if (name === InputNames.IssueNumber) {
          return "1";
        }

        return "";
      });

      const result = service.getIssueNumber();

      expect(result).toBe(1);
      expect(coreServiceMock.getInput).toHaveBeenCalledWith(InputNames.IssueNumber, {
        required: true,
      });
    });
  });

  describe("getIssueParsedBody", () => {
    it("should return the parsed issue body", () => {
      coreServiceMock.getInput.mockImplementation((name: string) => {
        if (name === InputNames.IssueParsedBody) {
          return JSON.stringify({ key: "value" });
        }

        return "";
      });

      const result = service.getIssueParsedBody();

      expect(result).toEqual({ key: "value" });
      expect(coreServiceMock.getInput).toHaveBeenCalledWith(InputNames.IssueParsedBody, {
        required: true,
      });
    });
  });

  describe("getHosters", () => {
    it("should return the hosters", () => {
      coreServiceMock.getInput.mockImplementation((name: string) => {
        if (name === InputNames.Hosters) {
          return JSON.stringify(["hoster1", "hoster2"]);
        }

        return "";
      });

      const result = service.getHosters();

      expect(result).toEqual(["hoster1", "hoster2"]);
      expect(coreServiceMock.getInput).toHaveBeenCalledWith(InputNames.Hosters, {
        required: true,
      });
    });

    it("should throw an error if the hosters input is not an array", () => {
      coreServiceMock.getInput.mockImplementation((name: string) => {
        if (name === InputNames.Hosters) {
          return JSON.stringify("hoster1");
        }

        return "";
      });

      expect(() => service.getHosters()).toThrow("Hosters input must be an array");
    });

    it("should throw an error if the hosters input is empty", () => {
      coreServiceMock.getInput.mockImplementation((name: string) => {
        if (name === InputNames.Hosters) {
          return JSON.stringify([]);
        }

        return "";
      });

      expect(() => service.getHosters()).toThrow("Hosters input must not be empty");
    });

    it("should throw an error if the hosters input is not an array of strings", () => {
      coreServiceMock.getInput.mockImplementation((name: string) => {
        if (name === InputNames.Hosters) {
          return JSON.stringify([1]);
        }

        return "";
      });

      expect(() => service.getHosters()).toThrow("Hosters input must be an array of strings");
    });
  });

  describe("getShouldFix", () => {
    it("should return the shouldFix value", () => {
      coreServiceMock.getBooleanInput.mockImplementation((name: string) => {
        if (name === InputNames.ShouldFix) {
          return true;
        }

        return false;
      });

      const result = service.getShouldFix();

      expect(result).toBe(true);
      expect(coreServiceMock.getBooleanInput).toHaveBeenCalledWith(InputNames.ShouldFix);
    });
  });

  describe("getFailOnError", () => {
    it("should return the failOnError value", () => {
      coreServiceMock.getBooleanInput.mockImplementation((name: string) => {
        if (name === InputNames.FailOnError) {
          return true;
        }

        return false;
      });

      const result = service.getFailOnError();

      expect(result).toBe(true);
      expect(coreServiceMock.getBooleanInput).toHaveBeenCalledWith(InputNames.FailOnError);
    });
  });

  describe("getGithubToken", () => {
    it("should return the github token", () => {
      coreServiceMock.getInput.mockImplementation((name: string) => {
        if (name === InputNames.GithubToken) {
          return "token";
        }

        return "";
      });

      const result = service.getGithubToken();

      expect(result).toBe("token");
      expect(coreServiceMock.getInput).toHaveBeenCalledWith(InputNames.GithubToken, {
        required: true,
      });
    });
  });
});
