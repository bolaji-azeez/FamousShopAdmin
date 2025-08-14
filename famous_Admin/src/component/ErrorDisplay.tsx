import { AlertCircle } from "lucide-react";

export function ErrorDisplay({ message = "Failed to load data. Please try again." }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-red-500">
      <AlertCircle className="h-8 w-8 mb-2" />
      <p>{message}</p>
      <button 
        className="mt-4 px-4 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
        onClick={() => window.location.reload()}
      >
        Retry
      </button>
    </div>
  );
}