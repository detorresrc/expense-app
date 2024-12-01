import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: About,
});

function About() {
  return (
    <div className='max-w-3xl mx-auto p-6'>
      <h1 className='text-4xl font-bold mb-6 text-center'>
        About the Expense Tracker Application
      </h1>
      <p className='text-lg leading-relaxed mb-4'>
        This application helps you track all your expenses efficiently. You can
        add, view, and manage your expenses in one place.
      </p>
      <ul className='list-disc list-inside mb-4 space-y-2'>
        <li className='text-lg'>Record daily expenses easily</li>
        <li className='text-lg'>Categorize expenses for better organization</li>
        <li className='text-lg'>Analyze spending habits over time</li>
      </ul>
      <p className='text-lg leading-relaxed'>
        Stay on top of your finances with our comprehensive expense tracking
        features.
      </p>
    </div>
  );
}
