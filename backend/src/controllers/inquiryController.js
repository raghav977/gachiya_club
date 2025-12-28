import { createInquiryService, getAllInquiriesService, getInqueryDetailByIdService, updateInquiryStatusService } from "../services/inquiryService.js";


// Create inquiry (public - from contact form)
export const createInquiry = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({
                message: "Name, email, and message are required"
            });
        }

        const inquiry = await createInquiryService(name, email, message);

        return res.status(201).json({
            message: "Inquiry submitted successfully",
            data: inquiry
        });
    } catch (err) {
        console.log("Create Inquiry Controller Error:", err.message);
        return res.status(500).json({
            message: err.message || "Internal Server Error"
        });
    }
};


export const getAllInquiries = async(req,res)=>{
    try{
        const { page = 1, limit = 10, status, search } = req.query;

        const { totalInquiries, inquiries } = await getAllInquiriesService(
            parseInt(page),
            parseInt(limit),
            status,
            search
        );

        return res.status(200).json({
            message: "Inquiries fetched successfully",
            page: parseInt(page),
            limit: parseInt(limit),
            totalInquiries,
            data: inquiries
        });

    }
    catch(err){
        console.log("Get All Inquiries Controller Error:", err.message);

        return res.status(500).json({
            message: err.message || "Internal Server Error"
        });

    }
}


export const getInquiryDetailById = async(req,res)=>{
    try{
        const { id } = req.params;
        const inquiry = await getInqueryDetailByIdService(id);

        return res.status(200).json({
            message: "Inquiry detail fetched successfully",
            data: inquiry
        });

    }
    catch(err){
        console.log("Get Inquiry Detail Controller Error:", err.message);

        return res.status(500).json({
            message: err.message || "Internal Server Error"
        });

    }
}


export const updateInquiryStatus = async(req,res)=>{
    try{
        const { id } = req.params;
        const { status } = req.body;

        const updatedInquiry = await updateInquiryStatusService(id,status);

        return res.status(200).json({
            message: "Inquiry status updated successfully",
            data: updatedInquiry
        });

    }
    catch(err){
        console.log("Update Inquiry Status Controller Error:", err.message);

        return res.status(500).json({
            message: err.message || "Internal Server Error"
        });

    }
}