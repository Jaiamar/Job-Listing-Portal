const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['APPLICATION_RECEIVED', 'STATUS_CHANGED', 'DEADLINE_REMINDER', 'JOB_POSTED', 'SYSTEM'],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  referenceId: String,
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

notificationSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
