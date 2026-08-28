export interface UpdateUserProfileRequestDTO {
  userId: string;
  name: string;
  phone: string;
  location?: string;
  bio?: string;
}