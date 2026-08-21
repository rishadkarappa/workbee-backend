import { inject, injectable } from 'tsyringe';
import { IUserRepository } from '../../../../domain/repositories/IUserRepository';
import { IGetUserProfilesBatchUseCase, IUserProfiles } from '../../../ports/isc/IGetUserProfilesBatchUseCase';
import { UserMapper } from '../../../mappers/UserMapper';

/**
 * Use case for fetching multiple user profiles safely
 * Used for inter-service communication bw communicaiton <-> auth serivce
 */

@injectable()
export class GetUserProfilesBatchUseCase implements IGetUserProfilesBatchUseCase {
    constructor(
        @inject("UserRepository") private readonly _userRepository: IUserRepository
    ) { }

    async execute(userIds: string[]): Promise<IUserProfiles[]> {
        if (!userIds || userIds.length === 0) {
            return [];
        }
        const users = await this._userRepository.findByIds(userIds);

        return users.map(UserMapper.toUserProfileBatch);
    }
}
