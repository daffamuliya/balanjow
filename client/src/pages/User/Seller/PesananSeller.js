import React, { useState, useEffect } from 'react';
import SellerNavbar from '../../../components/SellerNavbar';
import Card from 'react-bootstrap/Card';
import SidebarSeller from '../../../components/SidebarSeller';
import { MDBBtn, MDBRow, MDBCol, MDBContainer, MDBModal, MDBModalDialog, MDBModalContent, MDBModalHeader, MDBModalTitle, MDBModalBody } from 'mdb-react-ui-kit';
import Table from 'react-bootstrap/Table';
import axios from 'axios';
import CardBody from 'react-bootstrap/esm/CardBody';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getMe } from '../../../features/authSlice';

const PesananSeller = () => {
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
  useEffect(() => {
    getTransaksi();
  }, []);

  const getTransaksi = async () => {
    try {
      const response = await axios.get(`http://${url}/marketplace/order/transaksi`);
      setTransaksi(response.data.data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  const [TransaksiDetail, setTransaksiDetail] = useState(null);
  const [scrollableModal, setScrollableModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');

  const loadTransaksiDetail = async (id) => {
    try {
      const response = await axios.get(`http://${url}/marketplace/transaksi/${id}`);
      const TransaksiDetailData = Array.isArray(response.data.data) ? response.data.data : [response.data.data];
      setTransaksiDetail(TransaksiDetailData);
      setScrollableModal(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const handleSaveStatus = async (id) => {
    try {
      await axios.put(`http://${url}/marketplace/transaksi/${id}`, {
        status: selectedStatus,
      });
      setScrollableModal(false);
      getTransaksi();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div>
      <SellerNavbar />
      <div className="main">
        <SidebarSeller />
        <div className="container mt-5">
          <MDBRow className="mt-5">
            <h5 style={{ color: '#A08336' }}>Pesanan Masuk</h5>
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
                            <th>Tanggal Pemesanan</th>
                            <th>Produk</th>
                            <th>Harga</th>
                            <th>Telp Pembeli</th>
                            <th>Alamat Pembeli</th>
                            <th>Status Pembayaran</th>
                            <th>Status Pengiriman</th>
                            <th>Aksi</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Array.isArray(transaksi) &&
                            transaksi
                              .sort((a, b) => b.id - a.id)
                              .map((item) => (
                                <tr key={item.id}>
                                  <td>{item.id}</td>
                                  <td>{formatDate(item.transaksi.tanggal_pesan)}</td>
                                  <td>{item.nama_produk}</td>
                                  <td>{item.harga}</td>
                                  <td>{item.transaksi.telp_pembeli}</td>
                                  <td>{item.transaksi.alamat_pembeli}</td>
                                  <td>{item.transaksi.status_pembayaran}</td>
                                  <td>{item.status}</td>
                                  <td>
                                    <i class="bi bi-pencil-square" onClick={() => loadTransaksiDetail(item.id)} style={{ color: '#A08336', paddingRight: '10px', cursor: 'pointer' }}></i>
                                  </td>
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
      <MDBModal open={scrollableModal} setOpen={setScrollableModal} tabIndex="-1">
        <MDBModalDialog centered scrollable>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Status Transaksi</MDBModalTitle>
              <MDBBtn className="btn-close" color="none" onClick={() => setScrollableModal(!scrollableModal)}></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <MDBRow className="justify-content-center">
                <section className="isiblog">
                  {Array.isArray(TransaksiDetail) &&
                    TransaksiDetail.map((detail) => (
                      <MDBContainer key={detail.id}>
                        <div className="row gx-4 gx-lg-5 h-100 align-items-center justify-content-center text-center">
                          <div className="col-lg-12 ">
                            <p style={{ color: 'black', marginTop: '5px', textAlign: 'justify', fontSize: '16px' }}>
                              Nama Produk : <br /> {detail.nama_produk}
                            </p>{' '}
                            <hr />
                            <p style={{ color: 'black', marginTop: '5px', textAlign: 'justify', fontSize: '16px' }}>
                              Jumlah : <br /> {detail.jumlah}
                            </p>{' '}
                            <hr />
                            <p style={{ color: 'black', marginTop: '5px', textAlign: 'justify', fontSize: '16px' }}>
                              Total Transaksi : <br /> {detail.harga}
                            </p>{' '}
                            <hr />
                            <p style={{ color: 'black', marginTop: '5px', textAlign: 'justify', fontSize: '16px' }}>
                              Keterangan : <br /> {detail.keterangan}
                            </p>{' '}
                            <hr />
                            <p style={{ color: 'black', marginTop: '5px', textAlign: 'justify', fontSize: '16px' }}>Status :</p>
                            <select className="form-select" aria-label="Default select example" onChange={handleStatusChange} value={selectedStatus}>
                              <option value="" disabled selected>
                                {detail.status}
                              </option>
                              <option value="Dalam Pengiriman">Dalam Pengiriman</option>
                              <option value="Pesanan diterima pembeli">Pesanan diterima pembeli</option>
                              <option value="Pesanan Ditolak">Pesanan Ditolak</option>
                            </select>
                            <button className="btn btn-primary" style={{ backgroundColor: '#A08336', fontSize: '16px', textAlign: 'center', border: 'black', width: '100%', marginTop: '20px' }} onClick={() => handleSaveStatus(detail.id)}>
                              Simpan perubahan status
                            </button>
                          </div>
                        </div>
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

export default PesananSeller;
