import React, { useState } from 'react';
import axios from 'axios';
import { MDBBtn, MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBInput, MDBIcon } from 'mdb-react-ui-kit';
import swal from 'sweetalert';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confPassword, setConfPassword] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();
  const url = process.env.url;

  const Register = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${url}/auth/register`, {
        name: name,
        username: username,
        no_telp: phone,
        email: email,
        password: password,
        confPassword: confPassword,
      });
      swal({
        icon: 'success',
        title: 'Success',
        text: 'Anda berhasil registrasi akun',
      }).then(() => {
        navigate('/login');
      });
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      }
    }
  };
  return (
    <MDBContainer fluid>
      <section className="regist">
        <MDBRow className="d-flex justify-content-center align-items-center h-100">
          <MDBCol col="12">
            <MDBCard className="bg-white my-5 mx-auto" style={{ borderRadius: '10px', maxWidth: '644px' }}>
              <MDBCardBody className="p-5 w-100 d-flex flex-column ">
                <h2 className="fw mb-2 text-center" style={{ fontSize: '24px', fontWeight: 'bold' }}>
                  Register
                </h2>
                <form onSubmit={Register}>
                  <p className="text-center">{msg}</p>
                  <p className="text-black-100" style={{ fontSize: '16px' }}>
                    Full Name
                  </p>
                  <MDBInput
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    wrapperClass="mb-4 w-100"
                    id="formControlLg"
                    type="email"
                    size="lg"
                    style={{ fontSize: '16px' }}
                    placeholder="your full name"
                    className="focus-ring focus-ring-light "
                    autoComplete="new-password"
                  />
                  <p className="text-black-100" style={{ fontSize: '16px' }}>
                    Username
                  </p>
                  <MDBInput
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    wrapperClass="mb-4 w-100"
                    id="formControlLg"
                    type="email"
                    size="lg"
                    style={{ fontSize: '16px' }}
                    placeholder="your display name"
                    className="focus-ring focus-ring-light "
                    autoComplete="new-password"
                  />
                  <p className="text-black-100" style={{ fontSize: '16px' }}>
                    Phone
                  </p>
                  <MDBInput
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    wrapperClass="mb-4 w-100"
                    id="formControlLg"
                    type="email"
                    size="lg"
                    style={{ fontSize: '16px' }}
                    placeholder="your phone number"
                    className="focus-ring focus-ring-light "
                    autoComplete="new-password"
                  />
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
                  <p className="text-black-100" style={{ fontSize: '16px' }}>
                    Re-type Password
                  </p>
                  <MDBInput
                    value={confPassword}
                    onChange={(e) => setConfPassword(e.target.value)}
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
                    <MDBBtn type="submit" size="lg" onClick={Register} style={{ backgroundColor: 'black', fontSize: '16px', maxWidth: '158px', maxHeight: '42px', fontWeight: 'semi-bold', textAlign: 'center', border: 'black' }}>
                      Create Account
                    </MDBBtn>
                  </MDBRow>
                </form>
                <br></br>
                <hr className="my-4" />
                <br></br>
                <div className="d-flex justify-content-center">
                  <p className="text-black-100 me-3 mt-2" style={{ fontSize: '14px' }}>
                    Already have an account?
                  </p>
                  <MDBBtn className="w-100" size="lg" href="/login" style={{ backgroundColor: 'white', color: 'black', borderColor: '#7E7E7E', fontSize: '16px', maxWidth: '158px', maxHeight: '42px', fontWeight: 'bold' }}>
                    <MDBIcon fab icon="google" />
                    Sign in
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

export default Register;
