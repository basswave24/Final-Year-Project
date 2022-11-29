const express = require("express");
const router = express.Router();

router.get('/',(req,res)=>{
    const mfp = require('mfp');
    let MFPusername = req.query.username;
    let date = req.query.date;

    //Function to get the user's my fitness pal diary data
    mfp.fetchSingleDate(MFPusername,date,'all',function (data){
        res.send(data);
    })
})


module.exports = router;

