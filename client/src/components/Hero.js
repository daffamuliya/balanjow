const Hero = () => {
  return (
    <section className="hero">
      <div className="container px-4 px-lg-5 h-100">
        <div className="row gx-4 gx-lg-5 h-100 align-items-center justify-content-center text-center">
          <div className="col-lg-12 ">
            <h1 className="text-white font-weight-bold" style={{ color: 'white', fontSize: '74px' }}>
              Inovasi untuk Rangers.
            </h1>
            <p className="text-white-75 mb-5" style={{ color: 'white' }}>
              Bersatu dalam Pengetahuan, Inspirasi, dan Karya
            </p>
            <a href="/home" className="btn btn-primary" style={{ backgroundColor: '#A08336', fontSize: '16px', maxWidth: '169px', maxHeight: '48px', fontWeight: 'normal', textAlign: 'center', border: '#A08336', borderRadius: '10px' }}>
              Get Started
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
