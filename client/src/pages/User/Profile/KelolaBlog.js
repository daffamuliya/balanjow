import React, { useState, useEffect } from 'react';
import { MDBBtn, MDBRow, MDBModal, MDBModalDialog, MDBModalContent, MDBModalHeader, MDBModalTitle, MDBModalBody } from 'mdb-react-ui-kit';
import UserNavbar from '../../../components/UserNavbar';
import Card from 'react-bootstrap/Card';
import SidebarAkun from '../../../components/SidebarAkun';
import Table from 'react-bootstrap/Table';
import axios from 'axios';
import swal from 'sweetalert';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getMe } from '../../../features/authSlice';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const KelolaBlog = () => {
  const url = process.env.REACT_APP_BASE_URL;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError, user } = useSelector((state) => state.auth);
  const user_id = user ? user.id : null;

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      navigate('/login');
    }
  }, [isError, navigate]);

  const [blog, setBlog] = useState([]);
  useEffect(() => {
    getBlogs();
  }, []);

  const getBlogs = async () => {
    try {
      const response = await axios.get(`${url}/blog/dashboard`);
      const formattedBlogs = response.data.items.map((item) => {
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
      setBlog(formattedBlogs);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  const [BlogDetail, setBlogDetail] = useState(null);
  const [scrollableModal, setScrollableModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const [judul, setJudul] = useState('');
  const [slug, setSlug] = useState('');
  const [kategori_blog, setKategori] = useState('Pilih Kategori');
  const [file, setFile] = useState('');
  const [summary, setSummary] = useState('');
  const [konten, setKonten] = useState('');

  const loadBlogDetail = async (slug) => {
    try {
      const response = await axios.get(`${url}/blog/baca/${slug}`);
      const BlogDetailData = Array.isArray(response.data.items) ? response.data.items : [response.data.items];
      setBlogDetail(BlogDetailData[0]);
      setJudul(BlogDetailData[0].judul);
      setSlug(BlogDetailData[0].slug);
      setKategori(BlogDetailData[0].kategori_blog);
      setSummary(BlogDetailData[0].summary);
      setKonten(BlogDetailData[0].konten);
      setScrollableModal(true);
      setIsEditMode(true);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteBlog = async (id) => {
    try {
      swal({
        title: 'Anda yakin?',
        text: 'Anda tidak akan dapat mengembalikan blog ini!',
        icon: 'warning',
        buttons: true,
        dangerMode: true,
      }).then(async (willDelete) => {
        if (willDelete) {
          await axios.delete(`${url}/blog/deleteBlog/${id}`);
          getBlogs();
          swal('Blog berhasil dihapus!', {
            icon: 'success',
          });
        } else {
          swal('Blog Anda tidak jadi dihapus!');
        }
      });
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  const updateBlog = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('user_id', user_id);
    formData.append('user', user.name);
    formData.append('judul', judul);
    formData.append('slug', slug);
    formData.append('kategori_blog', kategori_blog);
    formData.append('file', file);
    formData.append('summary', summary);
    formData.append('konten', konten);

    try {
      await axios.put(`${url}/blog/updateBlog/${BlogDetail.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      swal({
        icon: 'success',
        title: 'Success',
        text: 'Blog berhasil di update!',
      }).then(() => {
        setScrollableModal(false);
        getBlogs();
      });
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
                    Kelola Blog
                  </h2>
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>Judul Blog</th>
                        <th>Kategori</th>
                        <th>Uploader</th>
                        <th>Tanggal Upload</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(blog) &&
                        blog.map((item) => (
                          <tr key={item.id}>
                            <td>{item.judul}</td>
                            <td>{item.kategori_blog}</td>
                            <td>{item.user}</td>
                            <td>{item.waktuNormal}</td>
                            <td>
                              <i class="bi bi-trash-fill" onClick={() => deleteBlog(item.id)} style={{ color: '#A08336', marginRight: '5px', cursor: 'pointer' }}></i>
                              <i class="bi bi-pencil-square" onClick={() => loadBlogDetail(item.slug)} style={{ color: '#A08336', paddingRight: '10px', marginLeft: '5px', cursor: 'pointer' }}></i>
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
              <MDBModalTitle>{isEditMode ? 'Edit Blog' : 'Blog Details'}</MDBModalTitle>
              <MDBBtn className="btn-close" color="none" onClick={() => setScrollableModal(!scrollableModal)}></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <MDBRow className="justify-content-center">
                <section className="isiblog">
                  {isEditMode ? (
                    <form onSubmit={updateBlog}>
                      <div className="mb-3">
                        <label htmlFor="judul" className="form-label">
                          Judul
                        </label>
                        <input type="text" value={judul} onChange={(e) => setJudul(e.target.value)} className="form-control" id="judul" />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="slug" className="form-label">
                          Slug
                        </label>
                        <input type="text" value={slug} readOnly className="form-control" id="slug" disabled />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="kategori_blog" className="form-label">
                          Kategori
                        </label>
                        <select value={kategori_blog} onChange={(e) => setKategori(e.target.value)} className="form-select" aria-label="Default select example" id="kategori_blog">
                          <option value="Pilih Kategori">Pilih Kategori</option>
                          <option value="Wirausaha">Wirausaha</option>
                          <option value="Keuangan Finansial">Keuangan Finansial</option>
                          <option value="Pemasaran">Pemasaran</option>
                        </select>
                      </div>
                      <div className="mb-3">
                        <label htmlFor="file" className="form-label">
                          Unggah File
                        </label>
                        <input type="file" onChange={(e) => setFile(e.target.files[0])} className="form-control" id="file" />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="summary" className="form-label">
                          Summary
                        </label>
                        <textarea value={summary} onChange={(e) => setSummary(e.target.value)} className="form-control" id="summary" rows="3"></textarea>
                      </div>
                      <div className="mb-3">
                        <label htmlFor="konten" className="form-label">
                          Konten
                        </label>
                        <CKEditor editor={ClassicEditor} data={konten} onChange={(event, editor) => setKonten(editor.getData())} />
                      </div>
                      <button type="submit" className="btn btn-primary">
                        Simpan Perubahan
                      </button>
                    </form>
                  ) : (
                    <div>
                      <h5>Judul: {BlogDetail?.judul}</h5>
                      <p>Slug: {BlogDetail?.slug}</p>
                      <p>Kategori: {BlogDetail?.kategori_blog}</p>
                      <p>Summary: {BlogDetail?.summary}</p>
                      <div dangerouslySetInnerHTML={{ __html: BlogDetail?.konten }} />
                    </div>
                  )}
                </section>
              </MDBRow>
            </MDBModalBody>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </div>
  );
};

export default KelolaBlog;
