import { Message } from './message';
import { Refund } from './refund';
import { Transaction } from './transaction';

export type MessageData = {
  messages: Message[];
  page: number;
  totalMessages: number;
  totalPages: number;
};

export type RefundData = {
  refunds: Refund[];
  page: number;
  totalRefunds: number;
  totalPages: number;
};

export type TransactionData = {
  transactions: Transaction[];
  page: number;
  totalTransactions: number;
  totalPages: number;
};
