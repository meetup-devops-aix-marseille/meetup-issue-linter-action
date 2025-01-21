import { inject, injectable } from "inversify";
import { CoreService, CORE_SERVICE_IDENTIFIER } from "./core.service";

export type Inputs = {
  issueNumber: number;
  shouldFix: boolean;
  githubToken: string;
};

export enum InputNames {
  IssueNumber = "issue-number",
  IssueParsedBody = "issue-parsed-body",
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

  getShouldFix(): boolean {
    return this.coreService.getBooleanInput(InputNames.ShouldFix);
  }

  getGithubToken(): string {
    return this.coreService.getInput(InputNames.GithubToken, {
      required: true,
    });
  }
}
