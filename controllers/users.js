const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserModel = require('../models/user');
const RefreshTokenModel = require('../models/refreshToken');

exports.signup = async (req, res) => {

    const { email, password } = req.body;

    try {
        const user = await UserModel.find({ email: email })
        if (user.length !== 0) return res.status(409).json({ message: 'User with that email already exists!'});

        const encryptedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserModel({ email, password: encryptedPassword });
        await newUser.save();

        res.status(201).json({
            message: 'New user sucessfully created',
            user: newUser
        })
        
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong'});
    }
};

exports.login = async (req, res) => {

    const { email, password } = req.body;

    try {
        const user = await UserModel.find({ email: email })

        if (user.length === 0) return res.status(401).json({ message: 'Authentication failed' });

        bcrypt.compare(password, user[0].password, async (err, result) => {
            if (err) {
                return res.status(401).json({ message: 'Authentication failed' });
            } 
            if (result) {
                const accessToken = jwt.sign({ name: user[0].email }, process.env.JWT_ACCESS_KEY, { expiresIn: '15m' });

                const refreshToken = jwt.sign({ name: user[0].email }, process.env.JWT_REFRESH_KEY);
                const newRefreshTokenDb = new RefreshTokenModel({ token: refreshToken });
                await newRefreshTokenDb.save();

                return res.status(200).json({
                    message: 'Authentication successful',
                    accessToken: accessToken,
                    refreshToken: refreshToken
                })
            }
            return res.status(401).json({ message: 'Authentication failed' });
        })

    } catch (error) {
        res.status(401).json({ message: 'Authentication failed '});
    }
};

exports.logout = async (req, res) => {
    const authHeader = req.headers['authorization'];
    const refreshToken = authHeader && authHeader.split(' ')[1];

    try {
        await RefreshTokenModel.findOneAndRemove({ token: refreshToken });
        res.status(200).json({ message: 'Logout successful'});
        
    } catch (error) {
        res.sendStatus(500);
    }
}

exports.refresh_token = async (req, res) => {
    const authHeader = req.headers['authorization'];
    const refreshToken = authHeader && authHeader.split(' ')[1];
    if (!refreshToken) return res.sendStatus(401);

    const dbRefreshToken = await RefreshTokenModel.find({ token: refreshToken });
    if (dbRefreshToken.length === 0) return res.sendStatus(403);

    jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
        if (err) return res.sendStatus(403);

        const accessToken = jwt.sign(({ user: user.name }), process.env.JWT_ACCESS_KEY, { expiresIn: '15m' });
        res.json({ accessToken: accessToken });
    })
  };

exports.get_all_users = async (req, res) => {

    try {
        const users = await UserModel.find();
        res.status(200).json(users);

    } catch (error) {
        res.status(500).json({ controller_get_all_users : error})
    }
};

exports.create_user = async (req, res) => {

    const { email, password } = req.body;
    const newUser = new UserModel({ email, password });

    try {
        await newUser.save();

        res.status(201).json(newUser);
        
    } catch (error) {
        res.status(500).json({ controller_create_user: error});
    }
};

exports.get_single_user = async (req, res) => {

    const { id } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No user with id: ${id}`);

        const user = await UserModel.findById(id);

        res.status(200).json(user);    

    } catch (error) {
        res.status(500).json({ controller_get_single_user : error})
    }
};

exports.update_user = async (req, res) => {

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

exports.delete_user = async (req, res) => {
    
    const { id } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No user with id: ${id}`);

        await UserModel.findByIdAndRemove(id);
        res.status(200).json({ message: 'User deleted sucessfully.' })
        
    } catch (error) {
        res.status(500).json({ controller_delete_user : error });
    }
};