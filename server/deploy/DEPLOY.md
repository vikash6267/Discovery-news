# MP Update API — VPS par live karna (api.mpupdate.com)

Sirf **backend (Express + MongoDB)** VPS par jayega. Website (Next.js) Vercel par rahegi.

## 0. Pehle: kaun sa port khali hai (VPS par)
```bash
ssh user@VPS_IP
bash check-ports.sh        # is folder ki deploy/check-ports.sh
# ya sirf: ss -tlnp
```
Ye sab busy ports, ek **khali port ka suggestion**, CPU/RAM/swap dikhata hai. API ka port bahar se kholna nahi hai (sirf Nginx uske saath baat karega).

## 1. DNS
Domain panel me: `A` record  `api`  →  VPS ka public IP  (TTL 300)

## 2. Code upload
```bash
sudo mkdir -p /var/www/mpupdate-api && sudo chown $USER /var/www/mpupdate-api
# option A: apne computer se
scp -r backend/* backend/.env.production.example user@VPS_IP:/var/www/mpupdate-api/
# option B: GitHub se (jab code repo me ho): git clone <repo> /var/www/mpupdate-api
```

## 3. Setup chalao (Node 20, Nginx, PM2, firewall, free port – sab apne aap)
```bash
cd /var/www/mpupdate-api
sudo bash deploy/setup-vps.sh      # pehli baar .env banake ruk jata hai
nano .env                          # MONGODB_URL, JWT_SECRET, CORS_ORIGINS, AWS S3 (bucket + keys), mail bharo
sudo bash deploy/setup-vps.sh      # dobara chalao → API start + Nginx
sudo certbot --nginx -d api.mpupdate.com --redirect -m you@example.com --agree-tos -n
curl https://api.mpupdate.com/health        # {"ok":true,"mongo":"connected"}
```

## 4. MongoDB Atlas me VPS ka IP allow karo
Atlas → Network Access → Add IP → VPS ka IP. (Warna API database se connect nahi hogi.)
Tez chalane ke liye Atlas cluster ka region VPS ke paas rakho (VPS India me ho to Mumbai).

## 5. Website ko naye API par lagao
Vercel → Project → Settings → Environment Variables:
`NEXT_PUBLIC_API_URL = https://api.mpupdate.com/api/v1` → Redeploy.

## Speed ke liye kya laga hai
| Layer | Kya karta hai |
|---|---|
| **Nginx microcache (30 s)** | khabar-list, menu, ads, poll jaise public GET Nginx se hi jate hain, Node/Mongo tak nahi pahunchte. Logged-in staff ki request cache bypass karti hai. Node down ho to bhi purana jawab milta hai (`stale`). |
| **Node memory cache (20 s – 5 min)** | wahi lists process ki memory me; koi bhi admin write (khabar, ad, poll…) hote hi cache turant saaf. |
| **gzip** | JSON 5–10× chhota. |
| **PM2 cluster** | 2 processes (`API_INSTANCES=max` bade server par), `max_memory_restart 450M`, zero-downtime reload. |
| **MongoDB indexes** | `status+publish`, `category+publish`, `subcategory`, `type`, `submittedBy` – list queries tez. Pehli baar chalne par apne aap ban jate hain. |
| **Connection pool 20**, keep-alive Nginx→Node | kam latency. |
| **Rate limit** | login 5/min (Nginx) + 40/15 min (Node); baaki 20 req/s per IP. |
| **swap 2 GB** | agar RAM < 2 GB ho to script apne aap banata hai. |

## Roz ka kaam
```bash
pm2 status                       # chal raha hai?
pm2 logs mpupdate-api --lines 100
pm2 monit                        # live CPU / memory
pm2 reload mpupdate-api          # naya code, bina downtime (pehle npm ci --omit=dev)
curl -I "https://api.mpupdate.com/api/v1/public/news?limit=10"   # X-Edge-Cache: HIT / MISS
```
**Update:** code upload → `npm ci --omit=dev` → `pm2 reload mpupdate-api`.

## Dhyan dene wali baatein
- `JWT_SECRET` naya lagao (purana repo me khula tha) – badalne par sab staff dobara login karenge.
- Purani repo me jo `.env` commit hui hai, uske DB password / Cloudinary secret / mail password badal dena.
- Photo upload ab **S3** par hota hai (Cloudinary hata diya). `.env` me `AWS_S3_BUCKET`, `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_S3_BASE_FOLDER` bharo.
  Bucket me photos public-read honi chahiye, jaise bucket policy: `{"Effect":"Allow","Principal":"*","Action":"s3:GetObject","Resource":"arn:aws:s3:::BUCKET/mpupdate/*"}`
  (Block Public Access me sirf "bucket policy" wali setting band karni hogi.) Photo ka link `https://BUCKET.s3.REGION.amazonaws.com/mpupdate/...` banta hai, ya `S3_PUBLIC_URL` (CloudFront) ho to wahi.
  S3 ke liye IAM user ko sirf `s3:PutObject` is bucket par do. Purani Cloudinary wali khabron ki photo wapas nahi aayengi (wo cloud disabled hai), site un par category photo dikhati hai.
- VPS me MongoDB nahi chal raha – Atlas hi use ho raha hai, isliye backup Atlas se aate hain.
