const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserModel = require('../models/user');

exports.get_all_users = async (req, res, next) => {
    try {
        const users = await UserModel.find();
        res.status(200).json(users);

    } catch (error) {
        res.status(500).json({ controller_get_all_users : error})
    }
};

exports.create_user = async (req, res, next) => {
    const { email, password } = req.body;
    const newUser = new UserModel({ email, password });

    try {
        await newUser.save();

        res.status(201).json(newUser);
        
    } catch (error) {
        res.status(500).json({ controller_create_user: error});
    }
};

exports.get_single_user = async (req, res, next) => {
    const { id } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No user with id: ${id}`);

        const user = await UserModel.findById(id);
        res.status(200).json(user);    

    } catch (error) {
        res.status(500).json({ controller_get_single_user : error})
    }
};

exports.update_user = async (req, res, next) => {
    const { id } = req.params;
    const { email, password, role } = req.body;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No user with id: ${id}`);

        const updatedUserData = { email, password, role, _id: id };
        const updatedUser = await UserModel.findByIdAndUpdate(id, updatedUserData, { new: true });
        res.status(200).json(updatedUser);
        
    } catch (error) {
        res.status(500).json({ controller_update_user : error });
    }
};

exports.delete_user = async (req, res, next) => {
    const { id } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No user with id: ${id}`);

        await UserModel.findByIdAndRemove(id);
        res.status(200).json({ message: 'User deleted sucessfully.' })
        
    } catch (error) {
        res.status(500).json({ controller_delete_user : error });
    }
};

exports.signup = async (req, res, next) => {
    const { email } = req.body.email;

    try {
        if (!mongoose.email.isValid()) return res.status(404).send(`No user with id: ${id}`);
        
    } catch (error) {
        res.status(401).json({ message: 'Authentication failed '});
    }
};

exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const user = await UserModel.find({ email: email })

        if (user.length === 0) return res.status(401).json({ message: 'Authentication failed' });

        bcrypt.compare(password, user[0].password, (err, result) => {
            if (err) {
                return res.status(401).json({ message: 'Authentication failed' });
            } 
            if (result) {
                const token = jwt.sign(
                    {
                    email: user[0].email,
                    userId: user[0]._id
                    },
                    process.env.JWT_KEY,
                    {
                        expiresIn: '1h'
                    }
                );

                return res.status(200).json({
                    message: 'Authentication successful',
                    token: token
                })
            }
            res.status(401).json({ message: 'Authentication failed' })
        })

    } catch (error) {
        res.status(401).json({ message: 'Authentication failed '});
    }
};