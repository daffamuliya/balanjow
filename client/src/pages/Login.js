import { MDBBtn, MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBInput, MDBIcon } from 'mdb-react-ui-kit';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { LoginUser, reset } from '../features/authSlice';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isError, isSuccess, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user || isSuccess) {
      if (user && user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/home');
      }
    }
    dispatch(reset());
  }, [user, isSuccess, dispatch, navigate]);

  const Auth = async (e) => {
    e.preventDefault();
    dispatch(LoginUser({ email, password }));
  };

  return (
    <MDBContainer fluid>
      <section className="login">
        <MDBRow className="d-flex justify-content-center align-items-center h-100">
          <MDBCol col="12">
            <MDBCard className="bg-white my-5 mx-auto" style={{ borderRadius: '10px', maxWidth: '644px' }}>
              <MDBCardBody className="p-5 w-100 d-flex flex-column ">
                <h2 className="fw mb-2 text-center" style={{ fontSize: '24px', fontWeight: 'bold' }}>
                  Login
                </h2>
                <form onSubmit={Auth}>
                  {isError && <p className="text-center">{message}</p>}
                  <p className="text-black-100" style={{ fontSize: '16px' }}>
                    Email
                  </p>
                  <MDBInput
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    wrapperClass="mb-4 w-100"
                    id="formControlLg"
                    type="email"
                    size="lg"
                    style={{ fontSize: '16px' }}
                    placeholder="your email address"
                    className="focus-ring focus-ring-light "
                    autoComplete="new-password"
                  />
                  <p className="text-black-100" style={{ fontSize: '16px' }}>
                    Password
                  </p>
                  <MDBInput
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    wrapperClass="mb-4 w-100"
                    id="formControlLg"
                    type="password"
                    size="lg"
                    style={{ fontSize: '16px' }}
                    placeholder="your password"
                    className="focus-ring focus-ring-light"
                    autoComplete="new-password"
                  />
                  <MDBRow className="d-flex justify-content-center align-items-center text-center">
                    <MDBBtn type="submit" size="lg" onClick={Auth} style={{ backgroundColor: 'black', fontSize: '16px', maxWidth: '158px', maxHeight: '42px', fontWeight: 'semi-bold', textAlign: 'center', border: 'black' }}>
                      Sign In
                    </MDBBtn>
                  </MDBRow>
                </form>
                <br></br>
                <hr className="my-4" />
                <br></br>
                <div className="d-flex justify-content-center">
                  <p className="text-black-100 me-3 mt-2" style={{ fontSize: '14px' }}>
                    Don't have an account?
                  </p>
                  <MDBBtn className="w-100" href="/register" size="lg" style={{ backgroundColor: 'white', color: 'black', borderColor: '#7E7E7E', fontSize: '16px', maxWidth: '158px', maxHeight: '42px', fontWeight: 'bold' }}>
                    <MDBIcon fab icon="google" />
                    Register
                  </MDBBtn>
                </div>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </section>
    </MDBContainer>
  );
}

export default Login;
