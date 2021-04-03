export class ValidationException extends Error {
  public data: any;
  public constructor(message: string, data?: any) {
    super(message);
    this.name = 'ValidationException';
    if (data) {
      this.data = data;
    }
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
