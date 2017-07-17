'use strict';
module.exports = function(sequelize, DataTypes) {
  var Stars = sequelize.define('Stars', {
    userId: DataTypes.INTEGER,
    snippetId: DataTypes.INTEGER
  }, {});

  Stars.associates = (models) => {
    Stars.belongsTo(
      models.Users,
      {as: "star", foreignKey: "userId"}
    );
    Stars.belongsTo(
      models.Snippets,
      {as: "snippet", foreignKey: "snippetId"}
    )
  }

  return Stars;
};
