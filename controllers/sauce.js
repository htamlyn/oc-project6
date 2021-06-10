const Sauce = require ('../models/sauce');

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
    console.log('it worked');
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
    console.log("can't find that sauce");
};

exports.createSauce = async (req, res) => {
    console.log('hitting route')
    console.log(req.body)
    const newSauce = new Sauce({
        // userId: req.body.userId,
        name: req.body.name,
        manufacturer: req.body.manufacturer,
        description: req.body.description,
        mainPepper: req.body.mainPepper,
        heat: req.body.heat,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });
    console.log(newSauce)
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
