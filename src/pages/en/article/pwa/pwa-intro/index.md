---
title: Introduction to PWA
description: An introduction to Progressive Web Apps
createdAt: 2025-01-31T00:00:00.000Z
modifiedAt: "2025-02-19T12:18:19.386Z"
tags:
  - PWA
index: 0
series: PWA
---

### [Origin](#come-from)

> Progressive Web Apps (PWA) were first introduced by Google in 2015. The goal was to provide web applications with a user experience similar to native apps while maintaining the openness and ease of maintenance of the web. From a technical standpoint, PWA is not a new framework or technology but rather a set of standards and best practices for web applications to enhance their capabilities in modern browsers.

### [Core Technologies](#core-tech)

The main technological elements include:

- **Service Worker**
  - Intercepts and caches requests
  - Runs in the background
- **Web App Manifest**
  - Configures the appearance and installation information of the web app
- **Web Push Notification**
  - Sends push notifications
- **HTTPS (Requirement)**
  - PWAs must operate in an HTTPS environment to ensure that Service Workers are not vulnerable to man-in-the-middle (MITM) attacks.

### [Abstract Use Case](#story)

Imagine you open a coffee shop in a small alley for the first time, and customers have to visit in person to buy coffee. As you become more familiar with the business, you want to improve the customer experience and grow your business, so you start making some improvements(progressive)!

1. **Introduce "Takeaway Cup Service" (Service Worker Cache)**
   Customers no longer need to wait in the shop for their coffee to be made; they can take it anywhere to enjoy. Service Workers cache content that users have previously viewed, allowing them to access it even in poor network conditions.

2. **Launch "Delivery Service" (Web App Manifest)**
   To expand your customer base, you start accepting online orders. Customers can easily buy coffee by paying a delivery fee (installation). The PWA installation mechanism allows users to "install" the website on their phone's home screen for easy access without typing the URL each time.

3. **Offer "Product Notifications" (Web Push Notification)**
   You want customers to know about new products or promotions, so you start distributing flyers: "New Chocolate Latte Released Today!" Even if customers don't visit the shop, they can stay informed about the latest updates through push notifications.

4. These improvements can create more opportunities for the coffee shop, moving beyond passively waiting for business. This is the transformation brought by PWA — you remain the same familiar coffee shop (website), but now it's more flexible and convenient (installable as a Web App), attracting more repeat customers (push notifications), and potentially reducing operating costs (caching static files)!

Adopting PWA doesn't change the essence of your website; it makes it more flexible, better performing, and easier to distribute.

### References

1. https://en.wikipedia.org/wiki/Progressive_web_app
2. https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps
