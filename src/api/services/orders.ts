import axios from 'axios';
import { BasicApiClass } from '../initial-class';
import type { Status } from '../../components/orders/types';

export class OrdersApi extends BasicApiClass {
  constructor() {
    super();
    this.baseUrl = 'admin/orders';
  }

  public getAllOrders = async (page?: number, perPage?: number) => {
    let query = '';
    if (page || perPage) {
      query = query + '?';
      if (page) {
        query = query + `page=${page}`;

        if (perPage) {
          query = query + `&perPage=${perPage}`;
        }
      }
    }
    return axios
      .get(`${this.baseUrl}${query}`, { headers: this.baseInstance.getHeaders() })
      .then(res => res.data)
      .catch(err => {
        throw err;
      });
  };

  public changeOrderStatus = (id: number, status: Status) =>
    axios
      .patch(
        `${this.baseUrl}/status/${id}`,
        { status },
        { headers: this.baseInstance.getHeaders() },
      )
      .then(res => res.data)
      .catch(err => {
        throw err;
      });
  public getActual = () =>
    axios
      .get(`${this.baseUrl}/actual`)
      .then(({ data }) => data)
      .catch(err => {
        throw err;
      });
}
