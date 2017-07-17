'use strict';
module.exports = function(sequelize, DataTypes) {
  var Tags = sequelize.define('Tags', {
    word: DataTypes.STRING,
    snippetId: DataTypes.INTEGER
  }, {});

  Tags.associates = (models) => {
    Tags.belongsTo(
      models.Snippets,
      {as: "tag", foreignKey: "snippetId"}
    );
  }

  return Tags;
};
