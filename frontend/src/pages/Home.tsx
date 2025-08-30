import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchRankings } from '../services/api';
import { Rankings, EventCategory } from '../types';
import OverallChart from '../components/OverallChart';

const Home: React.FC = () => {
    const [rankings, setRankings] = useState<Rankings | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<EventCategory>('overall');
    const [searchTerm, setSearchTerm] = useState('');

    // Load rankings data
    useEffect(() => {
        const loadRankings = async () => {
            try {
                setLoading(true);
                const data = await fetchRankings();
                setRankings(data);
                setError(null);
            } catch (err) {
                setError('Failed to load rankings data');
                console.error('Error loading rankings:', err);
            } finally {
                setLoading(false);
            }
        };

        loadRankings();
    }, []);

    // Filter rankings based on search term
    const filterRankings = (rankingList: any[]) => {
        if (!searchTerm) return rankingList;

        return rankingList.filter(entry =>
            entry.car_number.toString().includes(searchTerm.toLowerCase()) ||
            entry.team_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    // Get current tab data
    const getCurrentTabData = () => {
        if (!rankings) return [];
        return filterRankings(rankings[activeTab]);
    };

    if (loading) {
        return (
            <div className="text-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading competition results...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger">
                <h4>Error</h4>
                <p>{error}</p>
                <button
                    className="btn btn-primary"
                    onClick={() => window.location.reload()}
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="row mb-4">
            <div className="col-12">
                <div className="card">
                    <div className="card-header bg-primary text-white">
                        <h2 className="card-title mb-0">Baja SAE Competition Results</h2>
                    </div>
                    <div className="card-body">
                        <div className="alert alert-info">
                            <p className="mb-0">
                                View and analyze results from Baja SAE competitions. Select different ranking categories using
                                the tabs below. Click on a car number to see detailed results for that car.
                            </p>
                        </div>

                        {/* Chart Container */}
                        {rankings && rankings.overall.length > 0 && (
                            <OverallChart data={rankings.overall} />
                        )}

                        {/* Search Box */}
                        <div className="mb-3">
                            <div className="row">
                                <div className="col-md-6">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search by car # or team name"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Ranking Tabs */}
                        <ul className="nav nav-tabs" role="tablist">
                            {(['overall', 'dynamic', 'static', 'endurance'] as EventCategory[]).map((category) => (
                                <li className="nav-item" role="presentation" key={category}>
                                    <button
                                        className={`nav-link ${activeTab === category ? 'active' : ''}`}
                                        type="button"
                                        onClick={() => setActiveTab(category)}
                                    >
                                        {category.charAt(0).toUpperCase() + category.slice(1)}
                                    </button>
                                </li>
                            ))}
                        </ul>

                        {/* Tab Content */}
                        <div className="tab-content p-3 border border-top-0 rounded-bottom">
                            <div className="tab-pane fade show active">
                                <h4>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Rankings</h4>

                                {getCurrentTabData().length === 0 ? (
                                    <div className="alert alert-warning">
                                        <p>No results found{searchTerm ? ` for "${searchTerm}"` : ''}.</p>
                                    </div>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table table-striped table-hover">
                                            <thead>
                                                <tr>
                                                    <th>Rank</th>
                                                    <th>Car #</th>
                                                    <th>Team</th>
                                                    <th>Score</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {getCurrentTabData().map((entry, index) => (
                                                    <tr key={entry.car_number}>
                                                        <td>{entry.rank}</td>
                                                        <td>
                                                            <Link
                                                                to={`/car/${entry.car_number}`}
                                                                className="text-decoration-none fw-bold"
                                                            >
                                                                {entry.car_number}
                                                            </Link>
                                                        </td>
                                                        <td>{entry.team_name || 'Unknown Team'}</td>
                                                        <td>{entry.score.toFixed(2)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Summary Stats */}
                        {rankings && (
                            <div className="mt-4">
                                <div className="row">
                                    <div className="col-md-3">
                                        <div className="card bg-light">
                                            <div className="card-body text-center">
                                                <h5 className="card-title">Total Teams</h5>
                                                <h3 className="text-primary">{rankings.overall.length}</h3>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="card bg-light">
                                            <div className="card-body text-center">
                                                <h5 className="card-title">Top Score</h5>
                                                <h3 className="text-success">
                                                    {rankings.overall[0]?.score.toFixed(2) || '0.00'}
                                                </h3>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="card bg-light">
                                            <div className="card-body text-center">
                                                <h5 className="card-title">Leading Team</h5>
                                                <h4 className="text-primary">
                                                    Car #{rankings.overall[0]?.car_number} - {rankings.overall[0]?.team_name}
                                                </h4>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;