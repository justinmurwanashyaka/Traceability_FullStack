import React, { useEffect, useState } from 'react';
import { Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Paper, TextField, Checkbox, Menu, MenuItem, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, grid2Classes } from '@mui/material';
import { CiMenuKebab } from 'react-icons/ci';
import { BsFillImageFill } from 'react-icons/bs';
import Form from './form';

const DataTable = ({ user_compID }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [data, setData] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedRowData, setSelectedRowData] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectAll, setSelectAll] = useState(false);
    const [error, setError] = useState(null);
    const [clickedRow, setClickedRow] = useState(null);
    const [openDialogforView, setOpenDialogforView] = useState(false);
    const [openDialogforEdit, setOpenDialogforEdit] = useState(false);
    const [page, setPage] = useState(1);
    const [isViewEditModalOpen, setIsViewEditModalOpen] = useState(false);
    const rowsPerPage = 20;

    const [editedValues, setEditedValues] = useState({
        growDay: '',
        growPlace: '',
        fellDate: '',
        type: '',
        size: '',
        shape: '',
        situation: '',
        quality: '',
        durability: '',
        remarks: ''

    });
    const handleEdit = () => {
        setEditedValues({
            growDay: selectedRowData.growDay,
            growPlace: selectedRowData.growPlace,
            type: selectedRowData.type,
            size: selectedRowData.size,
            shape: selectedRowData.shape,
            situation: selectedRowData.situation,
            quality: selectedRowData.quality,
            remarks: selectedRowData.remarks,

        });
        setOpenDialogforEdit(true);
        handleCloseMenu();
    };
    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:8081/deleteteLogsrowselected/${selectedRowData.logID}`, {
                method: 'PUT', // or 'PATCH' depending on your server implementation
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user_compID}`,
                },
                body: JSON.stringify(editedValues),
            });

            if (response.ok) {
                // Update the local state or perform any necessary actions
                console.log('Tree updated successfully');

                // Fetch the updated data from the server
                const updatedResponse = await fetch('http://localhost:8081/logsinformationView', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${user_compID}`
                    }
                });

                if (updatedResponse.ok) {
                    const updatedData = await updatedResponse.json();
                    setData(updatedData ?? []);
                } else {
                    console.error('Error fetching updated data');
                    // Handle error cases
                }
            } else {
                console.error('Failed to update tree');
                // Handle error cases
            }
        } catch (error) {
            console.error('Error during tree update:', error);

        }
    };
    const handleFieldChange = (fieldName, value) => {
        setEditedValues((prevValues) => ({
            ...prevValues,
            [fieldName]: value,
        }));
    };
    const handleSaveEditForm = async () => {
        try {
            const response = await fetch(`http://localhost:8081/updateLogInformation/${selectedRowData.logID}`, {
                method: 'PUT', // or 'PATCH' depending on your server implementation
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user_compID}`,
                },
                body: JSON.stringify(editedValues),
            });

            if (response.ok) {
                // Update the local state or perform any necessary actions
                console.log('Tree updated successfully');

                // Fetch the updated data from the server
                const updatedResponse = await fetch('http://localhost:8081/logsinformationView', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${user_compID}`
                    }
                });

                if (updatedResponse.ok) {
                    const updatedData = await updatedResponse.json();
                    setData(updatedData ?? []);
                } else {
                    console.error('Error fetching updated data');
                    // Handle error cases
                }
            } else {
                console.error('Failed to update tree');
                // Handle error cases
            }
        } catch (error) {
            console.error('Error during tree update:', error);
            // Handle error cases
        }

        setOpenDialogforEdit(false);
    };
    const handleBulkDeletion = async () => {
        try {
            const response = await fetch('http://localhost:8081/bulkDeletionLogsInformation', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user_compID}`,
                },
                body: JSON.stringify({ logIDs: selectedRows }),
            });


            if (response.ok) {

                console.log('deleted successfully');


                const updatedResponse = await fetch('http://localhost:8081/logsinformationView', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${user_compID}`
                    }
                });

                if (updatedResponse.ok) {
                    const updatedData = await updatedResponse.json();
                    setData(updatedData ?? []);
                } else {
                    console.error('Error fetching updated data');
                    // Handle error cases
                }
            } else {
                console.error('Failed to update tree');
                // Handle error cases
            }
        } catch (error) {
            console.error('Error during tree update:', error);
            // Handle error cases
        }

        setOpenDialogforEdit(false);
    };




    useEffect(() => {
        fetch('http://localhost:8081/logsinformationView', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${user_compID}`
            }
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then((responseData) => {
                console.log('Data received:', responseData);
                setData(responseData ?? []);
            })
            .catch((err) => {
                console.error('Error fetching data:', err);
                setError(err);
            });
    }, [user_compID]);

    const handleCheckboxChange = (logID) => {
        const isSelected = selectedRows.includes(logID);
        if (isSelected) {
            setSelectedRows((prevSelected) => prevSelected.filter((id) => id !== logID));
        } else {
            setSelectedRows((prevSelected) => [...prevSelected, logID]);
        }
    };
    const handleSelectAllChange = () => {
        setSelectAll(!selectAll);
        setSelectedRows(selectAll ? [] : dataToDisplay.map((row) => row.logID));
    };
    const handleCloseMenu = () => {
        setAnchorEl(null);
        setClickedRow(null);
    };
    const handleRowClick = (row, event) => {
        const isCheckboxClick = event.target.type === 'checkbox';
        const isCiMenuKebabClick = event.target.closest('.ci-menu-kebab') !== null;
        if (isCiMenuKebabClick) {
            setSelectedRowData(row);
            setAnchorEl(event.currentTarget);
            setClickedRow(row.logID);
        }
    };
    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (anchorEl && !anchorEl.contains(event.target)) {
                handleCloseMenu();
            }
        };

        window.addEventListener('click', handleOutsideClick);

        return () => {
            window.removeEventListener('click', handleOutsideClick);
        };
    }, [anchorEl]);
    const handleView = () => {
        console.log('View clicked');
        setOpenDialogforView(true);
        handleCloseMenu();
    };
    const handleCloseDialog = () => {
        setOpenDialogforEdit(false);
        setOpenDialogforView(false)
    };
    const handlePrint = () => {
        const printButton = document.getElementById('printButton');
        const returnButton = document.getElementById('returnButton');
        if (printButton) {
            printButton.style.display = 'none';
            returnButton.style.display = 'none';

            window.print();
            setOpenDialogforView(false);
        }

    };

    const filteredData = Array.isArray(data)
        ? data.filter((row) => {
            return (
                (row.growPlace?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()) ||
                (row.growDay?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()) ||
                (row.typename?.toLowerCase() ?? '').includes(searchTerm.toLowerCase())
            );
        }) : [];

    // Calculate the range of data to display based on the current page
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const dataToDisplay = filteredData.slice(startIndex, endIndex);

    const columns = ['#', 'GROWING SITE', 'GROWING DAY', 'TYPE', 'SIZE', 'SHAPE', 'SITUATIN', 'QUALITY', 'REMARKS', 'ACTION'];

    return (
        <div className='table-container'>
            <h1>Log Information Search List</h1>
            <TextField
                label="Search"
                variant="outlined"
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-bar"
            />
            <div style={{ display: 'flex', justifyContent: 'space-between' }} >
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>

                            <TableRow>
                                <TableCell>
                                    <Checkbox checked={selectAll} onChange={handleSelectAllChange} />
                                </TableCell>
                                {columns.map((column) => (
                                    <TableCell key={column}>{column}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {dataToDisplay.map((row, index) => (
                                <TableRow key={row.logID} onClick={(event) => handleRowClick(row, event)}

                                    style={{ backgroundColor: selectedRows.includes(row.logID) ? 'lightblue' : (clickedRow === row.logID ? 'lightblue' : 'inherit') }}>

                                    <TableCell>
                                        <Checkbox
                                            checked={selectedRows.includes(row.logID)}
                                            onChange={() => handleCheckboxChange(row.logID)}
                                        />
                                    </TableCell>
                                    <TableCell>{startIndex + index + 1}</TableCell>
                                    <TableCell>{row.growPlace}</TableCell>
                                    <TableCell>{row.growDay}</TableCell>
                                    <TableCell>{row.type}</TableCell>
                                    <TableCell>{row.size}</TableCell>
                                    <TableCell>{row.shape}</TableCell>
                                    <TableCell style={{ color: 'green' }}>pre-shipped</TableCell>
                                    <TableCell>{row.quality}</TableCell>
                                    <TableCell><BsFillImageFill /></TableCell>
                                    <TableCell>
                                        <IconButton className="ci-menu-kebab" onClick={(event) => handleRowClick(row, event)}>
                                            <CiMenuKebab />
                                        </IconButton>
                                        <Menu
                                            anchorEl={anchorEl}
                                            open={Boolean(anchorEl)}
                                            onClose={handleCloseMenu}
                                            anchorOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'right',
                                            }}
                                            transformOrigin={{
                                                vertical: 'top',
                                                horizontal: 'right',
                                            }}
                                        >
                                            <MenuItem onClick={handleView}>View</MenuItem>
                                            <MenuItem onClick={handleEdit}>Edit</MenuItem>
                                            <MenuItem onClick={handleDelete}>Delete</MenuItem>
                                        </Menu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <div className='pagination'>
                        <button className='btn' onClick={() => setPage(page - 1)} disabled={page === 1}>
                            Previous
                        </button>
                        <span>{`Page ${page}`}</span>
                        <button className='btn' onClick={() => setPage(page + 1)}
                            disabled={endIndex >= filteredData.length}
                        >
                            Next
                        </button>
                    </div>
                </TableContainer>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                {selectedRows.length > 0 && (
                    <button className='btn' onClick={handleBulkDeletion}>Bulk deletion</button>
                )}
                <button className='btn'>Return</button>
            </div>
            <Dialog open={openDialogforEdit} onClose={handleCloseDialog} fullWidth maxWidth="lg">
                <DialogTitle className='title-edit-dialog'>Edit below Information</DialogTitle>
                <DialogContent >
                    {selectedRowData && (
                        <form className='edit-dialog' style={{ marginLeft: '30px' }}>
                            <div className='dialog-textfield'>
                                <TextField label="Grow Day" value={editedValues.growDay} onChange={(e) => handleFieldChange('growDay', e.target.value)} />
                            </div>
                            <div className='dialog-textfield'>
                                <TextField label="Grow Place" value={editedValues.growPlace} onChange={(e) => handleFieldChange('growPlace', e.target.value)} />
                            </div>
                            <div className='dialog-textfield'>
                                <TextField label="Type" value={editedValues.type} onChange={(e) => handleFieldChange('type', e.target.value)} />
                            </div>
                            <div className='dialog-textfield'>
                                <TextField label="Size" value={editedValues.size} onChange={(e) => handleFieldChange('size', e.target.value)} />
                            </div>
                            <div className='dialog-textfield'>
                                <TextField label="Shape" value={editedValues.shape} onChange={(e) => handleFieldChange('shape', e.target.value)} />
                            </div>
                            <div className='dialog-textfield'>
                                <TextField label="situation" value={editedValues.situation} onChange={(e) => handleFieldChange('situation', e.target.value)} />
                            </div>
                            <div className='dialog-textfield'>
                                <TextField label="Quality" value={editedValues.quality} onChange={(e) => handleFieldChange('quality', e.target.value)} />
                            </div>
                            <div className='dialog-textfield'>
                                <TextField label="Remarks" value={editedValues.remarks} onChange={(e) => handleFieldChange('remarks', e.target.value)} />
                            </div>
                        </form>
                    )}
                </DialogContent>
                <DialogActions className='dialogActions'>
                    <Button onClick={handleSaveEditForm} color="primary" >
                        Save
                    </Button>
                    <Button onClick={handleCloseDialog} color="primary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openDialogforView} onClose={handleCloseDialog} className='dialog' fullWidth maxWidth="lg">
                <DialogTitle className='dialogtitle'>Traceability information </DialogTitle>
                <DialogContent className='dialogcontent'>
                    {selectedRowData && (
                        <div>
                            <label>{selectedRowData.growDay}</label>
                            <label>{selectedRowData.growPlace}</label>
                            <label>{selectedRowData.fellDate}</label>
                            <label>{selectedRowData.type}</label>
                            <label>{selectedRowData.size}</label>
                            <label>{selectedRowData.shape}</label>
                            <label>{selectedRowData.strength}</label>
                            <label>{selectedRowData.quality}</label>
                            <label>{selectedRowData.durability}</label>
                            <label>{selectedRowData.remarks}</label>
                        </div>
                    )}
                </DialogContent>
                <DialogActions className='dialogActions'>
                    <Button id="printButton" onClick={handlePrint} color="primary" >
                        Print
                    </Button>
                    <Button id="returnButton" onClick={handleCloseDialog} color="primary">
                        Return
                    </Button>
                </DialogActions>
            </Dialog>

        </div>

    );

};

export default DataTable;
