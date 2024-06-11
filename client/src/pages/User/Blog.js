import React from 'react';
import NormalNavbar from '../../components/NormalNavbar';
import Footer from '../../components/Footer';
import { MDBRow, MDBCol, MDBContainer } from 'mdb-react-ui-kit';
import LandingBlog from '../../components/LandingBlog';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';

export default function Landing() {
  const { user } = useSelector((state) => state.auth);

  const navigate = useNavigate();
  const handleCreateArticle = () => {
    if (user) {
      navigate('/upload-blog');
    } else {
      swal({
        title: 'Oops!',
        text: 'Silakan login terlebih dahulu untuk membuat artikel.',
        icon: 'warning',
        buttons: ['Batal', 'Login'],
      }).then((isConfirmed) => {
        if (isConfirmed) {
          navigate('/login');
        }
      });
    }
  };

  return (
    <div>
      <NormalNavbar />
      <MDBContainer>
        <MDBRow className="mt-3 justify-content-center">
          <MDBCol md={12} xs={2} className="ms-auto mb-3">
            <img src="/img/banner-blog.png" className="hover-shadow" alt="" style={{ width: '100%' }} />
          </MDBCol>
          <MDBCol md={10} xs={12} className="mb-3"></MDBCol>
          <MDBCol md={2} xs={12} className="mb-3">
            {user ? (
              <button className="btn btn-primary" style={{ backgroundColor: '#A08336', fontSize: '16px', textAlign: 'center', border: 'black', width: '100%' }} onClick={handleCreateArticle}>
                Tulis Artikel
              </button>
            ) : (
              <button
                className="btn btn-primary"
                style={{ backgroundColor: '#A08336', fontSize: '16px', textAlign: 'center', border: 'black', width: '100%' }}
                onClick={() =>
                  swal({
                    icon: 'warning',
                    title: 'Oops!',
                    text: 'Anda belum login. Silakan login terlebih dahulu untuk menambahkan produk ke keranjang.',
                  })
                }
              >
                Tulis Artikel
              </button>
            )}
          </MDBCol>
        </MDBRow>
      </MDBContainer>
      <LandingBlog />
      <br></br>
      <br></br>
      <br></br>
      <Footer />
    </div>
  );
}
