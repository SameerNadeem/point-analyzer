import React from 'react';
import { useParams, Link } from 'react-router-dom';

const CarDetail: React.FC = () => {
    const { carNumber } = useParams<{ carNumber: string }>();

    return (
        <div className="row mb-4">
            <div className="col-12">
                <div className="card">
                    <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                        <h2 className="card-title mb-0">Car #{carNumber} Details</h2>
                    </div>
                    <div className="card-body">
                        <div className="alert alert-info">
                            <p className="mb-0">
                                Car detail page will show all event results and scores.
                            </p>
                        </div>

                        {/* Placeholder content */}
                        <div className="mt-4">
                            <h4>Event Results Coming Soon...</h4>
                            <p>This will show Dynamic Events, Static Events, and Endurance results.</p>
                        </div>

                        <div className="mt-4">
                            <Link to="/" className="btn btn-secondary">
                                Back to Rankings
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CarDetail;