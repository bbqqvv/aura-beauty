import React, { useState, useEffect } from 'react';
import AdminLayout from '@/layout/admin-layout';
import SEO from '@/components/seo';
import { useGetProductQuery, useUpdateProductMutation } from '@/redux/features/productApi';
import { useGetShowCategoryQuery } from '@/redux/features/categoryApi';
import { useGetActiveBrandsQuery } from '@/redux/features/brandApi';
import { useRouter } from 'next/router';
import { Save, ArrowLeft, Image as ImageIcon, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Loader from '@/components/loader/loader';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import { slugify } from '@/utils/slugify';

const EditProduct = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: productData, isLoading: isFetching } = useGetProductQuery(id, { skip: !id });
  const [updateProduct, { isLoading }] = useUpdateProductMutation();
  const { data: categoryData } = useGetShowCategoryQuery();
  const { data: brandData } = useGetActiveBrandsQuery();
  const categories = categoryData?.result || [];
  const brands = brandData?.result || [];
  
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '', slug: '', price: '', discount: '', quantity: '', sku: '', 
    category: '', children: '', brand: '', img: '', description: '', sizes: '',
    unit: 'pc', status: 'in-stock', tags: '', featured: false
  });

  // Calculate available children based on selected category
  const selectedCatObj = categories.find(c => c._id === formData.category);
  const availableChildren = selectedCatObj?.children || [];

  const [imageURLs, setImageURLs] = useState([]);
  const [additionalInfo, setAdditionalInfo] = useState([]);

  useEffect(() => {
    let p = productData?.data || productData;
    if (p && Object.keys(p).length > 0) {
      setFormData({
        title: p.title || '',
        price: p.price || '',
        discount: p.discount || '',
        quantity: p.quantity || '',
        sku: p.sku || '',
        category: p.category?.id || p.category || '',
        children: p.children || '',
        brand: p.brand?.id || p.brand || '',
        img: p.img || '',
        description: p.description || '',
        sizes: p.sizes ? p.sizes.join(', ') : '',
        unit: p.unit || 'pc',
        status: p.status || 'in-stock',
        tags: p.tags ? p.tags.join(', ') : '',
        slug: p.slug || '',
        featured: p.featured || false
      });
      setImageURLs(p.imageURLs || []);
      setAdditionalInfo(p.additionalInformation || []);
    }
  }, [productData]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formPayload = new FormData();
    formPayload.append('image', file);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:7000'}/api/cloudinary/add-img`, {
        method: 'POST',
        body: formPayload,
      });
      const data = await res.json();
      if (data.success) {
        setFormData(prev => ({ ...prev, img: data.data.url }));
      } else {
        alert('Upload failed: ' + data.message);
      }
    } catch (err) {
      alert('Lỗi tải ảnh lên');
    } finally {
      setUploading(false);
    }
  };

  const handleVariantImageUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;
    const formPayload = new FormData();
    formPayload.append('image', file);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:7000'}/api/cloudinary/add-img`, {
        method: 'POST',
        body: formPayload,
      });
      const data = await res.json();
      if (data.success) {
        updateGalleryImage(index, 'img', data.data.url);
      } else {
        alert('Upload failed: ' + data.message);
      }
    } catch (err) {
      alert('Lỗi tải ảnh lên');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    if (name === 'title') {
      setFormData({ ...formData, [name]: newValue, slug: slugify(newValue) });
    } else {
      setFormData({ ...formData, [name]: newValue });
    }
  };

  // Gallery
  const addGalleryImage = () => setImageURLs([...imageURLs, { color: { name: '', clrCode: '#000000' }, img: '' }]);
  const updateGalleryImage = (index, field, value, isColor = false) => {
    const newURLs = [...imageURLs];
    if (isColor) newURLs[index].color[field] = value;
    else newURLs[index][field] = value;
    setImageURLs(newURLs);
  };
  const removeGalleryImage = (index) => setImageURLs(imageURLs.filter((_, i) => i !== index));

  // Additional Info
  const addInfo = () => setAdditionalInfo([...additionalInfo, { key: '', value: '' }]);
  const updateInfo = (index, field, value) => {
    const newInfo = [...additionalInfo];
    newInfo[index][field] = value;
    setAdditionalInfo(newInfo);
  };
  const removeInfo = (index) => setAdditionalInfo(additionalInfo.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const selectedCategory = categories.find(c => c._id === formData.category);
      const selectedBrand = brands.find(b => b._id === formData.brand);

      if (!selectedCategory) return alert("Vui lòng chọn danh mục");
      if (!selectedBrand) return alert("Vui lòng chọn thương hiệu");
      if (!formData.children) return alert("Vui lòng chọn danh mục con");

      const payload = {
        ...formData,
        price: Number(formData.price),
        discount: formData.discount ? Number(formData.discount) : 0,
        quantity: Number(formData.quantity),
        category: { name: selectedCategory.parent, id: selectedCategory._id },
        parent: selectedCategory.parent,
        brand: { name: selectedBrand.name, id: selectedBrand._id },
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        sizes: formData.sizes ? formData.sizes.split(',').map(t => t.trim()).filter(Boolean) : [],
        productType: 'beauty',
        imageURLs: imageURLs.filter(img => img.img), // only keep if URL is provided
        additionalInformation: additionalInfo.filter(info => info.key && info.value)
      };
      await updateProduct({ id, data: payload }).unwrap();
      router.push('/admin/products');
    } catch (err) {
      console.error(err);
      alert('Cập nhật sản phẩm thất bại');
    }
  };

  if (isFetching) return <AdminLayout title="Edit Product"><div className="d-flex justify-content-center p-5"><Loader loading={true} /></div></AdminLayout>;

  return (
    <AdminLayout title="Edit Product">
      <SEO pageTitle="Edit Product" />
      
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/admin/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--admin-text-sub)', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' }}>
          <ArrowLeft size={18} /> Quay lại danh sách Sản phẩm
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="admin-product-form-container">
        <div className="admin-form-main">
          <div className="glass-panel" style={{ marginBottom: '1rem', padding: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', borderBottom: '1px solid var(--admin-border)', paddingBottom: '0.5rem' }}>Thông tin cơ bản</h3>
            
            <div className="admin-form-group">
              <label>Tên sản phẩm <span style={{color: 'red'}}>*</span></label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} required placeholder="VD: Sữa rửa mặt trị mụn" className="admin-input-premium" />
            </div>

            <div className="admin-form-group">
              <label>Slug (Đường dẫn thân thiện)</label>
              <input type="text" name="slug" value={formData.slug} onChange={handleChange} placeholder="sua-rua-mat-tri-mun" className="admin-input-premium" />
            </div>

            <div className="admin-form-group">
              <label>Mô tả chi tiết <span style={{color: 'red'}}>*</span></label>
              <div style={{ background: '#fff' }}>
                <ReactQuill theme="snow" value={formData.description} onChange={(val) => setFormData({...formData, description: val})} style={{ height: '200px', marginBottom: '50px' }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="admin-form-group">
                <label>Giá bán ($) <span style={{color: 'red'}}>*</span></label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} required placeholder="0.00" className="admin-input-premium" />
              </div>
              <div className="admin-form-group">
                <label>Khuyến mãi (%)</label>
                <input type="number" name="discount" value={formData.discount} onChange={handleChange} placeholder="0" className="admin-input-premium" />
              </div>
            </div>
          </div>

          <div className="glass-panel" style={{ marginBottom: '1rem', padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--admin-border)', paddingBottom: '0.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Thư viện Ảnh & Màu sắc</h3>
              <button type="button" onClick={addGalleryImage} className="admin-btn admin-btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1rem' }}>
                <Plus size={16} /> Thêm Phiên bản Màu
              </button>
            </div>
            
            {imageURLs.length === 0 && <p style={{ color: 'var(--admin-text-sub)' }}>Chưa có ảnh nào được thêm.</p>}
            
            {imageURLs.map((item, index) => (
              <div key={index} style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem', background: '#fff', padding: '1rem', borderRadius: '8px', border: '1px solid var(--admin-border)' }}>
                {/* Preview Image */}
                <div style={{ width: '60px', height: '60px', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--admin-border)', background: '#f8fafc', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {item.img ? (
                    <img src={item.img} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  ) : (
                    <ImageIcon size={20} style={{ color: '#cbd5e1' }} />
                  )}
                </div>

                {/* Inputs Grid */}
                <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 80px 2fr', gap: '1rem', alignItems: 'end' }}>
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '0.75rem', color: 'var(--admin-text-sub)' }}>Tên màu</label>
                    <input type="text" value={item.color?.name || ''} onChange={(e) => updateGalleryImage(index, 'name', e.target.value, true)} placeholder="VD: Hồng" className="admin-input-premium" style={{ padding: '0.4rem' }} />
                  </div>
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '0.75rem', color: 'var(--admin-text-sub)' }}>Mã màu</label>
                    <input type="color" value={item.color?.clrCode || '#000000'} onChange={(e) => updateGalleryImage(index, 'clrCode', e.target.value, true)} style={{ height: '34px', width: '100%', padding: '2px', border: '1px solid var(--admin-border)', borderRadius: '4px', cursor: 'pointer' }} />
                  </div>
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '0.75rem', color: 'var(--admin-text-sub)' }}>URL Ảnh / Tải lên</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input type="text" value={item.img} onChange={(e) => updateGalleryImage(index, 'img', e.target.value)} placeholder="https://..." className="admin-input-premium" style={{ padding: '0.4rem', flex: 1 }} />
                      <label className="admin-btn" style={{ background: '#f1f5f9', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 0, border: '1px solid var(--admin-border)', borderRadius: '6px', width: '34px', height: '34px', padding: 0 }}>
                        <ImageIcon size={16} />
                        <input type="file" accept="image/*" onChange={(e) => handleVariantImageUpload(e, index)} style={{ display: 'none' }} />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Delete Button */}
                <button type="button" onClick={() => removeGalleryImage(index)} className="admin-btn" style={{ padding: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--admin-danger)', height: '34px', width: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', flexShrink: 0 }}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <div className="glass-panel" style={{ marginBottom: '1rem', padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--admin-border)', paddingBottom: '0.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Thông tin Bổ sung</h3>
              <button type="button" onClick={addInfo} className="admin-btn admin-btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1rem' }}>
                <Plus size={16} /> Thêm Thông tin
              </button>
            </div>

            {additionalInfo.length === 0 && <p style={{ color: 'var(--admin-text-sub)' }}>Chưa có thông tin bổ sung.</p>}

            {additionalInfo.map((info, index) => (
              <div key={index} style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                <input type="text" value={info.key} onChange={(e) => updateInfo(index, 'key', e.target.value)} placeholder="Property (e.g. Weight)" className="admin-input-premium" style={{ flex: 1, padding: '0.5rem' }} />
                <input type="text" value={info.value} onChange={(e) => updateInfo(index, 'value', e.target.value)} placeholder="Value (e.g. 50g)" className="admin-input-premium" style={{ flex: 2, padding: '0.5rem' }} />
                <button type="button" onClick={() => removeInfo(index)} className="admin-btn" style={{ padding: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--admin-danger)' }}>
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-form-sidebar">
          <div className="glass-panel" style={{ padding: '1rem', marginBottom: '1rem' }}>
             <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Ảnh đại diện <span style={{color: 'red'}}>*</span></h3>
             <div className="admin-image-upload-box">
                {formData.img ? (
                  <div style={{ position: 'relative' }}>
                    <img src={formData.img} alt="Preview" style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' }} />
                    <button type="button" onClick={() => setFormData({...formData, img: ''})} style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer' }}>×</button>
                  </div>
                ) : (
                  <label style={{ height: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--admin-text-sub)', background: '#f8fafc', border: '2px dashed var(--admin-border)', borderRadius: '8px', cursor: 'pointer' }}>
                    <ImageIcon size={40} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
                    <span>{uploading ? 'Đang tải lên...' : 'Nhấp để Tải Ảnh Lên'}</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} disabled={uploading} />
                  </label>
                )}
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '1rem', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--admin-text-sub)', whiteSpace: 'nowrap' }}>HOẶC Dán URL:</span>
                  <input type="text" name="img" value={formData.img} onChange={handleChange} required placeholder="https://..." className="admin-input-premium" style={{ padding: '0.5rem' }} />
                </div>
             </div>
          </div>

          <div className="glass-panel" style={{ padding: '1rem', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Phân loại</h3>
            
            <div className="admin-form-group">
              <label>Danh mục <span style={{color: 'red'}}>*</span></label>
              <select name="category" value={formData.category} onChange={handleChange} required className="admin-input-premium">
                <option value="">Chọn danh mục</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.parent}</option>
                ))}
              </select>
            </div>

            <div className="admin-form-group">
              <label>Danh mục con <span style={{color: 'red'}}>*</span></label>
              <select name="children" value={formData.children} onChange={handleChange} required className="admin-input-premium" disabled={!formData.category}>
                <option value="">Chọn danh mục con</option>
                {availableChildren.map((child, idx) => (
                  <option key={idx} value={child}>{child}</option>
                ))}
              </select>
            </div>

            <div className="admin-form-group">
              <label>Thương hiệu <span style={{color: 'red'}}>*</span></label>
              <select name="brand" value={formData.brand} onChange={handleChange} required className="admin-input-premium">
                <option value="">Chọn thương hiệu</option>
                {brands.map(b => (
                  <option key={b._id} value={b._id}>{b.name}</option>
                ))}
              </select>
            </div>

            <div className="admin-form-group">
              <label>Kích cỡ / Dung tích (Ngăn cách bởi dấu phẩy)</label>
              <input type="text" name="sizes" value={formData.sizes} onChange={handleChange} placeholder="VD: S, M, L hoặc 50ml, 100ml" className="admin-input-premium" />
            </div>

            <div className="admin-form-group">
              <label>Thẻ (Ngăn cách bởi dấu phẩy)</label>
              <input type="text" name="tags" value={formData.tags} onChange={handleChange} placeholder="VD: tự nhiên, dưỡng da, mặt" className="admin-input-premium" />
            </div>

            <div className="admin-form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} style={{ width: '18px', height: '18px' }} />
                <span style={{ fontWeight: 500 }}>Sản phẩm Nổi bật</span>
              </label>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Kho hàng</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="admin-form-group">
                <label>Số lượng <span style={{color: 'red'}}>*</span></label>
                <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} required placeholder="0" className="admin-input-premium" />
              </div>
              <div className="admin-form-group">
                <label>Đơn vị tính <span style={{color: 'red'}}>*</span></label>
                <input type="text" name="unit" value={formData.unit} onChange={handleChange} required placeholder="hộp, tuýp, ml" className="admin-input-premium" />
              </div>
            </div>

            <div className="admin-form-group">
              <label>Mã SKU (Tùy chọn)</label>
              <input type="text" name="sku" value={formData.sku} onChange={handleChange} placeholder="PRD-XXXX" className="admin-input-premium" />
            </div>

            <div className="admin-form-group">
              <label>Trạng thái</label>
              <select name="status" value={formData.status} onChange={handleChange} className="admin-input-premium">
                <option value="in-stock">Còn hàng</option>
                <option value="out-of-stock">Hết hàng</option>
                <option value="discontinued">Ngừng kinh doanh</option>
              </select>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            <button type="submit" disabled={isLoading} className="admin-btn admin-btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem', fontSize: '1rem', width: '100%', justifyContent: 'center', borderRadius: '8px', boxShadow: '0 4px 12px rgba(9, 137, 255, 0.3)' }}>
              <Save size={20} /> {isLoading ? 'Đang lưu...' : 'Cập nhật Sản phẩm'}
            </button>
          </div>

        </div>
      </form>
    </AdminLayout>
  );
};

export default EditProduct;
