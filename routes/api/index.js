const express     =         require('express');
const router      =         express.Router();
const userRouter  =         require('./users');
const snipRouter  =         require('./snippets');
const tagRouter   =         require('./tags');

router.use("/users", userRouter);
router.use("/snippets", snipRouter);
router.use("/tags", tagRouter);

router.get('/', (req, res) => res.send("Welcome to the API") );

module.exports = router;
