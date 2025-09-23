import axios from 'axios';
import { BasicApiClass } from '../initial-class';

export class MenuApi extends BasicApiClass {
  constructor() {
    super();
    this.baseUrl = '/admin/menu';
    this.changeOnboard = this.baseInstance.refreshHelper(this.changeOnboard);
    this.addCategory = this.baseInstance.refreshHelper(this.addCategory);
    this.rmCategory = this.baseInstance.refreshHelper(this.rmCategory);
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
}
