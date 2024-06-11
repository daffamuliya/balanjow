import React, { useEffect, useState } from 'react';
import AdminNavbar from '../../components/AdminNavbar';
import Card from 'react-bootstrap/Card';
import Sidebar from '../../components/Sidebar';
import Table from 'react-bootstrap/Table';
import axios from 'axios';
import swal from 'sweetalert';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getMe } from '../../features/authSlice';
import { MDBBtn, MDBRow, MDBContainer, MDBModal, MDBModalDialog, MDBModalContent, MDBModalHeader, MDBModalTitle, MDBModalBody } from 'mdb-react-ui-kit';

const KelolaUser = () => {
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
  const [user, setUser] = useState([]);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      const response = await axios.get(`${url}/daftaruser`);
      setUser(response.data.items);
      console.log(response.data.items);
    } catch (error) {
      console.error('error', error);
    }
  };

  const [UserDetail, setUserDetail] = useState(null);
  const [scrollableModal, setScrollableModal] = useState(false);
  const loadUserDetail = async (id) => {
    try {
      const response = await axios.get(`${url}/daftaruser/${id}`);
      const UserDetailData = Array.isArray(response.data.items) ? response.data.items : [response.data.items];
      setUserDetail(UserDetailData);
      setScrollableModal(true);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteUser = async (id) => {
    try {
      swal({
        title: 'Anda yakin?',
        text: 'Anda tidak akan dapat mengembalikan user ini!',
        icon: 'warning',
        buttons: true,
        dangerMode: true,
      }).then(async (willDelete) => {
        if (willDelete) {
          await axios.delete(`${url}/daftaruser/deleteUser/${id}`);
          getUser();
          swal('User berhasil dihapus!', {
            icon: 'success',
          });
        } else {
          swal('User Anda tidak jadi dihapus!');
        }
      });
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  return (
    <div>
      <AdminNavbar />
      <div className="main">
        <Sidebar />
        <div className="container mt-5">
          <h5 className="title" style={{ color: '#A08336' }}>
            Kelola User
          </h5>
          <Card>
            <Card.Body>
              {' '}
              <Table responsive>
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Nama</th>
                    <th>username</th>
                    <th>Email</th>
                    <th>Tanggal Bergabung</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(user) &&
                    user.map((item) => (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.name}</td>
                        <td>{item.username}</td>
                        <td>{item.email}</td>
                        <td>{item.created_at}</td>
                        <td>
                          <i class="bi bi-trash-fill" onClick={() => deleteUser(item.id)} style={{ color: '#A08336', marginRight: '5px', cursor: 'pointer' }}></i>
                          <i class="bi bi-eye-fill" onClick={() => loadUserDetail(item.id)} style={{ color: '#A08336', marginLeft: '10px', cursor: 'pointer' }}></i>{' '}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </div>
      </div>
      <MDBModal open={scrollableModal} setOpen={setScrollableModal} tabIndex="-1">
        <MDBModalDialog centered scrollable>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>User Details</MDBModalTitle>
              <MDBBtn className="btn-close" color="none" onClick={() => setScrollableModal(!scrollableModal)}></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <MDBRow className="justify-content-center">
                <section className="isiblog">
                  {Array.isArray(UserDetail) &&
                    UserDetail.map((detail) => (
                      <MDBContainer key={detail.id}>
                        <div className="row gx-4 gx-lg-5 h-100 align-items-center justify-content">
                          <div className="col-lg-12 ">
                            <p style={{ color: 'black', marginTop: '5px', textAlign: 'justify', fontSize: '16px' }}>
                              Nama Lengkap : <br /> {detail.name}
                            </p>{' '}
                            <hr />
                            <p style={{ color: 'black', marginTop: '5px', textAlign: 'justify', fontSize: '16px' }}>
                              Username : <br /> {detail.username}
                            </p>{' '}
                            <hr />
                            <p style={{ color: 'black', marginTop: '5px', textAlign: 'justify', fontSize: '16px' }}>
                              Email : <br /> {detail.email}
                            </p>{' '}
                            <hr />
                            <p style={{ color: 'black', marginTop: '5px', textAlign: 'justify', fontSize: '16px' }}>
                              No Handphone : <br /> {detail.no_telp}
                            </p>{' '}
                            <hr />
                            <p style={{ color: 'black', marginTop: '5px', textAlign: 'justify', fontSize: '16px' }}>
                              Alamat : <br /> {detail.alamat}
                            </p>{' '}
                            <hr />
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

export default KelolaUser;
