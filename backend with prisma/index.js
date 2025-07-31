const express = require('express');
const cors = require('cors');

// routers
const demoRouter = require('./routers/demoRouter')
const systemRouter = require('./routers/systemRouter');
const productRouter = require('./routers/productRouter');
const userRouter = require('./routers/userRouter');
const roleRouter = require('./routers/roleRouter');
const categoryRouter = require('./routers/categoryRouter');
const cartItemRouter = require('./routers/cartItemRouter');
const wishlistItemRouter = require('./routers/wishlistItemRouter');
const orderRouter = require('./routers/orderRouter');
const orderItemRouter = require('./routers/orderItemRouter');

const app = express();
const port = 3000;

app.use(cors(
    {
        origin: '*', // Allow all origins
        methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific HTTP methods
        allowedHeaders: ['Content-Type', 'Authorization'] // Allow specific headers
    }
));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// static file serving
app.use('/uploads', express.static('./uploads'));

// routes
app.use('/api', demoRouter);
app.use('/api', systemRouter);
app.use('/api', productRouter);
app.use('/api', userRouter);
app.use('/api', roleRouter);
app.use('/api', categoryRouter);
app.use('/api', cartItemRouter);
app.use('/api', wishlistItemRouter);
app.use('/api', orderRouter);
app.use('/api', orderItemRouter);

app.listen(port, () => {
    console.log(`Server running on ${port}`);
})
