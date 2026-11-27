# MP Update — सत्ता, सियासत और सरोकार

| Folder | What it is |
|---|---|
| `client/` | **Next.js 14** – public website + `/admin` panel in one app (deploy on Vercel, Root Directory = `client`) |
| `server/` | **Express + MongoDB API** – roles, editorial approval, public read APIs (deploy on VPS: `server/deploy/DEPLOY.md`) |

## Environment

`client/.env.example` → set in Vercel:
- `NEXT_PUBLIC_SITE_URL` = `https://www.mpupdate.com`
- `NEXT_PUBLIC_API_URL` = `https://api.mpupdate.com/api/v1`

`server/.env.example` / `server/.env.production.example` → copy to `server/.env` on the server and fill in
(`MONGODB_URL`, `JWT_SECRET`, `CORS_ORIGINS`, AWS S3 keys, mail). **Never commit `.env`.**

## Run locally
``` 
cd server && npm install && npm run dev      # API  :8080
cd client && npm install && npm run dev      # site :3000
```

## Roles (admin panel → `/admin`)
| Role | Hindi | Can |
|---|---|---|
| SuperAdmin | मास्टर एडमिन | everything, creates sub admins |
| Admin | सब एडमिन | publish directly, manage categories/ads/polls/staff |
| Editor | संपादक | approve / reject reporters' stories, publish directly |
| Writer | कंटेंट राइटर | writes stories → editor's queue |
| Reporter | जिला रिपोर्टर | sends district stories → editor's queue |

Writer / Reporter stories are never public until an editor approves them (`status`: `pending` → `approved` / `rejected`).
