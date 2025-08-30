import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchCarDetail, fetchRankings } from '../services/api';
import { CarData, Rankings } from '../types';

const CarDetail: React.FC = () => {
    const { carNumber } = useParams<{ carNumber: string }>();
    const [carData, setCarData] = useState<CarData | null>(null);
    const [overallRank, setOverallRank] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('dynamic');

    useEffect(() => {
        const loadCarData = async () => {
            if (!carNumber) return;

            try {
                setLoading(true);
                const [carResponse, rankingsResponse] = await Promise.all([
                    fetchCarDetail(parseInt(carNumber)),
                    fetchRankings()
                ]);

                setCarData(carResponse);

                // Find overall rank
                const rank = rankingsResponse.overall.find(entry =>
                    entry.car_number === parseInt(carNumber)
                )?.rank || null;
                setOverallRank(rank);

                setError(null);
            } catch (err) {
                setError(`Failed to load data for Car #${carNumber}`);
                console.error('Error loading car detail:', err);
            } finally {
                setLoading(false);
            }
        };

        loadCarData();
    }, [carNumber]);

    const getStatusBadge = (status: string | null) => {
        if (status === 'OK') {
            return <span className="badge bg-success">OK</span>;
        } else if (status === 'DNF') {
            return <span className="badge bg-danger">DNF</span>;
        } else if (status === 'DSQ') {
            return <span className="badge bg-warning text-dark">DSQ</span>;
        } else {
            return <span className="badge bg-secondary">{status || 'N/A'}</span>;
        }
    };

    const formatResult = (result: any, showAttribute?: 'distance' | 'cones' | 'gates') => {
        if (!result) return 'No Data';

        return (
            <div>
                <div>{result.time ? `${result.time} seconds` : 'N/A'}</div>
                {showAttribute && result.unique_attribute !== null && (
                    <small className="text-muted">
                        {showAttribute === 'distance' && `Distance: ${result.unique_attribute}`}
                        {showAttribute === 'cones' && `Cones Hit: ${result.unique_attribute}`}
                        {showAttribute === 'gates' && `Gates Hit: ${result.unique_attribute}`}
                    </small>
                )}
            </div>
        );
    };

    // Handle export
    const handleExport = (format: 'csv' | 'json') => {
        const link = document.createElement('a');
        link.href = `/api/export/${format}`;
        link.download = `baja_results.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) {
        return (
            <div className="text-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading car details...</p>
            </div>
        );
    }

    if (error || !carData) {
        return (
            <div className="row mb-4">
                <div className="col-12">
                    <div className="alert alert-danger">
                        <h4>Error</h4>
                        <p>{error}</p>
                        <Link to="/" className="btn btn-primary">Back to Rankings</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="row mb-4">
            <div className="col-12">
                <div className="card">
                    <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                        <h2 className="card-title mb-0">
                            Car #{carData.car_number} - {carData.team_name || 'Unknown Team'}
                        </h2>
                        {overallRank && (
                            <span className="badge bg-light text-dark fs-6">
                                Overall Rank: #{overallRank}
                            </span>
                        )}
                    </div>
                    <div className="card-body">

                        {/* Navigation Tabs */}
                        <ul className="nav nav-tabs" role="tablist">
                            <li className="nav-item">
                                <button
                                    className={`nav-link ${activeTab === 'dynamic' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('dynamic')}
                                >
                                    Dynamic Events
                                </button>
                            </li>
                            <li className="nav-item">
                                <button
                                    className={`nav-link ${activeTab === 'static' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('static')}
                                >
                                    Static Events
                                </button>
                            </li>
                            <li className="nav-item">
                                <button
                                    className={`nav-link ${activeTab === 'endurance' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('endurance')}
                                >
                                    Endurance
                                </button>
                            </li>
                        </ul>

                        {/* Tab Content */}
                        <div className="tab-content p-3 border border-top-0 rounded-bottom">

                            {/* Dynamic Events Tab */}
                            {activeTab === 'dynamic' && (
                                <div className="row">
                                    {/* Acceleration */}
                                    <div className="col-md-6 mb-3">
                                        <div className="card">
                                            <div className="card-header">
                                                <h5>Acceleration</h5>
                                            </div>
                                            <div className="card-body">
                                                <p><strong>Score:</strong> {(carData.acceleration_score || 0).toFixed(2)}</p>
                                                <h6>Attempts:</h6>
                                                <div className="row">
                                                    <div className="col-6">
                                                        <div className="border rounded p-2 mb-2">
                                                            <strong>Run 1:</strong>
                                                            <div>{formatResult(carData.acceleration_result_1)}</div>
                                                            <div>{getStatusBadge(carData.acceleration_result_1?.status ?? null)}</div>
                                                        </div>
                                                    </div>
                                                    <div className="col-6">
                                                        <div className="border rounded p-2 mb-2">
                                                            <strong>Run 2:</strong>
                                                            <div>{formatResult(carData.acceleration_result_2)}</div>
                                                            <div>{getStatusBadge(carData.acceleration_result_2?.status ?? null)}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Traction */}
                                    <div className="col-md-6 mb-3">
                                        <div className="card">
                                            <div className="card-header">
                                                <h5>Traction</h5>
                                            </div>
                                            <div className="card-body">
                                                <p><strong>Score:</strong> {(carData.traction_score || 0).toFixed(2)}</p>
                                                <h6>Attempts:</h6>
                                                <div className="row">
                                                    <div className="col-6">
                                                        <div className="border rounded p-2 mb-2">
                                                            <strong>Run 1:</strong>
                                                            <div>{formatResult(carData.traction_result_1, 'distance')}</div>
                                                            <div>{getStatusBadge(carData.traction_result_1?.status ?? null)}</div>
                                                        </div>
                                                    </div>
                                                    <div className="col-6">
                                                        <div className="border rounded p-2 mb-2">
                                                            <strong>Run 2:</strong>
                                                            <div>{formatResult(carData.traction_result_2, 'distance')}</div>
                                                            <div>{getStatusBadge(carData.traction_result_2?.status ?? null)}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Maneuverability */}
                                    <div className="col-md-6 mb-3">
                                        <div className="card">
                                            <div className="card-header">
                                                <h5>Maneuverability</h5>
                                            </div>
                                            <div className="card-body">
                                                <p><strong>Score:</strong> {(carData.maneuverability_score || 0).toFixed(2)}</p>
                                                <h6>Attempts:</h6>
                                                <div className="row">
                                                    <div className="col-6">
                                                        <div className="border rounded p-2 mb-2">
                                                            <strong>Run 1:</strong>
                                                            <div>{formatResult(carData.maneuverability_result_1, 'cones')}</div>
                                                            <div>{getStatusBadge(carData.maneuverability_result_1?.status ?? null)}</div>
                                                        </div>
                                                    </div>
                                                    <div className="col-6">
                                                        <div className="border rounded p-2 mb-2">
                                                            <strong>Run 2:</strong>
                                                            <div>{formatResult(carData.maneuverability_result_2, 'cones')}</div>
                                                            <div>{getStatusBadge(carData.maneuverability_result_2?.status ?? null)}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Suspension */}
                                    <div className="col-md-6 mb-3">
                                        <div className="card">
                                            <div className="card-header">
                                                <h5>Suspension</h5>
                                            </div>
                                            <div className="card-body">
                                                <p><strong>Score:</strong> {(carData.suspension_score || 0).toFixed(2)}</p>
                                                <h6>Attempts:</h6>
                                                <div className="row">
                                                    <div className="col-6">
                                                        <div className="border rounded p-2 mb-2">
                                                            <strong>Run 1:</strong>
                                                            <div>{formatResult(carData.suspension_result_1, 'gates')}</div>
                                                            <div>{getStatusBadge(carData.suspension_result_1?.status ?? null)}</div>
                                                        </div>
                                                    </div>
                                                    <div className="col-6">
                                                        <div className="border rounded p-2 mb-2">
                                                            <strong>Run 2:</strong>
                                                            <div>{formatResult(carData.suspension_result_2, 'gates')}</div>
                                                            <div>{getStatusBadge(carData.suspension_result_2?.status ?? null)}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Static Events Tab */}
                            {activeTab === 'static' && (
                                <div className="row">
                                    <div className="col-md-4 mb-3">
                                        <div className="card">
                                            <div className="card-header">
                                                <h5>Design</h5>
                                            </div>
                                            <div className="card-body">
                                                {carData.design_result ? (
                                                    <>
                                                        <p><strong>Score:</strong> {carData.design_result.score?.toFixed(2) || '0.00'}</p>
                                                        <p><strong>Status:</strong> {getStatusBadge(carData.design_result.status)}</p>
                                                    </>
                                                ) : (
                                                    <p>No Data</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <div className="card">
                                            <div className="card-header">
                                                <h5>Cost</h5>
                                            </div>
                                            <div className="card-body">
                                                {carData.cost_result ? (
                                                    <>
                                                        <p><strong>Score:</strong> {carData.cost_result.score?.toFixed(2) || '0.00'}</p>
                                                        <p><strong>Status:</strong> {getStatusBadge(carData.cost_result.status)}</p>
                                                    </>
                                                ) : (
                                                    <p>No Data</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <div className="card">
                                            <div className="card-header">
                                                <h5>Business</h5>
                                            </div>
                                            <div className="card-body">
                                                {carData.business_result ? (
                                                    <>
                                                        <p><strong>Score:</strong> {carData.business_result.score?.toFixed(2) || '0.00'}</p>
                                                        <p><strong>Status:</strong> {getStatusBadge(carData.business_result.status)}</p>
                                                    </>
                                                ) : (
                                                    <p>No Data</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Endurance Tab */}
                            {activeTab === 'endurance' && (
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <div className="card">
                                            <div className="card-header">
                                                <h5>Endurance Results</h5>
                                            </div>
                                            <div className="card-body">
                                                <p><strong>Score:</strong> {(carData.endurance_score || 0).toFixed(2)}</p>
                                                <p><strong>Laps Completed:</strong> {carData.endurance_laps || 'No Data'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Score Summary */}
                                    <div className="col-md-6 mb-3">
                                        <div className="card">
                                            <div className="card-header">
                                                <h5>Score Summary</h5>
                                            </div>
                                            <div className="card-body">
                                                <p><strong>Dynamic Score:</strong> {carData.dynamic_score.toFixed(2)}</p>
                                                <p><strong>Static Score:</strong> {carData.static_score.toFixed(2)}</p>
                                                <p><strong>Endurance Score:</strong> {(carData.endurance_score || 0).toFixed(2)}</p>
                                                <hr />
                                                <p className="h5"><strong>Total Score:</strong> {carData.total_score.toFixed(2)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Navigation */}
                        <div className="mt-4 d-flex justify-content-between">
                            <Link to="/" className="btn btn-secondary">
                                <i className="bi bi-arrow-left"></i> Back to Rankings
                            </Link>

                            <div className="btn-group">
                                <button
                                    className="btn btn-outline-success btn-sm"
                                    onClick={() => handleExport('csv')}
                                >
                                    Export CSV
                                </button>
                                <button
                                    className="btn btn-outline-primary btn-sm"
                                    onClick={() => handleExport('json')}
                                >
                                    Export JSON
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CarDetail;