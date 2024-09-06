const { AboutLab } = require("../models");

const aboutLabController = {
  async getAll(req, res) {
    try {
      const aboutLabs = await AboutLab.findAll();
      res.json(aboutLabs[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async createOrUpdate(req, res) {
    try {
      const allowedFields = ["about", "media_gp_url", "mobile", "email", "address"];

      const [instance, created] = await AboutLab.findOrCreate({
        where: {},
        defaults: req.body,
        fields: allowedFields,
      });

      if (!created) {
        await instance.update(req.body);
      }

      res.status(created ? 201 : 200).json(instance);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};
module.exports = aboutLabController;
