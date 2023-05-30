import React, { useState, useEffect } from 'react';
import SearchVal from './Search';
import axios from 'axios';
import noImage from '../assets/images/no-image.jpeg';
import { Link } from 'react-router-dom';
import {
    makeStyles,
    Card,
    CardActionArea,
    Grid,
    CardContent,
    CardMedia,
    Typography,
} from '@material-ui/core';
const useStyles = makeStyles({
    card: {
        maxWidth: 550,
        height: '100%',
        marginLeft: 'auto',
        marginRight: 'auto',
        borderRadius: 5,
        border: '1px solid #222',
        boxShadow:
            '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);',
        color: '#222',
    },
    titleHead: {
        borderBottom: '1px solid #222',
        fontWeight: 'bold',
        color: '#222',
        fontSize: 'large',
    },
    grid: {
        flexGrow: 1,
        flexDirection: 'row',
    },
    media: {
        height: '100%',
        width: '100%',
    },
    button: {
        color: '#222',
        fontWeight: 'bold',
        fontSize: 12,
    },
});

const BookSearchDetails = (props) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchData, setSearchData] = useState(undefined);
    const [loading, setLoading] = useState(false);
    const classes = useStyles();
    let card = null;

    useEffect(() => {
        console.log('search useEffect fired');
        async function fetchData() {
            try {
                console.log(`in fetch searchTerm: ${searchTerm}`);
                const { data } = await axios.get(
                    ' https://houseof-books.herokuapp.com/books/search/' +
                        searchTerm
                );
                setSearchData(data);
                setLoading(false);
            } catch (e) {
                console.log(e);
            }
        }
        if (searchTerm) {
            console.log('searchTerm is set');
            fetchData();
        }
    }, [searchTerm]);

    const searchValue = async (value) => {
        if (value === '') setSearchData([]);
        setSearchTerm(value);
    };

    const buildCard = (book) => {
        return (
            <Grid
                item
                xs={10}
                sm={7}
                md={5}
                lg={4}
                xl={3}
                height={45}
                key={book._id}
            >
                <Card className={classes.card} variant="outlined">
                    <CardActionArea>
                        <Link to={`/books/${book._id}`}>
                            <CardMedia
                                className={classes.media}
                                component="img"
                                image={book.url ? book.url : noImage}
                                title="book image"
                            />
                            <CardContent>
                                <Typography
                                    variant="body2"
                                    color="textSecondary"
                                    component="span"
                                >
                                    <p className="title1">{book.title}</p>
                                    <dl>
                                        <dt className="title">Genre:</dt>
                                        {book && book.genre ? (
                                            <dd>{book.genre}</dd>
                                        ) : (
                                            <dd>N/A</dd>
                                        )}

                                        <dt className="title">Price:</dt>
                                        {book && book.price ? (
                                            <dd>{book.price}</dd>
                                        ) : (
                                            <dd>N/A</dd>
                                        )}
                                    </dl>
                                </Typography>
                            </CardContent>
                        </Link>
                    </CardActionArea>
                </Card>
            </Grid>
        );
    };

    if (loading) {
        return (
            <div>
                <h2>Loading....</h2>
            </div>
        );
    } else {
        card =
            searchData &&
            searchData.map((book) => {
                return buildCard(book);
            });
        return (
            <div>
                <SearchVal searchValue={searchValue} />
                <br />
                <br />
                <Grid container className={classes.grid} spacing={5}>
                    {card}
                </Grid>
            </div>
        );
    }
};

export default BookSearchDetails;
