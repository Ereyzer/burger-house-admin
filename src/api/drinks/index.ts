import axios from 'axios';
import { BaseApi } from '../initial-class';

export class DrinksApi {
  readonly #baseInstance = BaseApi.instance;
  readonly #baseUrl = '/admin/drink';
  constructor() {
    this.getAll = this.#baseInstance.refreshHelper(this.getAll);
    this.updatePrice = this.#baseInstance.refreshHelper(this.updatePrice);
    this.addDrink = this.#baseInstance.refreshHelper(this.addDrink);
    this.rmDrink = this.#baseInstance.refreshHelper(this.rmDrink);
  }

  public getAll = async () => {
    const response = await axios.get(this.#baseUrl, { headers: this.#baseInstance.getHeaders() });
    return response.data;
  };
  public updatePrice = async (id: number, price: number) => {
    const response = await axios.patch(
      `${this.#baseUrl}/price/${id}`,
      { price },
      { headers: this.#baseInstance.getHeaders() },
    );
    console.log(response);

    return response.data;
  };

  public addDrink = async (name: string, price: number, calories: number, description?: string) =>
    axios
      .post(
        this.#baseUrl,
        { name, price, calories, description },
        { headers: this.#baseInstance.getHeaders() },
      )
      .then(response => response.data);

  public rmDrink = async (id: number) =>
    axios
      .delete(`${this.#baseUrl}/${id}`, { headers: this.#baseInstance.getHeaders() })
      .then(res => res.data);
}
