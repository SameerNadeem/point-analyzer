import React from 'react';
import { Link } from 'react-router-dom';
import { RankingEntry } from '../types';

interface OverallChartProps {
    data: RankingEntry[];
}

const OverallChart: React.FC<OverallChartProps> = ({ data }) => {
    const top10Data = data.slice(0, 10);

    const getRankBadge = (rank: number) => {
        if (rank === 1) return { emoji: '👑', class: 'bg-warning text-dark' };
        if (rank === 2) return { emoji: '🥈', class: 'bg-secondary' };
        if (rank === 3) return { emoji: '🥉', class: 'bg-warning text-dark' };
        return { emoji: '', class: 'bg-primary' };
    };

    const getCardBorder = (rank: number) => {
        if (rank === 1) return 'border-warning border-2';
        if (rank <= 3) return 'border-warning';
        return 'border-0';
    };

    return (
        <div className="mb-4">
            <h4>Top 10 Teams Overall</h4>
            <div className="row">
                {top10Data.map((entry) => {
                    const badge = getRankBadge(entry.rank);
                    return (
                        <div key={entry.car_number} className="col-md-6 col-lg-4 mb-3">
                            <Link to={`/car/${entry.car_number}`} className="text-decoration-none">
                                <div className={`card h-100 ${getCardBorder(entry.rank)} shadow-sm`}>
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <div className="flex-grow-1">
                                                <h5 className="card-title mb-1 d-flex align-items-center">
                                                    {badge.emoji && <span className="me-2">{badge.emoji}</span>}
                                                    Car #{entry.car_number}
                                                </h5>
                                                <p className="text-muted small mb-2" title={entry.team_name}>
                                                    {entry.team_name.length > 25
                                                        ? entry.team_name.substring(0, 25) + '...'
                                                        : entry.team_name}
                                                </p>
                                            </div>
                                            <span className={`badge ${badge.class} ms-2`}>
                                                #{entry.rank}
                                            </span>
                                        </div>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <span className="text-success fw-bold h5 mb-0">
                                                {entry.score.toFixed(2)}
                                            </span>
                                            <small className="text-muted">points</small>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default OverallChart;