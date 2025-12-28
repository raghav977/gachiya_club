import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Member = sequelize.define("Member", {
  fullName: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: "Member testimonial or saying",
  },
  image: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  memberType: {
    type: DataTypes.ENUM("executive", "team", "member"),
    allowNull: false,
    defaultValue: "member",
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false,
  },
  displayOrder: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
  contactNumber: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  joinedDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
});

export default Member;
