const { EventsType, Event } = require("../models");

const eventTypeController = {
  async get(req, res) {
    try {
      const events = await EventsType.findAll();
      return res.json(events);
    } catch (err) {
      return res.status(500).json({ err: err.message });
    }
  },
  async createOrUpdate(req, res) {
    try {
      const { id } = req.body;
      const [instance, created] = await EventsType.findOrCreate({
        defaults: req.body,
        where: { id: id ?? null },
      });
      if (!created) {
        await instance.update(req.body);
      }
      const events = await EventsType.findAll();
      res.json(events);
    } catch (err) {
      res.json({ err: err.errors.length > 0 ? err.errors[0].message : err.message });
    }
  },
  async delete(req, res) {
    try {
      const { id } = req.body;
      console.log("alvis.", id);
      const eventCount = await Event.count({ where: { event_type_id: id } });

      if (eventCount > 0) {
        return res.status(400).json({
          error: "Cannot delete this event type. It is still in use by existing events.",
          eventsUsingType: eventCount,
        });
      }
      const resp = await EventsType.destroy({
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
module.exports = eventTypeController;
