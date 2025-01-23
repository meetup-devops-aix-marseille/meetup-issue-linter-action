import { injectable } from "inversify";
import { string } from "zod";
import { AbstractZodLinterAdapter } from "./abtract-zod-linter.adapter";

@injectable()
export class DriveLinkLinterAdapter extends AbstractZodLinterAdapter {
  private static readonly DRIVE_LINK_REGEX =
    /^https:\/\/drive\.google\.com\/drive\/folders\/[a-zA-Z0-9-_]+$/;

  protected getValidator() {
    return string().url().regex(DriveLinkLinterAdapter.DRIVE_LINK_REGEX, {
      message:
        "Must be a valid Drive Link, e.g. https://drive.google.com/drive/folders/1a2b3c4d5e6f7g8h9i0j",
    });
  }

  protected getFieldName() {
    return "drive_link" as const;
  }
}
