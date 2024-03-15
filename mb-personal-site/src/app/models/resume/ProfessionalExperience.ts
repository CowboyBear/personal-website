import { Education } from "../site-content/Education";
import { PersonalInformation } from "../site-content/PersonalInformation";
import { Position } from "../site-content/Position";

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
  