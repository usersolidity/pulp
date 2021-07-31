import * as _ from 'lodash';
import { Connection, In } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { HashHelper } from '../../helpers';
import { PermissionEntity } from '../../modules/admin/access/permissions/permission.entity';
import { RoleEntity } from '../../modules/admin/access/roles/role.entity';
import { UserStatus } from '../../modules/admin/access/users/user-status.enum';
import { UserEntity } from '../../modules/admin/access/users/user.entity';

const users = [
    {
        nonce: '12345',
        address: '0x5d20caFc82feDE339aCFF0d3097b07B3E3E940b5',
        isSuperUser: false,
        status: UserStatus.Active
    },
];
const rolePermissions = {
    'Author': [
        { slug: 'user.access.ipfs.proxy', description: 'Allow proxy-pass of IPFS data' },
    ],
    'Developer': [
        { slug: 'admin.access.users.read', description: 'Read users' },
        { slug: 'admin.access.users.create', description: 'Create users' },
        { slug: 'admin.access.users.update', description: 'Update users' },
        { slug: 'admin.access.roles.read', description: 'Read Roles' },
        { slug: 'admin.access.roles.create', description: 'Create Roles' },
        { slug: 'admin.access.roles.update', description: 'Update Roles' },
        { slug: 'admin.access.permissions.read', description: 'Read permissions' },
        { slug: 'admin.access.permissions.create', description: 'Create permissions' },
        { slug: 'admin.access.permissions.update', description: 'Update permissions' },
    ],
    'Admin': [
        { slug: 'admin.access.users.read', description: 'Read users' },
        { slug: 'admin.access.users.create', description: 'Create users' },
        { slug: 'admin.access.users.update', description: 'Update users' },
        { slug: 'admin.access.roles.read', description: 'Read Roles' },
        { slug: 'admin.access.roles.create', description: 'Create Roles' },
        { slug: 'admin.access.roles.update', description: 'Update Roles' },
    ]
};

export default class CreateUsersSeed implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<any> {
        const roleNames = Object.keys(rolePermissions);
        // Distinct permissions contained in all roles
        const permissions = _.uniqBy(roleNames.reduce((acc, roleName) => {
            return acc.concat(rolePermissions[roleName]);
        }, []), 'slug');
        // Getting slugs form permissions
        const permissionSlugs = permissions.map(p => p.slug);
        // Getting existing permissions from the DB
        const existingPermissions = await connection.manager.find(PermissionEntity, { where: { slug: In(permissionSlugs) } });
        // Mapping all permissions to permission entities
        const validPermissions = permissions.map(p => {
            const existing = existingPermissions.find(e => e.slug === p.slug);
            if (existing) {
                return existing;
            }
            return new PermissionEntity(p);
        });
        // Creating / updating permissions
        const savedPermissions = (await connection.manager.save(validPermissions)).reduce((acc, p) => {
            return { ...acc, [p.slug]: p };
        }, {});

        // Creating roles
        const roles = roleNames.map(name => {
            const permissions = Promise.resolve(rolePermissions[name].map(p => savedPermissions[p.slug]));
            return new RoleEntity({ name, permissions });
        });
        const savedRoles = await connection.manager.save(roles);
        //Creating users
        const entities = await Promise.all(users.map(async u => {
            const roles = Promise.resolve(savedRoles);
            const nonce = await HashHelper.encrypt(u.nonce); // TODO: generate nonce
            const user = new UserEntity({ ...u, nonce, roles });
            return user;
        }));
        await connection.manager.save(entities);
    }
}
