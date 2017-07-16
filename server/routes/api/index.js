const express     =         require('express');
const router      =         express.Router();
const userRouter  =         require('./users');

router.use("/users", userRouter);

router.get('/', (req, res) => res.send("Welcome to the API") );

module.exports = router;
