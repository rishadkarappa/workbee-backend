import { CreateOrderRequestDTO } from "../../dtos/payment/CreateOrderDTO";
import { CreateOrderResponseDTO } from "../../dtos/payment/CreateOrderDTO";

export interface ICreateRazorpayOrderUseCase {
  execute(data: CreateOrderRequestDTO): Promise<CreateOrderResponseDTO>;
}