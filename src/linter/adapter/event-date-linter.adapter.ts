import { injectable } from "inversify";
import { string } from "zod";
import { AbstractZodLinterAdapter } from "./abtract-zod-linter.adapter";

@injectable()
export class EventDateLinterAdapter extends AbstractZodLinterAdapter {
  protected getValidator() {
    return string().date();
  }

  protected getFieldName() {
    return "event_date" as const;
  }
}
