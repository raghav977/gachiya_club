
import { sequelize } from "../config/db.js";
import { DataTypes } from "sequelize";

const Admin = sequelize.define(
    "Admin",
    {
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
    }
)

export default Admin;