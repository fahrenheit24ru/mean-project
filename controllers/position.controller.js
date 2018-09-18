const Position = require('../models/position.model');
const errorHandler = require('../utils/errorHandler.util');

module.exports.getByCategoryId = async function (req, res) {
    try {
        const positions = await Position.find({
            category: req.params.categoryId,
            user: req.user.id
        });
        setTimeout(() => {
            res.status(200).json(positions);
        }, 500);
    } catch (error) {
        errorHandler(res, error);
    }
}
module.exports.create = async function (req, res) {
    try {
        const position = await new Position({
            name: req.body.name,
            cost: req.body.cost,
            category: req.body.category,
            user: req.user.id
        }).save();
        res.status(201).json(position);
    } catch (error) {
        errorHandler(res, error);
    }
}
module.exports.remove = async function (req, res) {
    try {
        await Position.remove({
            _id: req.params.id
        });
        res.status(200).json({
            message: 'the position was deleted'
        })
    } catch (error) {
        errorHandler(res, error);
    }
}
module.exports.update = async function (req, res) {
    try {
        const position = await Position.findOneAndUpdate({
            _id: req.params.id
        }, {
            $set: req.body
        }, {
            new: true
        });
        res.status(200).json(position);
    } catch (error) {
        errorHandler(res, error);
    }
}