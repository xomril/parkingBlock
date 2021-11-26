const express = require('express');
const path = require('path');
const axios = require('axios');
const router = express.Router();
const dir = path.join(__dirname, '../public');
const sheetUrl = ''


router.get('/', async (req, res) => {
    const data = await getSpots()
    let parking = 0;
    let spots = 0;
    let per=0;
    for (item in data) {
        spots++;
        if (data[item].name == '') parking++;
    }
    let obj = {
        spots: spots,
        parking: parking,
        data: data,
    }

    res.render('index', { 
        data: obj.data, 
        spots: obj.spots-1, 
        parking: obj.parking,
    })
})

router.get('/table', async (req, res) => {
    const data = await getSpots();
    res.send(data)
})
router.get('/updatePost', async (req, res) => {
    const data = {
        spot: req.query.spot,
        name: req.query.name,
        phone: req.query.phone
    }
    // console.log(data)
    await axios({
        method: 'post',
        url: sheetUrl,
        data: data
    });
    res.send('ok')
})
const getSpots = (id) => {
    let getUrl = sheetUrl;
    if (id) {
        getUrl = getUrl + "?id=" + id
    } else {
        getUrl = getUrl + "?get=all"
    }
    return axios.get(getUrl)
        .then((data) => {
           
            return data.data;
        })
        .catch((e) => {
            console.log(e)
        })
}
module.exports = router;