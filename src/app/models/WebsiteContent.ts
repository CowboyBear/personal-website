import { Career } from "./Career";
import { Education } from "./Education";
import { PersonalInformation } from "./PersonalInformation";
import { TechnicalKnowledge } from "./TechnicalKnowledge";

export class WebsiteContent {

  public personalInformation: PersonalInformation;
  public education: Education[];
  public personalInterests: string[];
  public technicalKnowledge: TechnicalKnowledge[];
  public careerInformation: Career[];

  public constructor(
    fields?: {
      personalInformation?: PersonalInformation,
      education?: Education[],
      personalInterests?: string[],
      technicalKnowledge?: TechnicalKnowledge[],
      careerInformation?: Career[]
    }
  ) {
    if (fields) {
      this.personalInformation = fields.personalInformation || this.personalInformation;
      this.education = fields.education || this.education;
      this.personalInterests = fields.personalInterests || this.personalInterests;
      this.technicalKnowledge = fields.technicalKnowledge || this.technicalKnowledge;
      this.careerInformation = fields.careerInformation || this.careerInformation;
    }

  }
}
