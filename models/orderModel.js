import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        default: 1
    },
    type: {
        type: String,
        default: 'product'  // 'product' or 'print'
    },
    details: {
        type: mongoose.Schema.Types.Mixed  // For print job details
    }
});

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: false  // Allow guest orders
    },
    customer: {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        mobile: {
            type: String,
            required: true
        }
    },
    pickup: {
        date: {
            type: String,
            required: true
        },
        time: {
            type: String,
            required: true
        }
    },
    paymentMode: {
        type: String,
        enum: ['cash', 'upi'],
        required: true
    },
    items: [orderItemSchema],
    total: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'ready', 'completed', 'cancelled'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const orderModel = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default orderModel; 