import { jsPDF } from "jspdf";
import { Resume } from "./Resume";
import { ProfileImageRenderer } from "./component-renderers/side-bar/ProfileImageRenderer";
import { PDFDocument } from "../utils/PDFDocument";
import { AchievementRenderer } from "./component-renderers/side-bar/AchievementRenderer";
import { PDFUtils } from "../utils/PDFUtils";
import { SkillRenderer } from "./component-renderers/side-bar/SkillRenderer";
import { LanguageRenderer } from "./component-renderers/side-bar/LanguageRenderer";
import { HeaderRenderer } from "./component-renderers/main-content/HeaderRenderer";
import { SummaryRenderer } from "./component-renderers/main-content/SummaryRenderer";
import { ProfessionalExperienceRenderer } from "./component-renderers/main-content/ProfessionalExperienceRenderer";
import { EducationRenderer } from "./component-renderers/main-content/EducationRenderer";

export class PDFResumeBuilder {
    private resume: Resume;
    private doc: jsPDF;
    private cursorXCoordinate: number;
    private cursorYCoordinate: number;

    private pdf: PDFDocument;
    private utils: PDFUtils;

    constructor(resume: Resume) {
        this.resume = resume;
        this.doc = new jsPDF({ unit: 'px' });
        this.cursorXCoordinate = 0;
        this.cursorYCoordinate = 0;

        this.pdf = new PDFDocument(this.doc, this.cursorXCoordinate, this.cursorYCoordinate);
        this.utils = new PDFUtils(this.pdf);
    };

    // TODO: Projects (?)
    public withSideBar(): PDFResumeBuilder {
        this.utils.renderSideBarBackground();
        this.utils.renderSidebarFirstPageShadow();

        this.utils.renderSimpleComponent(
            new ProfileImageRenderer(this.pdf, this.utils),
            `../../${this.resume.personalInformation.profilePictureSrc}`            
        );

        this.utils.sideBar.renderSection(
            'ACHIEVEMENTS',
            new AchievementRenderer(this.utils),
            this.resume.achievements            
        );

        this.utils.sideBar.renderSection(
            'PROFESSIONAL EXPERTISE',
            new SkillRenderer(this.pdf, this.utils),
            this.resume.skills            
        );

        this.utils.sideBar.renderSection(
            'LANGUAGES',
            new LanguageRenderer(this.utils),
            this.resume.languages            
        );

        return this;
    }

    public withHeader(): PDFResumeBuilder {
        this.utils.renderSimpleComponent(
            new HeaderRenderer(this.pdf, this.utils),
            this.resume.personalInformation
        )

        return this;
    }

    public withSummary(): PDFResumeBuilder {
        this.utils.renderSimpleComponent(
            new SummaryRenderer(this.pdf, this.utils),
            this.resume.summary
        );

        return this;
    }

    public withProfessionalExperience(): PDFResumeBuilder {
        this.utils.renderSection(
            'PROFESSIONAL EXPERIENCE',
            new ProfessionalExperienceRenderer(this.pdf, this.utils),
            this.resume.professionalExperiences
        );

        return this;
    }

    public withEducation(): PDFResumeBuilder {
        this.utils.renderSection(
            'EDUCATION',
            new EducationRenderer(this.pdf, this.utils),
            this.resume.education
        );

        return this;
    }

    public build(): Blob {
        return this.pdf.doc.output('blob');
    }    
}
