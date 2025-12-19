import { DataTypes } from "sequelize";
import {sequelize} from "../config/db.js";


const Player = sequelize.define(
    "Player",
    {
        fullName: {
            type: DataTypes.STRING,
            allowNull: false

        },
        address: {
            type: DataTypes.STRING,
            allowNull: false
        },
        dateOfBirth: {
  type: DataTypes.DATEONLY,
  allowNull: false
}
,
        gender: {
            type: DataTypes.ENUM("male", "female", "other"),
            allowNull: false,

        },
        email: {
            type: DataTypes.STRING,

        },
        contactNumber: {
            type: DataTypes.STRING,
            allowNull: false
        },
        TshirtSize: {
            type: DataTypes.ENUM("XS", "S", "M", "L", "XL", "XXL"),
            allowNull:false

        },
        bloodGroup:{
            type:DataTypes.ENUM("A+", "A-", "B+", "B-","AB+", "AB-", "o+", "o-"),
            allowNull:false
        },
        emergencyContact:{
            type:DataTypes.STRING,
            allowNull:false
        },
        paymentVoucher:{
            type:DataTypes.STRING,
            allowNull:false
        },
        authenticateDocument:{
            type:DataTypes.STRING,
            allowNull:false
        }

    }
)

export default Player;