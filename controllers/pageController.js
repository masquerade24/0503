function test(req, res) {
    if (req.body.test === "test") {
        res.status(200);
        res.json({
            hi: 'Hello'
        })
    }
    res.status(200).json({
        hi: 'error'
    })
}

module.exports = {
    test,
};