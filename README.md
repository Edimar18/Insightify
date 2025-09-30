# Insightify: Mobile Business Intelligence for SMEs

![Insightify Logo](https://iili.io/KaKK1vp.md.png)


**Insightify** is a powerful mobile business intelligence application designed specifically for small to medium-sized businesses (SMEs) and entrepreneurs. It transforms fragmented business data into actionable insights through intuitive dashboards, enabling data-driven decisions on the go.

## 🚀 Features

### Data Management
- **Manual Data Entry**: Simple forms for logging revenues, expenses, and delivery costs
- **CSV/Excel Upload**: Import existing data from spreadsheets for easy onboarding
- **Data Aggregation**: Consolidates data from multiple sources into a unified view

### Data Visualization & Analytics
- **Real-time Dashboards**: High-level summary of business health at a glance
- **Interactive Charts**: 
  - Line graphs for trend analysis
  - Bar charts for comparisons
  - Pie charts for revenue/expense breakdowns
- **KPIs at a Glance**: Key metrics prominently displayed (Total Revenue, Net Profit, etc.)
- **Historical Comparisons**: Compare current performance against previous periods
- **Drill-down Analytics**: Tap into charts to view underlying transaction details

### Mobile-Specific Features
- **Push Notifications**: Alerts for important events (sales, overdue payments, expense thresholds)
- **Offline Access**: Cached data and dashboards available without internet
- **QR/Barcode Scanner**: (Future feature) For easy inventory/product logging

## 📱 Screens & Components

### 1. Dashboard (Main Screen)
- Header with app logo and user profile
- Summary cards for key metrics
- Interactive revenue/expense trend chart
- Recent transactions list
- Bottom navigation bar

### 2. Analytics
- Date range picker
- Expense breakdown pie chart
- Monthly profit/loss bar chart
- Filterable delivery log details

### 3. Data Entry
- Tabbed interface (Revenue/Expense/Delivery)
- Form inputs for transaction details
- Save functionality with feedback modals

### 4. Profile & Settings
- User information card
- Settings options (Categories, Data Import, Notifications)
- Account management

## 🛠 Technical Implementation

### Tech Stack
- **Framework**: React Native with Expo
- **State Management**: React hooks (useState, useReducer)
- **Navigation**: React Navigation
- **Charts**: react-native-chart-kit or react-native-svg-charts
- **Data Persistence**: Firebase Realtime Database (initial version)
- **UI Components**: Custom reusable components (Card, Chart, FormInput, ListItem)

### Project Structure
```
insightify/
   app/
   ├── _layout.tsx          # Root layout (decides stack navigation)
   ├── index.tsx            # Splash screen
   ├── (auth)/              # Authentication flow
   │   ├── _layout.tsx      # Auth stack (Login, Register)
   │   ├── login.tsx
   │   └── register.tsx
   └── (tabs)/              # Main dashboard tabs
      ├── _layout.tsx      # Bottom Tabs
      ├── home.tsx
      ├── analytics.tsx
      ├── data-entry.tsx
      └── profile.tsx

```

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14 or later)
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (for iOS development) or Android Studio (for Android development)

### Steps
1. Clone the repository
```bash
git clone https://github.com/Edimar18/Insightify.git
cd insightify
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npx expo start
```

4. Run the app
- On iOS: Press `i` in the terminal
- On Android: Press `a` in the terminal
- On web: Press `w` in the terminal


## 🔮 Future Enhancements

1. **Third-Party Integrations**: Connect with Shopify, Stripe, QuickBooks
2. **Predictive Analytics**: Forecast future trends using historical data
3. **Team Collaboration**: Multi-user access to business accounts
4. **Advanced Reporting**: Custom report generation and export
5. **Inventory Management**: Full inventory tracking system

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

Insightify is developed as part of a Mobile Programming course project by:
- [Edimar](https://github.com/Edimar18)
- [Team Member 2](https://github.com/member2)
- [Team Member 3](https://github.com/member3)
- [Team Member 4](https://github.com/member4)
- [Team Member 5](https://github.com/member5)
- [Team Member 6](https://github.com/member6)

---

**Empowering businesses with data-driven insights, anytime and anywhere.**