# AI Career Mentor 🎯

> AI-powered career development assistant with full Hebrew (RTL) and English support

## Features

- 🤖 **AI Career Plans** - Personalized career development strategies
- 🌍 **Bilingual** - English/Hebrew with automatic RTL layout switching
- 📊 **Progress Tracking** - Monitor your career journey
- 📱 **Responsive** - Works on all devices
- 🔐 **Secure** - User authentication and data protection

## Tech Stack

- **React 18** + TypeScript + Vite
- **Styled Components** with RTL theme system
- **React i18next** for internationalization
- **Material-UI** icons

## Quick Start

```bash
# Clone and install
git clone <repo-url>
cd ai-career-mentor
npm install

# Set up environment
cp .env.example .env

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## RTL Support

Comprehensive right-to-left support for Hebrew:

```typescript
// Auto RTL styling
const { getMargin, getTextAlign } = useRTLAware();
const styles = {
  ...getMargin("10px", "20px"), // Auto margins
  textAlign: getTextAlign("left"), // 'right' in Hebrew
};

// Theme-based components
const Card = styled.div`
  direction: ${({ theme }) => theme.direction};
  text-align: ${({ theme }) => (theme.direction === "rtl" ? "right" : "left")};
`;
```

## Scripts

- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run preview` - Preview build
- `npm run lint` - Code linting

## Project Structure

```
src/
├── contexts/RTLContext.tsx    # RTL provider & theme
├── hooks/useRTLAware.ts       # RTL styling utilities
├── pages/                     # Main app pages
├── locales/                   # en.json, he.json
└── types/styled.d.ts          # Theme types
```

## Environment Variables

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

## Contributing

1. Fork the repo
2. Create feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -m 'Add feature'`
4. Push: `git push origin feature/new-feature`
5. Open Pull Request

**RTL Guidelines:** Test both English (LTR) and Hebrew (RTL) layouts, use provided RTL hooks for new components.

---

Built with React + TypeScript + Vite
