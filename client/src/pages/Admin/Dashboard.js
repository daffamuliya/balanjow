import React, { useEffect, useState } from 'react';
import AdminNavbar from '../../components/AdminNavbar';
import Card from 'react-bootstrap/Card';
import Sidebar from '../../components/Sidebar';
import CardBody from 'react-bootstrap/esm/CardBody';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { MDBBtn, MDBRow, MDBCol, MDBContainer, MDBModal, MDBModalDialog, MDBModalContent, MDBModalHeader, MDBModalTitle, MDBModalBody } from 'mdb-react-ui-kit';
import { getMe } from '../../features/authSlice';

const Dashboard = () => {
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
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalBlog, setTotalBlog] = useState(0);
  const [totalForum, setTotalForum] = useState(0);
  const [totalBanner, setTotalBanner] = useState(0);
  const [banner, setBanner] = useState([]);

  useEffect(() => {
    getTotalUsers();
    getTotalBlog();
    getTotalForum();
    getBanner();
    getTotalBanner();
  }, []);
  const getBanner = async () => {
    try {
      const response = await axios.get(`${url}/marketplace/banner/activeBanner`);
      setBanner(response.data.items);
    } catch (error) {
      console.error('Error fetching banner:', error);
    }
  };

  const [BannerDetail, setBannerDetail] = useState(null);
  const [scrollableModal, setScrollableModal] = useState(false);
  const loadBannerDetail = async (id) => {
    try {
      const response = await axios.get(`${url}/marketplace/banner/${id}`);
      const BannerDetailData = Array.isArray(response.data.items) ? response.data.items : [response.data.items];
      setBannerDetail(BannerDetailData);
      setScrollableModal(true);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteActiveBanner = async (id) => {
    try {
      const response = await axios.delete(`${url}/marketplace/banner/deleteActiveBanner/${id}`);
      console.log(response.data);
      getBanner();
    } catch (error) {
      console.error('Error rejecting banner:', error);
    }
  };

  const getTotalBanner = async () => {
    try {
      const response = await axios.get(`${url}/marketplace/banner/total`);
      setTotalBanner(response.data.totalBanner);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const getTotalUsers = async () => {
    try {
      const response = await axios.get(`${url}/daftaruser/user/total`);
      setTotalUsers(response.data.totalUsers);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const getTotalBlog = async () => {
    try {
      const response = await axios.get(`${url}/blog/totalblog`);
      setTotalBlog(response.data.totalBlog);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const getTotalForum = async () => {
    try {
      const response = await axios.get(`${url}/forum/total/totalforum`);
      setTotalForum(response.data.totalForum);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  return (
    <div>
      <AdminNavbar />
      <div className="main">
        <Sidebar />
        <div className="container mt-5">
          <MDBRow>
            <MDBRow className="mt-3 justify-content-center">
              <MDBCol md={3} xs={2} className="ms-auto mb-1">
                <Card>
                  <CardBody>
                    <h5>Total User</h5>
                    <h3>{totalUsers}</h3>
                  </CardBody>
                </Card>
              </MDBCol>
              <MDBCol md={3} xs={2} className="ms-auto mb-1">
                <Card>
                  <CardBody>
                    <h5>Total Active Banner</h5>
                    <h3>{totalBanner}</h3>
                  </CardBody>
                </Card>
              </MDBCol>
              <MDBCol md={3} xs={2} className="ms-auto mb-1">
                <Card>
                  <CardBody>
                    <h5>Total Blog</h5>
                    <h3>{totalBlog}</h3>
                  </CardBody>
                </Card>
              </MDBCol>
              <MDBCol md={3} xs={2} className="ms-auto mb-1">
                <Card>
                  <CardBody>
                    <h5>Total Forum</h5>
                    <h3>{totalForum}</h3>
                  </CardBody>
                </Card>
              </MDBCol>
            </MDBRow>
          </MDBRow>
          <MDBRow className="mt-5">
            <h5 style={{ color: '#A08336' }}>Active Banner</h5>
            <MDBRow className="mt-3 justify-content-center">
              <MDBCol md={12} xs={2} className="ms-auto">
                <Card>
                  <CardBody>
                    {' '}
                    <div class="row">
                      <Table responsive>
                        <thead>
                          <tr>
                            <th>Banner ID</th>
                            <th>Nama User</th>
                            <th>Nama Banner</th>
                            <th>Gambar</th>
                            <th>Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Array.isArray(banner) &&
                            banner.map((item) => (
                              <tr>
                                <td>{item.id}</td>
                                <td>{item.user.name}</td>
                                <td>{item.nama_banner}</td>
                                <td>
                                  <img src={item.gambar} alt="" style={{ width: '100px', height: '100px' }} />
                                </td>
                                <td>
                                  <button className="btn btn-success" size="sm" style={{ fontSize: '13px', maxWidth: '120px', maxHeight: '30px', border: 'black', marginRight: '5px' }}>
                                    {item.status}
                                  </button>
                                </td>
                                <td>
                                  <i class="bi bi-trash-fill" onClick={() => deleteActiveBanner(item.id)} style={{ color: '#A08336', paddingRight: '10px', cursor: 'pointer' }}></i>
                                  <i class="bi bi-eye-fill" onClick={() => loadBannerDetail(item.id)} style={{ color: '#A08336', paddingRight: '10px', cursor: 'pointer' }}></i>{' '}
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
              <MDBModalTitle>Banner Details</MDBModalTitle>
              <MDBBtn className="btn-close" color="none" onClick={() => setScrollableModal(!scrollableModal)}></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <MDBRow className="justify-content-center">
                <section className="isiblog">
                  {Array.isArray(BannerDetail) &&
                    BannerDetail.map((detail) => (
                      <MDBContainer key={detail.id}>
                        <div className="row gx-4 gx-lg-5 h-100 align-items-center justify-content-center mt-5 text-center">
                          <div className="col-lg-12 ">
                            <img src={detail.gambar} className="hover-shadow" alt="" style={{ width: '100%' }} />
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

export default Dashboard;
