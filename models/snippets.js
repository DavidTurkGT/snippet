'use strict';
module.exports = function(sequelize, DataTypes) {
  var Snippets = sequelize.define('Snippets', {
    title: DataTypes.STRING,
    body: DataTypes.TEXT,
    userId: DataTypes.INTEGER
  }, {});

  Snippets.associates = (models) => {
    Snippets.belongsTo(
      models.Users,
      {as: "snippet", foreignKey: "userId"}
    );
    Snippets.hasMany(
      models.Stars,
      {as: "stars", foreignKey: "snippetId"}
    );
    Snippets.hasMany(
      models.Tags,
      {as: "tags", foreignKey: "snippetId"}
    );
  }

  return Snippets;
};
