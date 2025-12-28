import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Gallery = sequelize.define(
  "Gallery",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(250),
      allowNull: true,
    },
    url: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }
);

export default Gallery;
