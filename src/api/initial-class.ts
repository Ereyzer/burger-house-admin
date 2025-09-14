import axios from 'axios';

export class BaseApi {
  readonly #BASE_URL = 'http://localhost:3000';
  #token: string | null;
  #rememberMe = true;
  static #instance: BaseApi | null;
  #refreshFunc: (() => Promise<{ at: string }>) | null = null;

  private constructor() {
    axios.defaults.baseURL = this.#BASE_URL;
    this.#token = sessionStorage.getItem('at');

    if (!this.#token) {
      this.#token = localStorage.getItem('at');
    } else {
      this.#rememberMe = false;
    }
  }

  public static get instance() {
    if (!this.#instance) {
      this.#instance = new BaseApi();
    }
    return this.#instance;
  }

  public get token() {
    return this.#token;
  }
  public set token(token) {
    this.#token = token;
  }
  public getHeaders = (extraHeaders = {}) => ({
    Authorization: `Bearer ${this.#token}`,
    ...extraHeaders,
  });
  public set refreshFunc(func: () => Promise<{ at: string }>) {
    this.#refreshFunc = func;
  }

  public refreshHelper = <F extends (...args: Parameters<F>) => Promise<ReturnType<F>>>(
    func: F,
  ) => {
    return async (...args: Parameters<F>): Promise<ReturnType<F>> => {
      try {
        return await func(...args);
      } catch (error) {
        if (!this.#refreshFunc) throw error;
        const { statusCode } = (error as { response: { data: { statusCode: number } } } & Error)
          .response.data;
        if (statusCode === 401) {
          try {
            const response = await this.#refreshFunc();
            this.#token = response.at;
            if (this.#rememberMe) {
              localStorage.setItem('at', response.at);
            } else {
              sessionStorage.setItem('at', response.at);
            }

            return await func(...args);
          } catch (error) {
            const { statusCode } = (error as { response: { data: { statusCode: number } } } & Error)
              .response.data;
            if (statusCode === 403) {
              localStorage.removeItem('at');
              sessionStorage.removeItem('at');
              this.#token = null;
            }
            throw error;
          }
        }

        throw error;
      }
    };
  };
}
