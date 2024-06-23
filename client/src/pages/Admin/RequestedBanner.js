import React, { useState, useEffect } from 'react';
import AdminNavbar from '../../components/AdminNavbar';
import Card from 'react-bootstrap/Card';
import Sidebar from '../../components/Sidebar';
import Table from 'react-bootstrap/Table';
import axios from 'axios';
import swal from 'sweetalert';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getMe } from '../../features/authSlice';

const RequestedBanner = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError } = useSelector((state) => state.auth);
  const url = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      navigate('/login');
    }
  }, [isError, navigate]);
  const [banner, setBanner] = useState([]);

  useEffect(() => {
    getBanner();
  }, []);

  const getBanner = async () => {
    try {
      const response = await axios.get(`${url}/marketplace/banner/requestedBanner`);
      setBanner(response.data.items);
    } catch (error) {
      console.error('Error fetching banner:', error);
    }
  };

  const approveBanner = async (id) => {
    try {
      const defaultStatus = 'Aktif';
      const selectedBanner = banner.find((item) => item.id === id);

      if (!selectedBanner) {
        console.error('Banner tidak ditemukan');
        swal('Gagal!', 'Banner tidak ditemukan', 'error');
        return;
      }

      const activeBannerData = {
        id_user: selectedBanner.id_user,
        nama_banner: selectedBanner.nama_banner,
        gambar: selectedBanner.gambar,
        status: defaultStatus,
      };

      const response = await axios.post(`${url}/marketplace/banner/addActiveBanner/${id}`, activeBannerData);
      console.log(response);
      swal('Banner Ditambahkan', 'Banner telah ditambahkan sebagai aktif', 'success').then(() => {
        navigate('/admin');
      });
    } catch (error) {
      console.error('Error saat menambahkan banner aktif:', error);
      swal('Gagal!', 'Terjadi kesalahan saat menambahkan banner aktif', 'error');
    }
  };

  const rejectBanner = async (id) => {
    try {
      const response = await axios.delete(`${url}/marketplace/banner/rejectBanner/${id}`);
      console.log(response.data);
      getBanner();
    } catch (error) {
      console.error('Error rejecting banner:', error);
    }
  };

  return (
    <div>
      <AdminNavbar />
      <div className="main">
        <Sidebar />
        <div className="container mt-5">
          <h5 className="title" style={{ color: '#A08336' }}>
            Requested Banner
          </h5>
          <Card>
            <Card.Body>
              <Table responsive>
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Requested by</th>
                    <th>Nama Baner</th>
                    <th>Deskripsi</th>
                    <th>Gambar</th>
                    <th>Bukti Transfer</th>
                    <th>Status</th>
                    <th className="text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(banner) &&
                    banner.map((item) => (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.user.name}</td>
                        <td>{item.nama_banner}</td>
                        <td>{item.deskripsi}</td>
                        <td>
                          <img src={item.gambar} alt="" style={{ width: '100px', height: '100px' }} />
                        </td>
                        <td>
                          <img src={item.bukti_transfer} alt="" style={{ width: '100px', height: '100px' }} />
                        </td>
                        <td>{item.status}</td>
                        <td className="text-center">
                          <button
                            onClick={() => approveBanner(item.id)}
                            className="btn btn-primary"
                            size="sm"
                            style={{ backgroundColor: '#A08336', fontSize: '13px', maxWidth: '120px', maxHeight: '30px', border: 'black', marginRight: '5px' }}
                          >
                            Setujui
                          </button>
                          <button onClick={() => rejectBanner(item.id)} className="btn btn-danger" size="sm" style={{ fontSize: '13px', maxWidth: '120px', maxHeight: '30px', border: 'black' }}>
                            Tolak
                          </button>
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

export default RequestedBanner;
