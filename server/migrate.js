import pool from './db.js';
import bcrypt from 'bcryptjs';

async function migrate() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // ── Admins ──
    await client.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // ── Site Settings (key-value) ──
    await client.query(`
      CREATE TABLE IF NOT EXISTS site_settings (
        key VARCHAR(150) PRIMARY KEY,
        value TEXT NOT NULL DEFAULT '',
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // ── Hero Slides ──
    await client.query(`
      CREATE TABLE IF NOT EXISTS hero_slides (
        id SERIAL PRIMARY KEY,
        image VARCHAR(500) NOT NULL,
        sort_order INT DEFAULT 0
      )
    `);

    // ── Procedures ──
    await client.query(`
      CREATE TABLE IF NOT EXISTS procedures (
        id SERIAL PRIMARY KEY,
        slug VARCHAR(100) UNIQUE NOT NULL,
        category VARCHAR(50) NOT NULL DEFAULT 'injection',
        name VARCHAR(200) NOT NULL,
        description TEXT DEFAULT '',
        image VARCHAR(500) DEFAULT '',
        sort_order INT DEFAULT 0,
        is_popular BOOLEAN DEFAULT false,
        popular_name VARCHAR(200) DEFAULT '',
        popular_description VARCHAR(500) DEFAULT '',
        popular_image VARCHAR(500) DEFAULT '',
        detail_description TEXT DEFAULT '',
        benefits JSONB DEFAULT '[]',
        steps JSONB DEFAULT '[]',
        video_url VARCHAR(500) DEFAULT '',
        duration VARCHAR(100) DEFAULT '',
        price_from VARCHAR(100) DEFAULT ''
      )
    `);
    // Add columns if missing (for existing databases)
    await client.query(`ALTER TABLE procedures ADD COLUMN IF NOT EXISTS duration VARCHAR(100) DEFAULT ''`);
    await client.query(`ALTER TABLE procedures ADD COLUMN IF NOT EXISTS price_from VARCHAR(100) DEFAULT ''`);

    // ── Team Members ──
    await client.query(`
      CREATE TABLE IF NOT EXISTS team_members (
        id SERIAL PRIMARY KEY,
        slug VARCHAR(100) UNIQUE NOT NULL,
        name VARCHAR(200) NOT NULL,
        role VARCHAR(200) DEFAULT '',
        specialization VARCHAR(200) DEFAULT '',
        image VARCHAR(500) DEFAULT '',
        sort_order INT DEFAULT 0
      )
    `);

    // ── FAQs ──
    await client.query(`
      CREATE TABLE IF NOT EXISTS faqs (
        id SERIAL PRIMARY KEY,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        sort_order INT DEFAULT 0
      )
    `);

    // ── Results (Before/After) ──
    await client.query(`
      CREATE TABLE IF NOT EXISTS results (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT DEFAULT '',
        before_image VARCHAR(500) DEFAULT '',
        after_image VARCHAR(500) DEFAULT '',
        sort_order INT DEFAULT 0
      )
    `);

    // ── Reels (Video Gallery) ──
    await client.query(`
      CREATE TABLE IF NOT EXISTS reels (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT DEFAULT '',
        thumbnail VARCHAR(500) DEFAULT '',
        video_url TEXT DEFAULT '',
        sort_order INT DEFAULT 0
      )
    `);
    // Expand video_url to TEXT for existing databases
    await client.query(`ALTER TABLE reels ALTER COLUMN video_url TYPE TEXT`);

    // ── Offers ──
    await client.query(`
      CREATE TABLE IF NOT EXISTS offers (
        id SERIAL PRIMARY KEY,
        badge_text VARCHAR(200) DEFAULT '',
        title VARCHAR(200) DEFAULT '',
        subtitle VARCHAR(200) DEFAULT '',
        description TEXT DEFAULT '',
        old_price VARCHAR(50) DEFAULT '',
        new_price VARCHAR(50) DEFAULT '',
        image VARCHAR(500) DEFAULT '',
        is_active BOOLEAN DEFAULT true
      )
    `);

    // ── Course Mentors ──
    await client.query(`
      CREATE TABLE IF NOT EXISTS course_mentors (
        id SERIAL PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        role VARCHAR(200) DEFAULT '',
        image VARCHAR(500) DEFAULT '',
        sort_order INT DEFAULT 0
      )
    `);

    // ── Bookings ──
    await client.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        name VARCHAR(200),
        phone VARCHAR(50),
        email VARCHAR(200),
        procedure_name VARCHAR(200),
        doctor VARCHAR(200),
        date VARCHAR(50),
        time VARCHAR(50),
        comment TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        source VARCHAR(50) DEFAULT 'website',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // ── Contact Messages ──
    await client.query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id SERIAL PRIMARY KEY,
        name VARCHAR(200),
        phone VARCHAR(50),
        email VARCHAR(200),
        message TEXT,
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // ── Course Registrations ──
    await client.query(`
      CREATE TABLE IF NOT EXISTS course_registrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(200),
        email VARCHAR(200),
        phone VARCHAR(50),
        experience VARCHAR(50),
        message TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // ── Nav Items ──
    await client.query(`
      CREATE TABLE IF NOT EXISTS nav_items (
        id SERIAL PRIMARY KEY,
        label VARCHAR(200) NOT NULL,
        path VARCHAR(200) NOT NULL,
        icon VARCHAR(50) DEFAULT '',
        is_visible BOOLEAN DEFAULT true,
        is_special BOOLEAN DEFAULT false,
        is_cta BOOLEAN DEFAULT false,
        open_in_new_tab BOOLEAN DEFAULT false,
        sort_order INT DEFAULT 0
      )
    `);

    // ══ SEED DEFAULT DATA ══

    // Default admin (admin / admin123)
    const adminExists = await client.query('SELECT id FROM admins LIMIT 1');
    if (adminExists.rows.length === 0) {
      const hash = await bcrypt.hash('admin123', 10);
      await client.query('INSERT INTO admins (username, password_hash) VALUES ($1, $2)', ['admin', hash]);
      console.log('✓ Default admin created: admin / admin123');
    }

    // Site settings
    const settings = [
      ['site.title', 'Entourage'],
      ['site.tagline', 'პრემიუმ ესთეტიკური ცენტრი, სადაც სილამაზე ხვდება პროფესიონალიზმს.'],
      ['site.meta_title', 'Entourage - ბაია კონდრატიევას ესთეტიკური ცენტრი'],
      ['site.meta_description', 'პრემიუმ ესთეტიკური ცენტრი თბილისში - ბოტოქსი, ფილერები, ბიორევიტალიზაცია და სხვა თანამედროვე პროცედურები'],
      ['contact.phone', '032 219 54 00'],
      ['contact.email', 'info@enturage.ge'],
      ['contact.address', 'წყნეთის გზატკეცილი 49'],
      ['contact.city', 'თბილისი, საქართველო'],
      ['contact.hours', 'ყოველდღე: 10:00 - 21:00'],
      ['hero.badge', 'პრემიუმ ესთეტიკური ცენტრი'],
      ['hero.title_line1', 'სილამაზე'],
      ['hero.title_line2', 'დეტალებშია'],
      ['hero.subtitle', 'აღმოაჩინეთ სილამაზის ახალი სტანდარტები ბაია კონდრატიევას ესთეტიკურ ცენტრში.'],
      ['hero.cta_primary', 'დაჯავშნე კონსულტაცია'],
      ['hero.cta_secondary', 'პროცედურები'],
      ['founder.name', 'ბაია კონდრატიევა'],
      ['founder.badge', 'დამფუძნებელი'],
      ['founder.quote', '"ჩემი მიზანია, ყველა ჩემს პაციენტს მივანიჭო თავდაჯერებულობა. ჩვენთან სილამაზე უსაფრთხოა."'],
      ['founder.image', 'https://ihost.ge/s3/site-entourage-ge/images/about/founder.jpg'],
      ['founder.stat1_value', '15+'],
      ['founder.stat1_label', 'წლიანი გამოცდილება'],
      ['founder.stat2_value', '10k+'],
      ['founder.stat2_label', 'ბედნიერი პაციენტი'],
      ['why.badge', 'რატომ Entourage?'],
      ['why.title_line1', 'სილამაზის'],
      ['why.title_line2', 'ახალი სტანდარტი'],
      ['why.subtitle', 'ჩვენ ვაერთიანებთ სამედიცინო პროფესიონალიზმს და ესთეტიკურ ხედვას საუკეთესო შედეგისთვის.'],
      ['why.cta_title', 'მზად ხართ ცვლილებებისთვის?'],
      ['why.cta_text', 'დაჯავშნეთ ვიზიტი უფასო კონსულტაციაზე და მიიღეთ ინდივიდუალური გეგმა.'],
      ['why.feature1_title', 'ექსპერტიზა'],
      ['why.feature1_desc', 'საერთაშორისო დონის სერტიფიცირებული ექიმები და 15+ წლიანი გამოცდილება.'],
      ['why.feature2_title', 'უსაფრთხოება'],
      ['why.feature2_desc', 'სტერილიზაციის უმაღლესი სტანდარტები და FDA დამტკიცებული პრეპარატები.'],
      ['why.feature3_title', 'ტექნოლოგიები'],
      ['why.feature3_desc', 'უახლესი თაობის აპარატურა მსოფლიო წამყვანი მწარმოებლებისგან.'],
      ['why.feature4_title', 'კომფორტი'],
      ['why.feature4_desc', 'პრემიუმ გარემო და ინდივიდუალური ზრუნვა თითოეულ პაციენტზე.'],
      ['popular.title', 'პოპულარული პროცედურები'],
      ['popular.subtitle', 'ჩვენი ყველაზე მოთხოვნადი ესთეტიკური სერვისები, რომლებიც დაგეხმარებათ იგრძნოთ თავი თავდაჯერებულად.'],
      ['faq.title', 'ხშირად დასმული კითხვები'],
      ['faq.subtitle', 'პასუხები თქვენს ყველა კითხვაზე'],
      ['reels.title', 'ვიდეო გალერეა'],
      ['reels.subtitle', 'ნახეთ პროცედურების მიმდინარეობა და შედეგები'],
      ['course.badge', 'სერტიფიცირებული პროგრამა'],
      ['course.title_line1', 'ლაზერული თერაპიის'],
      ['course.title_line2', 'სრული კურსი'],
      ['course.subtitle', 'დაეუფლე თანამედროვე ესთეტიკური მედიცინის ერთ-ერთ ყველაზე მოთხოვნად მიმართულებას პროფესიონალებთან ერთად.'],
      ['course.about_title', 'კურსის შესახებ'],
      ['course.about_text', 'ეს ინტენსიური კურსი განკუთვნილია როგორც დამწყები, ისე მოქმედი სპეციალისტებისთვის. პროგრამა მოიცავს თეორიულ საფუძვლებს და პრაქტიკულ მუშაობას უახლესი თაობის აპარატურაზე.'],
      ['course.features', JSON.stringify(['აპარატურის შესწავლა', 'უსაფრთხოების ნორმები', 'პრაქტიკა მოდელებზე', 'საერთაშორისო სერტიფიკატი'])],
    ];

    for (const [key, value] of settings) {
      await client.query(
        'INSERT INTO site_settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO NOTHING',
        [key, value]
      );
    }
    console.log('✓ Site settings seeded');

    // Hero slides
    const slidesExist = await client.query('SELECT id FROM hero_slides LIMIT 1');
    if (slidesExist.rows.length === 0) {
      const slides = [
        'https://ihost.ge/s3/site-entourage-ge/images/hero/hero-slide-1.jpg',
        'https://ihost.ge/s3/site-entourage-ge/images/hero/hero-slide-2.jpg',
        'https://ihost.ge/s3/site-entourage-ge/images/hero/hero-slide-3.jpg',
      ];
      for (let i = 0; i < slides.length; i++) {
        await client.query('INSERT INTO hero_slides (image, sort_order) VALUES ($1, $2)', [slides[i], i]);
      }
      console.log('✓ Hero slides seeded');
    }

    // Procedures
    const procsExist = await client.query('SELECT id FROM procedures LIMIT 1');
    if (procsExist.rows.length === 0) {
      const img = (name) => `https://ihost.ge/s3/site-entourage-ge/images/procedures/${name}.jpg`;
      const procs = [
        { slug: 'botulinum-therapy', category: 'injection', name: 'ბოტულინოთერაპია (ბოტოქსი)', description: 'მიმიკური ნაოჭების გასწორება და პრევენცია ბოტულინის ტოქსინით', image: img('botox'), is_popular: true, popular_name: 'ბოტოქსი', popular_description: 'ნაოჭების შემცირება და პრევენცია', popular_image: img('botox'), detail_description: 'ბოტულინოთერაპია არის ერთ-ერთი ყველაზე პოპულარული და ეფექტური ესთეტიკური პროცედურა. ბოტულინის ტოქსინის მიკრო-ინექციები დროებით აკავებს კუნთების მოძრაობას, რაც ამცირებს მიმიკურ ნაოჭებს შუბლზე, ცხვირის ხიდზე და თვალების გარშემო. შედეგი ბუნებრივია და 4-6 თვე გრძელდება.', benefits: JSON.stringify(['მიმიკური ნაოჭების შემცირება', 'ნაოჭების პრევენცია', 'ჰიპერჰიდროზის მკურნალობა', 'სწრაფი პროცედურა (15-20 წთ)', 'მინიმალური დისკომფორტი', 'ბუნებრივი შედეგი']), steps: JSON.stringify(['კონსულტაცია და ზონების შეფასება', 'სახის დეზინფექცია', 'ბოტულინის ინექცია', 'პოსტ-პროცედურული რეკომენდაციები']), duration: '15-20 წუთი', price_from: '200₾' },
        { slug: 'biorevitalization', category: 'injection', name: 'ბიორევიტალიზაცია', description: 'კანის ღრმა დატენიანება და აღდგენა ჰიალურონის მჟავით', image: img('facial-treatment'), is_popular: true, popular_name: 'ბიორევიტალიზაცია', popular_description: 'კანის ღრმა დატენიანება', popular_image: img('facial-treatment'), detail_description: 'ბიორევიტალიზაცია არის კანის ღრმა დატენიანებისა და რეგენერაციის პროცედურა, რომელიც ეფუძნება ჰიალურონის მჟავის ინექციებს კანქვეშ. პროცედურა ააქტიურებს კოლაგენის წარმოქმნას, აუმჯობესებს კანის ტექსტურას, ელასტიურობას და ბრწყინვალებას.', benefits: JSON.stringify(['კანის ღრმა დატენიანება', 'კოლაგენის სტიმულაცია', 'კანის ტექსტურის გაუმჯობესება', 'ელასტიურობის აღდგენა', 'ბუნებრივი ბრწყინვალება']), steps: JSON.stringify(['კანის ანალიზი', 'ანესთეზიის კრემი', 'ჰიალურონის ინექციები', 'დამატენიანებელი ნიღაბი']), duration: '30-40 წუთი', price_from: '250₾' },
        { slug: 'mesotherapy', category: 'injection', name: 'მეზოთერაპია', description: 'ვიტამინების და აქტიური ნივთიერებების მიკრო-ინექციები კანში', image: img('skin-care'), is_popular: true, popular_name: 'მეზოთერაპია', popular_description: 'კანის გამაჯანსაღებელი კოქტეილები', popular_image: img('skin-care'), detail_description: 'მეზოთერაპია მოიცავს ვიტამინების, ამინომჟავებისა და მინერალების კოქტეილების ინექციას კანის შუა ფენაში. ეს პროცედურა ეფექტურად ებრძვის კანის უხარისხობას, პიგმენტაციას, ნაოჭებსა და თმის ცვენას.', benefits: JSON.stringify(['კანის გაჯანსაღება', 'პიგმენტაციის შემცირება', 'თმის ცვენის საწინააღმდეგო', 'კანის ტონუსის ამაღლება', 'ინდივიდუალური კოქტეილები']), steps: JSON.stringify(['დიაგნოსტიკა', 'კოქტეილის შერჩევა', 'მიკრო-ინექციები', 'SPF დაცვა']), duration: '30-45 წუთი', price_from: '150₾' },
        { slug: 'plasmotherapy', category: 'injection', name: 'პლაზმოთერაპია', description: 'კანის რეგენერაცია საკუთარი სისხლის თრომბოციტებით (PRP)', image: img('filler'), is_popular: false, detail_description: 'პლაზმოთერაპია (PRP) იყენებს პაციენტის საკუთარ სისხლს — თრომბოციტებით მდიდარ პლაზმას. ეს ბუნებრივი მეთოდი ასტიმულირებს კანის რეგენერაციას, აუმჯობესებს ფერს, ამცირებს ნაოჭებს და ხელს უწყობს ნაწიბურების შეხორცებას.', benefits: JSON.stringify(['100% ბუნებრივი მეთოდი', 'კანის რეგენერაცია', 'ნაწიბურების შემცირება', 'თმის ზრდის სტიმულაცია', 'ალერგიის რისკი არ არსებობს']), steps: JSON.stringify(['სისხლის აღება', 'ცენტრიფუგირება', 'PRP ინექციები', 'პოსტ-პროცედურული მოვლა']), duration: '45-60 წუთი', price_from: '300₾' },
        { slug: 'bioreparation', category: 'injection', name: 'ბიორეპარაცია', description: 'კანის ღრმა აღდგენა და რეპარაცია ბიოაქტიური კომპლექსებით', image: img('facial-treatment'), is_popular: false, detail_description: 'ბიორეპარაცია არის ბიორევიტალიზაციის განახლებული ვერსია, რომელიც ჰიალურონის მჟავას აერთიანებს ამინომჟავებთან, პეპტიდებთან, ვიტამინებთან და ანტიოქსიდანტებთან. უზრუნველყოფს კანის კომპლექსურ აღდგენას.', benefits: JSON.stringify(['კომპლექსური კანის აღდგენა', 'ანტიოქსიდანტური დაცვა', 'კოლაგენის სინთეზის ამაღლება', 'კანის სტრუქტურის გაუმჯობესება']), steps: JSON.stringify(['კანის ანალიზი', 'ანესთეზია', 'ბიორეპარანტის ინექცია', 'რეკომენდაციები']), duration: '30-40 წუთი', price_from: '280₾' },
        { slug: 'booster', category: 'injection', name: 'ბუსტერი', description: 'კონცენტრირებული ჰიალურონის ინექცია კანის ხარისხის გასაუმჯობესებლად', image: img('botox'), is_popular: false, detail_description: 'სკინ-ბუსტერი არის სტაბილიზირებული ჰიალურონის მჟავის მიკრო-ინექციები, რომლებიც ღრმად ატენიანებს კანს შიგნიდან. განსხვავდება ფილერისგან — არ ამატებს მოცულობას, არამედ აუმჯობესებს კანის ხარისხს, ტექსტურას და ბრწყინვალებას.', benefits: JSON.stringify(['ღრმა დატენიანება შიგნიდან', 'კანის ტექსტურის გაუმჯობესება', 'ბუნებრივი ბრწყინვალება', 'წვრილი ნაოჭების შემცირება']), steps: JSON.stringify(['კონსულტაცია', 'ანესთეზია', 'მიკრო-ინექციები', 'თანმიმდევრული სეანსები']), duration: '20-30 წუთი', price_from: '350₾' },
        { slug: 'deep-cleansing', category: 'care', name: 'სახის აპარატურული/ღრმა წმენდა', description: 'სახის ღრმა ფუნდამენტური წმენდა აპარატურული მეთოდებით', image: img('skin-care'), is_popular: true, popular_name: 'სახის წმენდა', popular_description: 'ღრმა წმენდა და გაჯანსაღება', popular_image: img('skin-care'), detail_description: 'სახის აპარატურული ღრმა წმენდა მოიცავს ულტრაბგერით, ვაკუუმით და გალვანური დენით კანის ფუნდამენტურ გაწმენდას. პროცედურა შლის ფორებს, ამცირებს კომედონებს, აუმჯობესებს კანის ტონუსს და ამზადებს სხვა პროცედურებისთვის.', benefits: JSON.stringify(['ფორების ღრმა გაწმენდა', 'კომედონების მოცილება', 'კანის ტონუსის გაუმჯობესება', 'მიკროცირკულაციის სტიმულაცია', 'გაწმენდილი, ჯანსაღი კანი']), steps: JSON.stringify(['დემაკიაჟი', 'ორთქლით გახსნა', 'აპარატურული წმენდა', 'დამამშვიდებელი ნიღაბი', 'SPF']), duration: '60-90 წუთი', price_from: '120₾' },
        { slug: 'peeling', category: 'care', name: 'პილინგი', description: 'კანის ზედაპირული ფენის ქიმიური ექსფოლიაცია და განახლება', image: img('liposuction'), is_popular: false, detail_description: 'ქიმიური პილინგი არის კანის რეგენერაციის პროცედურა, რომელიც მჟავების საშუალებით ფრთხილად აცილებს კანის ზედაპირულ მკვდარ უჯრედებს. ხელს უწყობს ახალი, ჯანსაღი კანის წარმოქმნას, ამცირებს პიგმენტაციას, აკნეს ნაკვალევს და წვრილ ნაოჭებს.', benefits: JSON.stringify(['კანის განახლება', 'პიგმენტაციის შემცირება', 'აკნეს ნაკვალევის მკურნალობა', 'კანის ტონის გათანაბრება', 'კოლაგენის სტიმულაცია']), steps: JSON.stringify(['კანის მომზადება', 'მჟავის აპლიკაცია', 'ნეიტრალიზაცია', 'დამატენიანებელი ნიღაბი']), duration: '30-45 წუთი', price_from: '100₾' },
        { slug: 'microneedling', category: 'care', name: 'მიკრონიდლინგი', description: 'კოლაგენის ინდუქციური თერაპია მიკრონემსებით', image: img('rhinoplasty'), is_popular: false, detail_description: 'მიკრონიდლინგი (CIT) იყენებს წვრილ ნემსებს კანში მიკროარხების შესაქმნელად, რაც ასტიმულირებს კოლაგენის და ელასტინის ბუნებრივ წარმოქმნას. ეფექტურია ნაწიბურების, სტრეჩ მარკების, ფართო ფორებისა და დაბერების ნიშნების წინააღმდეგ.', benefits: JSON.stringify(['კოლაგენის სტიმულაცია', 'ნაწიბურების შემცირება', 'ფორების შეკუმშვა', 'კანის ტექსტურის გაუმჯობესება', 'აქტიური ნივთიერებების შეწოვის გაძლიერება']), steps: JSON.stringify(['კანის მომზადება', 'ანესთეზიის კრემი', 'მიკრონიდლინგის პროცედურა', 'სერუმის აპლიკაცია', 'რეკომენდაციები']), duration: '45-60 წუთი', price_from: '200₾' },
        { slug: 'face-modeling', category: 'modeling', name: 'სახის მოდელირება (ფილერები)', description: 'სახის კონტურების მოდელირება ჰიალურონის ფილერებით', image: img('filler'), is_popular: true, popular_name: 'ფილერები', popular_description: 'სახის მოდელირება და კონტურინგი', popular_image: img('filler'), detail_description: 'სახის მოდელირება ჰიალურონის მჟავის ფილერებით საშუალებას იძლევა შეიცვალოს სახის კონტურები, აღდგეს დაკარგული მოცულობა, გამოსწორდეს ასიმეტრია. ლოყების, ნიკაპის, ყბის ხაზის და ნაზოლაბიალური ნაოჭების კორექცია.', benefits: JSON.stringify(['სახის კონტურების გამოკვეთა', 'მოცულობის აღდგენა', 'ნაზოლაბიალური ნაოჭების კორექცია', 'ყბის ხაზის მოდელირება', 'მყისიერი შედეგი']), steps: JSON.stringify(['3D სახის ანალიზი', 'ანესთეზია', 'ფილერის ინექცია', 'მოდელირება და შეფასება']), duration: '30-60 წუთი', price_from: '400₾' },
        { slug: 'lip-augmentation', category: 'modeling', name: 'ტუჩის აუგმენტაცია', description: 'ტუჩის მოცულობის გაზრდა და კონტურის გამოკვეთა', image: img('botox'), is_popular: true, popular_name: 'ტუჩის აუგმენტაცია', popular_description: 'ტუჩის მოცულობა და კონტური', popular_image: img('botox'), detail_description: 'ტუჩის აუგმენტაცია ჰიალურონის მჟავით საშუალებას იძლევა გაიზარდოს ტუჩის მოცულობა, გამოიკვეთოს კონტური, აღმოიფხვრას ასიმეტრია. პროცედურა ინდივიდუალურია — შედეგი ბუნებრივია და ჰარმონიული სახის პროპორციებთან.', benefits: JSON.stringify(['ბუნებრივი მოცულობა', 'კონტურის გამოკვეთა', 'ასიმეტრიის კორექცია', 'ტენიანი, ახალგაზრდული ტუჩები', 'მყისიერი შედეგი']), steps: JSON.stringify(['კონსულტაცია და დაგეგმვა', 'ანესთეზია', 'ფილერის ინექცია', 'ფორმის კორექცია']), duration: '20-30 წუთი', price_from: '350₾' },
        { slug: 'thread-lifting', category: 'modeling', name: 'ძაფებით მოდელირება (აპტოსი)', description: 'სახის ლიფტინგი ბიოთავსებადი ძაფებით ოპერაციის გარეშე', image: img('rhinoplasty'), is_popular: false, detail_description: 'ძაფებით მოდელირება (აპტოსის ძაფები) არის არაქირურგიული ლიფტინგის მეთოდი. ბიოთავსებადი ძაფები კანქვეშ იმაგრება და უზრუნველყოფს სახის ქსოვილების მექანიკურ ლიფტინგს. პარალელურად ასტიმულირებს კოლაგენის წარმოქმნას ძაფის გარშემო.', benefits: JSON.stringify(['არაქირურგიული ლიფტინგი', 'მყისიერი შედეგი', 'კოლაგენის სტიმულაცია', 'მინიმალური რეაბილიტაცია', 'ბუნებრივი შედეგი']), steps: JSON.stringify(['კონსულტაცია', 'მონიშვნა და ანესთეზია', 'ძაფების იმპლანტაცია', 'რეკომენდაციები']), duration: '45-60 წუთი', price_from: '800₾' },
        { slug: 'collagen-stimulators', category: 'modeling', name: 'კოლაგენის სტიმულატორები', description: 'სკულპტრა და რედიესი — კოლაგენის სტიმულატორებით სახის ახალგაზრდობა', image: img('filler'), is_popular: false, detail_description: 'კოლაგენის სტიმულატორები (სკულპტრა — პოლი-L-რძემჟავა, რედიესი — კალციუმ ჰიდროქსილაპატიტი) ასტიმულირებს ორგანიზმის საკუთარი კოლაგენის წარმოქმნას. განსხვავდებიან ფილერებისგან — არ ავსებენ, არამედ რეგენერაციას უწყობენ ხელს. ეფექტი თანდათან ვლინდება და 1-2 წელი გრძელდება.', benefits: JSON.stringify(['საკუთარი კოლაგენის სტიმულაცია', 'ხანგრძლივი ეფექტი (1-2 წელი)', 'თანდათანობითი, ბუნებრივი შედეგი', 'სახის ოვალის გაუმჯობესება', 'კანის სიმკვრივის ზრდა']), steps: JSON.stringify(['კონსულტაცია', 'ანესთეზია', 'პრეპარატის ინექცია', 'მასაჟი (სკულპტრა)', 'განმეორებითი სეანსი']), duration: '30-45 წუთი', price_from: '600₾' },
        { slug: 'laser-epilation', category: 'laser', name: 'ლაზერული ეპილაცია', description: 'არასასურველი თმის სამუდამო მოცილება თანამედროვე ლაზერით', image: img('rhinoplasty'), is_popular: true, popular_name: 'ლაზერული ეპილაცია', popular_description: 'თმის სამუდამო მოცილება', popular_image: img('rhinoplasty'), detail_description: 'ლაზერული ეპილაცია არის არასასურველი თმის სამუდამო მოცილების ყველაზე ეფექტური მეთოდი. ლაზერის სხივი თმის ფოლიკულას ანადგურებს, რაც იწვევს თმის ზრდის ეტაპობრივ შეწყვეტას. 6-8 სეანსის შემდეგ მიიღწევა 90%+ შედეგი.', benefits: JSON.stringify(['სამუდამო შედეგი', 'უმტკივნეულო პროცედურა', 'ყველა ზონის მკურნალობა', 'ჩაზრდილი თმის პრობლემის მოგვარება', 'სწრაფი სეანსები']), steps: JSON.stringify(['კონსულტაცია', 'ზონის მომზადება', 'ლაზერული დამუშავება', 'გაგრილება და დაცვა']), duration: '15-60 წუთი', price_from: '50₾' },
      ];
      for (let i = 0; i < procs.length; i++) {
        const p = procs[i];
        await client.query(
          `INSERT INTO procedures (slug, category, name, description, image, sort_order, is_popular, popular_name, popular_description, popular_image, detail_description, benefits, steps, video_url, duration, price_from)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)`,
          [p.slug, p.category, p.name, p.description, p.image, i, p.is_popular || false, p.popular_name || '', p.popular_description || '', p.popular_image || '', p.detail_description || '', p.benefits || '[]', p.steps || '[]', p.video_url || '', p.duration || '', p.price_from || '']
        );
      }
      console.log('✓ Procedures seeded (14 items)');
    }

    // Team members
    const teamExists = await client.query('SELECT id FROM team_members LIMIT 1');
    if (teamExists.rows.length === 0) {
      const team = [
        { slug: 'baia', name: 'ბაია კონდრატიევა', role: 'დამფუძნებელი / ექიმი', specialization: 'ინექციური კოსმეტოლოგია', image: 'https://ihost.ge/s3/site-entourage-ge/images/team/doctor-1.jpg' },
        { slug: 'nino', name: 'ნინო კახიანი', role: 'ლაზეროთერაპევტი', specialization: 'აპარატული პროცედურები', image: 'https://ihost.ge/s3/site-entourage-ge/images/team/doctor-2.jpg' },
        { slug: 'mariam', name: 'მარიამ გიორგობიანი', role: 'დერმატოლოგი', specialization: 'კანის მკურნალობა', image: 'https://ihost.ge/s3/site-entourage-ge/images/team/doctor-3.jpg' },
        { slug: 'natia', name: 'ნათია იარაჯული', role: 'კოსმეტოლოგი', specialization: 'ესთეტიკური თერაპია', image: 'https://ihost.ge/s3/site-entourage-ge/images/team/doctor-4.jpg' },
        { slug: 'elene', name: 'ელენე დავითაშვილი', role: 'ექიმი-კოსმეტოლოგი', specialization: 'ინექციური პროცედურები', image: 'https://ihost.ge/s3/site-entourage-ge/images/team/doctor-5.jpg' },
        { slug: 'sophie', name: 'სოფო მახარაძე', role: 'ლაზეროთერაპევტი', specialization: 'ეპილაცია', image: 'https://ihost.ge/s3/site-entourage-ge/images/team/doctor-6.jpg' },
      ];
      for (let i = 0; i < team.length; i++) {
        const t = team[i];
        await client.query(
          'INSERT INTO team_members (slug, name, role, specialization, image, sort_order) VALUES ($1,$2,$3,$4,$5,$6)',
          [t.slug, t.name, t.role, t.specialization, t.image, i]
        );
      }
      console.log('✓ Team members seeded');
    }

    // FAQs
    const faqExists = await client.query('SELECT id FROM faqs LIMIT 1');
    if (faqExists.rows.length === 0) {
      const faqs = [
        { q: 'როგორ დავჯავშნო ვიზიტი?', a: 'ვიზიტის დაჯავშნა შეგიძლიათ ჩვენს ვებ-გვერდზე \'დაჯავშნა\' ღილაკის გამოყენებით, ან დაგვიკავშირდით ნომერზე: 032 219 54 00.' },
        { q: 'რა ღირს კონსულტაცია?', a: 'პირველადი კონსულტაცია ბაია კონდრატიევასთან არის 50 ლარი. პროცედურის ჩატარების შემთხვევაში კონსულტაციის თანხა იქვითება.' },
        { q: 'რამდენ ხანს გრძელდება ბოტოქსის ეფექტი?', a: 'ბოტოქსის ეფექტი ინდივიდუალურია, თუმცა საშუალოდ გრძელდება 4-დან 6 თვემდე. რეგულარული პროცედურების შემთხვევაში ეფექტი შესაძლოა გახანგრძლივდეს.' },
        { q: 'არის თუ არა პროცედურები მტკივნეული?', a: 'პროცედურების უმეტესობა ტარდება ადგილობრივი ანესთეზიით (კრემი), რაც მინიმუმამდე ამცირებს დისკომფორტს.' },
        { q: 'შემიძლია თუ არა განვადებით სარგებლობა?', a: 'დიახ, ჩვენ ვთანამშრომლობთ წამყვან ბანკებთან და გთავაზობთ მოქნილ განვადებას ყველა ძვირადღირებულ პროცედურაზე.' },
      ];
      for (let i = 0; i < faqs.length; i++) {
        await client.query('INSERT INTO faqs (question, answer, sort_order) VALUES ($1,$2,$3)', [faqs[i].q, faqs[i].a, i]);
      }
      console.log('✓ FAQs seeded');
    }

    // Results
    const resultsExist = await client.query('SELECT id FROM results LIMIT 1');
    if (resultsExist.rows.length === 0) {
      const results = [
        { title: 'კოსმეტიკური პროცედურა', desc: 'სახის კონტურის სრული კორექცია და გაახალგაზრდავება', img: 'https://ihost.ge/s3/site-entourage-ge/images/results/before-after-cosmetic-operation.jpg' },
        { title: 'ნიკაპის კორექცია', desc: 'ქვედა ყბის და ნიკაპის ფორმის დახვეწა', img: 'https://ihost.ge/s3/site-entourage-ge/images/results/female-double-chin-before-after.jpg' },
        { title: 'ნაოჭების კორექცია', desc: 'ღრმა ნაოჭების გასწორება და თვალის უპეების კორექცია', img: 'https://ihost.ge/s3/site-entourage-ge/images/results/plastic-surgery-results-nasolabial.jpg' },
        { title: 'სრული ტრანსფორმაცია', desc: 'კანის ფერის გათანაბრება და მაკიაჟის ეფექტი', img: 'https://ihost.ge/s3/site-entourage-ge/images/results/woman-before-after-makeup.jpg' },
        { title: 'ანტი-აგინგ მკურნალობა', desc: 'კანის ხარისხის გაუმჯობესება და ლიფტინგი', img: 'https://ihost.ge/s3/site-entourage-ge/images/results/womans-clean-face-before-after.jpg' },
      ];
      for (let i = 0; i < results.length; i++) {
        const r = results[i];
        await client.query('INSERT INTO results (title, description, before_image, after_image, sort_order) VALUES ($1,$2,$3,$4,$5)', [r.title, r.desc, r.img, r.img, i]);
      }
      console.log('✓ Results seeded');
    }

    // Reels
    const reelsExist = await client.query('SELECT id FROM reels LIMIT 1');
    if (reelsExist.rows.length === 0) {
      const reels = [
        { title: 'ტუჩის აუგმენტაცია', desc: 'ბუნებრივი მოცულობა და კონტური', thumb: 'https://ihost.ge/s3/site-entourage-ge/images/procedures/filler.jpg', video: 'https://streamable.com/e/hstt93' },
        { title: 'ბიორევიტალიზაცია', desc: 'კანის ღრმა დატენიანება', thumb: 'https://ihost.ge/s3/site-entourage-ge/images/procedures/botox.jpg', video: 'https://streamable.com/e/hstt93' },
        { title: 'ბოტოქსის პროცედურა', desc: 'მიმიკური ნაოჭების კორექცია', thumb: 'https://ihost.ge/s3/site-entourage-ge/images/procedures/facial-treatment.jpg', video: 'https://streamable.com/e/hstt93' },
        { title: 'ლაზერული ეპილაცია', desc: 'სრული სხეული - ალექსანდრიტი', thumb: 'https://ihost.ge/s3/site-entourage-ge/images/procedures/skin-care.jpg', video: 'https://streamable.com/e/hstt93' },
      ];
      for (let i = 0; i < reels.length; i++) {
        const r = reels[i];
        await client.query('INSERT INTO reels (title, description, thumbnail, video_url, sort_order) VALUES ($1,$2,$3,$4,$5)', [r.title, r.desc, r.thumb, r.video, i]);
      }
      console.log('✓ Reels seeded');
    }

    // Offers
    const offersExist = await client.query('SELECT id FROM offers LIMIT 1');
    if (offersExist.rows.length === 0) {
      await client.query(
        `INSERT INTO offers (badge_text, title, subtitle, description, old_price, new_price, image, is_active) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
        ['შემოდგომის შეთავაზება', 'სრული განახლების', 'პაკეტი', 'ბიორევიტალიზაცია + ტოსკანის ბუსტერი + პროფესიული წმენდა. მიიღეთ სრული მომსახურება ექსკლუზიურ ფასად.', '750 ₾', '399 ₾', 'https://ihost.ge/s3/site-entourage-ge/images/offers/current-offer.jpg', true]
      );
      console.log('✓ Offers seeded');
    }

    // Course mentors
    const mentorsExist = await client.query('SELECT id FROM course_mentors LIMIT 1');
    if (mentorsExist.rows.length === 0) {
      const mentors = [
        { name: 'ბაია კონდრატიევა', role: 'კურსის ხელმძღვანელი', image: 'https://ihost.ge/s3/site-entourage-ge/images/courses/course-1.jpg' },
        { name: 'ანა გიორგაძე', role: 'მოწვეული ტრენერი', image: 'https://ihost.ge/s3/site-entourage-ge/images/courses/course-2.jpg' },
      ];
      for (let i = 0; i < mentors.length; i++) {
        const m = mentors[i];
        await client.query('INSERT INTO course_mentors (name, role, image, sort_order) VALUES ($1,$2,$3,$4)', [m.name, m.role, m.image, i]);
      }
      console.log('✓ Course mentors seeded');
    }

    // Nav Items
    const navExists = await client.query('SELECT id FROM nav_items LIMIT 1');
    if (navExists.rows.length === 0) {
      const navItems = [
        { label: 'მთავარი', path: '/', icon: '', is_special: false, is_cta: false },
        { label: 'პროცედურები', path: '/procedures', icon: '', is_special: false, is_cta: false },
        { label: 'შედეგები', path: '/results', icon: '', is_special: false, is_cta: false },
        { label: 'კურსი', path: '/courses', icon: 'GraduationCap', is_special: true, is_cta: false },
        { label: 'გუნდი', path: '/team', icon: '', is_special: false, is_cta: false },
        { label: 'დაჯავშნა', path: '/booking', icon: 'Calendar', is_special: false, is_cta: true },
        { label: 'კონტაქტი', path: '/contact', icon: '', is_special: false, is_cta: false },
      ];
      for (let i = 0; i < navItems.length; i++) {
        const n = navItems[i];
        await client.query(
          'INSERT INTO nav_items (label, path, icon, is_special, is_cta, sort_order) VALUES ($1,$2,$3,$4,$5,$6)',
          [n.label, n.path, n.icon, n.is_special, n.is_cta, i]
        );
      }
      console.log('✓ Nav items seeded');
    }

    await client.query('COMMIT');
    console.log('\n✅ Migration complete!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Migration failed:', err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
