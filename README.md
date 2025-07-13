# SmartCourseAI

An AI-powered course recommendation system for university students that provides personalized course suggestions based on interests, academic level, and career goals.

## Features

- 🤖 **AI-Powered Recommendations**: Get personalized course suggestions based on your interests and academic profile
- 💬 **AI Chatbot Assistant**: Chat with an intelligent assistant for course registration questions and guidance
- 👤 **User Authentication**: Secure login and registration system with welcome emails
- 🏫 **School-Specific Credits**: University-specific course catalogs with accurate credit systems
- 🎓 **Graduation Requirements**: Track progress toward degree requirements with detailed category breakdowns
- 📅 **Course Scheduling**: Interactive weekly schedule with course management
- 📊 **Course Details**: Comprehensive course information including credits, difficulty, and prerequisites
- 🎯 **Smart Planning**: Plan your academic journey with detailed course tracking
- 📧 **Email Notifications**: Welcome emails sent upon registration
- 📱 **Modern UI**: Beautiful, responsive design with smooth animations

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Icons**: Lucide React
- **Forms**: React Hook Form, Zod validation
- **Authentication**: Custom auth system (can be extended with NextAuth.js)
- **AI Integration**: OpenAI API ready (currently using mock responses)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd SmartCourseAI
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
SmartCourseAI/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── dashboard/        # Dashboard components
│   ├── layout/           # Layout components
│   └── providers/        # Context providers
├── public/               # Static assets
└── package.json          # Dependencies and scripts
```

## Usage

### For Students

1. **Register/Login**: Create an account or sign in with your credentials
2. **Complete Profile**: Add your university, academic level, and interests
3. **Get Recommendations**: Fill out the recommendation form to receive AI-powered course suggestions
4. **Chat with AI**: Use the AI assistant for course-related questions and guidance
5. **Plan Your Journey**: Review course details and plan your academic path

### Demo Credentials

For testing purposes, you can use any email and password combination to log in.

## Features in Detail

### Course Recommendations
- Input additional interests and preferences
- Specify preferred credit load and difficulty level
- Get personalized course suggestions with detailed explanations
- View course details including prerequisites and scheduling
- School-specific course catalogs with accurate credit systems
- **Smart Mix**: 4 interest-based courses + 2 graduation requirement courses

### Graduation Requirements Tracking
- Visual progress bars for each requirement category
- Real-time credit tracking and remaining requirements
- Category-specific recommendations (Social Sciences, Humanities, etc.)
- Next steps guidance for incomplete requirements
- University-specific graduation requirements

### Course Scheduling
- Interactive weekly schedule view
- Add and remove courses from your schedule
- View course times, locations, and instructors
- Credit tracking and semester management
- Visual schedule grid for easy planning

### AI Chatbot
- Ask questions about course registration
- Get guidance on prerequisites and scheduling
- Receive personalized advice based on your profile
- Suggested questions to get started

### User Dashboard
- View your academic profile and graduation progress
- Track recommended courses with requirement context
- Manage course schedule
- Access AI assistant
- Email notifications for important events

## Customization

### Adding Real AI Integration

To integrate with OpenAI API:

1. Add your OpenAI API key to environment variables:
```bash
OPENAI_API_KEY=your_api_key_here
```

2. Update the AI response generation in `components/dashboard/AIChatbot.tsx` and `components/dashboard/CourseRecommendationForm.tsx`

### Styling

The app uses Tailwind CSS with custom design tokens. You can customize:
- Colors in `tailwind.config.js`
- Component styles in `app/globals.css`
- Individual component styling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the repository.

---

Built with ❤️ for students seeking better course planning and academic guidance.
