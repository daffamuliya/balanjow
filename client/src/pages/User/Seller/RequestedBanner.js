import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import SellerNavbar from '../../../components/SellerNavbar';
import SidebarSeller from '../../../components/SidebarSeller';
import { MDBCol } from 'mdb-react-ui-kit';
import Table from 'react-bootstrap/Table';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getMe } from '../../../features/authSlice';

const RequestedBanner = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError } = useSelector((state) => state.auth);

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
      const response = await axios.get('http://${url}/marketplace/banner/requestedBanner');
      setBanner(response.data.items);
    } catch (error) {
      console.error('Error fetching banner:', error);
    }
  };

  const deleteRequestedBanner = async (id) => {
    try {
      const response = await axios.delete(`http://${url}/marketplace/banner/deleteRequestedBanner/${id}`);
      console.log(response.data);
      getBanner();
    } catch (error) {
      console.error('Error rejecting banner:', error);
    }
  };
  return (
    <div>
      <SellerNavbar />
      <div className="main">
        <SidebarSeller />
        <div className="container mt-5">
          <h5 className="title" style={{ color: '#A08336' }}>
            Requested Banner
          </h5>
          <MDBCol size="2" className="mt-3 mb-3">
            <a href="upload-banner" className="btn btn-primary" style={{ backgroundColor: '#A08336', fontSize: '16px', maxWidth: '158px', maxHeight: '42px', textAlign: 'center', border: 'black', display: 'inline-block' }}>
              Tambah
            </a>
          </MDBCol>
          <Card>
            <Card.Body>
              {' '}
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
                    <th>Aksi</th>
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
                        <td>
                          <i class="bi bi-trash-fill" onClick={() => deleteRequestedBanner(item.id)} style={{ color: '#A08336', paddingRight: '10px', cursor: 'pointer' }}></i>
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
