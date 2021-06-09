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

