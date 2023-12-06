export default class Widget {
  private static _is: boolean = false;

  public static get is(): boolean {
    return this._is;
  }

  public static set is(value: boolean) {
    this._is = value;
  }
}
