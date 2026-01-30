const { Media } = require('../models');

exports.getAllMedia = async (req, res) => {
    try {
        const { category, type } = req.query;
        const where = {};
        if (category) where.category = category;
        if (type) where.type = type;

        const items = await Media.findAll({
            where,
            order: [['createdAt', 'DESC']]
        });
        res.json(items);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.uploadMedia = async (req, res) => {
    try {
        const { title, description, type, url, category } = req.body;

        const media = await Media.create({
            title,
            description,
            type,
            url,
            category,
            uploadedBy: req.user.id
        });

        res.status(201).json(media);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteMedia = async (req, res) => {
    try {
        const { id } = req.params;
        const media = await Media.findByPk(id);

        if (!media) return res.status(404).json({ message: 'Media not found' });

        await media.destroy();
        res.json({ message: 'Media deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
