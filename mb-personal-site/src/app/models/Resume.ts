import { TitleAndDescriptionPair } from "./TitleAndDescriptionPair";
import { Education } from "./Education";
import { PersonalInformation } from "./PersonalInformation";
import { ProfessionalExperience } from "./ProfessionalExperience";
import { Skill } from "./Skill";

export class Resume {

    public personalInformation: PersonalInformation;
    public education: Education[];
    public summary: string;    
    public achievements: TitleAndDescriptionPair[];
    public professionalExperiences: ProfessionalExperience[];
    public skills: Skill[];
    public languages: TitleAndDescriptionPair[];
  
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
        this.achievements = fields.resumeData.achievements;
        this.professionalExperiences = fields.resumeData.professionalExperiences;
        this.skills = fields.resumeData.skills;
        this.languages = fields.resumeData.languages;
      }  
    }
  }
  