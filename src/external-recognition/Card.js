import React, { useEffect, useState } from "react"
import { Card, CardMedia, CardActions, CardContent, Typography, Button, Box, Alert, Skeleton } from "@mui/material"
import axios from "axios";
import { Slide } from 'react-slideshow-image';

export const ExternalRecognitionCard = ({ id, title, description, externalLinks, videoLinks, images, href }) => {

    let mediaType = "HARDCODED";
    if (id !== undefined && id !== null) {
        mediaType = "FETCH";
    } else if (images !== undefined && images !== null && images.length > 0) {
        mediaType = "IMAGE_PROVIDED";
    }

    const [mediaData, setMediaData] = useState({
        loading: (id !== undefined && id !== null),
        response: null,
        err: null
    })

    useEffect(() => {
        if (mediaType !== "FETCH") {
            return;
        }

        const params = {
            refType: "EXTERNAL_RECOGNITION",
            refId: id,
        }

        const config = {
            params
        }

        axios.get(`http://localhost:8080/recognition/api/media`, config)
            .then(res =>
                setMediaData({
                    loading: false,
                    response: res.data,
                    err: null
                })
            ).catch(err => setMediaData({
                loading: false,
                response: null,
                err: err
            }));
    }, []);

    let imgDataList = null;
    let externalVideoList = null;
    if (mediaType === "FETCH" && mediaData.loading === false && mediaData.err === null && mediaData.response !== null) {
        imgDataList = mediaData.response.filter(media => media.type === "IMAGE");
        externalVideoList = mediaData.response.filter(media => media.type === "VIDEO");
        if (imgDataList.length === 0) {
            mediaType = "HARDCODED";
        }
    }

    return (
        <Card  >
            {mediaData.err !== null && <Alert color="error" >Error loading media: {mediaData.err.message}</Alert>}

            {mediaData.loading && <Skeleton variant="rectangular" height="200px" />}

            {mediaType === "HARDCODED" && (
                <Slide>
                    <a className="silent-link" href={href}>
                        <CardMedia
                            component="img"
                            alt="green iguana"
                            image="https://mui.com/static/images/cards/contemplative-reptile.jpg"
                        /></a>
                </Slide>
            )}

            {mediaType === "IMAGE_PROVIDED" && (
                <Slide>
                    {images.map(img => <a className="silent-link" href={href}>
                        <Box display="flex" justifyContent="center" alignContent="center">
                            <img src={img} style={{ minHeight: "5vh", maxHeight: "40vh" }} ></img>
                        </Box>
                    </a>)
                    }
                </Slide>
            )}

            {mediaType === "FETCH" && imgDataList !== null && (
                <Slide>
                    {imgDataList.map(img => <a className="silent-link" href={href}>
                        <Box display="flex" justifyContent="center" alignContent="center">
                            <img alt={img.fileName} src={`data:${img.mimeType};base64,${img.mediaContent}`} style={{ minHeight: "5vh", maxHeight: "40vh" }} ></img>
                        </Box>
                    </a>)
                    }
                </Slide>            
            )}

            <CardContent>
                <a className="silent-link" href={href}>
                    <Typography gutterBottom variant="h5" component="div">
                        {title}
                    </Typography>

                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {description}
                    </Typography>
                </a>

                {videoLinks !== null && videoLinks !== undefined && (videoLinks.length > 0) && (
                    <Box marginTop="2vh">
                        <Typography variant="body2">Video links</Typography>
                        <Box>
                            {videoLinks.map(link =>
                                <Box>
                                    <a href={link}>{link}</a>
                                </Box>
                            )}
                        </Box>
                    </Box>
                )}

                {mediaType === "FETCH" && externalVideoList !== null && externalVideoList !== undefined && (externalVideoList.length > 0) && (
                    <Box marginTop="2vh">
                        <Typography variant="body2">Video links</Typography>
                        <Box>
                            {externalVideoList.map(media =>
                                <Box>
                                    <a href={media.mediaUrl}>{media.mediaUrl}</a>
                                </Box>
                            )}
                        </Box>
                    </Box>
                )}


                {externalLinks !== null && externalLinks !== undefined && (externalLinks.length > 0) && (
                    <Box marginTop="2vh">
                        <Typography variant="body2">External reading links</Typography>
                        {externalLinks.map(link =>
                            <Box>
                                <a href={link}>{link}</a>
                            </Box>
                        )}
                    </Box>

                )}

            </CardContent>
            <CardActions>
                <Button size="small">Like</Button>
                <Button size="small">Comment</Button>
                <Button size="small">Share</Button>
            </CardActions>
        </Card>
    )
}