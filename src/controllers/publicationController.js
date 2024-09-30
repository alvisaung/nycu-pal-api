const { Publication, PublicationType } = require("../models");

const publicationController = {
  async get(req, res) {
    const { q } = req.query;
    const queryOptions = {
      limit: q ? parseInt(q, 10) : undefined,
      include: PublicationType,
      order: [
        ["publish_yr", "DESC"],
        ["createdAt", "DESC"],
      ],
    };

    try {
      let allPub = await Publication.findAll(queryOptions);
      allPub = allPub.map((pub) => ({ ...pub.get({ plain: true }), type: pub?.PublicationType?.title }));

      const pubGp = allPub.reduce((acc, pub) => {
        let typeGroup = acc.find((group) => group.type === pub.PublicationType.title);
        if (!typeGroup) {
          typeGroup = { type: pub.PublicationType.title, publication_list: [] };
          acc.push(typeGroup);
        }

        const year = pub.publish_yr;
        let yearGroup = typeGroup.publication_list.find((yg) => yg.year === year);

        if (!yearGroup) {
          yearGroup = { year: year, publications: [] };
          typeGroup.publication_list.push(yearGroup);
        }
        yearGroup.publications.push(pub);
        return acc;
      }, []);

      return res.json(pubGp);
    } catch (err) {
      return res.status(500).json(err);
    }
  },

  async createOrUpdate(req, res) {
    try {
      const { id, title, author, img_url, PublicationTypeId, publish_yr, conference_name, url } = req.body;

      const paperType = await PublicationType.findByPk(PublicationTypeId);
      if (!paperType) {
        return res.status(400).json({ error: "Invalid event type" });
      }
      let paper;
      let created = false;
      if (id) {
        // If ID is provided, try to find the event
        paper = await Publication.findByPk(id);
      }
      const updateData = {
        title,
        author,
        img_url,
        PublicationTypeId,
        publish_yr,
        conference_name,
        url,
      };
      if (paper) {
        // If event exists, update it
        await paper.update(updateData);
      } else {
        paper = await Publication.create(updateData);
        created = true;
      }
      res.status(created ? 201 : 200).json(paper);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  async delete(req, res) {
    try {
      const { id } = req.body;
      await Publication.destroy({
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
module.exports = publicationController;
