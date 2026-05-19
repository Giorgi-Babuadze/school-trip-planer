# School Trip Planner - Backend

Express.js + MongoDB API მის მოსახლეობის ცხაველი აპლიკაციისთვის.

## გამოყენებული ტექნოლოგია

- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **TypeScript** - Type safety
- **Mongoose** - MongoDB ODM

## დაწყება

### 1. Dependencies ინსტალაცია

```bash
npm install
```

### 2. Environment Setup

`.env.example` დააკოპირე `.env` ფაილში:

```bash
cp .env.example .env
```

შემდეგ დაარედაქტირე `.env` ფაილი თქვენი MongoDB URI-ით:

```env
MONGODB_URI=mongodb://localhost:27017/school-trip-planner
PORT=5000
NODE_ENV=development
```

### 3. Database Seed

სტატიკური მონაცემი ჩატვირთე ბაზაში:

```bash
npm run seed
```

### 4. ბექენდის გაშვება

განვითარება რეჟიმით:

```bash
npm run dev
```

პროდაქშন:

```bash
npm run build
npm start
```

## API Endpoints

### Tours

- `GET /api/tours` - ყველა ტურის სახე
- `GET /api/tours/:id` - კონკრეტული ტურის დეტალები
- `POST /api/tours` - ახალი ტური შექმნა
- `PUT /api/tours/:id` - ტურის შეცვლა
- `DELETE /api/tours/:id` - ტურის წაშლა

### Bookings

- `GET /api/bookings` - ყველა ბუქინგი
- `GET /api/bookings/tour/:tourId` - კონკრეტული ტურის ბუქინგი
- `POST /api/bookings` - ახალი ბუქინგი
- `PUT /api/bookings/:id` - ბუქინგის შეცვლა
- `DELETE /api/bookings/:id` - ბუქინგის წაშლა

## Project Structure

```
src/
├── models/         # MongoDB schemas
├── controllers/    # Business logic
├── routes/        # API routes
├── scripts/       # Seed data
├── middleware/    # Express middleware (for future)
├── db.ts          # MongoDB connection
└── index.ts       # Entry point
```

## ბუქინგ მონაცემი

თითოეული ბუქინგი შეიცავს:
- ტურის ID
- სტუდენტის ინფორმაცია
- მშობლის კონტაქტი
- უცხო პირების რაოდენობა
- სულ ფასი
- სტატუსი (pending, confirmed, cancelled)

## ტურის მონაცემი

თითოეული ტური შეიცავს:
- დასახელება
- აღწერა
- დანიშვულება
- ფასი
- ხანგრძლივობა (დღის რაოდენობა)
- მაქსიმალური მონაწილეები
- ამჟამინდელი მონაწილეები
- დაწყების თარიღი
- დამთავრების თარიღი
- სხვა დეტალები

## მომავალი ფუნქციები

- [ ] აუთენტიფიკაცია / ავტორიზაცია
- [ ] ელ-ფოსტის ნოტიფიკაციები
- [ ] ფილტრაცია და ძებნა
- [ ] გამოხმელი რეპორტები
