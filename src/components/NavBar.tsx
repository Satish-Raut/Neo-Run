import { Link, useLocation } from 'react-router-dom';
import { Code2, LogIn, Terminal } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

type NavBarProps = {
    showCompilerButton?: boolean;
    additionalButtons?: React.ReactNode;
};

export default function NavBar({
    showCompilerButton = true,
    additionalButtons
}: NavBarProps) {
    const { currentUser } = useAuth();
    const location = useLocation();

    // Determine current page based on location path
    const isHomePage = location.pathname === '/';
    const isCompilerPage = location.pathname === '/compiler';

    return (
        <header className="sticky top-0 z-20 pt-4">
            <div className="max-w-7xl sm:mx-auto mx-2 bg-gray-900/75 backdrop-blur-md rounded-2xl border border-purple-500/20 shadow-lg shadow-purple-900/15 px-3 py-2 flex items-center justify-between transition-all duration-300 hover:shadow-purple-800/10">
                {/* Logo and Title */}
                <div className="flex items-center gap-3">
                    <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
                        <div className="bg-gradient-to-r from-purple-600 to-violet-700 rounded-xl p-2 shadow-sm shadow-purple-900/15">
                            <Code2 className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight bg-gradient-to-br from-purple-400 via-violet-400 to-purple-500 bg-clip-text text-transparent">
                            NeoRun
                        </h1>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex items-center gap-3">
                    {/* Additional buttons passed from parent component */}
                    {additionalButtons}

                    {/* User is logged in - show profile menu */}
                    {currentUser ? (
                        <>
                            {/* Compiler button */}
                            {showCompilerButton && !isCompilerPage && (
                                <Link
                                    to="/compiler"
                                    className="flex items-center gap-2 p-2 bg-gradient-to-r from-purple-600 to-violet-700 hover:from-violet-700 hover:to-purple-600 rounded-xl text-white font-medium transition-all shadow-md shadow-purple-900/15 hover:shadow-purple-800/25 border border-purple-500/40"
                                    aria-label="Compiler"
                                >
                                    <Terminal className="w-6 h-6" />
                                    <span className="hidden sm:inline">{isHomePage ? "Launch Compiler" : "Compiler"}</span>
                                </Link>
                            )}
                        </>
                    ) : (
                        /* User is not logged in - show login button */
                        <>
                            {/* Login button */}
                            <Link
                                to="/auth"
                                className="flex items-center gap-2 p-2 bg-gray-800/60 hover:bg-gray-800/70 rounded-xl text-white transition-all border border-purple-500/30 shadow-sm hover:shadow"
                                aria-label="Login"
                            >
                                <LogIn className="w-6 h-6" />
                                <span className="hidden sm:inline">Login</span>
                            </Link>

                            {/* Compiler button */}
                            {showCompilerButton && !isCompilerPage && (
                                <Link
                                    to="/compiler"
                                    className="flex items-center gap-2 p-2 bg-gradient-to-r from-purple-600 to-violet-700 hover:from-violet-700 hover:to-purple-600 rounded-xl text-white font-medium transition-all shadow-md shadow-purple-900/15 hover:shadow-purple-800/25 border border-purple-500/40"
                                    aria-label="Compiler"
                                >
                                    <Terminal className="w-6 h-6" />
                                    <span className="hidden sm:inline">{isHomePage ? "Launch Compiler" : "Compiler"}</span>
                                </Link>
                            )}
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}