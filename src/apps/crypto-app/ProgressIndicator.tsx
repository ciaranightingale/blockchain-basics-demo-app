// src/components/ProgressIndicator.tsx
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

interface Demo {
  id: string;
  title: string;
  description: string;
}

interface ProgressIndicatorProps {
  demos: Demo[];
  currentDemo: number;
  nextDemo: () => void;
  prevDemo: () => void;
  getDemoCompletionStatus: (demoId: string) => boolean;
}

const ProgressIndicator = ({ demos, currentDemo, nextDemo, prevDemo, getDemoCompletionStatus }: ProgressIndicatorProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t dark:border-gray-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Previous Button */}
          <button
            onClick={prevDemo}
            disabled={currentDemo === 0}
            className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 rounded-lg transition-colors ${
              currentDemo === 0
                ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-medium text-xs sm:text-sm">Previous</span>
          </button>

          {/* Progress Dots */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {demos.map((demo, index) => (
              <div key={demo.id} className="flex items-center">
                <div className="relative">
                  <div
                    className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-300 ${
                      index === currentDemo
                        ? 'bg-blue-600 scale-125'
                        : getDemoCompletionStatus(demo.id)
                        ? 'bg-green-500'
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  />
                  {/* Completion check mark */}
                  {getDemoCompletionStatus(demo.id) && index !== currentDemo && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Check className="w-2 h-2 sm:w-3 sm:h-3 text-white" />
                    </div>
                  )}
                </div>
                {index < demos.length - 1 && (
                  <div
                    className={`w-4 sm:w-8 h-0.5 mx-1 sm:mx-2 transition-colors duration-300 ${
                      getDemoCompletionStatus(demo.id) ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={nextDemo}
            disabled={currentDemo === demos.length - 1}
            className={`flex items-center space-x-1 sm:space-x-2 px-3 sm:px-6 py-2 rounded-lg transition-colors ${
              currentDemo === demos.length - 1
                ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
            }`}
          >
            <span className="font-medium text-xs sm:text-sm">Next</span>
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Current Demo Info */}
        <div className="text-center mt-2 sm:mt-3">
          <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            {currentDemo + 1} of {demos.length}
            {getDemoCompletionStatus(demos[currentDemo].id) && (
              <span className="ml-2 text-green-600 dark:text-green-400 font-medium">✓ Completed</span>
            )}
          </div>
          <div className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
            {demos[currentDemo].title}
          </div>
          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 hidden sm:block">
            {demos[currentDemo].description}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicator;