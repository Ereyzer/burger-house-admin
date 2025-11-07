import axios from 'axios';

export class BaseApi {
  readonly #BASE_URL = 'http://localhost:3000';
  #token: string | null = null;
  #rememberMe = true;
  static #instance: BaseApi | null;
  #refreshFunc: (() => Promise<{ at: string }>) | null = null;
  #timeoutTokenUpdate: number = 0;

  private constructor() {
    axios.defaults.baseURL = this.#BASE_URL;
    // this.#token = sessionStorage.getItem('at');

    if (!this.#token) {
      this.#token = localStorage.getItem('at');
    } else {
      this.#rememberMe = false;
    }
  }

  private decodeJwt = (token: string): null | { exp: number } => {
    try {
      const payloadBase64 = token.split('.')[1];
      const decoderPayload = atob(payloadBase64);
      return JSON.parse(decoderPayload);
    } catch {
      return null;
    }
  };

  private isTimeToExpirationToken = (token: string) => {
    const payload = this.decodeJwt(token);

    if (!payload || !payload.exp) return false;
    const expirationTimeMs = payload.exp * 1000;

    const currentTimeMs = Date.now();

    const timeBufferMs = 60000;
    const leftMs = expirationTimeMs - currentTimeMs - timeBufferMs;

    if (leftMs < 0) return false;
    return leftMs;
  };

  private getTokenFromStorage() {
    this.#token = sessionStorage.getItem('at');

    if (!this.#token) {
      this.#token = localStorage.getItem('at');
    } else {
      this.#rememberMe = false;
    }
  }

  public getAndUpdateToken = async () => {
    this.getTokenFromStorage();
    console.log(1);

    if (!this.#token) return;
    const leftMs: number | false = this.isTimeToExpirationToken(this.#token);
    console.log(2);

    if (!leftMs) {
      clearTimeout(this.#timeoutTokenUpdate);
      await this.refreshAndUpdateToken();
      this.#timeoutTokenUpdate = setTimeout(() => {
        console.log(leftMs, ' koma ', 2);

        this.getAndUpdateToken();
      }, 14 * 60 * 1000);
    } else {
      clearTimeout(this.#timeoutTokenUpdate);
      this.#timeoutTokenUpdate = setTimeout(async () => {
        console.log(leftMs, ' bez ', 2);
        this.getAndUpdateToken();
      }, leftMs);
    }
  };

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

  private refreshAndUpdateToken = async () => {
    if (!this.#refreshFunc) throw new Error('refresh is null');
    const { at } = await this.#refreshFunc();
    this.#token = at;
    if (this.#rememberMe) {
      localStorage.setItem('at', at);
    } else {
      sessionStorage.setItem('at', at);
    }
  };
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
            // const response = await this.#refreshFunc();
            // this.#token = response.at;
            // if (this.#rememberMe) {
            //   localStorage.setItem('at', response.at);
            // } else {
            //   sessionStorage.setItem('at', response.at);
            // }
            await this.getAndUpdateToken();

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
  readonly baseInstance = BaseApi.instance;
  baseUrl = '';
  constructor() {
    this.getAll = this.baseInstance.refreshHelper(this.getAll);
    this.getOneById = this.baseInstance.refreshHelper(this.getOneById);
    this.updatePrice = this.baseInstance.refreshHelper(this.updatePrice);
    this.updateItem = this.baseInstance.refreshHelper(this.updateItem);
    this.addItem = this.baseInstance.refreshHelper(this.addItem);
    this.rmItem = this.baseInstance.refreshHelper(this.rmItem);
  }
  public getAll = () =>
    axios
      .get(this.baseUrl, { headers: this.baseInstance.getHeaders() })
      .then(res => res.data)
      .catch(err => {
        throw err;
      });

  // TODO:
  // async (page?: number, perPage?: number) => {
  //   let query = '';
  //   if (page || perPage) {
  //     query = query + '?';
  //     if (page) {
  //       query = query + `page=${page}`;

  //       if (perPage) {
  //         query = query + `&perPage=${perPage}`;
  //       }
  //     }
  //   }
  //   return axios
  //     .get(`${this.baseUrl}${query}`, { headers: this.baseInstance.getHeaders() })
  //     .then(res => res.data)
  //     .catch(err => {
  //       throw err;
  //     });
  // };

  public getOneById = (id: number) =>
    axios
      .get(`${this.baseUrl}/${id}`, { headers: this.baseInstance.getHeaders() })
      .then(res => res.data)
      .catch(err => {
        throw err;
      });

  public updatePrice = (id: number, price: number) =>
    axios
      .patch(`${this.baseUrl}/price/${id}`, { price }, { headers: this.baseInstance.getHeaders() })
      .then(res => res.data)
      .catch(err => {
        throw err;
      });

  public updateItem = <T extends object>(id: number, data: T) =>
    axios
      .patch(`${this.baseUrl}/${id}`, data, { headers: this.baseInstance.getHeaders() })
      .then(res => res.data)
      .catch(err => {
        throw err;
      });

  public addItem = <T extends object>(data: T) =>
    axios
      .post(this.baseUrl, data, { headers: this.baseInstance.getHeaders() })
      .then(response => response.data)
      .catch(err => {
        throw err;
      });

  public rmItem = (id: number) =>
    axios
      .delete(`${this.baseUrl}/${id}`, { headers: this.baseInstance.getHeaders() })
      .then(res => res.data)
      .catch(err => {
        throw err;
      });
}
