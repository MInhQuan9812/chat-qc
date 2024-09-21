const express=require('express')
const registerUser = require('../controllers/registerUser')
const checkEmail = require('../controllers/checkEmail')
const checkPassword = require('../controllers/checkPassword')
const userDetail = require('../controllers/userDetail')
const logout = require('../controllers/logout')
const updateUserDetail = require('../controllers/updateUserDetail')
const searchUser = require('../controllers/searchUser')

const router=express.Router()

router.post('/register',registerUser)
router.post('/email',checkEmail)
router.post('/password',checkPassword)
router.get('/user-detail',userDetail)
router.get('/logout',logout)
router.post('/update-user',updateUserDetail)
router.post('/search-user',searchUser)
module.exports = router