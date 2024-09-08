const { ResearchTopic } = require("../models");
const { ResearchBranch } = require("../models");

const createOrUpdateBranch = async (body) => {
  const { title, description, media_url, is_img, topic_id, id } = body;

  const data = {
    title: title,
    description: description,
    media_url: media_url,
    is_img: is_img,
    ResearchTopicId: topic_id,
  };
  let branch;
  try {
    // const topic = await ResearchTopic.findByPk(topic_id);
    // if (!topic) {
    //   return res.status(400).json({ error: "Invalid topic id" });
    // }
    if (id) {
      branch = await ResearchBranch.findByPk(id);
    }
    if (branch) {
      await branch.update(data);
    } else {
      branch = await ResearchBranch.create(data);
    }
    // res.json(branch);
    return;
  } catch (err) {
    // res.status(500).json(err.message);
    throw err;
  }
};
module.exports = {
  async get(req, res) {
    try {
      const research = await ResearchTopic.findAll({ include: ResearchBranch });
      res.json(research);
    } catch (err) {
      res.status(500).json(err.message);
    }
  },

  async createOrUpdate(req, res) {
    const { title, description, media_url, is_img, id, ResearchBranches } = req.body;
    const data = {
      title: title,
      description: description,
      media_url: media_url,
      is_img: is_img,
    };
    let topic;

    try {
      if (id) {
        topic = await ResearchTopic.findByPk(id);
      }

      if (topic) {
        await topic.update(data);
      } else {
        topic = await ResearchTopic.create(data);
      }
      let hasErr;
      for (let i = 0; i < ResearchBranches.length; i++) {
        const branch = ResearchBranches[i];
        try {
          await createOrUpdateBranch({ ...branch, topic_id: topic.id });
        } catch (err) {
          hasErr = err.message;
          break;
        }
      }
      if (hasErr) return res.status(500).json(hasErr);

      res.json(topic);
    } catch (err) {
      res.status(500).json(err.message);
    }
  },
  async delete(req, res) {
    try {
      const { id } = req.body;
      await ResearchTopic.destroy({
        where: {
          id: id,
        },
      });
      res.json({ msg: "delete success" });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  async createOrUpdateBranch(body) {
    const { title, description, media_url, is_img, topic_id, id, youtube_embed_url } = body;

    const data = {
      title: title,
      description: description,
      media_url: media_url,
      is_img: is_img,
      ResearchTopicId: topic_id,
      youtube_embed_url: youtube_embed_url,
    };
    let branch;
    try {
      // const topic = await ResearchTopic.findByPk(topic_id);
      // if (!topic) {
      //   return res.status(400).json({ error: "Invalid topic id" });
      // }
      if (id) {
        branch = await ResearchBranch.findByPk(id);
      }
      if (branch) {
        await branch.update(data);
      } else {
        branch = await ResearchBranch.create(data);
      }
      // res.json(branch);
      return;
    } catch (err) {
      // res.status(500).json(err.message);
      throw err;
    }
  },
  async deleteBranch(req, res) {
    try {
      const { id } = req.body;
      await ResearchBranch.destroy({
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
