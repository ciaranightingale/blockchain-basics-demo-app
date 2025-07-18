// src/components/ProgressIndicator.jsx
import React from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

const ProgressIndicator = ({ demos, currentDemo, nextDemo, prevDemo, getDemoCompletionStatus }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Previous Button */}
          <button
            onClick={prevDemo}
            disabled={currentDemo === 0}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              currentDemo === 0
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-medium">Previous</span>
          </button>

          {/* Progress Dots */}
          <div className="flex items-center space-x-3">
            {demos.map((demo, index) => (
              <div key={demo.id} className="flex items-center">
                <div className="relative">
                  <div
                    className={`w-4 h-4 rounded-full transition-all duration-300 ${
                      index === currentDemo
                        ? 'bg-blue-600 scale-125'
                        : getDemoCompletionStatus(demo.id)
                        ? 'bg-green-500'
                        : 'bg-gray-300'
                    }`}
                  />
                  {/* Completion check mark */}
                  {getDemoCompletionStatus(demo.id) && index !== currentDemo && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                {index < demos.length - 1 && (
                  <div
                    className={`w-8 h-0.5 mx-2 transition-colors duration-300 ${
                      getDemoCompletionStatus(demo.id) ? 'bg-green-500' : 'bg-gray-300'
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
            className={`flex items-center space-x-2 px-6 py-2 rounded-lg transition-colors ${
              currentDemo === demos.length - 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <span className="font-medium">Next</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Current Demo Info */}
        <div className="text-center mt-2">
          <div className="text-sm text-gray-500">
            {currentDemo + 1} of {demos.length}
            {getDemoCompletionStatus(demos[currentDemo].id) && (
              <span className="ml-2 text-green-600 font-medium">✓ Completed</span>
            )}
          </div>
          <div className="text-lg font-semibold text-gray-900">
            {demos[currentDemo].title}
          </div>
          <div className="text-sm text-gray-600">
            {demos[currentDemo].description}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicator;