const express = require("express");
const { isAuthenticated } = require("../middlewares/permission.middleware");
const GuruModel = require("../models/guru.model");
const router = express.Router();


router.post('/', [isAuthenticated], async (req, res) => {
  try {
    // periksa apakah kode guru disertakan, jika tidak
    if (!req.body.kode) {
      return res.status(400).json({
        message: "Kode guru harus disertakan!"
      })
    }

    // periksa apakah nama guru disertakan, jika tidak
    if (!req.body.nama) {
      return res.status(400).json({
        message: "Nama guru harus disertakan!"
      })
    }

    // ambil guru dari kodenya
    let guru = await GuruModel.findOne({ kode: req.body.kode });

    // periksa apakah guru ada, jika ada
    if (guru) {
      return res.status(400).json({ 
        message: "Guru sudah pernah dibuat" 
      })
    }
    
    await new GuruModel(req.body).save();
    res.status(201).json(req.body)
  } catch (error) {
    res.status(400).json(error)
  }
})


router.get('/', [isAuthenticated], async (req, res) => {
  try {
    // Jika query tidak ada, jadikan null
    let query = req.query ? req.query : null;

    let users = await GuruModel.find(query, { _id: 0, __v: 0 })
    res.status(201).json(users)
  } catch (error) {
    res.status(400).json(error)
  }
})


router.get('/:kode', [isAuthenticated], async (req, res) => {
  try {
    // mengambil guru dari kodenya
    let guru = await GuruModel.findOne({kode: req.params.kode}, {_id: 0})

    if (!guru) {
      return res.status(404).json({ message: 'Guru tidak ditemukan.' })
    } 

    return res.json(guru)
  } catch (error) {
    return res.status(400).json(error)
  }
})


router.put('/:kode', [isAuthenticated], async (req, res) => {
  try {
    // mengambil data guru
    let guru = await GuruModel.findOne({kode: req.params.kode}, {_id: 0})
    if (!guru) {
      return res.status(404).json({ message: 'Guru tidak ditemukan!' })
    }

    const data = {
      nama: req.body.nama
    }

    await GuruModel.findOneAndUpdate({kode: req.params.kode}, data)
    guru = await GuruModel.findOne({kode: req.params.kode}, {_id: 0})

    return res.json(guru)
  } catch (error) {
    return res.status(400).json(error)
  }
})


router.delete('/:kode', [isAuthenticated], async (req, res) => {
  try {
    // ambil data guru
    let guru = await GuruModel.findOne({kode: req.params.kode}, {_id: 0})
    
    // jika guru tidak ada, kemudian
    if (!guru) {
      return res.status(404).json({ message: 'Guru tidak ditemukan!' })
    }

    await GuruModel.findOneAndRemove({kode: req.params.kode})
    res.status(204).json()
  } catch (error) {
    return res.status(400).json(error)
  }
})


module.exports = router