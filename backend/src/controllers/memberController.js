import {
  createMemberService,
  getAllMembersService,
  getPublicMembersService,
  getMemberByIdService,
  updateMemberService,
  deleteMemberService,
  toggleMemberStatusService,
  getMemberCountsService,
  updateMemberOrdersService,
} from "../services/memberService.js";
import { getRelativeImagePath } from "../middleware/multerConfig.js";

// Create member (admin)
export const createMember = async (req, res) => {
  try {
    console.log("this is request.body",req.body)
    const { fullName, role, description, memberType, isActive, displayOrder, contactNumber, email, joinedDate } = req.body;
    
    // Convert absolute path to relative path for database storage
    const image = getRelativeImagePath(req.file?.path);

    if (!fullName) {
      return res.status(400).json({ message: "Full name is required" });
    }

    const member = await createMemberService({
      fullName,
      role,
      description,
      image,
      memberType: memberType || "member",
      isActive: isActive !== undefined ? isActive : true,
      displayOrder: displayOrder || 0,
      contactNumber,
      email,
      joinedDate,
    });

    return res.status(201).json({ message: "Member created", data: member });
  } catch (err) {
    return res.status(500).json({ message: err.message || "Failed to create member" });
  }
};

// Get all members (admin with filters)
export const getAllMembers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", memberType = null, isActive = null } = req.query;

    const result = await getAllMembersService({
      page: Number(page),
      limit: Number(limit),
      search,
      memberType,
      isActive,
    });

    return res.status(200).json({
      message: "Members fetched",
      page: Number(page),
      limit: Number(limit),
      totalMembers: result.totalMembers,
      data: result.members,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message || "Failed to fetch members" });
  }
};

// Get public members (for frontend display)
export const getPublicMembers = async (req, res) => {
  try {
    const { page = 1, limit = 20, memberType = null, search = "" } = req.query;

    const result = await getPublicMembersService({
      page: Number(page),
      limit: Number(limit),
      memberType,
      search,
    });

    return res.status(200).json({
      message: "Members fetched",
      page: Number(page),
      limit: Number(limit),
      totalMembers: result.totalMembers,
      data: result.members,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message || "Failed to fetch members" });
  }
};

// Get member by ID
export const getMemberById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Member ID required" });

    const member = await getMemberByIdService(Number(id));
    return res.status(200).json({ message: "Member fetched", data: member });
  } catch (err) {
    return res.status(500).json({ message: err.message || "Failed to fetch member" });
  }
};

// Update member (admin)
export const updateMember = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Member ID required" });

    const { fullName, role, description, memberType, isActive, displayOrder, contactNumber, email, joinedDate } = req.body;

    const updateData = {};
    if (fullName !== undefined) updateData.fullName = fullName;
    if (role !== undefined) updateData.role = role;
    if (description !== undefined) updateData.description = description;
    if (memberType !== undefined) updateData.memberType = memberType;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (displayOrder !== undefined) updateData.displayOrder = displayOrder;
    if (contactNumber !== undefined) updateData.contactNumber = contactNumber;
    if (email !== undefined) updateData.email = email;
    if (joinedDate !== undefined) updateData.joinedDate = joinedDate;
    
    // Handle image upload - convert to relative path
    if (req.file?.path) {
      updateData.image = getRelativeImagePath(req.file.path);
    }

    const member = await updateMemberService(Number(id), updateData);
    return res.status(200).json({ message: "Member updated", data: member });
  } catch (err) {
    return res.status(500).json({ message: err.message || "Failed to update member" });
  }
};


export const deleteMember = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Member ID required" });

    const result = await deleteMemberService(Number(id));
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ message: err.message || "Failed to delete member" });
  }
};

// Toggle member status (admin)
export const toggleMemberStatus = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Member ID required" });

    const member = await toggleMemberStatusService(Number(id));
    return res.status(200).json({ message: "Member status toggled", data: member });
  } catch (err) {
    return res.status(500).json({ message: err.message || "Failed to toggle member status" });
  }
};

// Get member counts by type
export const getMemberCounts = async (req, res) => {
  try {
    const counts = await getMemberCountsService();
    return res.status(200).json({ message: "Counts fetched", data: counts });
  } catch (err) {
    return res.status(500).json({ message: err.message || "Failed to get counts" });
  }
};


export const reorderMembers = async (req, res) => {
  try {
    const { orders } = req.body;
    if (!orders || !Array.isArray(orders)) {
      return res.status(400).json({ message: "Orders array is required" });
    }

    const result = await updateMemberOrdersService(orders);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ message: err.message || "Failed to reorder members" });
  }
};
