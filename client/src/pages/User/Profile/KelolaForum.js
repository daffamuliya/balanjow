import React, { useState, useEffect } from 'react';
import UserNavbar from '../../../components/UserNavbar';
import Card from 'react-bootstrap/Card';
import { MDBBtn, MDBCol, MDBCard, MDBCardImage, MDBCardText, MDBModal, MDBModalDialog, MDBModalContent, MDBModalHeader, MDBModalTitle, MDBModalBody } from 'mdb-react-ui-kit';
import SidebarAkun from '../../../components/SidebarAkun';
import Table from 'react-bootstrap/Table';
import axios from 'axios';
import swal from 'sweetalert';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getMe } from '../../../features/authSlice';

export const KelolaForumUser = () => {
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
  const [forum, setForum] = useState([]);
  const [scrollableModal, setScrollableModal] = useState(false);
  const [forumDetail, setForumDetail] = useState(null);

  useEffect(() => {
    getForum();
  }, []);

  const getForum = async () => {
    try {
      const response = await axios.get('http://${url}/forum/dashboard');
      const formattedForum = response.data.map((item) => {
        const waktu = new Date(item.created_at);
        const options = {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          timeZone: 'Asia/Jakarta',
        };
        const waktuNormal = waktu.toLocaleDateString('id-ID', options);
        return { ...item, waktuNormal };
      });
      setForum(formattedForum);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  const deleteForum = async (id) => {
    try {
      swal({
        title: 'Anda yakin?',
        text: 'Anda tidak akan dapat mengembalikan forum ini!',
        icon: 'warning',
        buttons: true,
        dangerMode: true,
      }).then(async (willDelete) => {
        if (willDelete) {
          await axios.delete(`http://${url}/forum/deleteForum/${id}`);
          getForum();
          swal('Forum berhasil dihapus!', {
            icon: 'success',
          });
        } else {
          swal('Postingan tidak jadi dihapus!');
        }
      });
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const loadForumDetail = async (id) => {
    try {
      const response = await axios.get(`http://${url}/forum/comment/${id}`);
      const forumDetailData = Array.isArray(response.data.items) ? response.data.items : [response.data.items];
      setForumDetail(forumDetailData);
      console.log('forumDetail:', forumDetailData);
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
                <div class="row">
                  <h2 className="title" style={{ fontWeight: 'bold' }}>
                    Kelola Forum
                  </h2>
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>Content</th>
                        <th>Uploader</th>
                        <th>Tanggal</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(forum) &&
                        forum.map((item) => (
                          <tr key={item.uuid}>
                            <td>{item.konten}</td>
                            <td>{item.user}</td>
                            <td>{item.waktuNormal}</td>
                            <td>
                              <i class="bi bi-trash-fill" onClick={() => deleteForum(item.id)} style={{ color: '#A08336', marginRight: '5px', cursor: 'pointer' }}></i>
                              <i class="bi bi-eye-fill" onClick={() => loadForumDetail(item.id)} style={{ color: '#A08336', marginLeft: '10px', cursor: 'pointer' }}></i>
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
              <MDBModalTitle>Comments</MDBModalTitle>
              <MDBBtn className="btn-close" color="none" onClick={() => setScrollableModal(!scrollableModal)}></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <div className="mb-3">
                {Array.isArray(forumDetail) &&
                  forumDetail.map((detail) => (
                    <MDBCard className="mb-3" key={detail.id}>
                      {' '}
                      {/* Pindahkan key ke elemen MDBCard */}
                      <div className="d-flex">
                        <MDBCardImage className="me-2 mt-2 ms-2" src="/img/profile.png" style={{ width: '10%', height: '13%' }} />
                        <MDBCol>
                          <MDBCardText className="mt-2 ms-2 " style={{ color: 'black', fontSize: '16px', fontWeight: 'bold' }}>
                            {detail.user}
                          </MDBCardText>
                          <MDBCardText className="mb-3 ms-2" style={{ color: 'black', fontSize: '16px', marginTop: '-15px' }}>
                            {detail.komentar}
                          </MDBCardText>
                        </MDBCol>
                      </div>
                    </MDBCard>
                  ))}
              </div>
            </MDBModalBody>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </div>
  );
};

export default KelolaForumUser;
