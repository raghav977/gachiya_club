import { registerPlayerServices, getAllRegisteredPlayersService, getPlayerDetailService, verifyPlayerService, rejectPlayerService } from "../services/playerService.js";
import { getRelativeImagePath } from "../middleware/multerConfig.js";


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
    
    // Convert absolute paths to relative paths for database storage
    const paymentVoucherPath = getRelativeImagePath(paymentVoucher.path);
    const authenticateDocumentPath = getRelativeImagePath(authenticateDocument.path);

    try {
        const result = await registerPlayerServices(fullName, address, dateOfBirth, gender, email, contactNumber, TshirtSize, bloodGroup, emergencyContact, paymentVoucherPath, authenticateDocumentPath, eventId, category);

        return res.status(200).json({message:"User created", data:result});
    }
    catch(err){
        // console.log("Somthing went wrong:", err.message);

    }
    }



export const getAllRegisteredPlayers = async (req, res) => {
    try{
        const { page = 1, limit = 10, search = null, eventId = null, categoryId = null, status = null, bibNumber = null } = req.query;

        const result = await getAllRegisteredPlayersService({ 
            page: Number(page), 
            limit: Number(limit), 
            search, 
            eventId: eventId ? Number(eventId) : null, 
            categoryId: categoryId ? Number(categoryId) : null,
            status: status || null,
            bibNumber: bibNumber || null
        });

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



const formatBibNumber = (bibNumber) => {
  if (bibNumber === null || bibNumber === undefined) return "N/A";
  return String(bibNumber).padStart(4, "0");
};


export const verifyPlayer = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: "Player ID required" });

        const player = await verifyPlayerService(Number(id), "verified");

        return res.status(200).json({ 
            message: `Player verified successfully. BIB #${formatBibNumber(player.bibNumber)} assigned.`, 
            data: player 
        });
    }
    catch (err) {
        return res.status(500).json({ message: err.message || "Failed to verify player" });
    }
}


// Reject player registration
export const rejectPlayer = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;
        if (!id) return res.status(400).json({ message: "Player ID required" });

        const player = await rejectPlayerService(Number(id), reason);

        return res.status(200).json({ message: "Player registration rejected", data: player });
    }
    catch (err) {
        return res.status(500).json({ message: err.message || "Failed to reject player" });
    }
}