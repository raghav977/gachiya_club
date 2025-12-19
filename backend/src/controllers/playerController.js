import { registerPlayerServices, getAllRegisteredPlayersService, getPlayerDetailService } from "../services/playerService.js";


export const registerPlayer = async (req, res) => {
  
    // console.log("This is body:", req.body);
    const { fullName, address, dateOfBirth, gender, email, contactNumber, TshirtSize, bloodGroup, emergencyContact, eventId, category } = req.body;
//   console.log("This is req file:", req.files);
    const paymentVoucher = req.files?.paymentVoucher?.[0];
    // console.log("this is payment voucher",paymentVoucher)
    const authenticateDocument = req.files?.authenticateDocument?.[0];
    // console.log("this is date of birth",typeof(dateOfBirth))
    if(!paymentVoucher || !authenticateDocument){
        return res.status(400).json({message: "Please upload all documents"});
    }
    

    try {
        const result = await registerPlayerServices(fullName, address, dateOfBirth, gender, email, contactNumber, TshirtSize, bloodGroup, emergencyContact, paymentVoucher.path, authenticateDocument.path, eventId, category);

        return res.status(200).json({message:"User created", data:result});
    }
    catch(err){
        // console.log("Somthing went wrong:", err.message);

    }
    }



export const getAllRegisteredPlayers = async (req, res) => {
    try{
        const { page = 1, limit = 10, search = null, eventId = null, categoryId = null } = req.query;

        const result = await getAllRegisteredPlayersService({ page: Number(page), limit: Number(limit), search, eventId: eventId ? Number(eventId) : null, categoryId: categoryId ? Number(categoryId) : null });

        return res.status(200).json({ message: "Players fetched", page: Number(page), limit: Number(limit), total: result.totalPlayers, totals: result.totals, data: result.players });
    }
    catch(err){
        // console.log("Error fetching players:", err.message);
        return res.status(500).json({ message: err.message || "Something went wrong" });

    }
    // Implementation for fetching all registered players
}


export const getPlayerDetail = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: "player id required" });

        const player = await getPlayerDetailService(Number(id));

        return res.status(200).json({ message: "Player fetched", data: player });
    }
    catch (err) {
        // console.log("Error fetching player detail:", err.message);
        return res.status(500).json({ message: err.message || "Something went wrong" });
    }
}