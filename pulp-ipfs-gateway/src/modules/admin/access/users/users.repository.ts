import { PaginationRequest } from '@common/interfaces';
import { EntityRepository, Repository } from 'typeorm';
import { UserEntity } from './user.entity';

@EntityRepository(UserEntity)
export class UsersRepository extends Repository<UserEntity> {

    /**
     * Get users list
     * @param pagination {PaginationRequest}
     * @returns [userEntities: UserEntity[], totalUsers: number]
     */
    public async getUsersAndCount(
        pagination: PaginationRequest
    ): Promise<[userEntities: UserEntity[], totalUsers: number]> {

        const { skip, limit: take, order, params: { search } } = pagination;
        const query = this.createQueryBuilder('u')
            .innerJoinAndSelect('u.roles', 'r')
            .leftJoinAndSelect('u.permissions', 'p')
            .skip(skip)
            .take(take)
            .orderBy(order);

        if (search) {
            query.where(`
            u.address ILIKE :search
            `, { search: `%${search}%` }
            );
        }

        return query.getManyAndCount();
    }

    /**
     * find user by address
     * @param address {string}
     * @returns Promise<string>
     */
    async findUserByAddress(address: string): Promise<UserEntity> {
        return await this.createQueryBuilder('u')
            .leftJoinAndSelect('u.roles', 'r', 'r.active = true')
            .leftJoinAndSelect('r.permissions', 'rp', 'rp.active = true')
            .leftJoinAndSelect('u.permissions', 'p', 'p.active = true')
            .where('u.address = :address', { address })
            .getOne();
    }
}
