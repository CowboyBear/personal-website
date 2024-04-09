export class Skill {
  public name: string;
  public level: number;
 
  public constructor(
    fields?: {
      name?: string,
      level?: number,
    }
  ) {
    if (fields) {
      this.name = fields.name || this.name;
      this.level = fields.level || this.level;
    }
  }
}