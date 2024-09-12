const { PublicationType, Publication } = require("../models");
const { fn, col, literal } = require("sequelize");

const paperTypeController = {
  async get(req, res) {
    try {
      let paperType = await PublicationType.findAll({
        include: {
          model: Publication,
          attributes: ["publish_yr"],
          duplicating: false,
        },
        order: [
          [Publication, "publish_yr", "DESC"],
          ["id", "ASC"],
        ],
      });
      paperType = paperType.map((group) => group.toJSON());

      paperType.forEach((group) => {
        const uniqueYears = [...new Set(group.Publications.map((pub) => pub.publish_yr))];
        // Replace Publications with the filtered and sorted years
        group.Publications = uniqueYears;
      });
      return res.json(paperType);
    } catch (err) {
      return res.status(500).json({ err: err.message });
    }
  },

  async createOrUpdate(req, res) {
    try {
      const { id } = req.body;
      const [instance, created] = await PublicationType.findOrCreate({
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
      const paperCount = await Publication.count({ where: { PublicationTypeId: id } });

      if (paperCount > 0) {
        return res.status(400).json({
          error: "Cannot delete this event type. It is still in use by existing events.",
          paperCount: paperCount,
        });
      }
      await PublicationType.destroy({
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
