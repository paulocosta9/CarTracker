const app = require('./app');
const db = require('./models');
const PORT = process.env.PORT || 5000;

db.sequelize.sync({ alter: true })
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log('Database synchronized');
        });
    })
    .catch(err => {
        console.error('Database sync failed:', err);
        process.exit(1);
    });