const { Member, Sequelize, MemberType } = require("../models");
const memberController = {
  async swapMemberIds(req, res) {
    const { member_id, swipe_type } = req.body;

    try {
      // Step 1: Find the current member by ID
      const currentMember = await Member.findByPk(member_id);

      if (!currentMember) {
        return res.status(404).json({ error: "Member not found" });
      }

      const role_id = currentMember.MemberTypeId;

      // Step 2: Find the adjacent member based on the swipe direction and role
      let adjacentMember;

      if (swipe_type === "left") {
        // Find the member with the same role, ordered by id in descending order, that comes before the current member
        adjacentMember = await Member.findOne({
          where: {
            MemberTypeId: role_id,
            id: { [Sequelize.Op.lt]: currentMember.id }, // Less than the current member's ID
          },
          order: [["id", "DESC"]], // Get the closest one before the current member
        });
      } else if (swipe_type === "right") {
        // Find the member with the same role, ordered by id in ascending order, that comes after the current member
        adjacentMember = await Member.findOne({
          where: {
            MemberTypeId: role_id,
            id: { [Sequelize.Op.gt]: currentMember.id }, // Greater than the current member's ID
          },
          order: [["id", "ASC"]], // Get the closest one after the current member
        });
      }

      if (!adjacentMember) {
        return res.status(400).json({ error: `No adjacent member found to swap ${swipe_type}.` });
      }

      // Step 3: Swap the properties between the current member and adjacent member (excluding id)
      const tempMember = { ...currentMember.get() };
      await currentMember.update({ ...adjacentMember.get(), id: currentMember.id });
      await adjacentMember.update({ ...tempMember, id: adjacentMember.id });

      res.status(200).json({ message: "Members swapped successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred while swapping members" });
    }
  },
  async get(req, res) {
    try {
      const members = await Member.findAll({
        include: MemberType,
      });

      const memberGroups = members.reduce((acc, member) => {
        const group = acc.find((g) => g.MemberTypeId === member.MemberTypeId);
        if (group) {
          group.members_list.push(member);
        } else {
          acc.push({ MemberTypeId: member.MemberTypeId, role: member.MemberType ? member.MemberType.title : null, members_list: [member] });
        }
        return acc;
      }, []);
      res.json(memberGroups);
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
  },
  async createOrUpdate(req, res) {
    try {
      const { id, name, research_dir, email, img_url, experiences, phone, role_id, graduate_paper, is_graduated } = req.body;
      let member;
      let created = false;

      if (id) {
        member = await Member.findByPk(id);
      }
      const data = {
        name: name,
        graduate_paper: graduate_paper,
        research_dir: research_dir,
        email: email,
        img_url: img_url,
        experiences: experiences,
        phone: phone,
        is_graduated: is_graduated,
        MemberTypeId: role_id,
      };
      if (member) {
        await member.update(data);
      } else {
        member = await Member.create(data);
        created = true;
      }

      res.status(created ? 201 : 200).json(member);
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
  },
  async delete(req, res) {
    const { id } = req.body;
    if (!id) return res.status(500).json({ err: "Need id" });
    try {
      await Member.destroy({
        where: {
          id: id,
        },
      });
      res.json({ msg: "Success" });
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
  },
};
module.exports = memberController;
