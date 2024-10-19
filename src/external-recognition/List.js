import { Alert, Pagination, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { Box, Paper } from "@mui/material";
import { ExternalRecognitionCard } from "./Card";

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

    const [topInteractedRecognitions, setTopInteractedRecognitions] = useState({
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
    }, []);

    useEffect(() => {
        axios.get(`http://localhost:8080/recognition/api/external-recognition/top-interacted`)
            .then(res => {
                setTopInteractedRecognitions({
                    loading: false,
                    error: null,
                    response: res.data
                });
            }).catch(err => setTopInteractedRecognitions({
                loading: false,
                error: "Error loading top interacted recognitions" + err.message,
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

                {topInteractedRecognitions.error !== null && <Alert color="error" variant="outlined">{topInteractedRecognitions.error}</Alert>}

                <Box display="flex" justifyContent="space-between">
                    <Box>
                        {data.response !== null &&
                            data.response.map(r =>
                                <Box sx={{ minHeight: "25vh", minWidth: "15vw", maxWidth: "45vw", marginTop: "2vh" }}>
                                    <ExternalRecognitionCard {...r} href={`/recognition/${r.id}`} />
                                </Box>
                            )
                        }
                    </Box>
                    <Box>
                        {topInteractedRecognitions.response !== null && (
                            <TableContainer component={Paper}>
                                <Typography variant="h6">Top interacted recogitions</Typography>
                                <Table>
                                    <TableHead>
                                        <TableCell>Rank</TableCell>
                                        <TableCell>Title</TableCell>
                                    </TableHead>
                                    <TableBody>
                                        {topInteractedRecognitions.response.map((r, i) => <TableRow>
                                            <TableCell><a href={`/recognition/${r.id}`}>{i + 1}</a></TableCell>
                                            <TableCell><a href={`/recognition/${r.id}`}>{r.title}</a></TableCell>
                                        </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </Box>
                </Box>

                {paginationData.response !== null && <Pagination sx={{ marginTop: "2vh" }} page={page} count={paginationData.response.pageCount} onChange={handlePageChange} />}
            </Box>
        </Paper>
    )
}

