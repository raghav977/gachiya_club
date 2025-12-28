

import { sequelize } from "../config/db.js";
import { DataTypes } from "sequelize";

const Notices = sequelize.define(
    "Notices",
    {
        title: {
            type: DataTypes.STRING(250),
            allowNull: false,
        },

        description: {
            type: DataTypes.STRING(1500),
            allowNull: false,
        },
        url:{
            type: DataTypes.STRING(500),
            allowNull: true,
        },

        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    }
);

export default Notices;