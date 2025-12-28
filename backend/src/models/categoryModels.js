import { sequelize } from "../config/db.js";
import { DataTypes } from "sequelize";

const Category = sequelize.define(
    "Category",
    {
        title: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        isActive:{
            type:DataTypes.BOOLEAN,
            defaultValue:true,
            allowNull:false
        },
        // BIB number range for this category
        bibStart: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null,
        },
        bibEnd: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null,
        },
    }
);


export default Category;