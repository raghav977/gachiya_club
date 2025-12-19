import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Event = sequelize.define(
  "Event",
  {
    title: {
      type: DataTypes.STRING(250),
      allowNull: false,
    },

    description: {
      type: DataTypes.STRING(250),
      allowNull: false,
    },

    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true,
      },
    },

    isPublish: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

    note: {
      type: DataTypes.STRING(250),
      allowNull: true,
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    imageURl:{
        type:DataTypes.STRING
    }
  },
  {
    indexes: [
      {
        fields: ["title"], // index on title
      },
    ],
  }
    
);

export default Event;
