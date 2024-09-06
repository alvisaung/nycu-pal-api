const { Member } = require("../models");
const memberController = {
  async get(req, res) {
    try {
      const members = await Member.findAll();
      const memberGroups = members.reduce((acc, member) => {
        const group = acc.find((g) => g.role === member.role);
        if (group) {
          group.members_list.push(member);
        } else {
          acc.push({ role: member.role, members_list: [member] });
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
      const { id, name, research_dir, email, img_url, experiences, phone, role } = req.body;
      let member;
      let created = false;

      if (id) {
        member = await Member.findByPk(id);
      }
      const data = {
        name: name,
        research_dir: research_dir,
        email: email,
        img_url: img_url,
        experiences: experiences,
        phone: phone,
        role: role,
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
