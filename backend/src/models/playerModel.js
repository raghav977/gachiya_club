import { DataTypes } from "sequelize";
import {sequelize} from "../config/db.js";


const Player = sequelize.define(
    "Player",
    {
        fullName: {
            type: DataTypes.STRING(100),
            allowNull: false

        },
        address: {
            type: DataTypes.STRING(250),
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
            type: DataTypes.STRING(100),

        },
        contactNumber: {
            type: DataTypes.STRING(20),
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
            type:DataTypes.STRING(20),
            allowNull:false
        },
        paymentVoucher:{
            type:DataTypes.STRING(500),
            allowNull:false
        },
        authenticateDocument:{
            type:DataTypes.STRING(500),
            allowNull:false
        },
        verificationStatus: {
            type: DataTypes.ENUM("pending", "verified", "rejected"),
            defaultValue: "pending",
            allowNull: false
        },
        bibNumber: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null
        },
        // When the player was verified
        verifiedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: null
        },
        rejectionReason: {
            type: DataTypes.STRING(500),
            allowNull: true,
            defaultValue: null

    }
    }
)

export default Player;