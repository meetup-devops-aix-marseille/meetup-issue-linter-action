export class LintError extends Error {
  constructor(private readonly messages: string[]) {
    super(messages.join("; "));
  }

  getMessages(): string[] {
    return this.messages;
  }
}
