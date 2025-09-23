import { BasicApiClass } from '../initial-class';

export class CategoryApi extends BasicApiClass {
  constructor() {
    super();
    this.baseUrl = '/admin/categories';
  }
}
