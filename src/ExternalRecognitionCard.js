import React from "react"
import { Card, CardMedia, CardActions, CardContent, Typography, Button } from "@mui/material"

export const ExternalRecognitionCard = ({ title, description }) => {
    return (
        <Card  >
            <CardMedia
                component="img"
                alt="green iguana"
                height="100"
                image="https://mui.com/static/images/cards/contemplative-reptile.jpg"
            />

            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {description}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small">Like</Button>
                <Button size="small">Comment</Button>
                <Button size="small">Share</Button>
                <Button size="small">Learn More</Button>
            </CardActions>

        </Card>
    )
}