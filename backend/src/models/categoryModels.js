import { sequelize } from "../config/db.js";
import { DataTypes } from "sequelize";

const Category = sequelize.define(
    "Category",
    {
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        isActive:{
            type:DataTypes.BOOLEAN,
            defaultValue:true,
            allowNull:false
        }
    }
);


export default Category;