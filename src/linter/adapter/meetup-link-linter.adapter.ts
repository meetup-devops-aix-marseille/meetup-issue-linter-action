import { injectable } from "inversify";
import { string } from "zod";
import { AbstractZodLinterAdapter } from "./abtract-zod-linter.adapter";

@injectable()
export class MeetupLinkLinterAdapter extends AbstractZodLinterAdapter {
  private static readonly MEETUP_LINK_REGEX =
    /^https:\/\/www\.meetup\.com\/cloud-native-aix-marseille\/events\/[0-9]+$/;

  protected getValidator() {
    return string().url().regex(MeetupLinkLinterAdapter.MEETUP_LINK_REGEX, {
      message:
        "Must be a valid Meetup link, e.g. https://www.meetup.com/cloud-native-aix-marseille/events/123456789",
    });
  }

  protected getFieldName() {
    return "meetup_link" as const;
  }
}
