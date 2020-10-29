const Item = require("../models/item.model")

exports.addItem = async (req, res) => {
    try {
        const item = new Item({
            ...req.body.item.properties,
            ownerId: req.body.ownerId,
            ownerMobile: req.body.ownerMobile
        })
        await item.save()
        res.status(200).send(item)
    } catch (e) {
        console.log('err: ', e)
        res.status(400).send
    }
}