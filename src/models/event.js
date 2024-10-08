module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define(
    "Event",
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      img_url: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      desc: DataTypes.TEXT,
      youtube_embed_url: DataTypes.TEXT,
      event_date: { type: DataTypes.DATE, allowNull: true },
    },
    {
      tableName: "events",
      timestamps: true,
    }
  );

  Event.associate = (models) => {
    Event.belongsTo(models.EventsType, { foreignKey: "event_type_id" });
  };

  return Event;
};
