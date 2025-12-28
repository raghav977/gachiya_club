import { sequelize } from "../config/db.js";
import { DataTypes } from "sequelize";

export const Inquiry = sequelize.define("Inquiry", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  message: {
    type: DataTypes.STRING(1000),
    allowNull: false,
  },
  status:{
    type: DataTypes.ENUM('pending', 'in_progress', 'resolved'),
    defaultValue: 'pending',
  }
}, {
  tableName: "inquiries",
  timestamps: true,
});


export default Inquiry;
