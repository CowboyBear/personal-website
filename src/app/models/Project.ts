export class Project {

  public title: string;
  public description: string;

  public constructor(
    fields?: {
      title?: string,
      description: string
    }
  ) {
    this.title = fields.title || this.title;
    this.description = fields.description || this.description;
  }

}