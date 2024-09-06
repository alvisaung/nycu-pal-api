const { Research } = require("../models");

module.exports = {
  async get(req, res) {
    try {
      const research = await Research.findAll();
      res.json(research);
    } catch (err) {
      res.status(500).json(err.message);
    }
  },
  async createOrUpdate(req, res) {
    try {
      const { id, statement, media_url, is_img } = req.body;
      let research;
      if (id) {
        research = await Research.findByPk(id);
      }
      const data = {
        statement: statement,
        media_url: media_url,
        is_img: is_img,
      };
      if (research) {
        await research.update(data);
      } else {
        research = await Research.create(data);
      }
      res.json(research);
    } catch (err) {
      res.status(500).json(err.message);
    }
  },
  async delete(req, res) {},
};
