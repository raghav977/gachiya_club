import { sequelize } from "../config/db.js";
import Event from "../models/evenetModel.js";
import Category from "../models/categoryModels.js";
import Player from "../models/playerModel.js";
import { HasMany } from "sequelize";

Event.hasMany(Category, {foreignKey:"eventId"});
Category.belongsTo(Event, {foreignKey: "eventId"});

// Player relations
Event.hasMany(Player, { foreignKey: "eventId" });
Player.belongsTo(Event, { foreignKey: "eventId" });

Category.hasMany(Player, { foreignKey: "categoryId" });
Player.belongsTo(Category, { foreignKey: "categoryId" });

const syncDatabase = async()=>{
    try{
        await sequelize.authenticate();
        
        const seque = await sequelize.sync({
            alter:false
        })
        console.log("database synced    ");
    }
    catch(err){
        console.log("something went wrong",err);
    }
}

export default syncDatabase;