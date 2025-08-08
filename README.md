# 🏥 Chitti Healthcare Provider Web App

A comprehensive web application for healthcare providers to manage appointments, doctors, and patient interactions through Chitti AI.

## 🚀 Features

- **Provider Registration & Login**: Secure authentication for healthcare facilities
- **Doctor Management**: Add, edit, and manage doctor profiles
- **Appointment Management**: View, confirm, and track appointments
- **Availability Management**: Set and manage doctor schedules
- **Dashboard Analytics**: Real-time statistics and revenue tracking
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## 🛠️ Tech Stack

- **Frontend**: React.js, React Router, React Hook Form
- **Styling**: CSS3 with modern design
- **HTTP Client**: Axios for API calls
- **Notifications**: React Hot Toast
- **Backend**: Node.js + Express.js (separate repository)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd healthcare-webapp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔧 Configuration

The app is configured to connect to the backend API. Update the proxy in `package.json` if needed:

```json
{
  "proxy": "https://your-backend-url.com"
}
```

## 📱 Usage

### Demo Login
For testing purposes, use these demo credentials:
- **Email**: demo@hospital.com
- **Password**: demo123

### Key Features

1. **Dashboard**: View today's appointments, pending count, and revenue
2. **Doctor Management**: Add new doctors with specializations and fees
3. **Appointment Management**: Confirm, cancel, and track appointment status
4. **Availability Management**: Set weekly schedules for each doctor

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Railway
1. Connect your GitHub repository to Railway
2. Set environment variables
3. Deploy automatically on push

### Environment Variables
- `REACT_APP_API_URL`: Backend API URL
- `REACT_APP_ENVIRONMENT`: Production/Development

## 📊 API Endpoints

The app connects to these backend endpoints:

- `POST /healthcare/admin/login` - Provider login
- `POST /healthcare/provider/register` - Provider registration
- `POST /healthcare/doctor/add` - Add new doctor
- `GET /healthcare/provider/:id/dashboard` - Dashboard data
- `PUT /healthcare/appointment/:id/status` - Update appointment status
- `GET /healthcare/specializations` - Get specializations list

## 🎨 UI Components

- **Login/Registration**: Clean authentication forms
- **Dashboard**: Statistics cards and appointment overview
- **Tables**: Responsive data tables with sorting
- **Forms**: Validation and error handling
- **Navigation**: Consistent header navigation

## 🔒 Security

- JWT token authentication
- Form validation and sanitization
- Secure API communication
- Session management

## 📈 Analytics

- Real-time appointment tracking
- Revenue and commission calculations
- Doctor performance metrics
- Patient interaction history

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Email: support@chitti.ai
- Documentation: [docs.chitti.ai](https://docs.chitti.ai)
- Issues: GitHub Issues

---

**Built with ❤️ for the Indian healthcare ecosystem** 