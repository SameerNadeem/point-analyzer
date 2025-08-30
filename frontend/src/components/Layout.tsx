import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { refreshData } from '../services/api';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    useEffect(() => {
        setLastUpdate(new Date());
    }, []);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            await refreshData();
            setLastUpdate(new Date());
            setShowSuccessMessage(true);

            setTimeout(() => setShowSuccessMessage(false), 3000);

            setTimeout(() => window.location.reload(), 1000);

        } catch (error) {
            console.error('Refresh failed:', error);
            alert('Failed to refresh data. Please try again.');
        } finally {
            setIsRefreshing(false);
        }
    };

    const handleExport = (format: 'csv' | 'json') => {
        const link = document.createElement('a');
        link.href = `/api/export/${format}`;
        link.download = `baja_results.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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
                                <button
                                    className="nav-link dropdown-toggle btn btn-link p-0 border-0"
                                    type="button"
                                    data-bs-toggle="dropdown"
                                    style={{ color: 'rgba(255,255,255,.55)' }}
                                >
                                    Export
                                </button>
                                <ul className="dropdown-menu">
                                    <li>
                                        <button
                                            className="dropdown-item"
                                            onClick={() => handleExport('csv')}
                                        >
                                            Export CSV
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            className="dropdown-item"
                                            onClick={() => handleExport('json')}
                                        >
                                            Export JSON
                                        </button>
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

                {showSuccessMessage && (
                    <div className="alert alert-success alert-dismissible fade show" role="alert">
                        <strong>Success!</strong> Competition data has been refreshed successfully.
                        <button
                            type="button"
                            className="btn-close"
                            onClick={() => setShowSuccessMessage(false)}
                        ></button>
                    </div>
                )}

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