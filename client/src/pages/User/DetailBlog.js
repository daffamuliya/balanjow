import React, { useEffect, useState } from 'react';
import NormalNavbar from '../../components/NormalNavbar';
import Footer from '../../components/Footer';
import { MDBContainer, MDBRow, MDBBtn } from 'mdb-react-ui-kit';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const DetailBlog = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        let fetchedBlog;
        const savedBlog = localStorage.getItem('savedBlog');
        if (savedBlog) {
          fetchedBlog = JSON.parse(savedBlog);
          console.log(fetchedBlog);
        } else {
          const response = await axios.get(`http://${url}/blog/baca/${slug}`);
          fetchedBlog = response.data.items;
          const waktuDariDatabase = fetchedBlog.created_at;
          const waktu = new Date(waktuDariDatabase);
          const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: 'Asia/Jakarta',
          };
          const waktuNormal = waktu.toLocaleDateString('id-ID', options);
          fetchedBlog.waktuNormal = waktuNormal;
          localStorage.setItem('savedBlog', JSON.stringify(fetchedBlog));
        }
        setBlog(fetchedBlog);
      } catch (error) {
        console.log(error);
      }
    };

    fetchBlog();

    return () => {
      if (blog) {
        localStorage.removeItem('savedBlog');
      }
    };
  }, [slug, blog]);

  if (blog) {
    return (
      <div>
        <NormalNavbar />
        <MDBRow className="justify-content-center">
          <section className="judul-blog">
            <MDBContainer>
              <div className="row gx-4 gx-lg-5 h-100 align-items-center justify-content-center mt-5">
                <div className="col-lg-12 ">
                  <MDBBtn className="mb-3" color="light" style={{ color: '#A08336', fontSize: '14px' }}>
                    {blog.kategori_blog}
                  </MDBBtn>
                  <h1 className="font-weight-bold" style={{ color: 'black', fontSize: '40px', fontWeight: 'bold' }}>
                    {blog.judul}
                  </h1>
                  <p style={{ color: '#50739F' }}>{blog.waktuNormal}</p>
                  <p style={{ color: 'black' }}>Article by {blog.user}</p>
                </div>
              </div>
            </MDBContainer>
          </section>
        </MDBRow>
        <MDBRow className="justify-content-center">
          <section className="isiblog">
            <MDBContainer>
              <div className="row gx-4 gx-lg-5 h-100 align-items-center justify-content-center mt-5 text-center">
                <div className="col-lg-12 ">
                  <img src={blog.url} className="hover-shadow" alt="" style={{ width: '100%' }} />
                </div>
              </div>
              <div className="row gx-4 gx-lg-5 h-100 align-items-center justify-content mt-5">
                <div className="col-lg-12 ">
                  <p style={{ color: 'black', marginTop: '25px', textAlign: 'justify', fontSize: '20px' }} dangerouslySetInnerHTML={{ __html: blog.konten }}></p>
                </div>
              </div>
            </MDBContainer>
          </section>
        </MDBRow>
        <br></br>
        <br></br>
        <br></br>
        <Footer />
      </div>
    );
  } else {
    return <div>Loading..</div>;
  }
};

export default DetailBlog;
