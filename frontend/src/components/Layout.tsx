import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { refreshData } from '../services/api';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

    useEffect(() => {
        setLastUpdate(new Date());
    }, []);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            await refreshData();
            setLastUpdate(new Date());
            // Reload the page to get fresh data
            window.location.reload();
        } catch (error) {
            console.error('Refresh failed:', error);
            alert('Failed to refresh data. Please try again.');
        } finally {
            setIsRefreshing(false);
        }
    };

    return (
        <div className="min-vh-100 d-flex flex-column">
            {/* Navigation Bar */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container">
                    <Link className="navbar-brand" to="/">
                        Baja SAE Results Tracker
                    </Link>

                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav me-auto">
                            <li className="nav-item">
                                <Link className="nav-link" to="/">Home</Link>
                            </li>
                            <li className="nav-item dropdown">
                                <a
                                    className="nav-link dropdown-toggle"
                                    href="#"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                >
                                    Export
                                </a>
                                <ul className="dropdown-menu">
                                    <li>
                                        <a className="dropdown-item" href="/api/export/csv">
                                            CSV
                                        </a>
                                    </li>
                                    <li>
                                        <a className="dropdown-item" href="/api/export/json">
                                            JSON
                                        </a>
                                    </li>
                                </ul>
                            </li>
                        </ul>

                        <div className="d-flex">
                            <button
                                className="btn btn-outline-light"
                                type="button"
                                onClick={handleRefresh}
                                disabled={isRefreshing}
                            >
                                {isRefreshing ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" />
                                        Refreshing...
                                    </>
                                ) : (
                                    'Refresh Data'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="container my-4 flex-grow-1">
                {children}
            </div>

            {/* Footer */}
            <footer className="bg-dark text-light py-3 mt-5">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6">
                            <p className="mb-0">Baja SAE Results Tracker</p>
                        </div>
                        <div className="col-md-6 text-md-end">
                            {lastUpdate && (
                                <p className="mb-0">
                                    Last Updated: {lastUpdate.toLocaleString()}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;