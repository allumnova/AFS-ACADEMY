const { Batch, BatchStudent, Course, User } = require('../models');

exports.createBatch = async (req, res) => {
    try {
        const { name, courseId, instructorId, startDate, endDate, startTime, endTime, days, maxCapacity } = req.body;

        const course = await Course.findByPk(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const batch = await Batch.create({
            name,
            courseId,
            instructorId,
            startDate,
            endDate,
            startTime,
            endTime,
            days,
            maxCapacity
        });

        res.status(201).json(batch);
    } catch (error) {
        console.error("CREATE_BATCH_ERROR:", error);
        res.status(500).json({ message: 'Server error creating batch', error: error.message });
    }
};

exports.getAllBatches = async (req, res) => {
    try {
        const batches = await Batch.findAll({
            include: [
                { model: Course, as: 'course', attributes: ['title'] },
                { model: User, as: 'instructor', attributes: ['name'] }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json(batches);
    } catch (error) {
        console.error("GET_ALL_BATCHES_ERROR:", error);
        res.status(500).json({ message: 'Server error fetching batches' });
    }
};

exports.getBatchById = async (req, res) => {
    try {
        const batch = await Batch.findByPk(req.params.id, {
            include: [
                { model: Course, as: 'course' },
                { model: User, as: 'instructor', attributes: ['name', 'email'] },
                { model: User, as: 'students', attributes: ['id', 'name', 'email'], through: { attributes: ['status', 'joiningDate'] } }
            ]
        });

        if (!batch) {
            return res.status(404).json({ message: 'Batch not found' });
        }

        res.json(batch);
    } catch (error) {
        console.error("GET_BATCH_ERROR:", error);
        res.status(500).json({ message: 'Server error fetching batch details' });
    }
};

exports.addStudentToBatch = async (req, res) => {
    try {
        const { batchId, studentId } = req.body;

        const batch = await Batch.findByPk(batchId);
        if (!batch) return res.status(404).json({ message: 'Batch not found' });

        const student = await User.findByPk(studentId);
        if (!student) return res.status(404).json({ message: 'Student not found' });

        // Check if already in batch
        const existing = await BatchStudent.findOne({ where: { batchId, studentId } });
        if (existing) {
            return res.status(400).json({ message: 'Student already enrolled in this batch' });
        }

        const enrollment = await BatchStudent.create({ batchId, studentId });
        res.status(201).json(enrollment);
    } catch (error) {
        console.error("ADD_STUDENT_TO_BATCH_ERROR:", error);
        res.status(500).json({ message: 'Server error adding student to batch' });
    }
};

exports.updateBatch = async (req, res) => {
    try {
        const batch = await Batch.findByPk(req.params.id);
        if (!batch) return res.status(404).json({ message: 'Batch not found' });

        await batch.update(req.body);
        res.json(batch);
    } catch (error) {
        console.error("UPDATE_BATCH_ERROR:", error);
        res.status(500).json({ message: 'Server error updating batch' });
    }
};

exports.deleteBatch = async (req, res) => {
    try {
        const batch = await Batch.findByPk(req.params.id);
        if (!batch) return res.status(404).json({ message: 'Batch not found' });

        await batch.destroy();
        res.json({ message: 'Batch deleted' });
    } catch (error) {
        console.error("DELETE_BATCH_ERROR:", error);
        res.status(500).json({ message: 'Server error deleting batch' });
    }
};
