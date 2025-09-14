export class SessionStorage {
  static #instance: SessionStorage | null;

  private constructor() {}

  public static get instance() {
    if (!this.#instance) {
      this.#instance = new SessionStorage();
    }
    return this.#instance;
  }

  public addItem(name: string, value: string): void {
    sessionStorage.setItem(name, value);
  }
  public getItem(name: string): string | null {
    return sessionStorage.getItem(name);
  }
  public rmItem(name: string): void {
    sessionStorage.removeItem(name);
  }
}
