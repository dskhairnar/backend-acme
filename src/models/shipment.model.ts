import { Schema, model, Document, Types } from 'mongoose';

export interface IShipmentItem {
  name: string;
  quantity: number;
  price?: number;
}

export interface IShipment extends Document {
  userId: Types.ObjectId;
  items: IShipmentItem[];
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  shippedAt?: Date;
  deliveredAt?: Date;
}

const shipmentItemSchema = new Schema<IShipmentItem>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: false,
      min: 0,
    },
  },
  {
    _id: false,
  }
);

const shipmentSchema = new Schema<IShipment>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: {
      type: [shipmentItemSchema],
      required: true,
      validate: {
        validator: (items: IShipmentItem[]) => items.length > 0,
        message: 'Shipment must contain at least one item',
      },
    },
    status: {
      type: String,
      enum: ['pending', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    trackingNumber: {
      type: String,
      required: false,
      trim: true,
    },
    shippedAt: {
      type: Date,
      required: false,
    },
    deliveredAt: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying by user and status
shipmentSchema.index({ userId: 1, status: 1 });
shipmentSchema.index({ trackingNumber: 1 });

export const Shipment = model<IShipment>('Shipment', shipmentSchema);
