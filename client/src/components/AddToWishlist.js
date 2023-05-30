import React from 'react';
import Button from '@mui/material/Button';

export default function AddToWishlist({ bookid, handleOnClick }) {
    // console.log(bookid);
    return (
        <div>
            <Button variant="contained" color="error" onClick={handleOnClick}>
                Add To Wishlist
            </Button>
        </div>
    );
}
