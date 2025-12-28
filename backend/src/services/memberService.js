import Member from "../models/memberModel.js";
import { Op } from "sequelize";

// Create a new member
export const createMemberService = async (memberData) => {
  try {
    const member = await Member.create(memberData);
    return member;
  } catch (err) {
    throw new Error(err.message || "Failed to create member");
  }
};

// Get all members with pagination, search, and filter by type
export const getAllMembersService = async ({
  page = 1,
  limit = 10,
  search = "",
  memberType = null,
  isActive = null,
}) => {
  try {
    const offset = (page - 1) * limit;

    const where = {};
    
    if (search) {
      where[Op.or] = [
        { fullName: { [Op.like]: `%${search}%` } },
        { role: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];
    }

    if (memberType) {
      where.memberType = memberType;
    }

    if (isActive !== null && isActive !== undefined && isActive !== "") {
      where.isActive = isActive === "true" || isActive === true;
    }

    const totalMembers = await Member.count({ where });

    const members = await Member.findAll({
      where,
      limit: Number(limit),
      offset: Number(offset),
      order: [
        ["displayOrder", "ASC"],
        ["createdAt", "DESC"],
      ],
    });

    return { members, totalMembers };
  } catch (err) {
    throw new Error(err.message || "Failed to fetch members");
  }
};

// Get members for public display (only active, grouped by type)
export const getPublicMembersService = async ({
  page = 1,
  limit = 20,
  memberType = null,
  search = "",
}) => {
  try {
    const offset = (page - 1) * limit;

    const where = { isActive: true };
    
    if (memberType) {
      where.memberType = memberType;
    }

    if (search) {
      where[Op.or] = [
        { fullName: { [Op.like]: `%${search}%` } },
        { role: { [Op.like]: `%${search}%` } },
      ];
    }

    const totalMembers = await Member.count({ where });

    const members = await Member.findAll({
      where,
      limit: Number(limit),
      offset: Number(offset),
      order: [
        ["displayOrder", "ASC"],
        ["createdAt", "DESC"],
      ],
      attributes: ["id", "fullName", "role", "image", "memberType", "displayOrder","description"],
    });

    return { members, totalMembers };
  } catch (err) {
    throw new Error(err.message || "Failed to fetch public members");
  }
};

// Get member by ID
export const getMemberByIdService = async (id) => {
  try {
    const member = await Member.findByPk(id);
    if (!member) throw new Error("Member not found");
    return member;
  } catch (err) {
    throw new Error(err.message || "Failed to fetch member");
  }
};

// Update member
export const updateMemberService = async (id, updateData) => {
  try {
    const member = await Member.findByPk(id);
    if (!member) throw new Error("Member not found");

    await member.update(updateData);
    return member;
  } catch (err) {
    throw new Error(err.message || "Failed to update member");
  }
};

// Delete member
export const deleteMemberService = async (id) => {
  try {
    const member = await Member.findByPk(id);
    if (!member) throw new Error("Member not found");

    await member.destroy();
    return { message: "Member deleted successfully" };
  } catch (err) {
    throw new Error(err.message || "Failed to delete member");
  }
};

// Toggle member active status
export const toggleMemberStatusService = async (id) => {
  try {
    const member = await Member.findByPk(id);
    if (!member) throw new Error("Member not found");

    member.isActive = !member.isActive;
    await member.save();
    return member;
  } catch (err) {
    throw new Error(err.message || "Failed to toggle member status");
  }
};

// Get member counts by type
export const getMemberCountsService = async () => {
  try {
    const executive = await Member.count({ where: { memberType: "executive", isActive: true } });
    const team = await Member.count({ where: { memberType: "team", isActive: true } });
    const member = await Member.count({ where: { memberType: "member", isActive: true } });
    const total = await Member.count({ where: { isActive: true } });

    return { executive, team, member, total };
  } catch (err) {
    throw new Error(err.message || "Failed to get member counts");
  }
};

// Update display order for multiple members (for drag & drop reordering)
export const updateMemberOrdersService = async (orders) => {
  try {
    // orders = [{ id: 1, displayOrder: 0 }, { id: 2, displayOrder: 1 }, ...]
    const promises = orders.map(({ id, displayOrder }) =>
      Member.update({ displayOrder }, { where: { id } })
    );
    await Promise.all(promises);
    return { message: "Orders updated successfully" };
  } catch (err) {
    throw new Error(err.message || "Failed to update member orders");
  }
};
