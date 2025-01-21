import { injectable } from "inversify";
import { string } from "zod";
import { AbstractZodLinterAdapter } from "./abtract-zod-linter.adapter";

@injectable()
export class EventTitleLinterAdapter extends AbstractZodLinterAdapter {
  protected getValidator() {
    return string().nonempty({
      message: "Must not be empty",
    });
  }

  protected getFieldName() {
    return "event_title" as const;
  }

  getPriority() {
    return 0;
  }
}
