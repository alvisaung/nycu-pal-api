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
