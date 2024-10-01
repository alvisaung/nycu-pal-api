const { MemberType, Member } = require("../models");

const paperTypeController = {
  async get(req, res) {
    try {
      let memberType = await MemberType.findAll();

      return res.json(memberType);
    } catch (err) {
      return res.status(500).json({ err: err.message });
    }
  },

  async createOrUpdate(req, res) {
    try {
      const { id } = req.body;
      const [instance, created] = await MemberType.findOrCreate({
        defaults: req.body,
        where: { id: id ?? null },
      });
      if (!created) {
        await instance.update(req.body);
      }
      res.json(instance);
    } catch (err) {
      res.json({ err: err.errors.length > 0 ? err.errors[0].message : err.message });
    }
  },
  async delete(req, res) {
    try {
      const { id } = req.body;
      const memberCount = await Member.count({ where: { PublicationTypeId: id } });

      if (memberCount > 0) {
        return res.status(400).json({
          error: "Cannot delete this member type. It is still in use by existing member.",
          paperCount: paperCount,
        });
      }
      await MemberType.destroy({
        where: {
          id: id,
        },
      });
      res.json({ msg: "delete success" });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
};
module.exports = paperTypeController;
