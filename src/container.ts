import { Container } from "inversify";
import { LoggerService } from "./services/logger.service";
import { CORE_SERVICE_IDENTIFIER, coreService, CoreService } from "./services/core.service";
import { InputService } from "./services/input.service";
import { LinterService } from "./services/linter.service";
import { GithubService } from "./services/github.service";
import { EventDateLinterAdapter } from "./services/linter/event-date-linter.adapter";
import { LINTER_ADAPTER_IDENTIFIER, LinterAdapter } from "./services/linter/linter.adapter";
import { MeetupIssueService } from "./services/meetup-issue.service";
import { EventTitleLinterAdapter } from "./services/linter/event-title-linter.adapter";
import { TitleLinterAdapter } from "./services/linter/title-linter.adapter";
import { EventDescriptionLinterAdapter } from "./services/linter/event-description-linter.adapter";
import { HosterLinterAdapter } from "./services/linter/hoster-linter.adapter";

const container = new Container();

container.bind<CoreService>(CORE_SERVICE_IDENTIFIER).toConstantValue(coreService);

container.bind(GithubService).toSelf();
container.bind(InputService).toSelf();
container.bind(LinterService).toSelf();
container.bind(LoggerService).toSelf();
container.bind(MeetupIssueService).toSelf();

// Linters
container.bind<LinterAdapter>(LINTER_ADAPTER_IDENTIFIER).to(EventDateLinterAdapter);
container.bind<LinterAdapter>(LINTER_ADAPTER_IDENTIFIER).to(EventTitleLinterAdapter);
container.bind<LinterAdapter>(LINTER_ADAPTER_IDENTIFIER).to(TitleLinterAdapter);
container.bind<LinterAdapter>(LINTER_ADAPTER_IDENTIFIER).to(HosterLinterAdapter);
container.bind<LinterAdapter>(LINTER_ADAPTER_IDENTIFIER).to(EventDescriptionLinterAdapter);

export { container };
