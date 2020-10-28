const Item = require("../models/item.model")

exports.addItem = async (req, res) => {
    try {
        const item = new Item({
            ...req.body,
            // owerId: req.user._id,
            // ownerMobile: req.user.mobile
        })
        await item.save()
        res.status(201).send(item)
    } catch (e) {
        console.log('err: ', e)
        res.status(400).send
    }
}