export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 dark:bg-gray-800 border-t border-gray-300 dark:border-gray-700">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-gray-800 dark:text-gray-300">
            <strong>Made by AxoGM</strong> - © {currentYear}
          </p>
        </div>
      </div>
    </footer>
  );
};