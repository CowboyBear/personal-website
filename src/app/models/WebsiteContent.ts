import { Career } from "./Career";
import { PersonalInformation } from "./PersonalInformation";
import { TechnicalKnowledge } from "./TechnicalKnowledge";

export class WebsiteContent {

  public personalInformation: PersonalInformation;
  public personalInterests: string[];
  public technicalKnowledge: TechnicalKnowledge[];
  public careerInformation: Career[];

  public constructor(
    fields?: {
      personalInformation?: PersonalInformation,
      personalInterests?: string[],
      technicalKnowledge?: TechnicalKnowledge[],
      careerInformation?: Career[]
    }
  ) {
    if (fields) {
      this.personalInformation = fields.personalInformation || this.personalInformation;
      this.personalInterests = fields.personalInterests || this.personalInterests;
      this.technicalKnowledge = fields.technicalKnowledge || this.technicalKnowledge;
      this.careerInformation = fields.careerInformation || this.careerInformation;
    }

  }
}
