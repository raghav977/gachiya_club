
import { sequelize } from "../config/db.js";
import { DataTypes } from "sequelize";

const Admin = sequelize.define(
    "Admin",
    {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }
)

export default Admin;