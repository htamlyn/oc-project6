const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');

router.post('/signup', userCtrl.signUp);
router.post('/login', userCtrl.login);

// router.post = ('/signup', (req, res, next) => {
//     console.log(req.body)
//     bcrypt.hash(req.body.password, 10)
//         .then((hash) => {
//             const user = new User({
//                 email: req.body.email,
//                 password: hash
//             });
//             user.save()
//                 .then(() => {
//                     res.status(201).json({ message: 'User added successfully!' });
//                 })
//                 .catch((error) => {
//                     if (error.message.split(':')[0] == "User validation failed") {
//                         // error code and error msg
//                         res.status(409).json({ message: 'Email already registered' });
//                     }
//                     else {
//                         res.status(500).json({ error: error });
//                     }
//             });
//         })
//         .catch((error) => { 
//             res.status(500).json({ error: error });
//         });
// });

module.exports = router;