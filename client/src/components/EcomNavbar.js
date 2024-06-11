import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useDispatch, useSelector } from 'react-redux';
import { getMe } from '../features/authSlice';
import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const EcomNavbar = () => {
  const dispatch = useDispatch();
  const { user, isError } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

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
                <Link to="/cart" style={{ textDecoration: 'none', marginRight: '15px', color: '#A08336' }}>
                  <FontAwesomeIcon icon={faShoppingCart} style={{ cursor: 'pointer', paddingTop: '10px' }} />
                </Link>
                <Link
                  to="/seller"
                  className="btn"
                  style={{
                    backgroundColor: '#A08336',
                    fontSize: '16px',
                    color: 'white',
                    maxWidth: '158px',
                    maxHeight: '42px',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    border: 'black',
                    marginRight: '5px',
                  }}
                >
                  Seller Center
                </Link>
              </>
            ) : null}
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default EcomNavbar;
