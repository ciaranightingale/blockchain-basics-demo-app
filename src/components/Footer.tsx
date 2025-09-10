import { AlertTriangle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface SocialLinks {
  x?: string;
  github?: string;
  discord?: string;
}

interface FooterSection {
  name: string;
  baseUrl: string;
  items: Array<{
    name: string;
    url: string;
  }>;
}

interface FooterProps {
  title?: string;
  socials?: SocialLinks;
  inspirationUrl?: string;
  inspirationText?: string;
}

// Define the footer sections similar to the Svelte version
const sections: FooterSection[] = [
  {
    name: 'Cyfrin Updraft',
    baseUrl: 'https://updraft.cyfrin.io/',
    items: [
      { name: 'Blockchain Basics', url: 'https://updraft.cyfrin.io/courses/blockchain-basics' },
      { name: 'Foundry', url: 'https://updraft.cyfrin.io/courses/foundry' },
      { name: 'Advanced Foundry', url: 'https://updraft.cyfrin.io/courses/advanced-foundry' },
      { name: 'Assembly & Formal Verification', url: 'https://updraft.cyfrin.io/courses/formal-verification' }
    ]
  },
  {
    name: 'CodeHawks',
    baseUrl: 'https://codehawks.com/',
    items: [
      { name: 'Competitive Audits', url: 'https://codehawks.com/contests' },
      { name: 'First Flights', url: 'https://codehawks.com/first-flights' },
      { name: 'Learn', url: 'https://codehawks.com/learn' },
      { name: 'Docs', url: 'https://docs.codehawks.com/' }
    ]
  },
  {
    name: 'Cyfrin',
    baseUrl: 'https://cyfrin.io/',
    items: [
      { name: 'About', url: 'https://cyfrin.io/about' },
      { name: 'Services', url: 'https://cyfrin.io/services' },
      { name: 'Blog', url: 'https://cyfrin.io/blog' },
      { name: 'Contact', url: 'https://cyfrin.io/contact' }
    ]
  },
  {
    name: 'Solodit',
    baseUrl: 'https://solodit.xyz/',
    items: [
      { name: 'Audit Reports', url: 'https://solodit.xyz/' },
      { name: 'Search', url: 'https://solodit.xyz/search' },
      { name: 'Submit Report', url: 'https://solodit.xyz/submit' }
    ]
  }
];

const defaultSocials: SocialLinks = {
  x: 'https://x.com/cyfrinaudits',
  github: 'https://github.com/cyfrin',
  discord: 'https://discord.gg/cyfrin'
};

export default function Footer({ title = 'Updraft Learning Hub', socials = defaultSocials, inspirationUrl, inspirationText }: FooterProps) {
  const { isDarkMode } = useTheme();

  const SocialIcon = ({ name, href, className, width = "24" }: { name: string; href?: string; className?: string; width?: string }) => {
    if (!href) return null;
    
    const getIcon = () => {
      switch (name) {
        case 'twitter':
          return (
            <svg className={className} width={width} height={width} viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          );
        case 'github':
          return (
            <svg className={className} width={width} height={width} viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          );
        case 'discord':
          return (
            <svg className={className} width={width} height={width} viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
          );
        default:
          return null;
      }
    };

    return (
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer"
        className="group cursor-pointer"
        tabIndex={0}
      >
        {getIcon()}
      </a>
    );
  };

  const PoweredByCyfrinBadge = ({ className }: { className?: string }) => (
    <div className={`flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      <img 
        src={isDarkMode ? "/cyfrin-white.png" : "/cyfrin.png"}
        alt="Cyfrin Logo" 
        className="w-5 h-5 object-contain"
      />
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Powered by Cyfrin
      </span>
    </div>
  );

  return (
    <footer className="w-full flex flex-col items-center gap-16 bg-white dark:bg-gray-900 py-12 border-t border-gray-200 dark:border-gray-700">
      <div className="flex w-full flex-col items-center gap-8 max-w-[1600px] mx-auto">
        <div className="flex w-full flex-col items-center justify-center gap-x-20 gap-y-12 p-8 lg:flex-row lg:items-start">
          {/* Logo and Social Links */}
          <div className="order-1 flex shrink-0 flex-col flex-wrap items-center gap-12 lg:items-start lg:gap-6">
            <a className="flex items-center gap-3 text-xl font-bold text-gray-800 dark:text-white" href="/">
              <img 
                src={isDarkMode ? "/cyfrin-white.png" : "/cyfrin.png"}
                alt="Cyfrin Logo" 
                className="w-8 h-8 object-contain"
              />
              {title}
            </a>
            <div className="order-2 flex items-center gap-10 lg:gap-6">
              <SocialIcon
                className="fill-gray-400 stroke-gray-400 dark:fill-gray-500 dark:stroke-gray-500 group-hover:fill-gray-600 group-hover:stroke-gray-600 dark:group-hover:fill-gray-300 dark:group-hover:stroke-gray-300"
                name="twitter"
                href={socials.x}
                width="24"
              />
              <SocialIcon
                className="fill-gray-400 stroke-gray-400 dark:fill-gray-500 dark:stroke-gray-500 group-hover:fill-gray-600 group-hover:stroke-gray-600 dark:group-hover:fill-gray-300 dark:group-hover:stroke-gray-300"
                name="github"
                href={socials.github}
                width="24"
              />
              <SocialIcon
                className="fill-gray-400 stroke-gray-400 dark:fill-gray-500 dark:stroke-gray-500 group-hover:fill-gray-600 group-hover:stroke-gray-600 dark:group-hover:fill-gray-300 dark:group-hover:stroke-gray-300"
                name="discord"
                href={socials.discord}
                width="24"
              />
            </div>
          </div>

          {/* Footer Sections */}
          <div className="order-3 flex grow flex-col items-center gap-x-6 gap-y-8 self-stretch px-5 lg:flex-row lg:flex-wrap lg:items-start lg:justify-between">
            {sections.map((section) => (
              <div key={section.name} className="flex basis-1/2 flex-col items-start justify-start space-y-3 sm:basis-auto">
                <a
                  href={section.baseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base font-semibold text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {section.name}
                </a>
                {section.items.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => window.open(item.url, '_blank')}
                    className="hidden justify-start px-0 py-0 text-base font-medium text-gray-500 dark:text-gray-400 hover:bg-transparent hover:text-gray-700 dark:hover:text-gray-300 transition-colors lg:block text-left"
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            ))}
            <a className="block lg:hidden" href="https://www.cyfrin.io/" target="_blank" rel="noopener noreferrer">
              <PoweredByCyfrinBadge className="h-[29px]" />
            </a>
          </div>
        </div>
        
        {/* Desktop Powered by Cyfrin Badge */}
        <a className="hidden lg:block" href="https://www.cyfrin.io/" target="_blank" rel="noopener noreferrer">
          <PoweredByCyfrinBadge className="h-[29px]" />
        </a>
        
        {/* Inspiration Link */}
        {inspirationUrl && inspirationText && (
          <div className="text-center">
            <a
              href={inspirationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors"
            >
              {inspirationText}
            </a>
          </div>
        )}
        
        {/* Educational Notice */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-600 dark:text-gray-400 w-full max-w-4xl">
          <div className="flex items-center justify-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500 dark:text-red-400 flex-shrink-0" />
            <p>
              This is a demo app and doesn't use any real funds, accounts or cryptographic keys.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}