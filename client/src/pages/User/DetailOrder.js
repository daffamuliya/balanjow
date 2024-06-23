import React, { useEffect, useState } from 'react';
import NormalNavbar from '../../components/NormalNavbar';
import Footer from '../../components/Footer';
import axios from 'axios';
import swal from 'sweetalert';
import { useSelector, useDispatch } from 'react-redux';
import { getMe } from '../../features/authSlice';
import { MDBContainer, MDBRow, MDBCol, MDBCardBody, MDBCard, MDBCardTitle, MDBCardSubTitle, MDBCardText } from 'mdb-react-ui-kit';
import { Alert } from 'react-bootstrap';

const DetailOrder = () => {
  const url = process.env.REACT_APP_BASE_URL;
  const [orderDetail, setOrderDetail] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const [totalBayar, setTotalBayar] = useState(0);
  const [isAlamatComplete, setIsAlamatComplete] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    fetchOrderDetail();
  }, []);

  const fetchOrderDetail = async () => {
    try {
      const response = await axios.get(`http://${url}/marketplace/order/getMyOrder`);
      console.log(response);
      if (response.data.data) {
        setOrderDetail(response.data.data);
        const totalBayar = response.data.data.reduce((acc, item) => acc + item.total, 0);
        setTotalBayar(totalBayar);
        if (user && user.alamat && user.alamat !== 'Alamat belum dilengkapi') {
          setIsAlamatComplete(true);
        } else {
          setIsAlamatComplete(false);
        }
      } else {
        console.error('Data detail pemesanan tidak ditemukan');
      }
    } catch (error) {
      console.error('Terjadi kesalahan saat mengambil data detail pemesanan:', error);
    }
  };

  const deleteProduk = async (id) => {
    try {
      swal({
        title: 'Anda yakin?',
        text: 'Anda tidak akan dapat mengembalikan produk ini!',
        icon: 'warning',
        buttons: true,
        dangerMode: true,
      }).then(async (willDelete) => {
        if (willDelete) {
          await axios.delete(`http://${url}/marketplace/deleteOrderDetail/${id}`);
          fetchOrderDetail();
          swal('Produk berhasil dihapus!', {
            icon: 'success',
          });
        } else {
          swal('Produk Anda tidak jadi dihapus!');
        }
      });
    } catch (error) {
      console.error('Error deleting produk:', error);
    }
  };
  return (
    <div>
      <NormalNavbar />
      <MDBContainer>
        <MDBRow className="mt-3 justify-content-center">
          <MDBCol size="12">
            <h2 className="text-center mb-3 mt-3" style={{ fontWeight: 'bold', color: '#A08336' }}>
              Detail Pemesanan
            </h2>
            {!isAlamatComplete && user && user.alamat && user.alamat === 'Alamat belum dilengkapi' && (
              <Alert variant="danger">
                Alamat Anda belum dilengkapi. Silakan <Alert.Link href="/user/akun">lengkapi alamat Anda</Alert.Link>.
              </Alert>
            )}
            <MDBCard className="mb-3">
              <MDBCardBody>
                <MDBCardBody>
                  <MDBCardTitle>{user && user.name}</MDBCardTitle>
                  <MDBCardSubTitle>{user && user.email}</MDBCardSubTitle>
                  <MDBCardText>{user && user.no_telp}</MDBCardText>
                  <MDBCardText>{user && user.alamat}</MDBCardText>
                </MDBCardBody>
              </MDBCardBody>
            </MDBCard>
            {Array.isArray(orderDetail) &&
              orderDetail.map((item) => (
                <MDBCard key={item.id} className="mt-1">
                  <MDBRow className="g-0">
                    <MDBCol size={10}>
                      <div className="d-flex align-items-center">
                        <img src={item.produk.gambar} alt="" style={{ width: '100px', height: '100px' }} />
                        <div className="ms-3">
                          <p className="fw-bold mb-1">{item.produk.nama}</p>
                          <p className="text-muted mb-0">Harga : {item.total}</p>
                          <p className="text-muted mb-0">{item.produk.deskripsi}</p>
                        </div>
                      </div>
                    </MDBCol>
                    <MDBCol size={2}>
                      <div className="d-flex align-items-center">
                        <div className="ms-3 mt-5">
                          <i class="bi bi-trash-fill" onClick={() => deleteProduk(item.id)} style={{ color: '#A08336' }}></i>
                        </div>
                      </div>
                    </MDBCol>
                  </MDBRow>
                </MDBCard>
              ))}

            <p className="text-center mt-3">Total Bayar</p>
            <h2 className="text-center">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(totalBayar)}</h2>
            <hr className="my-4" />
          </MDBCol>
          <MDBCol size="12" className="text-center">
            <a href="bukti-bayar" className="btn btn-primary" style={{ backgroundColor: '#A08336', fontSize: '16px', maxWidth: '250px', maxHeight: '42px', textAlign: 'center', border: 'black', display: 'inline-block' }}>
              Proses ke Pembayaran
            </a>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
      <br></br>
      <br></br>
      <br></br>
      <Footer />
    </div>
  );
};

export default DetailOrder;
