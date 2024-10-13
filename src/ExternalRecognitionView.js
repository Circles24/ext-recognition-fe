import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Alert, Box } from "@mui/material";
import axios from "axios";

export const ExternalRecognitionView = () => {
    const [recognitionData, setRecognitionData] = useState({
        loading: true,
        data: null,
        err: null,
    });

    const [mediaData, setMediaData] = useState({
        loading: true,
        data: null,
        err: null,
    });

    const params = useParams();
    const id = params.id;

    useEffect(() => {
        axios.get(`http://localhost:8080/recognition/api/external-recognition/${id}`)
            .then(res => {
                setRecognitionData({
                    loading: false,
                    data: res.data,
                    err: null,
                })
            }).catch(err => {
                setRecognitionData({
                    loading: false,
                    data: null,
                    err: "Error fetching external recognition media " + err,
                })
            })

        axios.get(`http://localhost:8080/recognition/api/media?refType=EXTERNAL_RECOGNITION&refId=${id}`)
            .then(res => {
                setMediaData({
                    loading: false,
                    data: res.data,
                    err: null,
                })
            }).catch(err => {
                setMediaData({
                    loading: false,
                    data: null,
                    err: "Error fetching external recognition media " + err,
                })
            })
    }, [id]);

    if (recognitionData.loading) {
        return <Box>Loading...</Box>
    }

    if (recognitionData.err) {
        return <Box>
            <Alert color="error" >{recognitionData.err}</Alert>
        </Box>
    }
}