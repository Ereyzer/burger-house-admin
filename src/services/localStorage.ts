export class LocalStorage {
  static #instance: LocalStorage | null;

  private constructor() {}

  public static get instance() {
    if (!this.#instance) {
      this.#instance = new LocalStorage();
    }
    return this.#instance;
  }

  public addItem(name: string, value: string): void {
    localStorage.setItem(name, value);
  }
  public getItem(name: string): string | null {
    return localStorage.getItem(name);
  }
  public rmItem(name: string): void {
    localStorage.removeItem(name);
  }
}
