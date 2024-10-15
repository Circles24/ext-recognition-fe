import { Alert, Pagination, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { Box, Paper } from "@mui/material";
import { ExternalRecognitionCard } from "./ExternalRecognitionCard";

export const ExternalRecognitionList = () => {
    const [data, setData] = useState({
        loading: true,
        error: null,
        response: null,
    });

    const [paginationData, setPaginationData] = useState({
        loading: true,
        error: null,
        response: null
    });

    const [page, setPage] = useState(0);

    const handlePageChange = (e, newPage) => {
        setPage(newPage);
    }

    useEffect(() => {
        if (page === 0) {
            return;
        }

        axios.get(`http://localhost:8080/recognition/api/external-recognition?page=${page}`)
            .then(res => {
                const recognitions = res.data.map(r => {
                    let externalLinks = [];
                    if (r.externalLinks !== "" && r.externalLinks !== undefined && r.externalLinks !== null) {
                        externalLinks = r.externalLinks.split(",")
                            .map(link => link.trim())
                            .filter(link => link !== "");
                    }

                    return { ...r, externalLinks }
                });

                console.log("recognitions", recognitions);
                setData({
                    loading: false,
                    error: null,
                    response: recognitions
                });
            }).catch(err => setData({
                loading: false,
                error: "Error loading external recognitions " + err,
                response: null
            }))
    }, [page]);

    useEffect(() => {
        axios.get(`http://localhost:8080/recognition/api/external-recognition/pagination-info`)
            .then(res => {
                setPaginationData({
                    loading: false,
                    error: null,
                    response: res.data
                });
                setPage(1);
            }).catch(err => setPaginationData({
                loading: false,
                error: "Error loading pagination info " + err.message,
                response: null
            }));
    }, [])

    return (
        <Paper>
            <Box marginLeft="2vw">
                <Box>
                    <Typography variant="h6">External Recognitions</Typography>
                </Box>

                {paginationData.loading === true && <Box>Loading pagination info ...</Box>}

                {paginationData.error !== null && <Alert color="error" variant="outlined">{paginationData.error}</Alert>}

                {data.loading === true && <Box>Loading ...</Box>}

                {data.error !== null && <Alert color="error" variant="outlined">{data.error}</Alert>}

                {data.response !== null && (
                    <Box>
                        {data.response.map(r =>
                            <Box sx={{ minHeight: "25vh", minWidth: "15vw", maxWidth: "25vw", marginTop: "2vh" }}>
                                <ExternalRecognitionCard {...r} />
                            </Box>
                        )}
                    </Box>
                )}

                { paginationData.response !== null && <Pagination page={page} count={paginationData.response.pageCount} onChange={handlePageChange} />}
            </Box>
        </Paper>
    )
}

