import BaseSchema from "../common/dto/base.dto";

export interface ISweet extends BaseSchema {
  name: string;
  category: string;
  price: number;
  quantity: number;
  isActive?: boolean;
}
