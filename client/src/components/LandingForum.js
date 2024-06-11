import {
  MDBContainer,
  MDBRow,
  MDBBtn,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBListGroup,
  MDBListGroupItem,
  MDBCardImage,
  MDBCardText,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
} from 'mdb-react-ui-kit';
import { Chat } from 'react-bootstrap-icons';
import React, { useState, useEffect } from 'react';
import swal from 'sweetalert';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { getMe } from '../features/authSlice';

axios.defaults.withCredentials = true;

const LandingForum = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const user_id = user ? user.id : null;
  const url = process.env.url;

  const [konten, setKonten] = useState('');
  const [komentar, setKomentar] = useState('');
  const [selectedForumId, setSelectedForumId] = useState(null);
  const { user: loggedInUser } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  const handleButtonClick = (forum_id) => {
    setSelectedForumId(forum_id);
  };

  const saveKomentar = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${url}/forum/addComment`, {
        user_id,
        forum_id: selectedForumId,
        user: user.name,
        komentar,
      });
      swal({
        icon: 'success',
        title: 'Success',
        text: 'Komentar ditambahkan',
      });
      setKomentar('');
      setScrollableModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  const saveForum = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://${url}/forum/addForum`, {
        user_id,
        user: user.name,
        konten,
      });
      swal({
        icon: 'success',
        title: 'Success',
        text: 'Status berhasil di upload!',
      });
    } catch (error) {
      console.log(error);
    }
  };

  const [forum, setForum] = useState([]);
  const [forums, set3Forum] = useState([]);

  const [basicModal, setBasicModal] = useState(false);
  const toggleOpen = () => setBasicModal(!basicModal);
  const handleCloseModal = () => {
    toggleOpen();
    window.location.reload();
  };

  const [scrollableModal, setScrollableModal] = useState(false);
  const [forumDetail, setForumDetail] = useState(null);
  const [statusDetail, setStatusDetail] = useState(null);

  useEffect(() => {
    getForum();
    get3Forum();
  }, []);

  const getForum = async () => {
    const response = await axios.get('http://${url}/forum');
    setForum(response.data.items);
  };

  const get3Forum = async () => {
    try {
      const response = await axios.get('http://${url}/forum');
      const latestThreeItems = response.data.items.slice(0, 3);
      set3Forum(latestThreeItems);
    } catch (error) {
      console.error('Error fetching forum data:', error);
    }
  };

  const loadForumDetail = async (id) => {
    try {
      const response2 = await axios.get(`http://${url}/forum/${id}`);
      const statusDetailData = Array.isArray(response2.data.items) ? response2.data.items : [response2.data.items];
      setStatusDetail(statusDetailData);

      await handleButtonClick(id);
      const response = await axios.get(`http://${url}/forum/comment/${id}`);
      const forumDetailData = Array.isArray(response.data.items) ? response.data.items : [response.data.items];
      setForumDetail(forumDetailData);

      console.log('statusDetail:', statusDetailData);
      console.log('forumDetail:', forumDetailData);

      setScrollableModal(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="landingsocial">
      <MDBContainer>
        <MDBRow className="mt-4">
          <MDBCol md={4} xs={12}>
            {loggedInUser ? (
              <a href onClick={toggleOpen} className="btn btn-primary col-12" style={{ backgroundColor: '#A08336', fontSize: '16px', fontWeight: 'normal', border: '#A08336', borderRadius: '10px', marginBottom: '30px' }}>
                Mulai Diskusi Baru
              </a>
            ) : (
              <a
                href
                onClick={() =>
                  swal({
                    icon: 'warning',
                    title: 'Oops!',
                    text: 'Anda belum login. Silakan login terlebih dahulu untuk membuat diskusi baru.',
                  })
                }
                className="btn btn-primary col-12"
                style={{ backgroundColor: '#A08336', fontSize: '16px', fontWeight: 'normal', border: '#A08336', borderRadius: '10px', marginBottom: '30px' }}
              >
                Mulai Diskusi Baru
              </a>
            )}

            <p className="text-white-75 d-none d-md-block" style={{ color: '#6A6D70', marginBottom: '1rem' }}>
              Terbaru{' '}
            </p>
            <MDBListGroup style={{ minWidth: '22rem', backgroundColor: 'transparent' }} className="d-none d-md-block">
              {Array.isArray(forums) &&
                forums.map((item) => (
                  <MDBListGroupItem className="d-flex justify-content-between align-items-start" noBorders style={{ backgroundColor: 'transparent' }}>
                    <div className="me-auto">
                      <div className="fw-bold">{item.konten}</div>by {item.user}
                      <hr />
                    </div>
                  </MDBListGroupItem>
                ))}
            </MDBListGroup>
          </MDBCol>
          <MDBCol md={8} xs={12}>
            {Array.isArray(forum) &&
              forum.map((item) => (
                <MDBCard key={item.id} className="mb-3 ">
                  <MDBCardBody>
                    {' '}
                    <div className="d-flex">
                      <MDBCardImage className="me-2 mt-2" src="/img/profile.png" style={{ width: '8%', height: '13%' }} />
                      <MDBCol>
                        <MDBCardText className="mt-2 ms-2" style={{ color: 'black', fontSize: '18px', fontWeight: 'bold' }}>
                          {item.user}
                        </MDBCardText>
                        <MDBCardText className=" ms-2" style={{ color: 'black', fontSize: '18px', marginTop: '-15px' }}>
                          {item.konten}
                        </MDBCardText>
                        <Chat onClick={() => loadForumDetail(item.id)} style={{ cursor: 'pointer' }} />
                      </MDBCol>
                    </div>
                  </MDBCardBody>
                </MDBCard>
              ))}
          </MDBCol>
        </MDBRow>
      </MDBContainer>

      <MDBModal open={basicModal} setOpen={setBasicModal} tabIndex="-1">
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Create a post</MDBModalTitle>
              <MDBBtn className="btn-close" color="none" onClick={toggleOpen}></MDBBtn>
            </MDBModalHeader>
            <form onSubmit={saveForum}>
              <MDBModalBody>
                <div className="form-floating">
                  <textarea value={konten} onChange={(e) => setKonten(e.target.value)} className="form-control" placeholder="Tinggalkan komentar di sini" id="floatingTextarea2" style={{ height: '100px' }} required></textarea>
                  <label htmlFor="floatingTextarea2">Tanyakan sesuatu pada rangers</label>
                </div>
              </MDBModalBody>
              <MDBModalFooter>
                <button
                  type="submit"
                  className="btn btn-primary"
                  onClick={handleCloseModal}
                  style={{ backgroundColor: '#A08336', fontSize: '16px', maxWidth: '158px', maxHeight: '42px', textAlign: 'center', border: 'black', float: 'right' }}
                >
                  Send!
                </button>
              </MDBModalFooter>
            </form>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>

      <MDBModal open={scrollableModal} setOpen={setScrollableModal} tabIndex="-1">
        <MDBModalDialog centered scrollable>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Add Comment</MDBModalTitle>
              <MDBBtn className="btn-close" color="none" onClick={() => setScrollableModal(!scrollableModal)}></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              {Array.isArray(statusDetail) &&
                statusDetail.map((status) => (
                  <form onSubmit={saveKomentar}>
                    <div className="mb-3">
                      <div className="col-auto">
                        <MDBCardText className="mt-2" style={{ color: 'black', fontSize: '18px', fontWeight: 'bold' }}>
                          {status.user}
                        </MDBCardText>
                      </div>
                      <div className="col-12 mb-3 mt-1">
                        <p className="komentar" style={{ color: 'black', fontSize: '20px' }}>
                          {status.konten}
                        </p>
                      </div>
                    </div>
                    <div className="mb-5">
                      <label htmlFor="message-text" className="col-form-label">
                        Replying to {status.user}
                      </label>
                      <textarea value={komentar} onChange={(e) => setKomentar(e.target.value)} className="form-control" id="message-text"></textarea>
                      <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#A08336', fontSize: '16px', maxWidth: '158px', maxHeight: '42px', textAlign: 'center', border: 'black', float: 'right', marginTop: '15px' }}>
                        Send Reply
                      </button>
                    </div>
                  </form>
                ))}

              <div className="mb-3">
                <label className="col-form-label">Comments</label>
                {Array.isArray(forumDetail) &&
                  forumDetail.map((detail) => (
                    <MDBCard className="mb-3" key={detail.id}>
                      {' '}
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
    </section>
  );
};

export default LandingForum;
