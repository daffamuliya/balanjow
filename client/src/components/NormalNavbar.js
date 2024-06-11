import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useDispatch, useSelector } from 'react-redux';
import { logout, getMe } from '../features/authSlice';
import { MDBBtn } from 'mdb-react-ui-kit';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const NormalNavbar = () => {
  const dispatch = useDispatch();
  const { user, isError } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <Navbar expand="lg" style={{ backgroundColor: 'white', color: 'black', fontWeight: 'bold' }}>
      <Container>
        <Navbar.Brand href="/">
          <img src="/img/logo.png" width="63" height="63" className="d-inline-block align-top" alt="React Bootstrap logo" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto my-2 my-lg-0" style={{ maxHeight: '100px' }} navbarScroll>
            <Nav.Link href="/home">Home</Nav.Link>
            <Nav.Link href="/forum">Forum</Nav.Link>
            <Nav.Link href="/blog">Blog</Nav.Link>
            <Nav.Link href="/ecommerce">E Commerce</Nav.Link>
          </Nav>
          <Form className="d-flex">
            {isError ? (
              <>
                <a href="/login" className="btn btn-primary" style={{ marginRight: '5px', backgroundColor: 'transparent', fontSize: '16px', maxWidth: '158px', maxHeight: '42px', textAlign: 'center', border: 'none', color: '#A08336' }}>
                  Login
                </a>
                <a href="/register" className="btn btn-primary" style={{ backgroundColor: '#A08336', fontSize: '16px', maxWidth: '158px', maxHeight: '55px', fontWeight: 'bold', textAlign: 'center', border: 'black' }}>
                  Sign Up
                </a>
              </>
            ) : user ? (
              <>
                {user.role === 'admin' ? (
                  <button size="lg" className="me-2" style={{ backgroundColor: 'transparent', fontSize: '16px', maxWidth: '300px', maxHeight: '42px', textAlign: 'center', border: 'none', color: '#A08336', paddingTop: '10px' }}>
                    Halo, {user && user.username}
                  </button>
                ) : (
                  <Link to="/user/akun" style={{ textDecoration: 'none' }}>
                    <button size="lg" className="me-2" style={{ backgroundColor: 'transparent', fontSize: '16px', maxWidth: '300px', maxHeight: '42px', textAlign: 'center', border: 'none', color: '#A08336', paddingTop: '10px' }}>
                      Halo, {user && user.username}
                    </button>
                  </Link>
                )}
                <MDBBtn onClick={handleLogout} size="lg" style={{ backgroundColor: '#A08336', fontSize: '16px', maxWidth: '158px', maxHeight: '42px', fontWeight: 'bold', textAlign: 'center', border: 'black' }}>
                  Logout
                </MDBBtn>
              </>
            ) : null}
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NormalNavbar;
