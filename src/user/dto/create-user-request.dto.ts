export default class CreateUserDTO {
  public readonly id: number;
  public readonly name: string;
  constructor(id: number, nickname: string) {
    this.id = id;
    this.name = nickname;
  }
}
