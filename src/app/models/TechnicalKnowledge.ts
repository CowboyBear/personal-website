export class TechnicalKnowledge {

  public title: string;
  public description: string[];
  public emblemSrc: string;

  public constructor(
    fields?: {
      title?: string,
      description?: string[],
      emblemSrc?: string
    }
  ) {
    if (fields) {
      this.title = fields.title || this.title;
      this.description = fields.description || this.description;
      this.emblemSrc = fields.emblemSrc || this.emblemSrc;
    }

  }
}