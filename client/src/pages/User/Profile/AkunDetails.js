import React, { useEffect, useState } from 'react';
import UserNavbar from '../../../components/UserNavbar';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import SidebarAkun from '../../../components/SidebarAkun';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getMe } from '../../../features/authSlice';
import axios from 'axios';
import swal from 'sweetalert';

const AkunDetails = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError } = useSelector((state) => state.auth);

  const [showModal, setShowModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confNewPassword, setConfNewPassword] = useState('');
  const [noTelp, setNoTelp] = useState('');
  const [alamat, setAlamat] = useState('');

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      navigate('/login');
    }
  }, [isError, navigate]);

  const handleEditProfileClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    try {
      if (newPassword !== confNewPassword) {
        return swal({
          icon: 'error',
          title: 'Error',
          text: 'Password baru dan konfirmasi password tidak cocok',
        });
      }

      const response = await axios.put('http://${url}/auth/updatePassword', {
        oldPassword: oldPassword,
        newPassword: newPassword,
        confNewPassword: confNewPassword,
      });
      if (response.status === 200) {
        swal({
          icon: 'success',
          title: 'Success',
          text: response.data.msg,
        });
        setShowModal(false);
      } else {
        swal({
          icon: 'error',
          title: 'Error',
          text: response.data.msg,
        });
      }
    } catch (error) {
      swal({
        icon: 'error',
        title: 'Error',
        text: 'Gagal mengubah kata sandi. Silakan coba lagi.',
      });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put('http://${url}/auth/updateProfile', {
        no_telp: noTelp,
        alamat: alamat,
      });

      if (response.status === 200) {
        swal({
          icon: 'success',
          title: 'Success',
          text: response.data.msg,
        });
        setShowModal(false);
      } else {
        swal({
          icon: 'error',
          title: 'Error',
          text: response.data.msg,
        });
      }
    } catch (error) {
      swal({
        icon: 'error',
        title: 'Error',
        text: 'Gagal memperbarui informasi kontak. Silakan coba lagi.',
      });
    }
  };

  return (
    <div>
      <UserNavbar />
      <div className="main">
        <SidebarAkun />
        <div className="container mt-5 ">
          <Card>
            <Card.Body>
              <section className="blog">
                <div className="row">
                  <h2 className="title" style={{ fontWeight: 'bold' }}>
                    Account Details
                  </h2>
                  <div className="col-12 mb-4 mt-4">
                    <form>
                      <div className="mb-3">
                        <label className="form-label">FULL NAME *</label>
                        <input type="text" className="form-control" disabled placeholder={user && user.name} />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">USERNAME *</label>
                        <input type="text" className="form-control" disabled placeholder={user && user.username} />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">EMAIL *</label>
                        <input type="text" className="form-control" disabled placeholder={user && user.email} />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">HANDPHONE *</label>
                        <input type="text" className="form-control" disabled placeholder={user && user.no_telp} />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">ALAMAT *</label>
                        <input type="text" className="form-control" disabled placeholder={user && user.alamat} />
                      </div>
                    </form>
                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{ backgroundColor: '#A08336', fontSize: '16px', maxWidth: '158px', maxHeight: '42px', textAlign: 'center', border: 'black', float: 'right' }}
                      onClick={handleEditProfileClick}
                    >
                      Edit Profile
                    </button>
                  </div>
                  <h2 className="title" style={{ fontWeight: 'bold' }}>
                    Change Password
                  </h2>
                  <div className="col-12 mb-4 mt-4">
                    <form onSubmit={handleSaveChanges}>
                      <div className="mb-3">
                        <label className="form-label">OLD PASSWORD</label>
                        <input type="password" className="form-control" placeholder="Old Password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">NEW PASSWORD</label>
                        <input type="password" className="form-control" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">REPEAT NEW PASSWORD</label>
                        <input type="password" className="form-control" placeholder="Repeat New Password" value={confNewPassword} onChange={(e) => setConfNewPassword(e.target.value)} />
                      </div>
                      <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#A08336', fontSize: '16px', maxWidth: '158px', maxHeight: '42px', textAlign: 'center', border: 'black', float: 'right' }}>
                        Save Changes
                      </button>
                    </form>
                  </div>
                </div>
              </section>
            </Card.Body>
          </Card>
        </div>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSave}>
            <div className="mb-3">
              <label className="form-label">FULL NAME </label>
              <input type="text" className="form-control" defaultValue={user && user.name} disabled />
            </div>
            <div className="mb-3">
              <label className="form-label">USERNAME </label>
              <input type="text" className="form-control" defaultValue={user && user.username} disabled />
            </div>
            <div className="mb-3">
              <label className="form-label">EMAIL </label>
              <input type="email" className="form-control" defaultValue={user && user.email} disabled />
            </div>
            <div className="mb-3">
              <label className="form-label">HANDPHONE </label>
              <input type="text" className="form-control" value={noTelp} onChange={(e) => setNoTelp(e.target.value)} />
            </div>
            <div className="mb-3">
              <label className="form-label">ALAMAT </label>
              <input type="text" className="form-control" value={alamat} onChange={(e) => setAlamat(e.target.value)} />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave} style={{ backgroundColor: '#A08336', border: 'none' }}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AkunDetails;
