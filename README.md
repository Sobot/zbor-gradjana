# Збор грађана

Платформа за регистрацију збора грађана у општинама Србије.

## Функционалности

- Регистрација грађана за подршку збору у одређеној општини
- Сазивање збора грађана са одређивањем области и локације
- Аутентификација корисника преко Google и Facebook налога
- Интеграција са Google Maps за геолокацију и одређивање области

## Технологије

- Next.js 14
- TypeScript
- Prisma
- PostgreSQL
- NextAuth.js
- Google Maps API
- Tailwind CSS

## Развојно окружење

1. Клонирајте репозиторијум:
   ```bash
   git clone https://github.com/your-username/zbor-gradjana.git
   cd zbor-gradjana
   ```

2. Инсталирајте зависности:
   ```bash
   npm install
   ```

3. Креирајте `.env` фајл са следећим варијаблама:
   ```
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/zbor_gradjana?schema=public"
   NEXTAUTH_SECRET="your-secret-key"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   FACEBOOK_CLIENT_ID="your-facebook-client-id"
   FACEBOOK_CLIENT_SECRET="your-facebook-client-secret"
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-google-maps-api-key"
   ```

4. Покрените миграције базе података:
   ```bash
   npx prisma migrate dev
   ```

5. Покрените развојни сервер:
   ```bash
   npm run dev
   ```

## Продукционо окружење

1. Подесите све потребне environment варијабле на вашем хостинг провајдеру

2. Подесите PostgreSQL базу података

3. Покрените миграције:
   ```bash
   npx prisma migrate deploy
   ```

4. Изградите и покрените апликацију:
   ```bash
   npm run build
   npm start
   ```

## Лиценца

MIT
