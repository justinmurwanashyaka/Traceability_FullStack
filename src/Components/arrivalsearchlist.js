import React, { useEffect, useState } from 'react';
import { Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Paper, TextField, TablePagination, } from '@mui/material';
import { BiSolidDownload } from 'react-icons/bi'
import {CiMenuKebab} from 'react-icons/ci'
const ArrivalSearchList = ({ columns, onPageChange }) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8081/arrivalsearchList')
            .then(res => res.json())
            .then((data) => {
                setData(data);
            })
            .then(data => console.log(data))
            .catch(err => console.log(err));
    }, [])

    const filteredData = data.filter((row) => {
        return row.arrivalDay.toLowerCase().includes(searchTerm.toLowerCase()) ||
            row.incomingCargo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            row.receivingCompany.toLowerCase().includes(searchTerm.toLowerCase()) ||
            row.quantity.toLowerCase().includes(searchTerm.toLowerCase()) ||
            row.storageLocation.toLowerCase().includes(searchTerm.toLowerCase());

    });
    const handleChangePage = (event, newPage) => {
        onPageChange(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    return (
        <div>
            <TextField
                label="Search"
                variant="outlined"
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-bar"
            />
            <div style={{ textAlign: 'right', margin: '2% 0' }}>
                <button className='btn' style={{ width: '150px', padding: '0px' }}><BiSolidDownload />&nbsp;&nbsp;&nbsp;&nbsp;Export</button>
            </div>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell key={column}>{column}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                            <TableRow key={row.arrivalday}>
                                <TableCell>{row.arrivalID}</TableCell>
                                <TableCell>{row.incomingCargo}</TableCell>
                                <TableCell>{row.receivingcompany}</TableCell>
                                <TableCell>{row.arrivalDay}</TableCell>
                                <TableCell>{row.quantity}</TableCell>
                                <TableCell>{row.inStockStatus}</TableCell>
                                <TableCell>{row.storageLocation}</TableCell>
                                <TableCell>{row.remarks}</TableCell>
                                <TableCell><CiMenuKebab/></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5]}
                component="div"
                count={filteredData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                //style={{ padding:'2px' }} 
                className='tablepagination'
            />
            <div>
                <button className='btn' style={{ margin: '1% 30%' }}>Return</button>
            </div>

        </div>
    );
};

export default ArrivalSearchList;
