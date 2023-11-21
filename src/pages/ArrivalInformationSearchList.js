import React from 'react';

import ArrivalSearchList from '../Components/arrivalsearchlist.js';


const columns = ['#', 'INCOMING CARGO ', 'RECEIVING COMPANY', 'ARRIVAL DAY', 'QUANTITY', 'IN STOCK STATUS', 'STORAGE LOCATION', 'MARKS', 'ACTION'];

const ArrivalInformationSearchList = () => {
    return (
        <div className="container">
            <div className="table-container">
                <h1>Arrival Information List</h1>
                <ArrivalSearchList  columns={columns} />
            </div>
        </div>
    );
};

export default ArrivalInformationSearchList;
