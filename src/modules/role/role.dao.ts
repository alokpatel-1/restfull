import { RoleModel } from "./role.model";

export class RoleDao {

    getAllRoles = async () => {
        try {
            return await RoleModel.find().lean();
        } catch (error) {
            throw error;
        }
    }

    getRoleById = async (id: string) => {
        try {
            return await RoleModel.findById(id).lean();
        } catch (error) {
            throw error;
        }
    }
}