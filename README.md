# 🎟️ Event Booking System

A scalable **Event Booking Platform** that allows organizations to create events and enables users to discover, book, and pay for tickets online.

This project is designed as a **SaaS-ready platform** supporting multiple organizations, ticket types, secure payments, and event analytics.

---

# 🚀 Features

## 👤 Authentication

- User registration and login
- JWT authentication
- Password reset
- Role-based access (Admin, Organizer, User)

---

## 📅 Event Management

Organizers can:

- Create events
- Edit event details
- Upload event images
- Set event location and time
- Publish or unpublish events
- Manage event categories

---

## 🔁 Recurring Events

An event can have **multiple occurrences**.

Example:

```
AI  Class
Monday 7PM
Wednesday 7PM
Friday 7PM
```

Each occurrence is stored as an **event instance**.

---

## 🎟️ Ticket Types

Each event instance can contain multiple ticket types:

| Ticket Type | Example                    |
| ----------- | -------------------------- |
| Early Bird  | Limited discounted tickets |
| GENERAL     | Standard ticket            |
| VIP         | Premium access             |

Features:

- Limited ticket quantity
- Sales start / end time
- Maximum tickets per user
- Custom pricing

---

## 🛒 Ticket Booking

Users can:

1. Browse events
2. Select ticket type
3. Choose quantity
4. Confirm booking

The system creates:

```
booking
booking_items
payment
```

---

## 💳 Secure Payments

Supports payment integrations such as:

- Stripe
- PayPal
- Local payment gateways

Features:

- Payment status tracking
- Refund support
- Transaction history

---

## 🎫 Digital Tickets

After successful payment:

- Tickets are generated
- QR codes are created
- Users receive tickets via email

Tickets can be scanned during event check-in.

---

## 📍 Event Check-in

At the event entrance:

- Scan QR code
- Validate ticket
- Mark ticket as used

Prevents duplicate entries.

---

## 🏷️ Coupons & Discounts

Organizers can create:

- Percentage discounts
- Fixed amount discounts
- Promotional codes

Example:

```
SUMMER10
EARLYBIRD
VIP50
```

---

## ⭐ Reviews & Ratings

Users can rate events and leave feedback.

Example:

```
⭐⭐⭐⭐⭐
Amazing event and well organized!
```

---

## 📊 Organizer Dashboard

Organizers can track:

- Total tickets sold
- Revenue
- Booking statistics
- Event performance
- Upcoming events

---

# 🧱 Tech Stack

## Backend

- **Node.js**
- **NestJS**
- **PostgreSQL**
- **Redis**
- **JWT Authentication**

<!-- ## Frontend

* **Next.js**
* **React**
* **TailwindCSS** -->

## Infrastructure

- **Docker**
- **Nginx**
- **AWS / VPS**

---

# 🔄 Booking Flow

```
User
 ↓
Browse Events
 ↓
Select Event
 ↓
Choose Ticket Type
 ↓
Create Booking
 ↓
Payment Processing
 ↓
Booking Confirmed
 ↓
Ticket Generated
```

---

# 🔐 Roles

| Role      | Permissions              |
| --------- | ------------------------ |
| Admin     | Manage platform          |
| Organizer | Create and manage events |
| User      | Browse and book events   |

---

# 📦 Future Improvements

Possible SaaS features:

- Waitlist system
- Seat selection
- Email notifications
- Organizer subscription plans
- Event analytics

---

# 📄 License

MIT License

---

# 👨‍💻 Author

Built as a **modern SaaS Event Booking Platform** designed for scalability and real-world usage.
