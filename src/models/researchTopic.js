module.exports = (sequelize, DataTypes) => {
  const ResearchTopic = sequelize.define(
    "ResearchTopic",
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      media_url: {
        type: DataTypes.JSON,
        allowNull: true,
        get() {
          const rawValue = this.getDataValue("media_url");
          // Parse JSON string if MariaDB stores it as a string
          return typeof rawValue === "string" ? JSON.parse(rawValue) : rawValue;
        },
        set(value) {
          // Ensure value is stored as a JSON string
          this.setDataValue("media_url", JSON.stringify(value));
        },
      },
      is_img: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      youtube_embed_url: DataTypes.TEXT,
    },
    {
      tableName: "research_topics",
      timestamps: false,
    }
  );
  ResearchTopic.associate = (models) => {
    ResearchTopic.hasMany(models.ResearchBranch, { onDelete: "CASCADE" });
  };
  return ResearchTopic;
};
