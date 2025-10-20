import axios from 'axios';
import { BasicApiClass } from '../initial-class';

export class AboutApi extends BasicApiClass {
  constructor() {
    super();
    this.baseUrl = '/admin/about';
    this.getAbout = this.baseInstance.refreshHelper(this.getAbout);
    this.updateAbout = this.baseInstance.refreshHelper(this.updateAbout);
  }

  getAbout = () =>
    axios
      .get(this.baseUrl, { headers: this.baseInstance.getHeaders() })
      .then(({ data }) => data)
      .catch(err => {
        throw err;
      });

  updateAbout = (data: object) =>
    axios
      .post(this.baseUrl, data, { headers: this.baseInstance.getHeaders() })
      .then(({ data }) => data)
      .catch(err => {
        throw err;
      });
}
