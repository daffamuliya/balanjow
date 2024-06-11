const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/conn');
const transaksi = require('./transaksi');
const produk = require('./produk');

const DetailTransaksi = sequelize.define(
  'detail_transaksi',
  {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    id_transaksi: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: transaksi,
        key: 'id',
      },
    },
    id_produk: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: produk,
        key: 'id',
      },
    },
    id_penjual: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    telp_penjual: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nama_produk: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    harga: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    keterangan: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    jumlah: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    status: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: 'detail_transaksi',
    timestamps: false,
  }
);

DetailTransaksi.belongsTo(transaksi, { foreignKey: 'id_transaksi' });
DetailTransaksi.belongsTo(produk, { foreignKey: 'id_produk' });

module.exports = DetailTransaksi;
