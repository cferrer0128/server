const router = require('express').Router();

var contactList =[
    {
    'Name':'Name1',
    'address':'address1',
    'phone':'9090909090',
    'zipcode':'65555'},
    {
        'Name':'Name2',
        'address':'address2',
        'phone':'2222222222',
        'zipcode':'22222'}
        

]
router.get('/', (req, res, next) => {
    res.json(contactList);
});

module.exports = router;

