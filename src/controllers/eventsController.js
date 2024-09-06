const { Event, EventsType } = require("../models");

const eventsController = {
  async get(req, res) {
    const { id } = req.query;
    const limit = req.query.q ? parseInt(req.query.q, 10) : undefined;
    try {
      let allEvents;
      if (id) {
        allEvents = await Event.findByPk(id, { include: EventsType });
      } else {
        allEvents = await Event.findAll({ limit, include: EventsType, order: [["createdAt", "DESC"]] });
        allEvents = allEvents.map((event) => ({ ...event.get({ plain: true }), type: event?.EventsType.title }));
      }

      return res.json(allEvents);
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  async createOrUpdate(req, res) {
    try {
      const { id, title, desc, img_url, event_type_id } = req.body;
      const eventType = await EventsType.findByPk(event_type_id);
      if (!eventType) {
        return res.status(400).json({ error: "Invalid event type" });
      }
      let event;
      let created = false;
      if (id) {
        // If ID is provided, try to find the event
        event = await Event.findByPk(id);
      }
      if (event) {
        // If event exists, update it
        await event.update({
          title,
          desc,
          img_url,
          event_type_id,
        });
      } else {
        event = await Event.create({
          title,
          desc,
          img_url,
          event_type_id,
        });
        created = true;
      }
      res.status(created ? 201 : 200).json(event);
    } catch (error) {
      console.log(error.sqlMessage);
      res.status(400).json({ error: error.message });
    }
  },
  async delete(req, res) {
    try {
      const { id } = req.body;
      await Event.destroy({
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
module.exports = eventsController;
