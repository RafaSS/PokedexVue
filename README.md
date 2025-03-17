# PokedexVue

A modern Pokémon encyclopedia built with Vue.js 3, TypeScript, and Tailwind CSS. Browse, search, and filter Pokémon with an intuitive interface. The application features internationalization support (English and Portuguese), responsive design, and seamless navigation.

![PokedexVue](https://raw.githubusercontent.com/RafaSS/PokedexVue/main/src/assets/screenshot.png)

## Features

- **Comprehensive Pokémon Database**: Access detailed information about all Pokémon
- **Advanced Filtering**: Filter Pokémon by type with AND logic (shows Pokémon that match ALL selected types)
- **Responsive Design**: Works on desktop and mobile devices
- **Internationalization**: Support for English and Portuguese languages
- **Type Visualization**: Visual representation of Pokémon types with appropriate colors
- **Cookie Consent Management**: GDPR-compliant cookie consent implementation
- **Supabase Integration**: Backend powered by Supabase for data storage and retrieval

## Tech Stack

- **Vue.js 3**: Progressive JavaScript framework
- **TypeScript**: For type safety and better developer experience
- **Tailwind CSS**: Utility-first CSS framework
- **Pinia**: State management
- **Vue Router**: Client-side routing
- **Vue I18n**: Internationalization
- **Vite**: Next-generation frontend tooling
- **Supabase**: Open source Firebase alternative

## Installation

1. Clone the repository:
```bash
git clone https://github.com/RafaSS/PokedexVue.git
cd PokedexVue
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure your Supabase credentials in the `.env` file.

## Development

Run the development server:
```bash
npm run dev
```

Run tests:
```bash
npm run test
```

Lint and fix files:
```bash
npm run lint:fix
```

## Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

1. Push your code to a GitHub repository
2. Import your repository in Vercel
3. Set the build command to `npm run build`
4. Set the output directory to `dist`
5. Set environment variables in Vercel dashboard
6. Deploy!

## Project Structure

```
PokedexVue/
├── dist/               # Built files
├── public/             # Static assets
├── src/
│   ├── assets/         # Images and resources
│   ├── components/     # Vue components
│   ├── i18n/           # Internationalization files
│   ├── plugins/        # Vue plugins
│   ├── router/         # Vue Router configuration
│   ├── stores/         # Pinia stores
│   ├── styles/         # CSS styles
│   ├── types/          # TypeScript type definitions
│   ├── views/          # Vue views/pages
│   ├── App.vue         # Root component
│   └── main.ts         # Application entry point
├── .env                # Environment variables
├── .env.example        # Example environment variables
├── index.html          # HTML entry point
├── package.json        # Project dependencies
├── tailwind.config.js  # Tailwind CSS configuration
├── tsconfig.json       # TypeScript configuration
├── vercel.json         # Vercel configuration
└── vite.config.ts      # Vite configuration
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
