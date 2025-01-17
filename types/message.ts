// Import the required dependencies for primitive types and date handling
import { ObjectId } from 'mongodb';
import { Hex } from 'viem';

// Define the MessageContent type
export type MessageContent = {
  readonly version: number;
  readonly nonce: number;
  readonly origin_domain: number;
  readonly sender: Hex;
  readonly destination_domain: number;
  readonly recipient: Hex;
  readonly message_body: MessageBody;
};

// Define the MessageStatus type
export type MessageStatus =
  | 'pending'
  | 'signed'
  | 'broadcasted'
  | 'success'
  | 'invalid';

// Define the Message type
export type Message = {
  readonly _id: ObjectId;
  readonly origin_transaction: ObjectId;
  readonly origin_transaction_hash: Hex;
  readonly message_id: Hex;
  readonly content: MessageContent;
  readonly transactionBody: Hex;
  readonly signatures: Signature[];
  readonly transaction?: ObjectId | null;
  readonly sequence?: number | null;
  readonly transaction_hash: Hex;
  readonly status: MessageStatus;
  readonly created_at: Date;
  readonly updated_at: Date;
};

// Define the MessageBody type
export type MessageBody = {
  readonly sender_address: Hex;
  readonly amount: string;
  readonly recipient_address: Hex;
};

// Define the Signature type
export type Signature = {
  readonly signer: Hex;
  readonly signature: Hex; // Assuming signature is a string representation
};

export const CollectionMessages = 'messages';
