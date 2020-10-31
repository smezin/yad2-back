const Item = require("../models/item.model")

exports.addItem = async (req, res) => {
    try {
        const item = new Item({
            ...req.body.item.properties,
            ownerMobile: req.body.ownerMobile,
            owner: req.body.ownerId
        })
        await item.save()
        
        res.status(200).send(item)
    } catch (e) {
        console.log('err: ', e)
        res.status(400).send
    }
}