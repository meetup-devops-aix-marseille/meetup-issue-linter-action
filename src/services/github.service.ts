import { context, getOctokit } from "@actions/github";
import { GitHub } from "@actions/github/lib/utils";
import { injectable } from "inversify";

import { InputService } from "./input.service";

type Octokit = InstanceType<typeof GitHub>;

export type GithubIssue = {
  number: number;
  title: string;
  labels: string[];
};

@injectable()
export class GithubService {
  private octokit: Octokit | undefined;

  constructor(private readonly inputService: InputService) {}

  async getIssue(issueNumber: number): Promise<GithubIssue> {
    const { data: issue } = await this.getOctokit().rest.issues.get({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: issueNumber,
    });

    const labels: string[] = issue.labels
      .map((label) => ("string" === typeof label ? label : label.name))
      .filter(Boolean) as string[];

    return {
      number: issue.number,
      title: issue.title,
      labels,
    };
  }

  async updateIssueTitle(issueNumber: number, title: string): Promise<void> {
    await this.getOctokit().rest.issues.update({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: issueNumber,
      title: title,
    });
  }

  async updateIssueLabels(issueNumber: number, labels: string[]) {
    await this.getOctokit().rest.issues.update({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: issueNumber,
      labels: labels,
    });
  }

  private getOctokit(): Octokit {
    if (this.octokit) {
      return this.octokit;
    }
    return (this.octokit = getOctokit(this.inputService.getGithubToken()));
  }
}
