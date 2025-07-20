import { AlertTriangle } from 'lucide-react';

interface FooterProps {
  title: string;
  inspirationUrl?: string;
  inspirationText?: string;
}

export default function Footer({ title, inspirationUrl, inspirationText }: FooterProps) {
  return (
    <footer className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white py-8 mt-12 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold">{title}</h3>
          </div>
          
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
            <a
              href="https://cyfrin.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 font-medium transition-colors"
            >
              Created by Cyfrin
            </a>
            {inspirationUrl && inspirationText && (
              <>
                <span className="hidden md:inline text-gray-400 dark:text-gray-500">|</span>
                <a
                  href={inspirationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 font-medium transition-colors"
                >
                  {inspirationText}
                </a>
              </>
            )}
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center justify-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500 dark:text-red-400 flex-shrink-0" />
            <p>
              For educational purposes only.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}