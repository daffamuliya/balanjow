import React, { useState, useEffect } from 'react';
import AdminNavbar from '../../components/AdminNavbar';
import Card from 'react-bootstrap/Card';
import Sidebar from '../../components/Sidebar';
import Table from 'react-bootstrap/Table';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getMe } from '../../features/authSlice';

const KelolaEcommerce = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError } = useSelector((state) => state.auth);
  const url = process.env.url;

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      navigate('/login');
    }
  }, [isError, navigate]);

  const [transaksi, setTransaksi] = useState([]);

  useEffect(() => {
    getTransaksi();
  }, []);

  const getTransaksi = async () => {
    try {
      const response = await axios.get(`${url}/marketplace/transaksi/all`);
      const formattedTransaksi = response.data.data.map((item) => {
        const tanggalPesan = new Date(item.tanggal_pesan);
        const options = {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          timeZone: 'Asia/Jakarta',
        };
        const tanggalPesanNormal = tanggalPesan.toLocaleDateString('id-ID', options);
        return { ...item, tanggalPesanNormal };
      });
      setTransaksi(formattedTransaksi);
    } catch (error) {
      console.error('Error fetching transaksi:', error);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`${url}/marketplace/statusTransaksi/${id}`, { status: newStatus });
      setTransaksi(transaksi.map((item) => (item.id === id ? { ...item, status_pembayaran: newStatus } : item)));
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <div>
      <AdminNavbar />
      <div className="main">
        <Sidebar />
        <div className="container mt-5 ">
          <h5 className="title" style={{ color: '#A08336' }}>
            Transaction History
          </h5>
          <Card>
            <Card.Body>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Transaction ID</th>
                    <th>Date</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Bukti Pembayaran</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(transaksi) &&
                    transaksi
                      .sort((a, b) => new Date(b.tanggal_pesan) - new Date(a.tanggal_pesan)) // Urutkan berdasarkan tanggal pesan, dari yang terbaru ke yang terlama
                      .map((item) => (
                        <tr key={item.id}>
                          <td>{item.id}</td>
                          <td>{item.tanggalPesanNormal}</td>
                          <td>{item.user.name}</td>
                          <td>Rp {item.total}</td>
                          <td>{item.payment}</td>
                          <td>
                            <select className="form-select" aria-label="Default select example" onChange={(e) => handleStatusChange(item.id, e.target.value)}>
                              <option value="" disabled selected>
                                {item.status_pembayaran}
                              </option>
                              <option value="Pembayaran Terverifikasi">Pembayaran Terverifikasi</option>
                              <option value="Pembayaran Gagal">Pembayaran Gagal</option>
                            </select>
                          </td>
                          <td>
                            <a href={item.bukti_transfer} target="_blank" rel="noopener noreferrer">
                              Lihat Bukti Transfer
                            </a>
                          </td>
                        </tr>
                      ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default KelolaEcommerce;
