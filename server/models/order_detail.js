const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/conn');
const users = require('./users');
const produk = require('./produk');

const order_detail = sequelize.define(
  'order_detail',
  {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    id_penjual: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },

    produk_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },

    jumlah: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },

    keterangan: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    alamat: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    telp_pembeli: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    total: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  },
  {
    tableName: 'order_detail',
    timestamps: false,
  }
);

// Menetapkan relasi
order_detail.belongsTo(users, { foreignKey: 'user_id' });
order_detail.belongsTo(produk, { foreignKey: 'produk_id' });

module.exports = order_detail;
