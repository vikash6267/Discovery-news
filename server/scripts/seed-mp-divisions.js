/**
 * Creates the 10 divisions (संभाग) of Madhya Pradesh as categories (kind = "division")
 * and their districts as sub-categories.  Safe to run again – nothing is deleted or duplicated.
 *
 *   cd server && node scripts/seed-mp-divisions.js
 */
require("dotenv").config();
const mongoose = require("mongoose");
const Category = require("../models/category");
const SubCategory = require("../models/subCategory");

// order = position in the website menu
const DIVISIONS = [
  ["भोपाल", ["भोपाल", "रायसेन", "राजगढ़", "सीहोर", "विदिशा"]],
  ["इंदौर", ["इंदौर", "धार", "झाबुआ", "अलीराजपुर", "खरगोन", "खंडवा", "बड़वानी", "बुरहानपुर"]],
  ["जबलपुर", ["जबलपुर", "कटनी", "नरसिंहपुर", "छिंदवाड़ा", "सिवनी", "बालाघाट", "मंडला", "डिंडोरी", "पांढुर्ना"]],
  ["ग्वालियर", ["ग्वालियर", "दतिया", "गुना", "शिवपुरी", "अशोकनगर"]],
  ["उज्जैन", ["उज्जैन", "देवास", "रतलाम", "मंदसौर", "नीमच", "शाजापुर", "आगर मालवा"]],
  ["सागर", ["सागर", "दमोह", "छतरपुर", "पन्ना", "टीकमगढ़", "निवाड़ी"]],
  ["रीवा", ["रीवा", "सतना", "सीधी", "सिंगरौली", "मऊगंज", "मैहर"]],
  ["शहडोल", ["शहडोल", "अनूपपुर", "उमरिया"]],
  ["नर्मदापुरम", ["नर्मदापुरम", "बैतूल", "हरदा"]],
  ["चंबल", ["मुरैना", "भिंड", "श्योपुर"]],
];

(async () => {
  if (!process.env.MONGODB_URL) throw new Error("MONGODB_URL missing in .env");
  await mongoose.connect(process.env.MONGODB_URL);
  console.log("DB:", mongoose.connection.name);
  let newCats = 0, newSubs = 0;
  for (let i = 0; i < DIVISIONS.length; i++) {
    const [name, districts] = DIVISIONS[i];
    let cat = await Category.findOne({ name, kind: "division" });
    if (!cat) {
      cat = await Category.create({ name, description: `${name} संभाग की खबरें`, kind: "division", order: i + 1 });
      newCats++;
    } else if (cat.order !== i + 1) {
      cat.order = i + 1;
      await cat.save();
    }
    for (const d of districts) {
      let sub = await SubCategory.findOne({ name: d, category: cat._id });
      if (!sub) {
        sub = await SubCategory.create({ name: d, description: `${d} जिले की खबरें`, category: cat._id });
        await Category.updateOne({ _id: cat._id }, { $addToSet: { subCategories: sub._id } });
        newSubs++;
      }
    }
    console.log(`${String(i + 1).padStart(2)}. ${name.padEnd(10)} ${districts.length} जिले`);
  }
  console.log(`\nnew divisions: ${newCats}, new districts: ${newSubs}`);
  await mongoose.disconnect();
})().catch((e) => { console.error(e); process.exit(1); });
