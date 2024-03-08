import { Education } from "./Education";
import { PersonalInformation } from "./PersonalInformation";
import { Position } from "./Position";

export class ProfessionalExperience {
    
    public company: string;
    public positions: Position[];
  
    public constructor(
      fields?: {        
        company?: string,
        positions: Position[]
      }
    ) {
      if (fields) {
        this.company = fields.company;
        this.positions = fields.positions;
      }
  
    }
  }
  