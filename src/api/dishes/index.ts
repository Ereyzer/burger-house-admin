import { BasicApiClass } from '../initial-class';

// export class DishApi {
//   #base_interface = BaseApi.instance;
//   #baseUrl = '/admin/dish';
//   constructor() {
//     this.getAll = this.#base_interface.refreshHelper(this.getAll);
//     this.addDish = this.#base_interface.refreshHelper(this.addDish);
//     this.updateDish = this.#base_interface.refreshHelper(this.updateDish);
//     this.rmDish = this.#base_interface.refreshHelper(this.rmDish);
//   }
//   public getAll = () =>
//     axios.get(this.#baseUrl, { headers: this.#base_interface.getHeaders() }).then(res => res.data);

//   public addDish = (data: CreateDishDto) =>
//     axios
//       .post(this.#baseUrl, data, { headers: this.#base_interface.getHeaders() })
//       .then(res => res.data);

//   public updatePrice = async (id: number, price: number) => {
//     const response = await axios.patch(
//       `${this.#baseUrl}/price/${id}`,
//       { price },
//       { headers: this.#base_interface.getHeaders() },
//     );
//     console.log(response);

//     return response.data;
//   };
//   public updateDish = (id: number) =>
//     axios
//       .patch(`${this.#baseUrl}/${id}`, {}, { headers: this.#base_interface.getHeaders() })
//       .then(res => res.data);

//   public rmDish = (id: number) =>
//     axios
//       .delete(`${this.#baseUrl}/${id}`, { headers: this.#base_interface.getHeaders() })
//       .then(res => res.data);
// }

export class DishApi extends BasicApiClass {
  constructor() {
    super();
    this.baseUrl = '/admin/dish';
  }
}
