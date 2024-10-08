const { Research } = require("../models");

module.exports = {
  async get(req, res) {
    try {
      const { id } = req.query;
      if (id) {
        const researchTopic = await Research.findOne({ where: { id } });
        if (!researchTopic) {
          return res.status(404).json({ message: "Research topic not found" });
        }
        return res.json(researchTopic);
      }
      const allResearchTopics = await Research.findAll();
      return res.json(allResearchTopics);
    } catch (err) {
      res.status(500).json(err.message);
    }
  },
  async createOrUpdate(req, res) {
    try {
      const { id, statement, media_url, is_img, youtube_embed_url } = req.body;
      let research;
      if (id) {
        research = await Research.findByPk(id);
      }
      const data = {
        statement: statement,
        media_url: media_url,
        is_img: is_img,
        youtube_embed_url: youtube_embed_url,
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
