import { Education } from "./Education";
import { PersonalInformation } from "./PersonalInformation";

export class Resume {

    public personalInformation: PersonalInformation;
    public education: Education[];
  
    public constructor(
      fields?: {
        personalInformation?: PersonalInformation,
        education?: Education[],
      }
    ) {
      if (fields) {
        this.personalInformation = fields.personalInformation || this.personalInformation;
        this.education = fields.education || this.education;
      }
  
    }
  }
  