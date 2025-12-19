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

  public changeOnboard = (id: string) =>
    axios
      .put(`${this.baseUrl}/onboard/${id}`, {}, { headers: this.baseInstance.getHeaders() })
      .then(res => res.data)
      .catch(err => {
        throw err;
      });

  public addCategory = (id: string, name: string) =>
    axios
      .put(`${this.baseUrl}/category/${id}`, { name }, { headers: this.baseInstance.getHeaders() })
      .then(res => res.data)
      .catch(err => {
        throw err;
      });

  public rmCategory = (id: string, name: string) =>
    axios
      .delete(`${this.baseUrl}/category/${id}?name=${name}`, {
        headers: this.baseInstance.getHeaders(),
      })
      .then(res => res.data)
      .catch(err => {
        throw err;
      });

  public addDrink = (id: string, drink: string) =>
    axios
      .put(`${this.baseUrl}/drinks/${id}`, { drink }, { headers: this.baseInstance.getHeaders() })
      .then(res => res.data)
      .catch(err => {
        throw err;
      });
  public rmDrink = (id: string, drink: string) =>
    axios
      .delete(`${this.baseUrl}/drinks/${id}?drink=${drink}`, {
        headers: this.baseInstance.getHeaders(),
      })
      .then(res => res.data)
      .catch(err => {
        throw err;
      });

  public addDish = (id: string, dish: string) =>
    axios
      .put(`${this.baseUrl}/dishes/${id}`, { dish }, { headers: this.baseInstance.getHeaders() })
      .then(res => res.data)
      .catch(err => {
        throw err;
      });
  public rmDish = (id: string, dish: string) =>
    axios
      .delete(`${this.baseUrl}/dishes/${id}?dish=${dish}`, {
        headers: this.baseInstance.getHeaders(),
      })
      .then(res => res.data)
      .catch(err => {
        throw err;
      });

  public updateImage = (id: string, data: FormData) =>
    axios
      .patch(`${this.baseUrl}/images/${id}`, data, {
        headers: this.baseInstance.getHeaders(),
      })
      .then(res => res.data)
      .catch(err => {
        throw err;
      });
}
