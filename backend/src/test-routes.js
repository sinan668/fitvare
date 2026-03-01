const express = require('express');
const app = express();
const trainerRoutes = require('./routes/trainerRoutes');

app.use('/api/trainers', trainerRoutes);

console.log('Routes registered:');
app._router.stack.forEach((r) => {
    if (r.route && r.route.path) {
        console.log(r.route.path);
    } else if (r.name === 'router') {
        r.handle.stack.forEach((sr) => {
            if (sr.route) {
                console.log('/api/trainers' + sr.route.path);
            }
        });
    }
});
