import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Resources = sequelize.define(
  "Resources",
  {
    name: {
      type: DataTypes.STRING(250),
      allowNull: false,
    },

    url: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }
);

export default Resources;