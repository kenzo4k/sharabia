import * as React from 'react';
import { Plus, Edit2, Trash2, Search, X, Image as ImageIcon } from 'lucide-react';
import api from '@/services/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import Loader from '@/components/shared/Loader';
import { toast } from 'sonner';

export default function AdminProducts() {
  const [products, setProducts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  
  // Form State
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState(null);
  const [formData, setFormData] = React.useState({
    name: '',
    description: '',
    price: '',
    category: 'بلدي',
    stock: '10',
    images: [],
    sizes: ['عادي'],
    colors: [],
    isFeatured: false
  });

  const categories = ['بلدي', 'اطقم', 'رفايع'];

  const fetchProducts = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get(`/products?page=${currentPage}&limit=10&search=${searchQuery}`);
      setProducts(data.products || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (err) {
      console.error('Failed to load products:', err);
      toast.error('فشل في تحميل المنتجات');
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery]);

  React.useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Convert uploaded image to base64
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    files.forEach((file) => {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('حجم الصورة يجب أن لا يتجاوز 2 ميجابايت');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, reader.result]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'بلدي',
      stock: '10',
      images: [],
      sizes: ['عادي'],
      colors: [],
      isFeatured: false
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingId(product._id);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: String(product.price),
      category: product.category,
      stock: String(product.stock || 10),
      images: product.images || [],
      sizes: product.sizes || ['عادي'],
      colors: product.colors || [],
      isFeatured: !!product.isFeatured
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;

    try {
      await api.delete(`/products/${id}`);
      toast.success('تم حذف المنتج بنجاح');
      fetchProducts();
    } catch (err) {
      console.error(err);
      toast.error('حدث خطأ أثناء حذف المنتج');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.category) {
      toast.error('الرجاء تعبئة الحقول الإلزامية');
      return;
    }

    const payload = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock)
    };

    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
        toast.success('تم تعديل المنتج بنجاح');
      } else {
        await api.post('/products', payload);
        toast.success('تم إضافة المنتج بنجاح');
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'فشلت العملية');
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* HEADER & ADD BUTTON */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-5 flex-row-reverse">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">إدارة المنتجات</h1>
          <p className="text-slate-500 text-xs mt-1">تصفح وتعديل وإضافة منتجات جديدة للمتجر.</p>
        </div>
        <Button 
          variant="primary" 
          onClick={handleOpenAddModal}
          className="bg-orange-600 hover:bg-orange-500 text-white font-bold h-10 cursor-pointer flex items-center gap-2 flex-row-reverse"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>إضافة منتج جديد</span>
        </Button>
      </div>

      {/* SEARCH FILTERS */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-4">
          <form onSubmit={handleSearchSubmit} className="flex gap-2 flex-row-reverse">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="ابحث عن منتج بالاسم..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-9 text-right bg-slate-50 border-slate-200 focus:bg-white text-sm"
              />
            </div>
            <Button type="submit" variant="secondary" className="cursor-pointer">
              بحث
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* PRODUCTS TABLE */}
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          {loading ? (
            <div className="py-20"><Loader /></div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 text-slate-400 text-sm">
              لا توجد منتجات مطابقة للبحث أو معروضة حالياً.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                    <th className="p-4 text-right">الصورة</th>
                    <th className="p-4 text-right">الاسم</th>
                    <th className="p-4 text-right">القسم</th>
                    <th className="p-4 text-right">السعر</th>
                    <th className="p-4 text-right">المخزون</th>
                    <th className="p-4 text-right">مميز</th>
                    <th className="p-4 text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map((product) => (
                    <tr key={product._id} className="hover:bg-slate-50/50">
                      <td className="p-4">
                        <div className="h-11 w-11 rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                          {product.images?.[0] ? (
                            <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-slate-400"><ImageIcon className="h-5 w-5" /></div>
                          )}
                        </div>
                      </td>
                      <td className="p-4 font-semibold text-slate-800">{product.name}</td>
                      <td className="p-4">
                        <Badge className="bg-orange-50 text-orange-700 border-orange-100">{product.category}</Badge>
                      </td>
                      <td className="p-4 font-bold text-slate-700">{product.price} جنيه</td>
                      <td className="p-4">
                        <span className={product.stock <= 3 ? 'text-red-500 font-bold' : 'text-slate-600'}>
                          {product.stock} قطع
                        </span>
                      </td>
                      <td className="p-4">
                        {product.isFeatured ? (
                          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100">نعم</Badge>
                        ) : (
                          <span className="text-slate-400 text-xs">لا</span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex justify-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleOpenEditModal(product)}
                            className="h-8 w-8 p-0 border-slate-200 text-slate-600 hover:text-orange-600 cursor-pointer"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleDelete(product._id)}
                            className="h-8 w-8 p-0 border-slate-200 text-slate-600 hover:text-red-600 cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4 flex-row-reverse">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="cursor-pointer"
          >
            السابق
          </Button>
          <span className="text-slate-600 text-xs font-semibold">
            صفحة {currentPage} من {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="cursor-pointer"
          >
            التالي
          </Button>
        </div>
      )}

      {/* EDIT/ADD PRODUCT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 text-right space-y-6">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 flex-row-reverse">
              <h2 className="text-xl font-bold text-slate-800">
                {editingId ? 'تعديل بيانات المنتج' : 'إضافة منتج جديد'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 col-span-2">
                  <Label htmlFor="name">اسم المنتج <span className="text-red-500">*</span></Label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    placeholder="طقم حلل جرانيت فاخر" 
                    className="text-right"
                    required
                  />
                </div>

                <div className="space-y-1.5 col-span-2">
                  <Label htmlFor="description">وصف المنتج</Label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="اكتب تفاصيل وميزات المنتج هنا..."
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-right bg-transparent focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="price">السعر (جنيه) <span className="text-red-500">*</span></Label>
                  <Input 
                    id="price" 
                    name="price" 
                    type="number"
                    value={formData.price} 
                    onChange={handleInputChange} 
                    placeholder="500" 
                    className="text-right"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="category">القسم <span className="text-red-500">*</span></Label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 h-10.5 border border-slate-200 rounded-lg text-sm text-right bg-transparent focus:outline-none focus:border-orange-500"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="stock">الكمية بالمخزن</Label>
                  <Input 
                    id="stock" 
                    name="stock" 
                    type="number"
                    value={formData.stock} 
                    onChange={handleInputChange} 
                    placeholder="10" 
                    className="text-right"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 h-full pt-6">
                  <Label htmlFor="isFeatured" className="cursor-pointer">تثبيت كمنتج مميز في الصفحة الرئيسية</Label>
                  <input
                    id="isFeatured"
                    name="isFeatured"
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={handleInputChange}
                    className="h-4.5 w-4.5 rounded border-slate-300 text-orange-600 focus:ring-orange-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* IMAGE UPLOAD & GALLERY */}
              <div className="space-y-2.5">
                <Label>صور المنتج (يمكنك رفع أكثر من صورة)</Label>
                
                {/* Upload Trigger Area */}
                <div className="border-2 border-dashed border-slate-200 hover:border-orange-400 rounded-xl p-6 text-center cursor-pointer transition-all relative">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <ImageIcon className="h-8 w-8 mx-auto text-slate-400 mb-2" />
                  <p className="text-xs text-slate-600 font-semibold">اسحب أو اختر صور للمنتج هنا</p>
                  <p className="text-[10px] text-slate-400 mt-1">امتدادات JPG, PNG. حجم أقل من 2 ميجابايت</p>
                </div>

                {/* Uploaded Base64 Thumbnails */}
                {formData.images.length > 0 && (
                  <div className="flex flex-wrap gap-3 pt-2">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="h-16 w-16 rounded-lg overflow-hidden border border-slate-200 relative group bg-slate-50">
                        <img src={img} alt="preview" className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Form Buttons */}
              <div className="flex gap-3 justify-start pt-4 border-t border-slate-100">
                <Button
                  type="submit"
                  variant="primary"
                  className="bg-orange-600 hover:bg-orange-500 text-white font-bold h-11 px-6 cursor-pointer"
                >
                  {editingId ? 'حفظ التعديلات' : 'إضافة المنتج'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="border-slate-200 text-slate-500 hover:bg-slate-50 h-11 px-6 cursor-pointer"
                >
                  إلغاء
                </Button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
