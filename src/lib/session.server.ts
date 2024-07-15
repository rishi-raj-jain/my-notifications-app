import { connect, type StreamClient } from "getstream";

let client: StreamClient | null = null;

if (process.env.STREAM_API_KEY && process.env.STREAM_API_SECRET && !client) {
  client = connect(process.env.STREAM_API_KEY, process.env.STREAM_API_SECRET);
}

export default client;
