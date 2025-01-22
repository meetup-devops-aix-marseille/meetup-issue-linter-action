import { inject, injectable } from "inversify";
import { CoreService, CORE_SERVICE_IDENTIFIER } from "./core.service";

export enum InputNames {
  IssueNumber = "issue-number",
  IssueParsedBody = "issue-parsed-body",
  Hosters = "hosters",
  FailOnError = "fail-on-error",
  ShouldFix = "should-fix",
  GithubToken = "github-token",
}

@injectable()
export class InputService {
  constructor(@inject(CORE_SERVICE_IDENTIFIER) private readonly coreService: CoreService) {}

  getIssueNumber(): number {
    return parseInt(
      this.coreService.getInput(InputNames.IssueNumber, {
        required: true,
      })
    );
  }

  getIssueParsedBody(): Record<string, unknown> {
    const issueParsedBody = this.coreService.getInput(InputNames.IssueParsedBody, {
      required: true,
    });

    return JSON.parse(issueParsedBody);
  }

  getHosters(): [string, ...string[]] {
    const hostersInput = this.coreService.getInput(InputNames.Hosters, {
      required: true,
    });

    const hosters = JSON.parse(hostersInput);

    if (!Array.isArray(hosters)) {
      throw new Error("Hosters input must be an array");
    }

    if (hosters.length === 0) {
      throw new Error("Hosters input must not be empty");
    }

    for (const hoster of hosters) {
      if (typeof hoster !== "string") {
        throw new Error("Hosters input must be an array of strings");
      }
    }

    return hosters as [string, ...string[]];
  }

  getShouldFix(): boolean {
    return this.coreService.getBooleanInput(InputNames.ShouldFix);
  }

  getFailOnError() {
    return this.coreService.getBooleanInput(InputNames.FailOnError);
  }

  getGithubToken(): string {
    return this.coreService.getInput(InputNames.GithubToken, {
      required: true,
    });
  }
}
