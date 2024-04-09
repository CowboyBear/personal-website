import { TitleAndDescriptionPair } from "../utils/TitleAndDescriptionPair";
import { Education } from "../site-content/Education";
import { PersonalInformation } from "../site-content/PersonalInformation";
import { Skill } from "./Skill";
import { Career } from "../site-content/Career";

export class Resume {

    public personalInformation: PersonalInformation;
    public education: Education[];
    public career?: Career[];
    public summary: string;
    public achievements: TitleAndDescriptionPair[];
    public skills: Skill[];
    public languages: TitleAndDescriptionPair[];
    public position: string;
  
    public constructor(
      fields?: {
        personalInformation?: PersonalInformation,
        education?: Education[],
        career?: Career[],
        resumeData?: any        
      }
    ) {
      if (fields) {
        this.personalInformation = fields.personalInformation || this.personalInformation;
        this.education = fields.education || this.education;
        this.summary = fields.resumeData.summary;
        this.achievements = fields.resumeData.achievements;
        this.skills = fields.resumeData.skills;
        this.languages = fields.resumeData.languages;
        this.position = fields.resumeData.position;
        this.career = fields.career;
      }  
    }
  }
  