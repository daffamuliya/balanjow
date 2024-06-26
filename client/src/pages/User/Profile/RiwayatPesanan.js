import React, { useState, useEffect } from 'react';
import { MDBBtn, MDBRow, MDBModal, MDBModalDialog, MDBContainer, MDBModalContent, MDBModalHeader, MDBModalTitle, MDBModalBody } from 'mdb-react-ui-kit';
import UserNavbar from '../../../components/UserNavbar';
import Card from 'react-bootstrap/Card';
import SidebarAkun from '../../../components/SidebarAkun';
import Table from 'react-bootstrap/Table';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getMe } from '../../../features/authSlice';

const RiwayatPesanan = () => {
  const url = process.env.REACT_APP_BASE_URL;
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

  const [transaksi, setTransaksi] = useState([]);
  const [transaksiDetail, setTransaksiDetail] = useState([]);
  const [scrollableModal, setScrollableModal] = useState(false);

  useEffect(() => {
    getTransaksi();
  }, []);

  const getTransaksi = async () => {
    try {
      const response = await axios.get(`${url}/marketplace/pesan/transaksi`);
      const formattedTransaksi = response.data.data.map((item) => {
        const tanggal = new Date(item.tanggal_pesan);
        const options = {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          timeZone: 'Asia/Jakarta',
        };
        const tanggalNormal = tanggal.toLocaleDateString('id-ID', options);
        return { ...item, tanggalNormal };
      });
      setTransaksi(formattedTransaksi);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const loadTransaksiDetail = async (id) => {
    try {
      const response = await axios.get(`${url}/marketplace/detailtransaksi/${id}`);
      const transaksiDetailData = Array.isArray(response.data.data) ? response.data.data : [response.data.data];
      setTransaksiDetail(transaksiDetailData);
      setScrollableModal(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <UserNavbar />
      <div className="main">
        <SidebarAkun />
        <div className="container mt-5">
          <Card>
            <Card.Body>
              <section className="blog">
                <div className="row">
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Tanggal Pemesanan</th>
                        <th>Total Transaksi</th>
                        <th>Payment</th>
                        <th>Alamat Saya</th>
                        <th className="text-center">Lihat Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(transaksi) &&
                        transaksi.map((item) => (
                          <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.tanggalNormal}</td>
                            <td>Rp {item.total}</td>
                            <td>{item.payment}</td>
                            <td>{item.alamat_pembeli}</td>
                            <td className="text-center">
                              <i className="bi bi-eye-fill" style={{ color: '#A08336', cursor: 'pointer' }} onClick={() => loadTransaksiDetail(item.id)}></i>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </Table>
                </div>
              </section>
            </Card.Body>
          </Card>
        </div>
      </div>

      <MDBModal open={scrollableModal} setOpen={setScrollableModal} tabIndex="-1">
        <MDBModalDialog centered scrollable>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Detail Transaksi</MDBModalTitle>
              <MDBBtn className="btn-close" color="none" onClick={() => setScrollableModal(false)}></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <MDBRow className="justify-content-center">
                <section className="isiblog">
                  {Array.isArray(transaksiDetail) &&
                    transaksiDetail.map((detail) => (
                      <MDBContainer key={detail.id}>
                        <Card className="mb-3">
                          <Card.Body>
                            <p style={{ color: 'black', marginTop: '5px', textAlign: 'justify', fontSize: '16px' }}>
                              <strong>Nama Produk:</strong> <br /> {detail.nama_produk}
                            </p>
                            <hr />
                            <p style={{ color: 'black', marginTop: '5px', textAlign: 'justify', fontSize: '16px' }}>
                              <strong>Jumlah Pesanan:</strong> <br /> {detail.jumlah}
                            </p>
                            <hr />
                            <p style={{ color: 'black', marginTop: '5px', textAlign: 'justify', fontSize: '16px' }}>
                              <strong>Total Harga:</strong> <br /> Rp {detail.harga}
                            </p>
                            <hr />
                            <p style={{ color: 'black', marginTop: '5px', textAlign: 'justify', fontSize: '16px' }}>
                              <strong>No HP Penjual:</strong> <br /> {detail.telp_penjual}
                            </p>
                            <hr />
                            <p style={{ color: 'black', marginTop: '5px', textAlign: 'justify', fontSize: '16px' }}>
                              <strong>Status Pengiriman:</strong> <br /> {detail.status}
                            </p>
                            <hr />
                            <p style={{ color: 'black', marginTop: '5px', textAlign: 'justify', fontSize: '16px' }}>
                              <strong>Status Pembayaran:</strong> <br /> {detail.transaksi.status_pembayaran}
                            </p>
                          </Card.Body>
                        </Card>
                      </MDBContainer>
                    ))}
                </section>
              </MDBRow>
            </MDBModalBody>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </div>
  );
};

export default RiwayatPesanan;
