import { BasicApiClass } from '../initial-class';

export class DrinksApi extends BasicApiClass {
  constructor() {
    super();
    this.baseUrl = 'admin/drink';
  }
}
