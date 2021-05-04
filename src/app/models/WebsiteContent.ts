import { PersonalInformation } from "./PersonalInformation";
import { TechnicalKnowledge } from "./TechnicalKnowledge";

export class WebsiteContent {

  public personalInformation: PersonalInformation;
  public personalInterests: string[];
  public technicalKnowledge: TechnicalKnowledge[];

  public constructor(
    fields?: {
      personalInformation?: PersonalInformation,
      personalInterests?: string[],
      technicalKnowledge?: TechnicalKnowledge[]
    }
  ) {
    if (fields) {
      this.personalInformation = fields.personalInformation || this.personalInformation;
      this.personalInterests = fields.personalInterests || this.personalInterests;
      this.technicalKnowledge = fields.technicalKnowledge || this.technicalKnowledge;
    }

  }
}
