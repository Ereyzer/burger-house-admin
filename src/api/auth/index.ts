import axios from 'axios';
import { BaseApi } from '../initial-class';
import type { LoginUserDto } from '../../dto/login-user.dto';

export class UserApi {
  readonly #base_instance = BaseApi.instance;
  readonly #baseUrl = '/admin/auth';
  static #instance: UserApi | null = null;
  constructor() {
    this.#base_instance.refreshFunc = this.refreshToken;
    this.getLoggetUser = this.#base_instance.refreshHelper(this.getLoggetUser);
  }
  //TODO:
  public static get instance() {
    if (!this.#instance) {
      this.#instance = new UserApi();
    }
    return this.#instance;
  }
  public login = async (data: LoginUserDto) => {
    const response = await axios.post(`${this.#baseUrl}/login`, data, { withCredentials: true });

    return response.data;
  };
  public getLoggetUser = async () => {
    const response = await axios.get(`${this.#baseUrl}/login`, {
      headers: this.#base_instance.getHeaders(),
    });
    return response.data;
  };
  public refreshToken = async () => {
    const response = await axios.get(`${this.#baseUrl}/refresh`, {
      headers: this.#base_instance.getHeaders(),
      withCredentials: true,
    });
    return response.data;
  };
}
