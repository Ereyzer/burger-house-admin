import { BasicApiClass } from '../initial-class';

export class DishApi extends BasicApiClass {
  constructor() {
    super();
    this.baseUrl = '/admin/dish';
  }
}
