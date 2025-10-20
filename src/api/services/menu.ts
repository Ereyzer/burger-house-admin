import axios from 'axios';
import { BasicApiClass } from '../initial-class';

export class MenuApi extends BasicApiClass {
  constructor() {
    super();
    this.baseUrl = '/admin/menu';
    this.changeOnboard = this.baseInstance.refreshHelper(this.changeOnboard);
    this.addCategory = this.baseInstance.refreshHelper(this.addCategory);
    this.rmCategory = this.baseInstance.refreshHelper(this.rmCategory);
    this.addDrink = this.baseInstance.refreshHelper(this.addDrink);
    this.rmDrink = this.baseInstance.refreshHelper(this.rmDrink);
    this.addDish = this.baseInstance.refreshHelper(this.addDish);
    this.rmDish = this.baseInstance.refreshHelper(this.rmDish);
    this.updateImage = this.baseInstance.refreshHelper(this.updateImage);
  }

  public changeOnboard = (id: number) =>
    axios
      .put(`${this.baseUrl}/onboard/${id}`, {}, { headers: this.baseInstance.getHeaders() })
      .then(res => res.data)
      .catch(err => {
        throw err;
      });

  public addCategory = (id: number, name: string) =>
    axios
      .put(`${this.baseUrl}/category/${id}`, { name }, { headers: this.baseInstance.getHeaders() })
      .then(res => res.data)
      .catch(err => {
        throw err;
      });

  public rmCategory = (id: number, name: string) =>
    axios
      .delete(`${this.baseUrl}/category/${id}?name=${name}`, {
        headers: this.baseInstance.getHeaders(),
      })
      .then(res => res.data)
      .catch(err => {
        throw err;
      });

  public addDrink = (id: number, drink: number) =>
    axios
      .put(`${this.baseUrl}/drinks/${id}`, { drink }, { headers: this.baseInstance.getHeaders() })
      .then(res => res.data)
      .catch(err => {
        throw err;
      });
  public rmDrink = (id: number, drink: number) =>
    axios
      .delete(`${this.baseUrl}/drinks/${id}?drink=${drink}`, {
        headers: this.baseInstance.getHeaders(),
      })
      .then(res => res.data)
      .catch(err => {
        throw err;
      });

  public addDish = (id: number, dish: number) =>
    axios
      .put(`${this.baseUrl}/dishes/${id}`, { dish }, { headers: this.baseInstance.getHeaders() })
      .then(res => res.data)
      .catch(err => {
        throw err;
      });
  public rmDish = (id: number, dish: number) =>
    axios
      .delete(`${this.baseUrl}/dishes/${id}?dish=${dish}`, {
        headers: this.baseInstance.getHeaders(),
      })
      .then(res => res.data)
      .catch(err => {
        throw err;
      });

  public updateImage = (id: number, data: FormData) =>
    axios
      .patch(`${this.baseUrl}/images/${id}`, data, {
        headers: this.baseInstance.getHeaders(),
      })
      .then(res => res.data)
      .catch(err => {
        throw err;
      });
}
