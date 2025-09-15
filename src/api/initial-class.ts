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

export class BasicApiClass {
  readonly #baseInstance = BaseApi.instance;
  baseUrl = '';
  constructor() {
    // this.baseUrl = baseUrl;
    this.getAll = this.#baseInstance.refreshHelper(this.getAll);
    this.updatePrice = this.#baseInstance.refreshHelper(this.updatePrice);
    this.updateItem = this.#baseInstance.refreshHelper(this.updateItem);
    this.addItem = this.#baseInstance.refreshHelper(this.addItem);
    this.rmItem = this.#baseInstance.refreshHelper(this.rmItem);
  }
  public getAll = () =>
    axios
      .get(this.baseUrl, { headers: this.#baseInstance.getHeaders() })
      .then(res => res.data)
      .catch(err => {
        throw err;
      });

  public updatePrice = (id: number, price: number) =>
    axios
      .patch(`${this.baseUrl}/price/${id}`, { price }, { headers: this.#baseInstance.getHeaders() })
      .then(res => res.data)
      .catch(err => {
        throw err;
      });

  public updateItem = (id: number) =>
    axios
      .patch(`${this.baseUrl}/${id}`, {}, { headers: this.#baseInstance.getHeaders() })
      .then(res => res.data)
      .catch(err => {
        throw err;
      });

  public addItem = <T extends object>(data: T) =>
    axios
      .post(this.baseUrl, data, { headers: this.#baseInstance.getHeaders() })
      .then(response => response.data)
      .catch(err => {
        throw err;
      });

  public rmItem = (id: number) =>
    axios
      .delete(`${this.baseUrl}/${id}`, { headers: this.#baseInstance.getHeaders() })
      .then(res => res.data)
      .catch(err => {
        throw err;
      });
}
