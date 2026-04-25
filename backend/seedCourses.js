const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Course = require('./models/Course');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("MongoDB connected");

    await Course.deleteMany(); // ⚠️ clears old data (optional)

    await Course.insertMany([

      // BEAUTICIAN
      {
        category: "beautician",
        title: "Beautician Salon Course",
        duration: "15 Days",
        learnings: ["Facials & skincare", "Threading & waxing", "Manicure & pedicure"]
      },
      {
        category: "beautician",
        title: "Makeup Artist Course",
        duration: "15 Days",
        learnings: ["Contouring & highlighting", "Bridal & party makeup", "Product & brush knowledge"]
      },
      {
        category: "beautician",
        title: "Nail Artist Course",
        duration: "3 or 5 Days",
        learnings: ["Gel & acrylic nails", "Nail art designs", "French manicure"]
      },
      {
        category: "beautician",
        title: "Mehandi Artist Course",
        duration: "3 or 5 Days",
        learnings: ["Arabic & Indian designs", "Cone making", "Speed practice"]
      },
      {
        category: "beautician",
        title: "Hair Extension Course",
        duration: "3 Days",
        learnings: ["Clip-in & keratin extensions", "Color blending", "Hair care & removal"]
      },
      {
        category: "beautician",
        title: "Hairstyle Course",
        duration: "1 or 2 Days",
        learnings: ["Buns, curls & braids", "Tool-based styling", "Accessory placement"]
      },

      // FASHION
      {
        category: "fashion",
        title: "Fashion Designing Course",
        duration: "Weekly Ongoing Classes",
        learnings: ["Blouse Design", "Kurtis & Frocks", "Western Wear", "Kids Dress"]
      },
      {
        category: "fashion",
        title: "Saree Draping & Pre-Pleating Course",
        duration: "1 or 2 Days",
        learnings: ["Bridal Draping", "Party Draping", "Pre-Pleating Techniques"]
      },

      // EMBROIDERY
      {
        category: "embroidery",
        title: "Aari Embroidery Course",
        duration: "5, 10 or 25 Days",
        learnings: ["Basic stitches", "Zari & stone work", "Advanced designer motifs"]
      },
      {
        category: "embroidery",
        title: "Aari Brooches Work",
        duration: "3 Days",
        learnings: ["Patch & motif brooch", "Zardosi brooch", "Jewellery-style brooch"]
      },
      {
        category: "embroidery",
        title: "Machine Embroidery",
        duration: "5 Days",
        learnings: ["Thread tension control", "Motif embroidery", "Border & neckline designs"]
      },
      {
        category: "embroidery",
        title: "Hand Embroidery",
        duration: "3 Days",
        learnings: ["French knot & satin stitch", "Mirror work", "Simple motif making"]
      },
      {
        category: "embroidery",
        title: "Fabric Painting",
        duration: "3 Days",
        learnings: ["Fabric color mixing", "Floral & motif painting", "Block & stencil design"]
      },
      {
        category: "embroidery",
        title: "Simple Chemical Work",
        duration: "5 Days",
        learnings: ["Chemical lace technique", "Oxidation effect", "Fabric texture designs"]
      },

      // JEWELLERY
      {
        category: "jewellery",
        title: "Silk Thread Jewellery",
        duration: "3 Days",
        learnings: ["Matte finishing", "Jhumka making", "Silk chokers & chains"]
      },
      {
        category: "jewellery",
        title: "Kundan Jewellery",
        duration: "3 Days",
        learnings: ["Stone setting", "Kundan rings & chokers", "Color combination patterns"]
      },
      {
        category: "jewellery",
        title: "Crystal Jewellery",
        duration: "3 Days",
        learnings: ["Bead weaving", "Wire looping technique", "Party & casual wear sets"]
      },
      {
        category: "jewellery",
        title: "Terracotta Jewellery",
        duration: "3 Days",
        learnings: ["Clay molding", "Color baking", "Necklace & studs creation"]
      },

      // BAGS
      {
        category: "bags",
        title: "Jute Bag Making",
        duration: "5 Days",
        learnings: ["Basic & designer jute bags", "Lining & finishing", "Handle and zip attachment"]
      },
      {
        category: "bags",
        title: "Cloth Bag Making",
        duration: "5 Days",
        learnings: ["Cutting & stitching", "Pattern-based bags", "Reversible & foldable designs"]
      },
      {
        category: "bags",
        title: "Wire Bags",
        duration: "5 Days",
        learnings: ["Wire frame basics", "Bead fixing & pattern design", "Handle & closure techniques"]
      },
      {
        category: "bags",
        title: "Macramé Bags",
        duration: "3 Days",
        learnings: ["Basic macramé knots", "Bag structure & shaping", "Fringe & decorative finishing"]
      },
      {
        category: "bags",
        title: "Tatting",
        duration: "3 Days",
        learnings: ["Shuttle tatting basics", "Motif & edging creation", "Using tatting in accessories"]
      },
      {
        category: "bags",
        title: "Knitting",
        duration: "3 Days",
        learnings: ["Basic knit & purl", "Simple patterns", "Scarves & small projects"]
      },
      {
        category: "bags",
        title: "Crochet",
        duration: "3 Days",
        learnings: ["Basic crochet stitches", "Granny squares & motifs", "Mini bags & accessories"]
      },
      {
        category: "bags",
        title: "Brooches Making",
        duration: "3 Days",
        learnings: ["Design planning", "Bead & fabric brooches", "Finishing & attachment"]
      },

      // KIDS
      {
        category: "kids",
        title: "Abacus Training",
        duration: "3 / 6 Months",
        learnings: ["Visual calculation", "Brain development", "Confidence building"]
      },
      {
        category: "kids",
        title: "Kids Tuition",
        duration: "Monthly",
        learnings: ["All subjects", "Homework assistance", "Exam preparation"]
      },
      {
        category: "kids",
        title: "Hindi Language Course",
        duration: "1 – 3 Months",
        learnings: ["Basic grammar", "Conversation skills", "Writing practice"]
      },
      {
        category: "kids",
        title: "Phonics Training",
        duration: "2 Months",
        learnings: ["Sound recognition", "Word building", "Reading fluency"]
      },
      {
        category: "kids",
        title: "Silambam Training",
        duration: "Monthly",
        learnings: ["Stick techniques", "Body balance", "Self-defense skills"]
      },
      {
        category: "kids",
        title: "Karate Training",
        duration: "Monthly",
        learnings: ["Basic to advanced levels", "Discipline & focus", "Belt grading system"]
      },

      // SPECIAL
      {
        category: "special",
        title: "Soft Toys Making",
        duration: "3 Days",
        learnings: ["Doll & teddy making", "Pattern cutting", "Stuffing & finishing"]
      },
      {
        category: "special",
        title: "Abacus Training",
        duration: "1 Month",
        learnings: ["Basic & advance levels", "Speed calculation", "Memory improvement"]
      },
      {
        category: "special",
        title: "Bakery Products Course",
        duration: "5 Days",
        learnings: ["Cake & cupcake baking", "Bread & bun making", "Decorating basics"]
      },
      {
        category: "special",
        title: "Palm Leaf Craft Course",
        duration: "5 Days",
        learnings: ["Basket & box weaving", "Decorative crafts", "Natural dye finishing"]
      }

    ]);

    console.log("ALL COURSES INSERTED ✅");
    process.exit();
  })
  .catch(err => console.log(err));