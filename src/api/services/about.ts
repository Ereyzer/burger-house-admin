import axios from 'axios';
import { BasicApiClass } from '../initial-class';
import type { BrakeTime, DeliveryPrice, OpenDay } from '../../pages/aboutPlace/interface';

interface AboutData {
  id?: number;
  facebook: string;
  instagram: string;
  email: string;
  phone: string;
  placeDescription: string;
  placeAddress: string;
  openningHours: OpenDay[];
  brakeTimes: BrakeTime[];
  deliveryPrices: DeliveryPrice[];
}
export class AboutApi extends BasicApiClass {
  constructor() {
    super();
    this.baseUrl = '/admin/about';
    this.getAbout = this.baseInstance.refreshHelper(this.getAbout);
    this.updateAbout = this.baseInstance.refreshHelper(this.updateAbout);
    this.updateOpenigHours = this.baseInstance.refreshHelper(this.updateOpenigHours);
    this.addBrakeTime = this.baseInstance.refreshHelper(this.addBrakeTime);
    this.rmBrakeTime = this.baseInstance.refreshHelper(this.rmBrakeTime);
  }

  getAbout = (): Promise<AboutData> =>
    axios
      .get(this.baseUrl, { headers: this.baseInstance.getHeaders() })
      .then(({ data }: { data: AboutData }) => data)
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
  addBrakeTime = (payload: Pick<BrakeTime, 'workDate' | 'closesAt' | 'opensAt'>) =>
    axios
      .post(`${this.baseUrl}/braketime`, payload, { headers: this.baseInstance.getHeaders() })
      .then(({ data }: { data: BrakeTime }) => data)
      .catch(err => {
        throw err;
      });
  rmBrakeTime = (id: string) =>
    axios
      .delete(`${this.baseUrl}/braketime/${id}`, { headers: this.baseInstance.getHeaders() })
      .then(({ data }) => data)
      .catch(err => {
        throw err;
      });

  addDeliveryPrice = (payload: Omit<DeliveryPrice, 'id'>) =>
    axios
      .post(`${this.baseUrl}/deliveryprice`, payload, { headers: this.baseInstance.getHeaders() })
      .then(({ data }) => data)
      .catch(err => {
        throw err;
      });

  rmDeliveryPrices = (id: string) =>
    axios
      .delete(`${this.baseUrl}/deliveryprice/${id}`, { headers: this.baseInstance.getHeaders() })
      .then(({ data }) => data)
      .catch(err => {
        throw err;
      });
}
