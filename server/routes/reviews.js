const express = require('express');
const router = express.Router();
const booksData = require('../data/books');
const reviewData = require('../data/reviews');
const usersData = require('../data/users');
const errorCheck = require('../data/errorCheck');

router.get('/:id', async (req, res) => {
  if (!errorCheck.checkId(req.params.id.trim())) {
    res.status(400).json('You must supply a valid Book Id');
    return;
  }
  try {
    const reviewBook = await booksData.getById(req.params.id);
    res.json(reviewBook);
  } catch (e) {
    res.status(404).json('Book not found');
    return;
  }
});

router.get('/userreviews/:id', async (req, res) => {
  if (!errorCheck.checkId(req.params.id.trim())) {
    res.status(400).json('You must supply a valid Book Id');
    return;
  }
  try {
    const reviewsOfUser = await reviewData.getAllReviewsOfUser(req.params.id);
    res.json(reviewsOfUser);
  } catch (e) {
    res.status(404).json('Reviews of user not found');
    return;
  }
});

router.get('/bookreviews/:id', async (req, res) => {
  if (!errorCheck.checkId(req.params.id.trim())) {
    res.status(400).json('You must supply a valid Book Id');
    return;
  }
  try {
    const reviewsOfBook = await reviewData.getAllReviewsOfBook(req.params.id);
    res.json(reviewsOfBook);
  } catch (e) {
    res.status(404).json('Reviews of book not found');
    return;
  }
});

router.post('/review', async (req, res) => {
  let reviewInfo = req.body.data;

  const currentDate = new Date();
  const dateOfReview =
    currentDate.getMonth() +
    1 +
    '/' +
    currentDate.getDate() +
    '/' +
    currentDate.getFullYear();

  reviewInfo.rating = parseInt(reviewInfo.rating);

  if (!errorCheck.checkId(reviewInfo.bookId.trim())) {
    res.status(400).json('You must supply a valid Book Id');
    return;
  }

  if (!errorCheck.checkRating(reviewInfo.rating)) {
    res.status(400).json('You must supply a valid Rating');
    return;
  }

  if (!errorCheck.checkString(reviewInfo.comment.trim())) {
    res.status(400).json('You must supply a valid Date');
    return;
  }

  if (!errorCheck.checkDate(dateOfReview.trim())) {
    res
      .status(400)
      .json(
        "Date provided is not in proper format. Also please enter today's date"
      );
    return;
  }

  try {
    await booksData.getById(reviewInfo.bookId);
  } catch (e) {
    res.status(404).json('Book not found');
    return;
  }

  const user = await usersData.getUser(reviewInfo.email.trim());
  if (user === null) {
    res.status(404).json('User not found');
    return;
  }

  try {
    const newReview = await reviewData.createReview(
      reviewInfo.bookId,
      reviewInfo.email.trim(),
      reviewInfo.rating,
      dateOfReview.trim(),
      reviewInfo.comment.trim(),
      user.username.trim()
    );
    res.status(200).json(newReview);
  } catch (e) {
    res.status(500).json(e);
    return;
  }
});

router.get('/editReview/:id', async (req, res) => {
  if (!errorCheck.checkId(req.params.id.trim())) {
    res.status(400).json('You must supply a valid Review Id');
    return;
  }
  try {
    const reviewDetails = await reviewData.getReview(req.params.id);
    res.status(200).json(reviewDetails);
  } catch (e) {
    res.status(404).json('Review not found');
    return;
  }
});

router.put('/updateReview/', async (req, res) => {
  let updateReviewInfo = req.body.data;
  updateReviewInfo.rating = parseInt(updateReviewInfo.rating);

  if (!errorCheck.checkId(updateReviewInfo.reviewId.trim())) {
    res.status(400).json('You must supply a valid Review Id');
    return;
  }

  if (!errorCheck.checkRating(updateReviewInfo.rating)) {
    res.status(400).json('You must supply a valid Rating');
    return;
  }

  if (!errorCheck.checkString(updateReviewInfo.comment.trim())) {
    res.status(400).json('You must supply a valid Date');
    return;
  }

  try {
    await reviewData.getReview(updateReviewInfo.reviewId);
  } catch (e) {
    res.status(404).json('Review not found');
    return;
  }
  try {
    const updatedReview = await reviewData.updateReview(
      updateReviewInfo.reviewId,
      updateReviewInfo.rating,
      updateReviewInfo.comment
    );
    res.status(200).json(updatedReview);
  } catch (e) {
    res.status(404).json(e);
  }
});

router.delete('/deleteReview/:reviewId', async (req, res) => {
  if (!errorCheck.checkId(req.params.reviewId.trim())) {
    res.status(400).json('You must supply a valid Book Id');
    return;
  }

  try {
    let getReview = await reviewData.getReview(req.params.reviewId);
    console.log('Get review is ', getReview);
  } catch (e) {
    res.status(404).json('Review not found');
    return;
  }
  try {
    console.log('Before delete review');
    const deletedReview = await reviewData.removeReview(req.params.reviewId);
    console.log(deletedReview, deletedReview.deleted);
    if (deletedReview.deleted == true) {
      console.log('Inside if');
      let getReview = await booksData.getById(deletedReview.bookId);
      console.log(getReview);
      res.status(200).json(getReview);
    } else res.status(400).json('Review cannot be deleted due to some error');
  } catch (e) {
    res.status(404).json('Review cannot be deleted due to some error');
  }
});

module.exports = router;
