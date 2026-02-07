const routes = [
    './routes/authRoutes',
    './routes/courseRoutes',
    './routes/lectureRoutes',
    './routes/attendanceRoutes',
    './routes/paymentRoutes',
    './routes/mediaRoutes',
    './routes/reviewRoutes',
    './routes/notificationRoutes',
    './routes/adminRoutes',
    './routes/userRoutes',
    './routes/quizRoutes',
    './routes/certificateRoutes'
];

console.log("Verifying route modules...");

routes.forEach(route => {
    try {
        require(route);
        console.log(`[OK] ${route}`);
    } catch (e) {
        console.error(`[FAIL] ${route}:`, e.message);
    }
});

console.log("Verification complete.");
