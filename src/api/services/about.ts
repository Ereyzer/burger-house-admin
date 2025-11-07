import axios from 'axios';
import { BasicApiClass } from '../initial-class';
import type { OpenDay } from '../../pages/aboutPlace/interface';

export class AboutApi extends BasicApiClass {
  constructor() {
    super();
    this.baseUrl = '/admin/about';
    this.getAbout = this.baseInstance.refreshHelper(this.getAbout);
    this.updateAbout = this.baseInstance.refreshHelper(this.updateAbout);
    this.updateOpenigHours = this.baseInstance.refreshHelper(this.updateOpenigHours);
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
  updateOpenigHours = (data: OpenDay) =>
    axios
      .put(`${this.baseUrl}/opening`, data, { headers: this.baseInstance.getHeaders() })
      .then(({ data }) => data)
      .catch(err => {
        throw err;
      });
}
