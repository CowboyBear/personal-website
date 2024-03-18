import { PersonalInformation } from "src/app/models/site-content/PersonalInformation";
import { SubHeaderTag } from "./SubHeaderTag";

export class ResumeHeader {
    public personalInformation: PersonalInformation;
    public position: string;

    constructor(personalInformation: PersonalInformation, position: string) {
        this.personalInformation = personalInformation;
        this.position = position;
    }

    public getSubHeaderTags(): SubHeaderTag [] {        
        return [            
            new SubHeaderTag('mail', this.personalInformation.email),
            new SubHeaderTag('github', this.personalInformation.github),
            new SubHeaderTag('location', this.personalInformation.location),
            new SubHeaderTag('link', window.location.origin)
        ];
    }
}