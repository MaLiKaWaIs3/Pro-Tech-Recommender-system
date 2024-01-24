import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import axios from "axios";
import ErrorDialogueBox from '../MUIDialogueBox/ErrorDialogueBox';
import Box from '@mui/material/Box';
import DoctorTable from '../MUITable/DoctorTable';

function DoctorList() {
    const params = new URLSearchParams(window.location.search);
    const name = params.get('name');

    const [doctors, setdoctor] = useState([]);

    const [errorDialogueBoxOpen, setErrorDialogueBoxOpen] = useState(false);
    const [errorList, setErrorList] = useState([]);
    const handleDialogueOpen = () => {
        setErrorDialogueBoxOpen(true)
    };
    const handleDialogueClose = () => {
        setErrorList([]);
        setErrorDialogueBoxOpen(false)
    };


    useEffect(() => {
        getdoctors();
    }, []
    );

    const getdoctors = async () => {
        const response = await axios.get("http://localhost:3001/doctors", {
            params: {
                name: name
            }
        });
        setdoctor(response.data);
    };

    const deleteDoctor = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/doctors/${id}`);
            getdoctors();
        } catch (error) {
            setErrorList(error);
            handleDialogueOpen();
        }
    };


    return (
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>

            <div className="page-wrapper">
                <div className="content mt-4" >
                    <div className="row">
                        <div className="col-sm-4 col-3">
                            <h4 className="page-title">Expert</h4>
                        </div>
                        <div className="col-sm-8 col-9 text-right m-b-20">
                            <Link to="/doctors/add" className="btn btn-primary float-right btn-rounded">
                                <i className="fa fa-plus"></i> Add Expert
                            </Link>
                        </div>
                    </div>
                    <form action="/doctors" name="userFilter" >
                        <div className="row filter-row">

                            <div className="col-sm-4 col-md-4">
                                <div className="form-floating ">

                                    <input type="text" name="name" className="form-control" placeholder='Doctor Name' />
                                    <label className="focus-label">Expert Name</label>
                                </div>
                            </div>

                            <div className="col-sm-4 col-md-4">
                                <button type="submit" className="btn btn-primary btn-block"> Search </button>
                            </div>
                        </div>
                    </form>
                    <DoctorTable doctorList={doctors} deleteDoctor={deleteDoctor} />
                </div>
                <ErrorDialogueBox
                    open={errorDialogueBoxOpen}
                    handleToClose={handleDialogueClose}
                    ErrorTitle="Error: Add doctor"
                    ErrorList={errorList}
                />
            </div>

        </Box>
    )
}

export default DoctorList;
