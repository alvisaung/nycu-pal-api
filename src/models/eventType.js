module.exports = (sequelize, DataTypes) => {
  const EventsType = sequelize.define(
    "EventsType",
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },

      title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      tableName: "events_type",
      timestamps: false,
    }
  );

  return EventsType;
};
