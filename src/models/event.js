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
        get() {
          const rawValue = this.getDataValue("img_url");
          // Parse JSON string if MariaDB stores it as a string
          return typeof rawValue === "string" ? JSON.parse(rawValue) : rawValue;
        },
        set(value) {
          // Ensure value is stored as a JSON string
          this.setDataValue("img_url", value);
        },
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
