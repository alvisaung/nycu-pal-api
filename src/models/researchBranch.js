module.exports = (sequelize, DataTypes) => {
  const ResearchBranch = sequelize.define(
    "ResearchBranch",
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
        type: DataTypes.STRING,
        allowNull: false,
      },
      is_img: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    {
      tableName: "research_branches",
      timestamps: false,
    }
  );

  ResearchBranch.associate = (models) => {
    ResearchBranch.belongsTo(models.ResearchTopic, { foreignKey: "topic_id", allowNull: false });
  };

  return ResearchBranch;
};
