import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Order from '../models/Order.js';
import TrafficLog from '../models/TrafficLog.js';
import AdSpend from '../models/AdSpend.js';

dotenv.config();

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/sharabiastore';

const seedProducts = [
  // 1. Cookware Sets (اطقم)
  {
    name: 'طقم حلل جرانيت تركي 10 قطع',
    slug: 'turkish-granite-10pc',
    description: 'طقم طهي جرانيت تركي فاخر غير لاصق مكون من 4 حلل بمقاسات مختلفة ومقلاة صينية وجريل توزيع حراري مثالي ومقاوم للخدش.',
    price: 1850,
    category: 'اطقم',
    images: ['https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=600&auto=format&fit=crop'],
    sizes: ['عادي'],
    colors: ['وردي', 'رمادي', 'كحلي'],
    stock: 12,
    isFeatured: true
  },
  {
    name: 'طقم مقالي تيفال غير لاصق 3 قطع',
    slug: 'tefal-pan-3pc',
    description: 'مجموعة مقالي تيفال أصلية مكونة من ثلاث قطع بمقاسات (20، 24، 28 سم) مطلية بطبقة تيتانيوم مانعة للالتصاق ومثالية للقلي الصحي.',
    price: 720,
    category: 'اطقم',
    images: ['https://images.unsplash.com/photo-1599940824399-b87987ceb72a?q=80&w=600&auto=format&fit=crop'],
    sizes: ['عادي'],
    colors: ['أسود'],
    stock: 20,
    isFeatured: true
  },
  {
    name: 'طقم طهي ستانلس ستيل كوركماز 9 قطع',
    slug: 'korkmaz-stainless-9pc',
    description: 'طقم حلل ستانلس ستيل تركي كوركماز مقاوم للصدأ ذو قاعدة ثلاثية سميكة لتوزيع الحرارة بالتساوي وتوفير الطاقة في الطهي.',
    price: 2400,
    category: 'اطقم',
    images: ['https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=600&auto=format&fit=crop'],
    sizes: ['عادي'],
    colors: ['فضي'],
    stock: 8,
    isFeatured: true
  },
  {
    name: 'طقم حلل سيراميك كوري 8 قطع',
    slug: 'korean-ceramic-8pc',
    description: 'طقم حلل سيراميك كوري أصلي صديق للبيئة خالٍ من المواد الكيميائية الضارة بمظهر أنيق وملمس ناعم وسهل التنظيف للغاية.',
    price: 1650,
    category: 'اطقم',
    images: ['https://images.unsplash.com/photo-1599940824399-b87987ceb72a?q=80&w=600&auto=format&fit=crop'],
    sizes: ['عادي'],
    colors: ['وردي', 'أخضر فاتح'],
    stock: 10,
    isFeatured: false
  },
  {
    name: 'طقم صواني فرن جرانيت 3 قطع',
    slug: 'granite-oven-tray-3pc',
    description: 'طقم صواني فرن مستطيلة ومستديرة من الجرانيت المقاوم للالتصاق مثالي للمخبوزات وصواني البشاميل والرقاق واللحوم في الفرن.',
    price: 490,
    category: 'اطقم',
    images: ['https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=600&auto=format&fit=crop'],
    sizes: ['عادي'],
    colors: ['بني', 'رمادي'],
    stock: 15,
    isFeatured: false
  },

  // 2. Traditional Cookware (بلدي)
  {
    name: 'حلة ألومنيوم بلدي مقاس 40',
    slug: 'local-aluminum-pot-40',
    description: 'حلة ألومنيوم بلدي ثقيلة مقاس 40 سم مصنعة من ألومنيوم عالي النقاء ممتاز للطهي والولائم الكبيرة والعائلية وتدوم طويلاً.',
    price: 340,
    category: 'بلدي',
    images: ['https://images.unsplash.com/photo-1527018601619-a508a2be00cd?q=80&w=600&auto=format&fit=crop'],
    sizes: ['كبير'],
    colors: ['فضي'],
    stock: 30,
    isFeatured: true
  },
  {
    name: 'طقم صواني بسبوسة ألومنيوم بلدي',
    slug: 'local-basbousa-tray-3pc',
    description: 'طقم صواني بسبوسة وكنافة ألومنيوم بلدي ذو حافة منخفضة مكون من 3 قطع بمقاسات مختلفة لتسوية مثالية للحلويات الشرقية.',
    price: 180,
    category: 'بلدي',
    images: ['https://images.unsplash.com/photo-1527018601619-a508a2be00cd?q=80&w=600&auto=format&fit=crop'],
    sizes: ['عادي'],
    colors: ['فضي'],
    stock: 40,
    isFeatured: true
  },
  {
    name: 'طاجن فخار بلدي أسواني كبير',
    slug: 'local-aswan-clay-tagine',
    description: 'طاجن فخار بلدي طبيعي أسواني أصلي بدون جليز صحي تماماً ويعطي نكهة مميزة للأكلات الشرقية واللحوم والخضار بالفرن.',
    price: 120,
    category: 'بلدي',
    images: ['https://images.unsplash.com/photo-1527018601619-a508a2be00cd?q=80&w=600&auto=format&fit=crop'],
    sizes: ['كبير', 'وسط'],
    colors: ['بني طيني'],
    stock: 50,
    isFeatured: false
  },
  {
    name: 'قدرة فول ألومنيوم بلدي وسط',
    slug: 'local-fava-bean-pot',
    description: 'الدماسة التقليدية لتدميس الفول في المنزل ألومنيوم ثقيل بغطاء محكم لتسوية هادئة وممتازة للفول المدمس البيتي.',
    price: 95,
    category: 'بلدي',
    images: ['https://images.unsplash.com/photo-1527018601619-a508a2be00cd?q=80&w=600&auto=format&fit=crop'],
    sizes: ['وسط'],
    colors: ['فضي'],
    stock: 25,
    isFeatured: false
  },
  {
    name: 'كازرولة ألومنيوم بلدي بيد خشبية',
    slug: 'local-wooden-handle-casserole',
    description: 'كازرولة ألومنيوم بلدي صغيرة لغلي اللبن أو عمل الصلصات مجهزة بيد خشبية عازلة للحرارة لسهولة الاستخدام والاستعمال اليومي.',
    price: 85,
    category: 'بلدي',
    images: ['https://images.unsplash.com/photo-1527018601619-a508a2be00cd?q=80&w=600&auto=format&fit=crop'],
    sizes: ['صغير'],
    colors: ['فضي'],
    stock: 35,
    isFeatured: false
  },

  // 3. Kitchen Utensils (رفايع)
  {
    name: 'طقم توزيع سيليكون حراري 6 قطع',
    slug: 'thermal-silicone-set-6pc',
    description: 'طقم ملاعق ومغارف توزيع سيليكون حراري غير قابل للتفاعل مع الطعام يد خشبية أنيقة ومقاوم لدرجات الحرارة حتى 230 درجة.',
    price: 290,
    category: 'رفايع',
    images: ['https://images.unsplash.com/photo-1590794056226-79ef3a814c2f?q=80&w=600&auto=format&fit=crop'],
    sizes: ['عادي'],
    colors: ['رمادي', 'أخضر نعناعي', 'أسود'],
    stock: 22,
    isFeatured: true
  },
  {
    name: 'قطاعة خضروات وبصل يدوية سريعة',
    slug: 'quick-vegetable-chopper',
    description: 'مفرمة خضروات وبصل ولحوم خفيفة يدوية سريعة بحبل سحب وشفرات ستانلس ستيل حادة تسهل تحضير مكونات الطعام بضغطة زر.',
    price: 110,
    category: 'رفايع',
    images: ['https://images.unsplash.com/photo-1590794056226-79ef3a814c2f?q=80&w=600&auto=format&fit=crop'],
    sizes: ['عادي'],
    colors: ['أبيض وأخضر'],
    stock: 30,
    isFeatured: true
  },
  {
    name: 'طقم سكاكين مطبخ حادة 5 قطع مع حامل',
    slug: 'kitchen-knives-5pc-holder',
    description: 'طقم سكاكين مطبخ حادة مصنعة من الحديد المقاوم للصدأ ومجهزة بمقابض مريحة مع حامل خشبي أنيق لتنظيم مطبخك.',
    price: 450,
    category: 'رفايع',
    images: ['https://images.unsplash.com/photo-1590794056226-79ef3a814c2f?q=80&w=600&auto=format&fit=crop'],
    sizes: ['عادي'],
    colors: ['فضي وأسود'],
    stock: 14,
    isFeatured: true
  },
  {
    name: 'غلاية مياه ستانلس ستيل 1.8 لتر',
    slug: 'kettle-stainless-18l',
    description: 'كاتل غلاية مياه كهربائية سريعة مصنوعة من الستانلس ستيل الصحي بسعة 1.8 لتر وقوة 1500 وات مع حماية ضد الغليان الجاف.',
    price: 240,
    category: 'رفايع',
    images: ['https://images.unsplash.com/photo-1590794056226-79ef3a814c2f?q=80&w=600&auto=format&fit=crop'],
    sizes: ['1.8 لتر'],
    colors: ['فضي'],
    stock: 18,
    isFeatured: false
  },
  {
    name: 'مبشرة خضروات ستانلس ستيل رباعية الجوانب',
    slug: 'vegetable-grater-4side',
    description: 'مبشرة خضروات وجبن متعددة الجوانب مصنوعة من الستانلس ستيل ذو قاعدة مطاطية مانعة للانزلاق ومقبض مريح للاستخدام اليومي.',
    price: 75,
    category: 'رفايع',
    images: ['https://images.unsplash.com/photo-1590794056226-79ef3a814c2f?q=80&w=600&auto=format&fit=crop'],
    sizes: ['عادي'],
    colors: ['فضي'],
    stock: 45,
    isFeatured: false
  },
  {
    name: 'مقص مطبخ ستانلس ستيل متعدد الاستخدامات',
    slug: 'multipurpose-kitchen-scissors',
    description: 'مقص مطبخ حاد جداً لتقطيع الدواجن واللحوم وفتح العبوات وكسر البندق بمقابض مريحة آمن لغسالة الأطباق.',
    price: 65,
    category: 'رفايع',
    images: ['https://images.unsplash.com/photo-1590794056226-79ef3a814c2f?q=80&w=600&auto=format&fit=crop'],
    sizes: ['عادي'],
    colors: ['أسود'],
    stock: 50,
    isFeatured: false
  }
];

const seedDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB successfully.');

    // 1. CLEAR COLLECTIONS
    await Product.deleteMany({});
    await User.deleteMany({});
    await Order.deleteMany({});
    await TrafficLog.deleteMany({});
    await AdSpend.deleteMany({});
    console.log('Cleared existing data.');

    // 2. SEED PRODUCTS
    const insertedProducts = await Product.insertMany(seedProducts);
    console.log(`Seeded ${insertedProducts.length} products successfully!`);

    // 3. SEED ADMIN USER
    const adminUser = await User.create({
      name: 'Admin',
      email: 'admin@sharabia.com',
      password: '123456',
      role: 'admin'
    });
    console.log(`Seeded Admin User: ${adminUser.email}`);

    // Seed 4 Customer Users
    const customerUsersData = [
      {
        name: 'أحمد محمد',
        email: 'ahmed@gmail.com',
        password: '123456',
        phone: '01090600301',
        address: 'القاهرة، مصر الجديدة',
        role: 'customer'
      },
      {
        name: 'سارة علي',
        email: 'sara@gmail.com',
        password: '123456',
        phone: '01123456789',
        address: 'الجيزة، الدقي',
        role: 'customer'
      },
      {
        name: 'محمود حسين',
        email: 'mahmoud@gmail.com',
        password: '123456',
        phone: '01222233344',
        address: 'الإسكندرية، سموحة',
        role: 'customer'
      },
      {
        name: 'ياسمين مصطفى',
        email: 'yasmin@gmail.com',
        password: '123456',
        phone: '01511223344',
        address: 'القليوبية، بنها',
        role: 'customer'
      }
    ];

    // Note: User.insertMany does not trigger the 'save' pre-hook for hashing passwords when using insertMany unless we specify it or create them, or we can use User.create which hashes passwords correctly. Let's use User.create for each.
    const insertedCustomers = [];
    for (const cust of customerUsersData) {
      const created = await User.create(cust);
      insertedCustomers.push(created);
    }
    console.log(`Seeded ${insertedCustomers.length} Customer Users successfully!`);

    // 4. SEED SAMPLE ORDERS FOR ANALYTICS (Last 7 days)
    const orderDates = Array.from({ length: 15 }).map((_, idx) => {
      const d = new Date();
      d.setDate(d.getDate() - (idx % 7)); // Spread dates over last 7 days
      return d;
    });

    const channels = ['facebook', 'facebook', 'facebook', 'google', 'google', 'email', 'direct'];

    const sampleOrders = Array.from({ length: 15 }).map((_, idx) => {
      const product = insertedProducts[idx % insertedProducts.length];
      const customerUser = insertedCustomers[idx % insertedCustomers.length];
      const quantity = (idx % 2) + 1;
      const subtotal = product.price * quantity;
      const shippingCost = 0;
      const tax = Math.round((subtotal * 0.08) * 100) / 100;
      const total = Math.round((subtotal + tax) * 100) / 100;

      // Status distributions
      const statusOptions = ['pending_approval', 'succeeded', 'failed', 'processing', 'shipped'];
      const orderStatus = statusOptions[idx % statusOptions.length];
      
      let paymentStatus = 'pending';
      if (orderStatus === 'succeeded' || orderStatus === 'shipped') {
        paymentStatus = 'paid';
      } else if (orderStatus === 'failed') {
        paymentStatus = 'failed';
      }

      return {
        orderNumber: `SHR-${(idx + 10).toString()}${Date.now().toString().slice(-4)}`,
        userId: customerUser._id,
        customer: {
          name: customerUser.name,
          phone: customerUser.phone,
          address: customerUser.address,
          email: customerUser.email
        },
        items: [{
          productId: product._id,
          name: product.name,
          price: product.price,
          quantity,
          size: 'عادي',
          color: product.colors[0] || 'Default',
          image: product.images[0]
        }],
        shippingMethod: 'standard',
        shippingCost,
        subtotal,
        tax,
        total,
        paymentStatus,
        orderStatus,
        utmSource: channels[idx % channels.length],
        createdAt: orderDates[idx]
      };
    });

    const insertedOrders = await Order.insertMany(sampleOrders);
    console.log(`Seeded ${insertedOrders.length} orders successfully!`);

    // 5. SEED AD SPENDS FOR MARKETING EFFICIENCY
    const channelsSpends = [
      { channel: 'facebook', spend: 450, impressions: 8500, date: new Date() },
      { channel: 'facebook', spend: 350, impressions: 7200, date: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      { channel: 'facebook', spend: 500, impressions: 9000, date: new Date(Date.now() - 48 * 60 * 60 * 1000) },
      { channel: 'google', spend: 300, impressions: 6000, date: new Date() },
      { channel: 'google', spend: 280, impressions: 5500, date: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      { channel: 'google', spend: 320, impressions: 6400, date: new Date(Date.now() - 48 * 60 * 60 * 1000) },
      { channel: 'email', spend: 50, impressions: 1200, date: new Date() },
      { channel: 'email', spend: 50, impressions: 1100, date: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    ];

    const insertedSpends = await AdSpend.insertMany(channelsSpends);
    console.log(`Seeded ${insertedSpends.length} ad spend entries successfully!`);

    // 6. SEED TRAFFIC LOGS FOR FUNNEL SIMULATION (250 Views, 180 product views, 85 cart_add, 40 checkout_start)
    const logs = [];
    const activeSessionIds = Array.from({ length: 110 }).map((_, idx) => `sess_user_${idx}`);
    
    // Add views
    activeSessionIds.forEach((sess, idx) => {
      const source = channels[idx % channels.length];
      logs.push({
        path: '/',
        sessionID: sess,
        utmSource: source,
        action: 'view',
        createdAt: orderDates[idx % orderDates.length]
      });

      // 80% view a product detail page
      if (idx < 90) {
        const product = insertedProducts[idx % insertedProducts.length];
        logs.push({
          path: `/product/${product.slug}`,
          sessionID: sess,
          utmSource: source,
          action: 'view',
          createdAt: orderDates[idx % orderDates.length]
        });
      }

      // 40% add to cart
      if (idx < 45) {
        logs.push({
          path: '/cart',
          sessionID: sess,
          utmSource: source,
          action: 'cart_add',
          createdAt: orderDates[idx % orderDates.length]
        });
      }

      // 20% initiate checkout
      if (idx < 22) {
        logs.push({
          path: '/checkout',
          sessionID: sess,
          utmSource: source,
          action: 'checkout_start',
          createdAt: orderDates[idx % orderDates.length]
        });
      }
    });

    const insertedLogs = await TrafficLog.insertMany(logs);
    console.log(`Seeded ${insertedLogs.length} traffic log views successfully!`);

    await mongoose.disconnect();
    console.log('Database connection closed.');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seedDB();
