import React, { useState, useEffect } from 'react';
import SellerNavbar from '../../../components/SellerNavbar';
import Card from 'react-bootstrap/Card';
import SidebarSeller from '../../../components/SidebarSeller';
import { MDBRow, MDBCol } from 'mdb-react-ui-kit';
import Table from 'react-bootstrap/Table';
import CardBody from 'react-bootstrap/esm/CardBody';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getMe } from '../../../features/authSlice';

const DashboardSeller = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError } = useSelector((state) => state.auth);

  const [omzet, setOmzet] = useState(0);
  const [feePlatform, setFeePlatform] = useState(0);
  const [totalOrder, setTotalOrder] = useState(0);

  useEffect(() => {
    dispatch(getMe());
    getOmzet();
    getTotalOrder();
    getFeePlatform();
  }, [dispatch]);

  const getOmzet = async () => {
    try {
      const response = await axios.get('http://${url}/marketplace/omzet/transaksi');
      const omzetData = response.data.omzet;
      setOmzet(omzetData);
    } catch (error) {
      console.error('Error fetching omzet:', error);
    }
  };

  const getFeePlatform = async () => {
    try {
      const response = await axios.get('http://${url}/marketplace/fee/transaksi');
      const fee = response.data.fee;
      setFeePlatform(fee);
    } catch (error) {
      console.error('Error fetching omzet:', error);
    }
  };

  const getTotalOrder = async () => {
    try {
      const response = await axios.get('http://${url}/marketplace/order/total');
      setTotalOrder(response.data.totalOrder);
    } catch (error) {
      console.error('Error:', error);
    }
  };

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
      const response = await axios.get('http://${url}/marketplace/order/transaksi');
      setTransaksi(response.data.data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };
  return (
    <div>
      <SellerNavbar />
      <div className="main">
        <SidebarSeller />
        <div className="container mt-5">
          <MDBRow>
            <MDBRow className="mt-3 justify-content-center">
              <MDBCol md={4} xs={2} className="ms-auto mt-1">
                <Card>
                  <CardBody>
                    <h5>Total Revenue</h5>
                    <h3>Rp{omzet.toLocaleString()}</h3>
                  </CardBody>
                </Card>
              </MDBCol>
              <MDBCol md={4} xs={2} className="ms-auto mt-1">
                <Card>
                  <CardBody>
                    <h5>Fee Platform</h5>
                    <h3>Rp{feePlatform.toLocaleString()}</h3>
                  </CardBody>
                </Card>
              </MDBCol>
              <MDBCol md={4} xs={2} className="ms-auto mt-1">
                <Card>
                  <CardBody>
                    <h5>Total Order</h5>
                    <h3>{totalOrder}</h3>
                  </CardBody>
                </Card>
              </MDBCol>
            </MDBRow>
          </MDBRow>
          <MDBRow className="mt-5">
            <h5 style={{ color: '#A08336' }}>Riwayat Pesanan Masuk</h5>
            <MDBRow className="mt-3 justify-content-center">
              <MDBCol md={12} xs={2} className="ms-auto">
                <Card>
                  <CardBody>
                    {' '}
                    <div class="row">
                      <Table responsive>
                        <thead>
                          <tr>
                            <th>Order ID</th>
                            <th>Produk</th>
                            <th>Harga</th>
                            <th>Telp Pembeli</th>
                            <th>Alamat Pembeli</th>
                            <th>Status Pembayaran</th>
                            <th>Status Pengiriman</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Array.isArray(transaksi) &&
                            transaksi.map((item) => (
                              <tr>
                                <td>{item.id}</td>
                                <td>{item.nama_produk}</td>
                                <td>{item.harga}</td>
                                <td>{item.transaksi.telp_pembeli}</td>
                                <td>{item.transaksi.alamat_pembeli}</td>
                                <td>{item.transaksi.status_pembayaran}</td>
                                <td>{item.status}</td>
                              </tr>
                            ))}
                        </tbody>
                      </Table>
                    </div>
                  </CardBody>
                </Card>
              </MDBCol>
            </MDBRow>
          </MDBRow>
        </div>
      </div>
    </div>
  );
};

export default DashboardSeller;
