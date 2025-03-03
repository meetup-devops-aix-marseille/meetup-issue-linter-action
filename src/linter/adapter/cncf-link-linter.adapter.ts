import { injectable } from "inversify";
import { string } from "zod";
import { AbstractZodLinterAdapter } from "./abtract-zod-linter.adapter";

@injectable()
export class CNCFLinkLinterAdapter extends AbstractZodLinterAdapter {
  private static readonly CNCF_LINK_REGEX =
    /^https:\/\/community\.cncf\.io\/events\/details\/cncf-cloud-native-aix-marseille-presents-[0-9a-z-]+$/;

  protected getValidator() {
    return string().url().regex(CNCFLinkLinterAdapter.CNCF_LINK_REGEX, {
      message:
        "Must be a valid CNCF link, e.g. https://community.cncf.io/events/details/cncf-cloud-native-aix-marseille-presents-test-meetup-event",
    });
  }

  protected getFieldName() {
    return "cncf_link" as const;
  }
}
