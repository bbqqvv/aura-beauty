import React, { useState } from "react";
import SEO from "@/components/seo";
import HeaderTwo from "@/layout/headers/header-2";
import Wrapper from "@/layout/wrapper";
import Footer from "@/layout/footers/footer";
import { Phone, Clock, MapPin, Compass } from "lucide-react";
import { useGetActiveStoresQuery } from "@/redux/features/storeApi";
import Loader from "@/components/loader/loader";

const OurStores = () => {
  const { data: stores, isLoading, isError } = useGetActiveStoresQuery();
  const [selectedRegion, setSelectedRegion] = useState("all");

  const storesData = stores?.result || [];

  const filteredStores = selectedRegion === "all" 
    ? storesData 
    : storesData.filter(store => store.region === selectedRegion);

  // Curated premium Unsplash beauty store images
  const storeImages = [
    "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=600&auto=format&fit=crop", // Aura Beauty Thảo Điền (Luxurious gold boutique interior)
    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=600&auto=format&fit=crop", // Aura Beauty Hoàn Kiếm (Sophisticated beauty counter)
    "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=600&auto=format&fit=crop", // Aura Beauty Cầu Giấy (Clean minimalist beauty shelves)
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop", // Aura Beauty Hải Châu (Gorgeous spa interior)
    "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=600&auto=format&fit=crop"  // Aura Flagship Store Quận 1 (Luxury architectural boutique)
  ];

  return (
    <Wrapper>
      <SEO pageTitle="Hệ thống Cửa hàng Cao cấp" />
      <HeaderTwo style_2={true} />
      
      {/* Global CSS for animations and custom luxury styles */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Plus+Jakarta+Sans:wght@200..800&display=swap');

        .luxury-font-title {
          font-family: 'Playfair Display', serif;
        }
        .luxury-font-body {
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        /* Linear Grid Container styling */
        .linear-store-grid {
          border-left: 1px solid rgba(130, 90, 44, 0.12);
          border-top: 1px solid rgba(130, 90, 44, 0.12);
          background: #ffffff;
        }

        /* Linear Card styling */
        .linear-store-card {
          background: #ffffff;
          border-right: 1px solid rgba(130, 90, 44, 0.12);
          border-bottom: 1px solid rgba(130, 90, 44, 0.12);
          display: flex;
          flex-direction: column;
          height: 100%;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .linear-store-card:hover {
          background: #FAF8F5; /* subtle light cream shift */
        }

        .linear-store-card:hover .store-img {
          transform: scale(1.05);
        }

        /* Image and Thumbnail styling */
        .linear-store-thumb {
          position: relative;
          overflow: hidden;
          width: 100%;
          height: 220px;
          background: #efeae4;
          border-bottom: 1px solid rgba(130, 90, 44, 0.08);
        }

        /* Region Badge overlay */
        .linear-badge-region-overlay {
          position: absolute;
          top: 15px;
          left: 15px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          color: #ffffff;
          background: rgba(130, 90, 44, 0.85);
          backdrop-filter: blur(4px);
          padding: 5px 12px;
          letter-spacing: 1px;
          border-radius: 4px;
          z-index: 2;
        }

        /* Card Content Inner Padding */
        .linear-store-content {
          padding: 25px 25px 30px 25px;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .linear-store-no {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          color: #a87f53;
          letter-spacing: 1px;
        }

        .linear-status-badge {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          color: #2e7d32;
          background: rgba(46, 125, 50, 0.08);
          padding: 2px 8px;
          border-radius: 4px;
          letter-spacing: 0.5px;
        }

        .linear-store-title {
          font-family: 'Playfair Display', serif;
          font-size: 21px;
          font-weight: 500;
          color: #1a120b;
          line-height: 1.35;
          margin-top: 10px;
          margin-bottom: 15px;
          height: 56px; /* keep title heights consistent for grid alignment */
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .linear-detail-item {
          display: flex;
          gap: 10px;
          align-items: flex-start;
          font-size: 13.5px;
          color: #4a3f35;
          line-height: 1.5;
        }

        .linear-detail-icon {
          color: #a87f53;
          flex-shrink: 0;
          margin-top: 2.5px;
        }



        /* Action button wrapper */
        .linear-btn-wrapper {
          border-top: 1px solid rgba(130, 90, 44, 0.08);
          padding-top: 20px;
          margin-top: auto;
        }

        /* Linear Action Button */
        .linear-btn-map {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: #825a2c;
          color: #ffffff !important;
          border: none;
          padding: 11px 20px;
          font-size: 12.5px;
          font-weight: 600;
          letter-spacing: 0.5px;
          border-radius: 6px;
          width: 100%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .linear-btn-map:hover {
          background: #9c7345;
          transform: translateY(-1.5px);
          box-shadow: 0 4px 12px rgba(130, 90, 44, 0.12);
        }

        /* Flat tab styling */
        .flat-tab-btn {
          font-family: 'Plus Jakarta Sans', sans-serif;
          padding: 8px 20px;
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s ease;
          color: #555555;
          background: #efeae4;
          border: none;
          border-radius: 30px;
        }

        .flat-tab-btn:hover {
          color: #825a2c;
          background: #e5dfd7;
        }

        .flat-tab-btn.active {
          background: #825a2c;
          color: #ffffff;
        }
      `}</style>

      {/* Header Banner - High Fashion Luxury Editorial */}
      <section className="tp-stores-banner-area p-relative z-index-1 pt-120 pb-120 d-flex align-items-center" style={{
        background: 'linear-gradient(rgba(10, 8, 5, 0.45), rgba(10, 8, 5, 0.65)), url("/assets/img/contact/store-facade.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        minHeight: '420px'
      }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-9 text-center">
              <div className="tp-stores-banner-content">
                <h1 className="luxury-font-title" style={{
                  color: '#ffffff',
                  fontSize: '48px',
                  fontWeight: '400',
                  marginBottom: '20px',
                  letterSpacing: '1px',
                  lineHeight: '1.2'
                }}>
                  Khám Phá Hệ Thống Cửa Hàng
                </h1>
                
                <div style={{
                  width: '50px',
                  height: '2px',
                  background: '#e0b584',
                  margin: '15px auto 20px auto'
                }}></div>

                <p className="luxury-font-body" style={{
                  color: 'rgba(255, 255, 255, 0.85)',
                  fontSize: '15.5px',
                  fontWeight: '300',
                  maxWidth: '650px',
                  margin: '0 auto',
                  lineHeight: '1.7',
                  letterSpacing: '0.2px'
                }}>
                  Hành trình chăm sóc vẻ đẹp đích thực bắt đầu tại không gian mua sắm hoàng gia đẳng cấp. Hãy ghé thăm và tận hưởng các đặc quyền soi da, trị liệu spa chuyên biệt từ Aura.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stores Section */}
      <section className="tp-stores-list-area pt-80 pb-100" style={{
        background: '#FAF6F0',
        position: 'relative'
      }}>
        <div className="container">
          {isLoading ? (
            <div className="d-flex justify-content-center p-5">
              <Loader loading={isLoading} />
            </div>
          ) : isError ? (
            <div className="luxury-font-body text-danger p-5 text-center" style={{ fontSize: '18px', fontWeight: '500' }}>
              Không thể kết nối máy chủ. Vui lòng thử lại sau!
            </div>
          ) : (
            <>
              {/* Region Filter Buttons */}
              <div className="row justify-content-center mb-50">
                <div className="col-xl-8 text-center">
                  <div className="d-inline-flex flex-wrap justify-content-center gap-2">
                    <button 
                      onClick={() => setSelectedRegion("all")}
                      className={`flat-tab-btn ${selectedRegion === "all" ? 'active' : ''}`}
                    >
                      Tất cả ({storesData.length})
                    </button>
                    <button 
                      onClick={() => setSelectedRegion("hanoi")}
                      className={`flat-tab-btn ${selectedRegion === "hanoi" ? 'active' : ''}`}
                    >
                      Hà Nội ({storesData.filter(s => s.region === 'hanoi').length})
                    </button>
                    <button 
                      onClick={() => setSelectedRegion("hcm")}
                      className={`flat-tab-btn ${selectedRegion === "hcm" ? 'active' : ''}`}
                    >
                      TP. Hồ Chí Minh ({storesData.filter(s => s.region === 'hcm').length})
                    </button>
                    <button 
                      onClick={() => setSelectedRegion("danang")}
                      className={`flat-tab-btn ${selectedRegion === "danang" ? 'active' : ''}`}
                    >
                      Đà Nẵng ({storesData.filter(s => s.region === 'danang').length})
                    </button>
                  </div>
                </div>
              </div>

              {/* Cards Linear Grid */}
              <div className="row gx-0 linear-store-grid justify-content-center">
                {filteredStores.map((store, index) => (
                  <div 
                    key={store._id} 
                    className="col-xl-4 col-md-6 col-12"
                  >
                    <div className="linear-store-card">
                      {/* Card Image Header */}
                      <div className="linear-store-thumb">
                        <img 
                          src={storeImages[index % storeImages.length]} 
                          alt={store.name} 
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.5s ease',
                          }}
                          className="store-img"
                        />
                        {/* Region Badge overlay */}
                        <span className="linear-badge-region-overlay">
                          {store.regionLabel}
                        </span>
                      </div>

                      <div className="linear-store-content">
                        {/* Store # Info */}
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="linear-store-no">
                            CHI NHÁNH AURA #{index + 1}
                          </span>
                          
                          <span className="linear-status-badge">
                            Active
                          </span>
                        </div>

                        {/* Title with Serif Playfair */}
                        <h3 className="linear-store-title luxury-font-title">
                          {store.name}
                        </h3>

                        {/* Split Decorative Line */}
                        <div style={{
                          width: '40px',
                          height: '1px',
                          background: 'rgba(168, 127, 83, 0.25)',
                          marginBottom: '18px'
                        }}></div>

                        {/* Core Details */}
                        <div className="d-flex flex-column gap-2 mb-3">
                          <div className="linear-detail-item">
                            <MapPin size={15} className="linear-detail-icon" />
                            <span className="luxury-font-body" style={{ fontWeight: '400' }}>
                              {store.address}
                            </span>
                          </div>

                          <div className="linear-detail-item">
                            <Phone size={14} className="linear-detail-icon" />
                            <a href={`tel:${store.phone}`} className="luxury-font-body" style={{ color: '#825a2c', fontWeight: '600', transition: 'color 0.2s' }}>
                              {store.phone}
                            </a>
                          </div>

                          <div className="linear-detail-item">
                            <Clock size={14} className="linear-detail-icon" />
                            <span className="luxury-font-body" style={{ color: '#6e6255', fontWeight: '400' }}>
                              {store.hours}
                            </span>
                          </div>
                        </div>



                        {/* Map Button Area */}
                        <div className="linear-btn-wrapper">
                          <a 
                            href={store.mapUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="linear-btn-map"
                          >
                            <Compass size={14} />
                            Chỉ đường trên bản đồ
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {filteredStores.length === 0 && (
                  <div className="col-12 text-center p-5 luxury-font-body" style={{ color: '#8c7d6e', fontSize: '16.5px', fontStyle: 'italic', borderBottom: '1px solid rgba(130, 90, 44, 0.12)', borderRight: '1px solid rgba(130, 90, 44, 0.12)' }}>
                    Không có chi nhánh nào trong khu vực này. Vui lòng chọn khu vực khác!
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </section>

      <Footer primary_style={true} />
    </Wrapper>
  );
};

export default OurStores;
