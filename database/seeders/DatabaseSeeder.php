<?php

namespace Database\Seeders;

use App\Models\Deck;
use App\Models\Flashcard;
use App\Models\Product;
use App\Models\User;
use App\Models\UserInfo;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // Create Admin User
        $admin = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admoon',
                'password' => Hash::make('password4'),
                'email_verified_at' => now(),
            ]
        );

        // Create Normal User
        $user = User::firstOrCreate(
            ['email' => 'user@example.com'],
            [
                'name' => 'User',
                'password' => Hash::make('password4'),
                'email_verified_at' => now(),
            ]
        );

        // Create UserInfo for Admin
        UserInfo::firstOrCreate(
            ['user_id' => $admin->id],
            ['subscription' => 'super']
        );

        // Create UserInfo for Normal User
        UserInfo::firstOrCreate(
            ['user_id' => $user->id],
            ['subscription' => 'free']
        );

        // Create Products
        Product::firstOrCreate(
            ['name' => 'Super Plan'],
            [
                'price' => 250000,
                "type" => "subscription",
                'description' => 'Advanced features for power users.',
            ]
        );
        Product::firstOrCreate(
            ['name' => 'Starter Pack'],
            [
                'price' => "15000",
                "quantity" => 2100,
                "isListed" => true,
                "type" => "currency",
                'description' => 'A small pack of 2,100 gems to get you started.',
            ]
        );

        Product::firstOrCreate(
            ['name' => 'Value Pack'],
            [
                'price' => "29000",
                "quantity" => 4300,
                "type" => "currency",
                "isListed" => true,
                'description' => 'A great value pack of 4,300 gems.',
            ]
        );

        Product::firstOrCreate(
            ['name' => 'Super Pack'],
            [
                'price' => "49000",
                "quantity" => 7900,
                "type" => "currency",
                "isListed" => true,
                'description' => 'A super pack containing 7,900 gems.',
            ]
        );

        Product::firstOrCreate(
            ['name' => 'Mega Pack'],
            [
                'price' => "79000",
                "quantity" => 13500,
                "type" => "currency",
                "isListed" => true,
                'description' => 'A mega-sized deal for 13,500 gems.',
            ]
        );

        Product::firstOrCreate(
            ['name' => 'Giga Pack'],
            [
                'price' => "149000",
                "quantity" => 27500,
                "type" => "currency",
                "isListed" => true,
                'description' => 'A huge bundle of 27,500 gems for dedicated players.',
            ]
        );

        Product::firstOrCreate(
            ['name' => 'Tera Pack'],
            [
                'price' => "499000",
                "quantity" => 100000,
                "type" => "currency",
                "isListed" => true,
                'description' => 'The ultimate value with a massive 100,000 gems.',
            ]
        );

        /**
         * 1. Bahasa Indonesia: Pungtuasi dan Penulisan
         */
        $deck1 = Deck::firstOrCreate(
            ['title' => 'Pungtuasi dan Penulisan dalam Bahasa Indonesia', 'user_id' => 1],
            ['description' => 'Aturan tanda baca dan penulisan huruf, kata, serta angka sesuai EYD.']
        );

        $flashcards1 = [
            ["question" => "Apa fungsi tanda titik (.)?", "answer" => "Menandai akhir kalimat pernyataan dan singkatan."],
            ["question" => "Kapan tanda koma (,) digunakan?", "answer" => "Memisahkan perincian, unsur kalimat, atau anak kalimat."],
            ["question" => "Fungsi tanda titik dua (:)?", "answer" => "Memperkenalkan perincian atau kutipan langsung."],
            ["question" => "Apa fungsi tanda tanya (?)?", "answer" => "Digunakan di akhir kalimat tanya."],
            ["question" => "Apa fungsi tanda seru (!)?", "answer" => "Menunjukkan perintah atau emosi kuat."],
            ["question" => "Kapan huruf kapital dipakai?", "answer" => "Awal kalimat, nama diri, instansi, gelar, dan sapaan hormat."],
            ["question" => "Bagaimana menulis kata ulang?", "answer" => "Gunakan tanda hubung, contoh: anak-anak."],
            ["question" => "Kapan 'di' dipisah atau digabung?", "answer" => "Dipisah jika kata depan, disambung jika awalan."],
            ["question" => "Apa fungsi tanda kurung?", "answer" => "Mengapit penjelasan tambahan."],
            ["question" => "Bagaimana menulis singkatan gelar?", "answer" => "Setiap unsur diakhiri titik, misal S.Pd., M.Pd."],
        ];
        foreach ($flashcards1 as $f) Flashcard::create([...$f, 'deck_id' => $deck1->id]);

        /**
         * 2. Pancasila dan Kewarganegaraan
         */
        $deck2 = Deck::firstOrCreate(
            ['title' => 'Pancasila dan Kewarganegaraan', 'user_id' => 1],
            ['description' => 'Pemahaman nilai, sila, dan penerapan Pancasila dalam kehidupan berbangsa.']
        );

        $flashcards2 = [
            ["question" => "Apa arti Pancasila?", "answer" => "Lima dasar negara Republik Indonesia."],
            ["question" => "Sebutkan lima sila Pancasila!", "answer" => "1. Ketuhanan YME, 2. Kemanusiaan adil dan beradab, 3. Persatuan Indonesia, 4. Kerakyatan, 5. Keadilan sosial."],
            ["question" => "Sila pertama mencerminkan apa?", "answer" => "Keimanan dan ketakwaan terhadap Tuhan YME."],
            ["question" => "Makna sila kedua?", "answer" => "Menjunjung tinggi nilai kemanusiaan dan keadilan."],
            ["question" => "Sila ketiga menekankan apa?", "answer" => "Persatuan dan kesatuan bangsa."],
            ["question" => "Sila keempat mencerminkan apa?", "answer" => "Musyawarah mufakat dan demokrasi Pancasila."],
            ["question" => "Sila kelima menekankan apa?", "answer" => "Keadilan sosial bagi seluruh rakyat Indonesia."],
            ["question" => "Apa fungsi Pancasila?", "answer" => "Sebagai dasar negara, ideologi, dan pandangan hidup bangsa."],
            ["question" => "Apa makna simbol Garuda?", "answer" => "Kekuatan dan semangat perjuangan bangsa Indonesia."],
            ["question" => "Apa arti Bhineka Tunggal Ika?", "answer" => "Berbeda-beda tetapi tetap satu jua."],
        ];
        foreach ($flashcards2 as $f) Flashcard::create([...$f, 'deck_id' => $deck2->id]);

        /**
         * 3. Bahasa Inggris Dasar
         */
        $deck3 = Deck::firstOrCreate(
            ['title' => 'Basic English Grammar and Vocabulary', 'user_id' => 1],
            ['description' => 'Fundamental grammar, vocabulary, and daily expressions in English.']
        );

        $flashcards3 = [
            ["question" => "What is a noun?", "answer" => "A word that names a person, place, thing, or idea."],
            ["question" => "What is a verb?", "answer" => "A word that expresses an action or state of being."],
            ["question" => "Give examples of adjectives!", "answer" => "Beautiful, tall, smart, kind."],
            ["question" => "What are the tenses in English?", "answer" => "Present, past, future, and perfect forms."],
            ["question" => "How to form simple present tense?", "answer" => "Subject + base verb (+s/es). Example: He eats."],
            ["question" => "How to make negative sentence?", "answer" => "Use do/does not or did not before verb."],
            ["question" => "What is a pronoun?", "answer" => "A word that replaces a noun, e.g., he, she, they."],
            ["question" => "What is present continuous?", "answer" => "Action happening now, form: am/is/are + verb-ing."],
            ["question" => "Translate: 'Dia sedang belajar.'", "answer" => "He is studying."],
            ["question" => "What is a preposition?", "answer" => "A word showing relationship between words, e.g., in, on, at."],
            ["question" => "What is synonym of 'happy'?", "answer" => "Glad, joyful, cheerful, delighted."],
            ["question" => "Antonym of 'difficult'?", "answer" => "Easy."],
            ["question" => "Translate: 'Saya suka membaca buku.'", "answer" => "I like reading books."],
        ];
        foreach ($flashcards3 as $f) Flashcard::create([...$f, 'deck_id' => $deck3->id]);

        /**
         * 4. Matematika Dasar
         */
        $deck4 = Deck::firstOrCreate(
            ['title' => 'Matematika Dasar', 'user_id' => 1],
            ['description' => 'Konsep dasar matematika meliputi operasi bilangan, pecahan, dan aljabar sederhana.']
        );

        $flashcards4 = [
            ["question" => "Apa itu bilangan prima?", "answer" => "Bilangan yang hanya habis dibagi 1 dan dirinya sendiri."],
            ["question" => "Sebutkan bilangan prima kurang dari 10!", "answer" => "2, 3, 5, 7."],
            ["question" => "Apa itu KPK?", "answer" => "Kelipatan Persekutuan Terkecil dari dua atau lebih bilangan."],
            ["question" => "Apa itu FPB?", "answer" => "Faktor Persekutuan Terbesar dari dua atau lebih bilangan."],
            ["question" => "Rumus luas persegi?", "answer" => "Sisi × sisi."],
            ["question" => "Rumus luas segitiga?", "answer" => "½ × alas × tinggi."],
            ["question" => "Apa itu persamaan linear?", "answer" => "Persamaan dengan variabel berpangkat satu."],
            ["question" => "Apa nilai π (pi)?", "answer" => "3,14 atau 22/7."],
            ["question" => "Rumus keliling lingkaran?", "answer" => "2 × π × r."],
            ["question" => "Apa sifat-sifat segitiga sama sisi?", "answer" => "Tiga sisi sama panjang, tiga sudut sama besar (60°)."],
        ];
        foreach ($flashcards4 as $f) Flashcard::create([...$f, 'deck_id' => $deck4->id]);

        /**
         * 5. Sejarah Indonesia
         */
        $deck5 = Deck::firstOrCreate(
            ['title' => 'Sejarah Indonesia', 'user_id' => 1],
            ['description' => 'Rangkuman peristiwa penting dari masa kerajaan, kolonialisme, hingga kemerdekaan.']
        );

        $flashcards5 = [
            ["question" => "Siapa pendiri kerajaan Majapahit?", "answer" => "Raden Wijaya pada tahun 1293."],
            ["question" => "Kapan Proklamasi Kemerdekaan Indonesia?", "answer" => "17 Agustus 1945."],
            ["question" => "Siapa yang membacakan teks proklamasi?", "answer" => "Ir. Soekarno."],
            ["question" => "Apa isi sumpah pemuda?", "answer" => "Bertanah air satu, berbangsa satu, berbahasa satu: Indonesia."],
            ["question" => "Siapa presiden pertama Indonesia?", "answer" => "Ir. Soekarno."],
            ["question" => "Apa nama naskah perjanjian kemerdekaan RI-Belanda?", "answer" => "Konferensi Meja Bundar (KMB)."],
            ["question" => "Apa tujuan pergerakan Budi Utomo?", "answer" => "Meningkatkan pendidikan dan kesadaran nasional."],
            ["question" => "Kapan VOC dibubarkan?", "answer" => "1799 oleh Belanda."],
            ["question" => "Siapa pahlawan dari Aceh?", "answer" => "Cut Nyak Dien."],
            ["question" => "Siapa pahlawan dari Maluku?", "answer" => "Pattimura (Thomas Matulessy)."],
        ];
        foreach ($flashcards5 as $f) Flashcard::create([...$f, 'deck_id' => $deck5->id]);

        /**
         * 6. Sosiologi Dasar
         */
        $deck6 = Deck::firstOrCreate(
            ['title' => 'Sosiologi Dasar', 'user_id' => 1],
            ['description' => 'Pengantar sosiologi: konsep masyarakat, nilai, norma, dan interaksi sosial.']
        );

        $flashcards6 = [
            ["question" => "Apa itu sosiologi?", "answer" => "Ilmu yang mempelajari masyarakat dan perilaku sosial manusia."],
            ["question" => "Apa yang dimaksud dengan nilai sosial?", "answer" => "Ukuran atau pedoman dalam bertingkah laku di masyarakat."],
            ["question" => "Apa itu norma sosial?", "answer" => "Aturan yang mengatur perilaku agar sesuai nilai sosial."],
            ["question" => "Apa contoh norma hukum?", "answer" => "Peraturan perundang-undangan."],
            ["question" => "Apa itu sosialisasi?", "answer" => "Proses belajar individu menjadi anggota masyarakat."],
            ["question" => "Apa itu interaksi sosial?", "answer" => "Hubungan timbal balik antarindividu atau kelompok."],
            ["question" => "Apa bentuk interaksi sosial?", "answer" => "Asosiatif (kerja sama) dan disosiatif (konflik, kompetisi)."],
            ["question" => "Apa itu peran sosial?", "answer" => "Tindakan yang diharapkan dari seseorang berdasarkan statusnya."],
            ["question" => "Apa itu status sosial?", "answer" => "Kedudukan seseorang dalam masyarakat."],
            ["question" => "Apa yang dimaksud stratifikasi sosial?", "answer" => "Pelapisan masyarakat berdasarkan kedudukan atau status."],
        ];
        foreach ($flashcards6 as $f) Flashcard::create([...$f, 'deck_id' => $deck6->id]);

        /**
         * 7. Geografi Dasar
         */
        $deck7 = Deck::firstOrCreate(
            ['title' => 'Geografi Dasar', 'user_id' => 1],
            ['description' => 'Konsep ruang, peta, lingkungan, dan fenomena alam.']
        );

        $flashcards7 = [
            ["question" => "Apa itu geografi?", "answer" => "Ilmu yang mempelajari lokasi, ruang, dan hubungan manusia dengan lingkungan."],
            ["question" => "Apa yang dimaksud dengan peta?", "answer" => "Gambaran permukaan bumi pada bidang datar dengan skala tertentu."],
            ["question" => "Apa itu skala peta?", "answer" => "Perbandingan jarak di peta dengan jarak sebenarnya."],
            ["question" => "Apa itu garis lintang?", "answer" => "Garis khayal sejajar ekuator, menentukan iklim."],
            ["question" => "Apa itu garis bujur?", "answer" => "Garis khayal dari kutub utara ke kutub selatan, menentukan waktu."],
            ["question" => "Apa fungsi peta tematik?", "answer" => "Menunjukkan informasi khusus, seperti kepadatan penduduk atau curah hujan."],
            ["question" => "Apa itu litosfer?", "answer" => "Lapisan kerak bumi tempat daratan berada."],
            ["question" => "Apa itu atmosfer?", "answer" => "Lapisan udara yang menyelimuti bumi."],
            ["question" => "Apa itu hidrosfer?", "answer" => "Lapisan air di permukaan bumi, seperti laut, sungai, danau."],
            ["question" => "Apa itu biosfer?", "answer" => "Lapisan kehidupan tempat makhluk hidup berada."],
        ];
        foreach ($flashcards7 as $f) Flashcard::create([...$f, 'deck_id' => $deck7->id]);
    }
}
