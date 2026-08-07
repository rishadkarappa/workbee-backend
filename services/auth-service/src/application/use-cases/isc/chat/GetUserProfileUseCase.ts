import { inject, injectable } from 'tsyringe';
import { IUserRepository } from '../../../../domain/repositories/IUserRepository';
import { IGetUserProfileUseCase, IUserProfile } from '../../../ports/isc/IGetUserProfileUseCase';
import { ErrorMessages } from '../../../../shared/constants/ErrorMessages';

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
      throw new Error(ErrorMessages.USER.NOT_FOUND);
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
