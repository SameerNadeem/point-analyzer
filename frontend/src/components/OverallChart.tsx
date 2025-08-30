import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Link } from 'react-router-dom';
import { RankingEntry } from '../types';

interface OverallChartProps {
    data: RankingEntry[];
}

const OverallChart: React.FC<OverallChartProps> = ({ data }) => {
    const [viewMode, setViewMode] = useState<'podium' | 'chart' | 'cards'>('podium');
    const top10Data = data.slice(0, 10);
    const top3Data = data.slice(0, 3);

    // Colors for different positions
    const getBarColor = (index: number) => {
        if (index === 0) return '#FFD700'; // Gold
        if (index === 1) return '#C0C0C0'; // Silver  
        if (index === 2) return '#CD7F32'; // Bronze
        return '#154734'; // Brand green for others
    };

    const getPodiumHeight = (index: number) => {
        if (index === 0) return 120; // 1st place - tallest
        if (index === 1) return 90;  // 2nd place
        if (index === 2) return 60;  // 3rd place
        return 40;
    };

    // Custom tooltip for chart view
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white border rounded p-3 shadow-lg">
                    <p className="font-weight-bold mb-1">#{data.rank} - Car #{data.car_number}</p>
                    <p className="mb-1 text-muted">{data.team_name}</p>
                    <p className="mb-0 text-success font-weight-bold">Score: {data.score.toFixed(2)}</p>
                </div>
            );
        }
        return null;
    };

    // Podium View
    const PodiumView = () => (
        <div className="text-center">
            <div className="row justify-content-center align-items-end mb-4" style={{ height: '200px' }}>
                {/* 2nd Place */}
                <div className="col-md-3">
                    <div
                        className="podium-block mx-auto mb-2 d-flex flex-column justify-content-end align-items-center text-white"
                        style={{
                            height: getPodiumHeight(1),
                            backgroundColor: getBarColor(1),
                            borderRadius: '8px 8px 0 0',
                            width: '80%',
                            position: 'relative'
                        }}
                    >
                        <div className="podium-content p-2">
                            <div className="h1 mb-0">🥈</div>
                            <div className="small font-weight-bold">2nd</div>
                        </div>
                    </div>
                    <Link to={`/car/${top3Data[1]?.car_number}`} className="text-decoration-none">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body p-2">
                                <h6 className="card-title mb-1">Car #{top3Data[1]?.car_number}</h6>
                                <p className="card-text small text-muted mb-1">{top3Data[1]?.team_name}</p>
                                <p className="mb-0 font-weight-bold text-success">{top3Data[1]?.score.toFixed(2)}</p>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* 1st Place */}
                <div className="col-md-3">
                    <div
                        className="podium-block mx-auto mb-2 d-flex flex-column justify-content-end align-items-center text-white"
                        style={{
                            height: getPodiumHeight(0),
                            backgroundColor: getBarColor(0),
                            borderRadius: '8px 8px 0 0',
                            width: '80%',
                            position: 'relative'
                        }}
                    >
                        <div className="podium-content p-2">
                            <div className="h1 mb-0">👑</div>
                            <div className="small font-weight-bold">1st</div>
                        </div>
                    </div>
                    <Link to={`/car/${top3Data[0]?.car_number}`} className="text-decoration-none">
                        <div className="card border-warning border-2 shadow">
                            <div className="card-body p-2">
                                <h6 className="card-title mb-1">Car #{top3Data[0]?.car_number}</h6>
                                <p className="card-text small text-muted mb-1">{top3Data[0]?.team_name}</p>
                                <p className="mb-0 font-weight-bold text-warning">{top3Data[0]?.score.toFixed(2)}</p>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* 3rd Place */}
                <div className="col-md-3">
                    <div
                        className="podium-block mx-auto mb-2 d-flex flex-column justify-content-end align-items-center text-white"
                        style={{
                            height: getPodiumHeight(2),
                            backgroundColor: getBarColor(2),
                            borderRadius: '8px 8px 0 0',
                            width: '80%',
                            position: 'relative'
                        }}
                    >
                        <div className="podium-content p-2">
                            <div className="h1 mb-0">🥉</div>
                            <div className="small font-weight-bold">3rd</div>
                        </div>
                    </div>
                    <Link to={`/car/${top3Data[2]?.car_number}`} className="text-decoration-none">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body p-2">
                                <h6 className="card-title mb-1">Car #{top3Data[2]?.car_number}</h6>
                                <p className="card-text small text-muted mb-1">{top3Data[2]?.team_name}</p>
                                <p className="mb-0 font-weight-bold text-success">{top3Data[2]?.score.toFixed(2)}</p>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Remaining Top 10 */}
            {top10Data.length > 3 && (
                <div className="mt-4">
                    <h6>Remaining Top 10</h6>
                    <div className="row">
                        {top10Data.slice(3).map((entry, index) => (
                            <div key={entry.car_number} className="col-md-2 col-sm-4 col-6 mb-2">
                                <Link to={`/car/${entry.car_number}`} className="text-decoration-none">
                                    <div className="card border-0 shadow-sm h-100">
                                        <div className="card-body p-2 text-center">
                                            <div className="badge bg-secondary mb-1">#{entry.rank}</div>
                                            <h6 className="card-title mb-1 small">Car #{entry.car_number}</h6>
                                            <p className="card-text small text-muted mb-1" style={{ fontSize: '0.75rem' }}>
                                                {entry.team_name.length > 15 ? entry.team_name.substring(0, 15) + '...' : entry.team_name}
                                            </p>
                                            <p className="mb-0 small font-weight-bold text-success">{entry.score.toFixed(0)}</p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );

    // Chart View (improved version)
    const ChartView = () => (
        <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
                <BarChart data={top10Data} layout="horizontal" margin={{ top: 20, right: 30, left: 80, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis type="number" domain={[0, 'dataMax']} tickFormatter={(value) => value.toFixed(0)} />
                    <YAxis
                        type="category"
                        dataKey={(entry) => `#${entry.car_number}`}
                        width={70}
                        fontSize={12}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                        {top10Data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={getBarColor(index)} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );

    // Cards View
    const CardsView = () => (
        <div className="row">
            {top10Data.map((entry, index) => (
                <div key={entry.car_number} className="col-md-6 col-lg-4 mb-3">
                    <Link to={`/car/${entry.car_number}`} className="text-decoration-none">
                        <div className={`card h-100 ${index < 3 ? 'border-warning' : 'border-0'} shadow-sm`}>
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                    <div>
                                        <h5 className="card-title mb-1">
                                            {index < 3 && <span style={{ fontSize: '1.2em' }}>
                                                {index === 0 ? '👑' : index === 1 ? '🥈' : '🥉'}
                                            </span>}
                                            Car #{entry.car_number}
                                        </h5>
                                        <p className="text-muted small mb-2">{entry.team_name}</p>
                                    </div>
                                    <span className={`badge ${index < 3 ? 'bg-warning' : 'bg-secondary'}`}>
                                        #{entry.rank}
                                    </span>
                                </div>
                                <div className="d-flex justify-content-between align-items-center">
                                    <span className="text-success font-weight-bold h5 mb-0">
                                        {entry.score.toFixed(2)}
                                    </span>
                                    <small className="text-muted">points</small>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
            ))}
        </div>
    );

    return (
        <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>Top 10 Teams Overall</h4>
                <div className="btn-group" role="group">
                    <button
                        className={`btn btn-sm ${viewMode === 'podium' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setViewMode('podium')}
                    >
                        Podium
                    </button>
                    <button
                        className={`btn btn-sm ${viewMode === 'chart' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setViewMode('chart')}
                    >
                        Chart
                    </button>
                    <button
                        className={`btn btn-sm ${viewMode === 'cards' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setViewMode('cards')}
                    >
                        Cards
                    </button>
                </div>
            </div>

            {viewMode === 'podium' && <PodiumView />}
            {viewMode === 'chart' && <ChartView />}
            {viewMode === 'cards' && <CardsView />}
        </div>
    );
};

export default OverallChart;