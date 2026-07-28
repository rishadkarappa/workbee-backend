import { inject, injectable } from 'tsyringe';
import { IUserRepository } from '../../../../domain/repositories/IUserRepository';
import { IGetUserProfileUseCase, IUserProfile } from '../../../ports/isc/IGetUserProfileUseCase';

/**
 * comm
 */

@injectable()
export class GetUserProfileUseCase implements IGetUserProfileUseCase{
  constructor(
    @inject("UserRepository") private readonly _userRepository: IUserRepository
  ) {}

  async execute(userId: string):Promise<IUserProfile> {
    const user = await this._userRepository.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    };
  }
}
