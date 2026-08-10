export interface CreateOrderRequestDTO {
  workId: string;
  userId: string;
  workerId: string;
  workTitle: string;
  amount: number;
  currency?: string;
}

export interface CreateOrderResponseDTO {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
  paymentId: string;
}