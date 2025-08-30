import React from 'react';

const Home: React.FC = () => {
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
                                View and analyze results from Baja SAE competitions.
                            </p>
                        </div>

                        {/* Placeholder for rankings content */}
                        <div className="mt-4">
                            <h4>Rankings Table Coming Soon...</h4>
                            <p>This will show the Overall, Dynamic, Static, and Endurance rankings.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;