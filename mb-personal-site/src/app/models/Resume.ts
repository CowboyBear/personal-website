import { Education } from "./Education";
import { PersonalInformation } from "./PersonalInformation";
import { ProfessionalExperience } from "./ProfessionalExperience";

export class Resume {

    public personalInformation: PersonalInformation;
    public education: Education[];
    public summary: string;    
    public professionalExperiences: ProfessionalExperience[];
  
    public constructor(
      fields?: {
        personalInformation?: PersonalInformation,
        education?: Education[],
        resumeData?: any        
      }
    ) {
      if (fields) {
        this.personalInformation = fields.personalInformation || this.personalInformation;
        this.education = fields.education || this.education;
        this.summary = fields.resumeData.summary;
        this.professionalExperiences = fields.resumeData.professionalExperiences;
      }
  
    }
  }
  