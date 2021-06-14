const Sauce = require('../models/sauce');
const fs = require('fs');

exports.getAllSauces = async (req, res) => {
    await Sauce.find({}).then(
        (sauces) => {
            res.status(200).json(sauces)
        }
    ).catch(
        (error) => {
            res.status(404).json({
                error: error
            });
        }
    );
};

exports.getOneSauce = async (req, res) => {
    const { id } = req.params;
    await Sauce.findById(id).then(
        (sauce) => {
            res.status(200).json(sauce);
        }
    ).catch(
        (error) => {
            res.status(404).json({
                error: error
            });
        }
    );
};

exports.createSauce = async (req, res) => {
    const url = req.protocol + '://' + req.get('host');
    console.log('hitting route')
    sauce = JSON.parse(req.body.sauce)
    const newSauce = new Sauce({
        userId: sauce.userId,
        name: sauce.name,
        manufacturer: sauce.manufacturer,
        description: sauce.description,
        mainPepper: sauce.mainPepper,
        imageUrl: url + '/images/' + req.file.filename,
        heat: sauce.heat,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });
    await newSauce.save().then(
        () => {
            res.status(201).json({
                message: 'Sauce added successfully'
            })
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};

exports.modifySauce = async (req, res) => {
    const { id } = req.params;
    const url = req.protocol + '://' + req.get('host');
    if (req.file) {
        await Sauce.findById(id).then(
            (sauce) => {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink('images/' + filename, () => {
                    console.log('file deleted')
                })
            }
        )
        sauce = JSON.parse(req.body.sauce)
        sauce = {
            userId: sauce.userId,
            name: sauce.name,
            manufacturer: sauce.manufacturer,
            description: sauce.description,
            mainPepper: sauce.mainPepper,
            imageUrl: url + '/images/' + req.file.filename,
            heat: sauce.heat,
        }
        console.log(sauce)
    } else {
        console.log('no file')
        sauce = req.body;
    }
    await Sauce.findByIdAndUpdate(id, sauce).then(
        () => {
            res.status(201).json({
                message: 'Sauce updated successfully!'
            });
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};

exports.likeSauce = async (req, res) => {
    const { id } = req.params;
    const sauce = await Sauce.findById(id).then(
        (sauce) => {
            if (req.body.like === 1) {
                let liked = sauce.usersLiked.includes(req.body.userId)
                if (liked === true) {
                    console.log('Already liked')
                } else {
                    sauce.usersLiked.push(req.body.userId)
                    sauce.likes = sauce.likes + 1
                    Sauce.findByIdAndUpdate(id, sauce).then(
                        () => {
                            res.status(201).json({
                                message: 'Liked!'
                            });
                        }
                    ).catch(
                        (error) => {
                            res.status(400).json({
                                error: error
                            });
                        }
                    );
                }
            } else if (req.body.like === 0) {
                const likeIndex = sauce.usersLiked.indexOf(req.body.userId)
                if (likeIndex !== -1 && sauce.likes > 0) {
                    sauce.usersLiked.splice(likeIndex, 1)
                    sauce.likes = sauce.likes - 1
                }
                const dislikeIndex = sauce.usersDisliked.indexOf(req.body.userId)
                if (dislikeIndex !== -1 && sauce.dislikes > 0) {
                    sauce.usersDisliked.splice(dislikeIndex, 1)
                    sauce.dislikes = sauce.dislikes - 1
                }
                Sauce.findByIdAndUpdate(id, sauce).then(
                    () => {
                        res.status(201).json({
                            message: 'Cancelled opinion'
                        });
                    }
                ).catch(
                    (error) => {
                        res.status(400).json({
                            error: error
                        });
                    }
                );
            } else {
                let disliked = sauce.usersDisliked.includes(req.body.userId)
                if (disliked === true) {
                    console.log('Already disliked')
                } else {
                    sauce.usersDisliked.push(req.body.userId)
                    sauce.dislikes = sauce.dislikes + 1
                    Sauce.findByIdAndUpdate(id, sauce).then(
                        () => {
                            res.status(201).json({
                                message: 'Disliked!'
                            });
                        }
                    ).catch(
                        (error) => {
                            res.status(400).json({
                                error: error
                            });
                        }
                    );
                }
            }
        }).catch(
            (error) => {
                res.status(400).json({
                    error: error
                });
            }
        )
}

exports.deleteOneSauce = async (req, res) => {
    const { id } = req.params;
    await Sauce.findById(id).then(
        (sauce) => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink('images/' + filename, () => {
                Sauce.findByIdAndDelete(id).then(
                    () => {
                        res.status(200).json({
                            message: 'Deleted'
                        });
                    }
                ).catch(
                    (error) => {
                        res.status(400).json({
                            error: error
                        });
                    }
                );
            });
        }
    );
};
