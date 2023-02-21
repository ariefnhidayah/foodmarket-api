
const multer = require("multer");
const path = require("path");
const fs = require("fs");
require('dotenv').config()
const { HOSTNAME } = process.env

const uploadImage = (data, filename, additional_folder = '') => {
  const returnData = {
    success: 0,
    message: "Terjadi suatu kesalahan!",
    data: null,
    path: '',
  }

  try {
    let fullPath = '';
    let path = ''
    if (additional_folder != '') {
      fullPath = `${HOSTNAME}images/${additional_folder}/${filename}`;
      path = `./public/images/${additional_folder}/${filename}`
    } else {
      fullPath = `${HOSTNAME}images/${filename}`;
      path = `./public/images/${filename}`
    }

    if (fs.existsSync(path)) {
      if (additional_folder != '') {
        fullPath = `${HOSTNAME}images/${additional_folder}/${Date.now()}-${filename}`;
        path = `./public/images/${additional_folder}/${Date.now()}-${filename}`
      } else {
        fullPath = `${HOSTNAME}images/${Date.now()}-${filename}`;
        path = `./public/images/${Date.now()}-${filename}`
      }
    }

    fs.writeFile(path, data, function (err) {
      if (err) {
        returnData.success = 0;
        returnData.message = err.message;
        return returnData
      } else {
        returnData.success = 1
        returnData.data = fullPath
        returnData.message = ''
        return returnData
      }
    })
    returnData.success = 1
    returnData.path = path
    returnData.data = fullPath
    return returnData
  } catch (error) {
    returnData.success = 0
    returnData.message = error.toString()
    return returnData
  }

}

module.exports = { uploadImage }