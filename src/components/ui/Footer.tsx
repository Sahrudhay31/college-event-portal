import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="mt-auto border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 py-4 px-6 text-center text-sm">
            <div className="max-w-2xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-gray-600 dark:text-gray-400">
                    Designed and built with passion by <span className="font-semibold text-blue-600 dark:text-blue-400">Sahrudhay</span>
                </p>
                
                <div className="flex items-center gap-4">
                    <Link 
                        href="https://github.com/Sahrudhay31" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                    >
                        GitHub
                    </Link>
                    <span className="text-gray-300 dark:text-gray-700">|</span>
                    <Link 
                        href="https://www.linkedin.com/in/sahrudhay-chirra/" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                    >
                        LinkedIn
                    </Link>
                    <span className="text-gray-300 dark:text-gray-700">|</span>
                    <Link 
                        href="https://sahrudhay31.github.io/Portfolio-Website/" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400 transition-colors"
                    >
                        Portfolio
                    </Link>
                </div>
            </div>
        </footer>
    );
}
