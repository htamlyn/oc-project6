const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

// exports.signUp = (req, res, next) => {
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
// };

exports.signUp = (req, res, next) => {
    console.log('sign up working')
    console.log(req.body)
    bcrypt.hash(req.body.password, 10).then(
        (hash) => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save().then(
                () => {
                    res.status(201).json({
                        message: 'User added successfully'
                    });
                }
            ).catch(
                (error) => {
                    res.status(500).json({
                        error: error
                    });
                }
            );
        }
    );
};

exports.login = (req, res, next) => {
    User.findOne({email: req.body.email}).then(
        (user) => {
            if (!user) {
                return res.status(401).json({
                    error: new Error('User not found')
                });
            }
            bcrypt.compare(req.body.password, user.password).then(
                (valid) => {
                    if (!valid) {
                        return res.status(401).json({
                            error: new Error('Incorrect Password')
                        });
                    }
                    const token = jwt.sign(
                        {userId: user._id},
                        'RANDOM_TOKEN_SECRET',
                        {expiresIn: '24h'});
                    res.status(200).json({
                        userId: user._id,
                        token: token
                    });
                }
            ).catch(
                (error) => {
                    res.status(500).json({
                        error: error
                    });
                }
            );
        }
    ).catch(
        (error) => {
            res.status(500).json({
                error: error
            });
        }
    );
};