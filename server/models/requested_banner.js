const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/conn');
const users = require('./users');

const requested_banner = sequelize.define(
  'requested_banner',
  {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },

    id_user: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: users,
        key: 'id',
      },
    },

    nama_banner: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    deskripsi: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    gambar: {
      type: DataTypes.BLOB,
      allowNull: false,
    },

    bukti_transfer: {
      type: DataTypes.BLOB,
      allowNull: false,
    },

    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false, // Nonaktifkan timestamps
  }
);

requested_banner.belongsTo(users, { foreignKey: 'id_user' });

module.exports = requested_banner;
