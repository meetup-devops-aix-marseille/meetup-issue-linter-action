import { injectable } from "inversify";
import { enum as zodEnum } from "zod";
import { AbstractZodLinterAdapter } from "./abtract-zod-linter.adapter";
import { InputService } from "../../services/input.service";

@injectable()
export class HosterLinterAdapter extends AbstractZodLinterAdapter {
  private readonly hosters: [string, ...string[]];

  constructor(private readonly inputService: InputService) {
    super();

    this.hosters = this.inputService.getHosters();
  }

  protected getValidator() {
    return zodEnum(this.hosters, {
      message: "Must be an existing hoster",
    })
      .array()
      .min(1, {
        message: "Must not be empty",
      })
      .max(1, {
        message: "Must have exactly one entry",
      });
  }

  protected getFieldName() {
    return "hoster" as const;
  }
}
